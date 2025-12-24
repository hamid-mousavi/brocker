using Brocker.Api.DTOs;
using Brocker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Brocker.Api.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : BaseApiController
{
    private readonly IAdminService _admin;

    public AdminController(IAdminService admin){ _admin = admin; }

    [HttpGet("agents")]
    public async Task<IActionResult> Agents([FromQuery]int page=1, [FromQuery]int pageSize=10, [FromQuery]string? status=null)
    {
        var (agents, total) = await _admin.GetAgentsAsync(page, pageSize, status);
        var meta = new PaginationMeta{ Page = page, PageSize = pageSize, Total = total };
        return OkEnvelope(agents, null, meta);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var stats = await _admin.GetStatsAsync();
        return OkEnvelope(stats);
    }

    [HttpGet("registrations")]
    public async Task<IActionResult> Registrations([FromQuery]int page=1, [FromQuery]int pageSize=10, [FromQuery]string? status=null)
    {
        var (requests, total) = await _admin.GetRegistrationRequestsAsync(page, pageSize, status);
        var meta = new PaginationMeta{ Page = page, PageSize = pageSize, Total = total };
        return OkEnvelope(requests, null, meta);
    }

    [HttpGet("registrations/{id}")]
    public async Task<IActionResult> Registration([FromRoute]Guid id)
    {
        var r = await _admin.GetRegistrationRequestByIdAsync(id);
        if (r==null) return NotFoundEnvelope("Registration not found");
        return OkEnvelope(r);
    }

    [HttpPost("registrations/{id}/approve")]
    public async Task<IActionResult> ApproveRegistration([FromRoute]Guid id)
    {
        await _admin.ApproveRegistrationRequestAsync(id);
        return OkEnvelope(new { id }, "Registration approved");
    }

    [HttpPost("registrations/{id}/reject")]
    public async Task<IActionResult> RejectRegistration([FromRoute]Guid id, [FromBody] object? body)
    {
        await _admin.RejectRegistrationRequestAsync(id);
        return OkEnvelope(new { id }, "Registration rejected");
    }

    [HttpPost("agents/{id}/approve")]
    public async Task<IActionResult> Approve([FromRoute]Guid id)
    {
        await _admin.ApproveAgentAsync(id);
        return OkEnvelope(new { id }, "Agent approved");
    }

    [HttpPost("agents/{id}/reject")]
    public async Task<IActionResult> Reject([FromRoute]Guid id, [FromBody] object? body)
    {
        await _admin.RejectAgentAsync(id);
        return OkEnvelope(new { id }, "Agent rejected");
    }
}