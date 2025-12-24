using Brocker.Api;
using Brocker.Api.Data;
using Brocker.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().ConfigureApiBehaviorOptions(options => {
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState.Where(kvp => kvp.Value.Errors.Count>0).ToDictionary(kvp=>kvp.Key, kvp=>kvp.Value.Errors.Select(e=>e.ErrorMessage).ToArray());
        var res = new Brocker.Api.DTOs.ApiResponse<object?> { Success = false, Message = "Validation error", Data = null, Meta = errors };
        return new BadRequestObjectResult(res);
    };
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below."
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement{
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme{Reference = new Microsoft.OpenApi.Models.OpenApiReference{Type=Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer"}},
            new string[]{}
        }
    });
});

// DbContext - Postgres if connection string provided, else InMemory for quick dev
var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection") ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
if (!string.IsNullOrWhiteSpace(defaultConn))
{
    builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(defaultConn));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(opt => opt.UseInMemoryDatabase("BrockerDb"));
}

// App services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAgentService, AgentService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

// CORS for localhost frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("Localhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
    });
});

// Authentication JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? "dev_secret_key_replace";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Apply EF migrations automatically for relational DBs, fall back to EnsureCreated for InMemory provider
        if (db.Database.IsRelational())
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            try
            {
                // If migrations history exists or DB empty -> Migrate, else skip to avoid conflicts with pre-created tables
                var conn = db.Database.GetDbConnection();
                conn.Open();
                using var cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT to_regclass('public.__EFMigrationsHistory')::text"; // Postgres specific - cast to text to avoid regclass type issues
                var res = cmd.ExecuteScalar();

                if (res != null && res != DBNull.Value)
                {
                    logger.LogInformation("EF Migrations history found; applying pending migrations.");
                    db.Database.Migrate();
                }
                else
                {
                    // No migrations history table - check if DB already has tables
                    using var cmd2 = conn.CreateCommand();
                    cmd2.CommandText = "SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename NOT IN ('__EFMigrationsHistory'))";
                    var hasTables = Convert.ToBoolean(cmd2.ExecuteScalar());
                    if (!hasTables)
                    {
                        logger.LogInformation("No tables found; applying migrations.");
                        db.Database.Migrate();
                    }
                    else
                    {
                        logger.LogInformation("Database contains tables but no EF migrations history; skipping automatic Migrate to avoid conflicts.");
                    }
                }
            }
            catch (Exception ex)
            {
                // reuse existing logger
                logger.LogWarning(ex, "Migrate attempt failed; falling back to EnsureCreated if possible.");
                try { db.Database.EnsureCreated(); } catch { /* ignore */ }
            }
        }
        else
        {
            db.Database.EnsureCreated();
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Database initialize failed; proceed to seed if possible.");
    }

    DbSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Localhost");

app.UseMiddleware<Brocker.Api.Middleware.ExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();