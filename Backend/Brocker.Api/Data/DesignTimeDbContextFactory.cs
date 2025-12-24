using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Brocker.Api.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<AppDbContext>();

        // Try read from env var used by docker-compose or appsettings
        var conn = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                   ?? "Host=localhost;Database=brockerdb;Username=brocker;Password=brocker_pwd";

        builder.UseNpgsql(conn);
        return new AppDbContext(builder.Options);
    }
}