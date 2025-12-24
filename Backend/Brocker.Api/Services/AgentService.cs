using Brocker.Api.Data;
using Brocker.Api.DTOs;
using Brocker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Brocker.Api.Services;

public class AgentService : IAgentService
{
    private readonly AppDbContext _db;

    public AgentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(IEnumerable<AgentSummaryDto> agents, int total)> GetAgentsAsync(int page, int pageSize, string? query = null, string? city = null)
    {
        var q = _db.Agents.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query)) q = q.Where(a => a.FullName.Contains(query) || a.CompanyName.Contains(query));
        if (!string.IsNullOrWhiteSpace(city)) q = q.Where(a => a.City == city);

        var total = await q.CountAsync();

        var items = await q.OrderByDescending(a => a.RatingAverage)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AgentSummaryDto {
                Id = a.Id,
                FullName = a.FullName,
                CompanyName = a.CompanyName,
                City = a.City,
                YearsOfExperience = a.YearsOfExperience,
                RatingAverage = a.RatingAverage,
                NumberOfReviews = a.NumberOfReviews,
                Customs = a.Customs.Take(5).ToList(),
                GoodsTypes = a.GoodsTypes.Take(5).ToList(),
                IsVerified = a.IsVerified
            }).ToListAsync();

        return (items, total);
    }

    public async Task<AgentDetailDto?> GetAgentByIdAsync(Guid id, int reviewsPage = 1, int reviewsPageSize = 10)
    {
        var a = await _db.Agents.Include(x => x.Reviews).Include(x => x.Licenses).Include(x => x.Analytics).FirstOrDefaultAsync(x => x.Id == id);
        if (a == null) return null;

        var reviews = a.Reviews.OrderByDescending(r => r.CreatedAt).Skip((reviewsPage-1)*reviewsPageSize).Take(reviewsPageSize)
            .Select(r => new ReviewDto{Id=r.Id, ReviewerName=r.ReviewerName, Rating=r.Rating, Comment=r.Comment, CreatedAt=r.CreatedAt}).ToList();

        var breakdown = new RatingBreakdownDto();
        foreach(var r in a.Reviews)
        {
            switch(r.Rating){ case 5: breakdown.Stars5++; break; case 4: breakdown.Stars4++; break; case 3: breakdown.Stars3++; break; case 2: breakdown.Stars2++; break; case 1: breakdown.Stars1++; break; }
        }

        var detail = new AgentDetailDto {
            Id = a.Id,
            FullName = a.FullName,
            CompanyName = a.CompanyName,
            City = a.City,
            YearsOfExperience = a.YearsOfExperience,
            RatingAverage = a.RatingAverage,
            NumberOfReviews = a.NumberOfReviews,
            Customs = a.Customs,
            GoodsTypes = a.GoodsTypes,
            IsVerified = a.IsVerified,
            Bio = a.Bio,
            WorkingHours = a.WorkingHours,
            Licenses = a.Licenses.Where(l=>l.IsPublic).Select(l=>new LicenseDto{Id=l.Id, Title=l.Title, IsVerified=l.IsVerified}).ToList(),
            Reviews = reviews,
            RatingBreakdown = breakdown
        };

        return detail;
    }

    public async Task<AgentDashboardDto> GetAgentDashboardAsync(Guid agentId)
    {
        var a = await _db.Agents.Include(x=>x.Analytics).Include(x=>x.Licenses).Include(x=>x.Reviews).FirstOrDefaultAsync(x=>x.Id==agentId);
        if (a == null) return new AgentDashboardDto();

        var completion = CalculateCompletion(a);
        var licenseVerified = a.Licenses.Any(l=>l.IsVerified);
        var views = a.Analytics?.ProfileViews ?? 0;

        var breakdown = new RatingBreakdownDto();
        foreach(var r in a.Reviews)
        {
            switch(r.Rating){ case 5: breakdown.Stars5++; break; case 4: breakdown.Stars4++; break; case 3: breakdown.Stars3++; break; case 2: breakdown.Stars2++; break; case 1: breakdown.Stars1++; break; }
        }

        return new AgentDashboardDto {
            ProfileCompletion = completion,
            IsApproved = a.IsApproved,
            LicenseVerified = licenseVerified,
            ProfileViews = views,
            ReviewsSummary = breakdown
        };
    }

    private double CalculateCompletion(Agent a)
    {
        var total = 6.0; // base fields
        var score = 0.0;
        if (!string.IsNullOrWhiteSpace(a.FullName)) score++;
        if (!string.IsNullOrWhiteSpace(a.CompanyName)) score++;
        if (!string.IsNullOrWhiteSpace(a.Bio)) score++;
        if (a.Licenses?.Any() == true) score++;
        if (a.Customs?.Any() == true) score++;
        if (a.GoodsTypes?.Any() == true) score++;

        return Math.Round((score/total)*100, 0);
    }
}