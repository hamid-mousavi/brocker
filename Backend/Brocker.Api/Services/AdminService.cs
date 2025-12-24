using Brocker.Api.Data;
using Brocker.Api.DTOs;
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