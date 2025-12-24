using Brocker.Api.DTOs;

namespace Brocker.Api.Services;

public interface IAdminService
{
    Task<(IEnumerable<AgentSummaryDto> agents, int total)> GetAgentsAsync(int page, int pageSize, string? status = null);
    Task<AdminStatsDto> GetStatsAsync();
    Task ApproveAgentAsync(Guid agentId);
    Task RejectAgentAsync(Guid agentId, string? reason = null);
}