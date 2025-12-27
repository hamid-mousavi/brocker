using Brocker.Api.Data;
using Brocker.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Brocker.Api.Controllers;

[Route("api/agents")]
public class RegistrationController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public RegistrationController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] RegistrationCreateRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.FullName) && string.IsNullOrWhiteSpace(req.CompanyName))
            return BadRequestEnvelope("FullName or CompanyName is required");

        var reg = new RegistrationRequest
        {
            FullName = req.FullName ?? string.Empty,
            CompanyName = req.CompanyName ?? string.Empty,
            LegalType = req.LegalType,
            Mobile = req.Mobile ?? string.Empty,
            OfficePhone = req.OfficePhone ?? string.Empty,
            HomePhone = req.HomePhone ?? string.Empty,
            Address = req.Address ?? string.Empty,
            Latitude = req.Latitude,
            Longitude = req.Longitude,
            Customs = req.Customs?.ToList() ?? new List<string>(),
            GoodsTypes = req.GoodsTypes?.ToList() ?? new List<string>(),
            YearsOfExperience = req.YearsOfExperience,
            Description = req.Description ?? string.Empty,
            Status = "pending"
        };

        // handle files
        if (req.Attachments != null && req.Attachments.Count > 0)
        {
            var uploads = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

            foreach (var f in req.Attachments)
            {
                if (f.Length <= 0) continue;
                var ext = Path.GetExtension(f.FileName);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var filePath = Path.Combine(uploads, fileName);
                using (var fs = System.IO.File.Create(filePath))
                {
                    await f.CopyToAsync(fs);
                }
                var url = $"/uploads/{fileName}";
                reg.Attachments.Add(new RegistrationAttachment { FileName = fileName, Url = url });
            }
        }

        // parse phones JSON if present
        if (!string.IsNullOrWhiteSpace(req.PhonesJson))
        {
            try
            {
                var phones = System.Text.Json.JsonSerializer.Deserialize<List<PhoneDto>>(req.PhonesJson ?? "[]") ?? new List<PhoneDto>();
                foreach (var p in phones)
                {
                    if (string.IsNullOrWhiteSpace(p.Number)) continue;
                    reg.Phones.Add(new RegistrationPhone { Type = p.Type ?? string.Empty, Number = p.Number ?? string.Empty });
                }
            }
            catch { /* ignore malformed phones */ }
        }

        _db.RegistrationRequests.Add(reg);
        await _db.SaveChangesAsync();

        var res = new { Id = reg.Id, Status = reg.Status };
        return OkEnvelope(res, "Registration submitted");
    }
}

public class RegistrationCreateRequest
{
    public string? FullName { get; set; }
    public string? CompanyName { get; set; }
    public LegalType LegalType { get; set; } = LegalType.Individual;
    public string? Mobile { get; set; }
    public string? OfficePhone { get; set; }
    public string? HomePhone { get; set; }

    public string? Address { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public IEnumerable<string>? Customs { get; set; }
    public IEnumerable<string>? GoodsTypes { get; set; }
    public int YearsOfExperience { get; set; }
    public string? Description { get; set; }

    public IFormFileCollection? Attachments { get; set; }

    // JSON array of { type: string, number: string }
    public string? PhonesJson { get; set; }
}

public class PhoneDto { public string? Type { get; set; } public string? Number { get; set; } }