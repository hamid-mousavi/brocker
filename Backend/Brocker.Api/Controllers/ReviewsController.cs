using Brocker.Api.DTOs;
using Brocker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Brocker.Api.Controllers;

[Route("api/agents/{agentId}/[controller]")]
public class ReviewsController : BaseApiController
{
    private readonly IReviewService _reviews;

    public ReviewsController(IReviewService reviews){ _reviews = reviews; }

    [HttpGet]
    public async Task<IActionResult> Get(Guid agentId, [FromQuery]int page=1, [FromQuery]int pageSize=10)
    {
        var (reviews, total) = await _reviews.GetReviewsForAgentAsync(agentId, page, pageSize);
        var meta = new PaginationMeta{ Page = page, PageSize = pageSize, Total = total };
        return OkEnvelope(reviews, null, meta);
    }

    [HttpPost]
    public async Task<IActionResult> Post(Guid agentId, [FromBody] ReviewDto review)
    {
        if (string.IsNullOrWhiteSpace(review.ReviewerName) || review.Rating < 1 || review.Rating > 5) return BadRequestEnvelope("Validation error", new { reviewerName="required", rating="1-5" });
        var created = await _reviews.AddReviewAsync(agentId, review);
        return OkEnvelope(created, "Review added");
    }
}