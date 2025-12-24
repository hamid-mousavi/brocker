using Brocker.Api.Data;
using Brocker.Api.DTOs;
using Brocker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Brocker.Api.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _db;

    public ReviewService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(IEnumerable<ReviewDto> reviews, int total)> GetReviewsForAgentAsync(Guid agentId, int page, int pageSize)
    {
        var q = _db.Reviews.Where(r => r.AgentId == agentId);
        var total = await q.CountAsync();
        var items = await q.OrderByDescending(r=>r.CreatedAt).Skip((page-1)*pageSize).Take(pageSize)
            .Select(r => new ReviewDto{Id=r.Id, ReviewerName=r.ReviewerName, Rating=r.Rating, Comment=r.Comment, CreatedAt=r.CreatedAt}).ToListAsync();
        return (items, total);
    }

    public async Task<ReviewDto> AddReviewAsync(Guid agentId, ReviewDto review)
    {
        var entity = new Review{ AgentId = agentId, ReviewerName = review.ReviewerName, Rating = review.Rating, Comment = review.Comment };
        _db.Reviews.Add(entity);
        await _db.SaveChangesAsync();

        var agent = await _db.Agents.FindAsync(agentId);
        if (agent != null)
        {
            var totalReviews = _db.Reviews.Count(r => r.AgentId == agentId);
            var avg = _db.Reviews.Where(r => r.AgentId == agentId).Average(r => r.Rating);
            agent.NumberOfReviews = totalReviews;
            agent.RatingAverage = Math.Round(avg, 2);
            await _db.SaveChangesAsync();
        }

        return new ReviewDto { Id = entity.Id, ReviewerName = entity.ReviewerName, Rating = entity.Rating, Comment = entity.Comment, CreatedAt = entity.CreatedAt };
    }
}