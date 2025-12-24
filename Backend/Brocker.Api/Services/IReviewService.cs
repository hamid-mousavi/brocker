using Brocker.Api.DTOs;

namespace Brocker.Api.Services;

public interface IReviewService
{
    Task<(IEnumerable<ReviewDto> reviews, int total)> GetReviewsForAgentAsync(Guid agentId, int page, int pageSize);
    Task<ReviewDto> AddReviewAsync(Guid agentId, ReviewDto review);
}