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

    public async Task<(IEnumerable<AgentSummaryDto> agents, int total)> GetAgentsAsync(int page, int pageSize, string? query = null, string? city = null, string? port = null, string? service = null)
    {
        // normalize inputs: guard against "null"/"undefined" strings from clients and invalid paging values
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 10;
        string? Normalize(string? s) => string.IsNullOrWhiteSpace(s) || s == "null" || s == "undefined" ? null : s;
        query = Normalize(query);
        city = Normalize(city);
        port = Normalize(port);
        service = Normalize(service);

        var q = _db.Agents.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query)) q = q.Where(a => a.FullName.Contains(query) || a.CompanyName.Contains(query));
        if (!string.IsNullOrWhiteSpace(city)) q = q.Where(a => a.City == city);

        // filter by customs (port) or goods types (service) if provided
        if (!string.IsNullOrWhiteSpace(port)) q = q.Where(a => a.Customs.Any(c => c == port) || a.GoodsTypes.Any(g => g == port));
        if (!string.IsNullOrWhiteSpace(service)) q = q.Where(a => a.GoodsTypes.Any(g => g == service) || a.Customs.Any(c => c == service));

        var total = await q.CountAsync();

        List<AgentSummaryDto> items;
        try
        {
            items = await q.OrderByDescending(a => a.RatingAverage)
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
                    IsVerified = a.IsVerified,
                    Mobile = a.Mobile,
                    PhoneNumbers = a.PhoneNumbers
                }).ToListAsync();
        }
        catch (Npgsql.PostgresException ex) when (ex.SqlState == "42703" || ex.Message.Contains("does not exist"))
        {
            // Column missing in DB (migration not applied) - return a safe projection without Mobile/PhoneNumbers
            items = await q.OrderByDescending(a => a.RatingAverage)
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
                    IsVerified = a.IsVerified,
                    Mobile = string.Empty,
                    PhoneNumbers = new List<string>()
                }).ToListAsync();
        }

        return (items, total);
    }

    public async Task<AgentDetailDto?> GetAgentByIdAsync(Guid id, int reviewsPage = 1, int reviewsPageSize = 10)
    {
        try
        {
            var a = await _db.Agents.Include(x => x.Reviews).Include(x => x.Licenses).Include(x => x.Analytics).FirstOrDefaultAsync(x => x.Id == id);
            if (a == null) return null;

            var reviews = a.Reviews.OrderByDescending(r => r.CreatedAt).Skip((reviewsPage - 1) * reviewsPageSize).Take(reviewsPageSize)
                .Select(r => new ReviewDto { Id = r.Id, ReviewerName = r.ReviewerName, Rating = r.Rating, Comment = r.Comment, CreatedAt = r.CreatedAt }).ToList();

            var breakdown = new RatingBreakdownDto();
            foreach (var r in a.Reviews)
            {
                switch (r.Rating) { case 5: breakdown.Stars5++; break; case 4: breakdown.Stars4++; break; case 3: breakdown.Stars3++; break; case 2: breakdown.Stars2++; break; case 1: breakdown.Stars1++; break; }
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
                Mobile = a.Mobile,
                PhoneNumbers = a.PhoneNumbers,
                Bio = a.Bio,
                WorkingHours = a.WorkingHours,
                Licenses = a.Licenses.Where(l => l.IsPublic).Select(l => new LicenseDto { Id = l.Id, Title = l.Title, IsVerified = l.IsVerified }).ToList(),
                Reviews = reviews,
                RatingBreakdown = breakdown
            };

            return detail;
        }
        catch (Npgsql.PostgresException ex) when (ex.SqlState == "42703" || ex.Message.Contains("does not exist"))
        {
            // Column missing - fetch safe projection and assemble dto manually
            var basic = await _db.Agents
                .Where(x => x.Id == id)
                .Select(x => new {
                    x.Id,
                    x.FullName,
                    x.CompanyName,
                    x.City,
                    x.YearsOfExperience,
                    x.RatingAverage,
                    x.NumberOfReviews,
                    x.Customs,
                    x.GoodsTypes,
                    x.IsVerified,
                    x.Bio,
                    x.WorkingHours
                }).FirstOrDefaultAsync();

            if (basic == null) return null;

            var reviews = await _db.Reviews.Where(r => r.AgentId == id).OrderByDescending(r => r.CreatedAt)
                .Skip((reviewsPage - 1) * reviewsPageSize).Take(reviewsPageSize)
                .Select(r => new ReviewDto { Id = r.Id, ReviewerName = r.ReviewerName, Rating = r.Rating, Comment = r.Comment, CreatedAt = r.CreatedAt }).ToListAsync();

            var licenses = await _db.Agents.Where(a => a.Id == id).SelectMany(a => a.Licenses.Where(l => l.IsPublic)).Select(l => new LicenseDto { Id = l.Id, Title = l.Title, IsVerified = l.IsVerified }).ToListAsync();

            var allReviews = await _db.Reviews.Where(r => r.AgentId == id).ToListAsync();
            var breakdown = new RatingBreakdownDto();
            foreach (var r in allReviews)
            {
                switch (r.Rating) { case 5: breakdown.Stars5++; break; case 4: breakdown.Stars4++; break; case 3: breakdown.Stars3++; break; case 2: breakdown.Stars2++; break; case 1: breakdown.Stars1++; break; }
            }

            return new AgentDetailDto {
                Id = basic.Id,
                FullName = basic.FullName,
                CompanyName = basic.CompanyName,
                City = basic.City,
                YearsOfExperience = basic.YearsOfExperience,
                RatingAverage = basic.RatingAverage,
                NumberOfReviews = basic.NumberOfReviews,
                Customs = basic.Customs,
                GoodsTypes = basic.GoodsTypes,
                IsVerified = basic.IsVerified,
                Mobile = string.Empty,
                PhoneNumbers = new List<string>(),
                Bio = basic.Bio,
                WorkingHours = basic.WorkingHours,
                Licenses = licenses,
                Reviews = reviews,
                RatingBreakdown = breakdown
            };
        }
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