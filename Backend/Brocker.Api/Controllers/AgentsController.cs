using Brocker.Api.DTOs;
using Brocker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Brocker.Api.Controllers;

[Route("api/[controller]")]
public class AgentsController : BaseApiController
{
    private readonly IAgentService _agentService;

    public AgentsController(IAgentService agentService){ _agentService = agentService; }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? query = null, [FromQuery] string? city = null)
    {
        var (agents, total) = await _agentService.GetAgentsAsync(page, pageSize, query, city);
        var meta = new PaginationMeta{ Page = page, PageSize = pageSize, Total = total };
        return OkEnvelope(agents, null, meta);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get([FromRoute] Guid id, [FromQuery] int reviewsPage=1, [FromQuery] int reviewsPageSize=10)
    {
        var a = await _agentService.GetAgentByIdAsync(id, reviewsPage, reviewsPageSize);
        if (a==null) return NotFoundEnvelope("Agent not found");
        return OkEnvelope(a);
    }

    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> Dashboard([FromRoute] Guid id){
        var d = await _agentService.GetAgentDashboardAsync(id);
        return OkEnvelope(d);
    }
}