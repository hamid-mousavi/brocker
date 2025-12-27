using Brocker.Api.Data;
using Brocker.Api.DTOs;
using Brocker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Brocker.Api.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(IEnumerable<AgentSummaryDto> agents, int total)> GetAgentsAsync(int page, int pageSize, string? status = null)
    {
        var q = _db.Agents.AsQueryable();
        if (status == "pending") q = q.Where(a=>!a.IsApproved);
        var total = await q.CountAsync();
        var items = await q.Skip((page-1)*pageSize).Take(pageSize).Select(a => new AgentSummaryDto {
            Id = a.Id,
            FullName = a.FullName,
            CompanyName = a.CompanyName,
            City = a.City,
            YearsOfExperience = a.YearsOfExperience,
            RatingAverage = a.RatingAverage,
            NumberOfReviews = a.NumberOfReviews,
            Customs = a.Customs,
            GoodsTypes = a.GoodsTypes,
            IsVerified = a.IsVerified
        }).ToListAsync();

        return (items, total);
    }

    public async Task<AdminStatsDto> GetStatsAsync()
    {
        var total = await _db.Agents.CountAsync();
        var pending = await _db.Agents.CountAsync(a=>!a.IsApproved);
        var pendingLicenses = await _db.Agents.SelectMany(a=>a.Licenses).CountAsync(l=>!l.IsVerified);
        return new AdminStatsDto { TotalAgents = total, PendingApprovals = pending, PendingLicenses = pendingLicenses };
    }

    public async Task<(IEnumerable<RegistrationRequestSummaryDto> requests, int total)> GetRegistrationRequestsAsync(int page, int pageSize, string? status = null)
    {
        var q = _db.RegistrationRequests.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) q = q.Where(r => r.Status == status);
        var total = await q.CountAsync();
        var items = await q.OrderByDescending(r=>r.CreatedAt).Skip((page-1)*pageSize).Take(pageSize)
            .Select(r => new RegistrationRequestSummaryDto{ Id = r.Id, FullName = r.FullName, CompanyName = r.CompanyName, Mobile = r.Mobile, Status = r.Status, CreatedAt = r.CreatedAt }).ToListAsync();
        return (items, total);
    }

    public async Task<RegistrationRequestDto?> GetRegistrationRequestByIdAsync(Guid id)
    {
        var r = await _db.RegistrationRequests.Include(rr=>rr.Attachments).Include(rr=>rr.Phones).FirstOrDefaultAsync(x=>x.Id==id);
        if (r==null) return null;
        return new RegistrationRequestDto {
            Id = r.Id,
            FullName = r.FullName,
            CompanyName = r.CompanyName,
            Mobile = r.Mobile,
            Status = r.Status,
            CreatedAt = r.CreatedAt,
            Address = r.Address,
            Latitude = r.Latitude,
            Longitude = r.Longitude,
            Customs = r.Customs,
            GoodsTypes = r.GoodsTypes,
            YearsOfExperience = r.YearsOfExperience,
            Description = r.Description,
            Attachments = r.Attachments.Select(a=>new RegistrationAttachmentDto{ Id=a.Id, FileName=a.FileName, Url=a.Url}).ToList(),
            Phones = r.Phones.Select(p=> new RegistrationPhoneDto{ Type = p.Type, Number = p.Number }).ToList()
        };
    }

    public async Task ApproveRegistrationRequestAsync(Guid requestId)
    {
        var r = await _db.RegistrationRequests.Include(rr=>rr.Attachments).FirstOrDefaultAsync(x=>x.Id==requestId);
        if (r==null) throw new Exception("Registration request not found");

        // create an Agent from the registration
        var agent = new Agent {
            FullName = string.IsNullOrWhiteSpace(r.FullName) ? r.CompanyName : r.FullName,
            CompanyName = r.CompanyName,
            YearsOfExperience = r.YearsOfExperience,
            RatingAverage = 0,
            NumberOfReviews = 0,
            Customs = r.Customs,
            GoodsTypes = r.GoodsTypes,
            Bio = r.Description,
            IsVerified = false,
            IsApproved = true,
            Mobile = r.Mobile,
            PhoneNumbers = r.Phones?.Select(p=>p.Number).Where(n=>!string.IsNullOrWhiteSpace(n)).ToList() ?? new List<string>(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Agents.Add(agent);
        r.Status = "approved";
        await _db.SaveChangesAsync();
    }

    public async Task RejectRegistrationRequestAsync(Guid requestId, string? reason = null)
    {
        var r = await _db.RegistrationRequests.FindAsync(requestId);
        if (r==null) throw new Exception("Registration request not found");
        r.Status = "rejected";
        await _db.SaveChangesAsync();
    }

    public async Task ApproveAgentAsync(Guid agentId)
    {
        var a = await _db.Agents.FindAsync(agentId);
        if (a == null) throw new Exception("Agent not found");
        a.IsApproved = true;
        await _db.SaveChangesAsync();
    }

    public async Task RejectAgentAsync(Guid agentId, string? reason = null)
    {
        var a = await _db.Agents.FindAsync(agentId);
        if (a == null) throw new Exception("Agent not found");
        a.IsApproved = false;
        await _db.SaveChangesAsync();
    }
}