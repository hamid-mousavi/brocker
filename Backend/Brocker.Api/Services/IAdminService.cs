using Brocker.Api.DTOs;

namespace Brocker.Api.Services;

public interface IAdminService
{
    Task<(IEnumerable<AgentSummaryDto> agents, int total)> GetAgentsAsync(int page, int pageSize, string? status = null);
    Task<(IEnumerable<RegistrationRequestSummaryDto> requests, int total)> GetRegistrationRequestsAsync(int page, int pageSize, string? status = null);
    Task<RegistrationRequestDto?> GetRegistrationRequestByIdAsync(Guid id);
    Task ApproveRegistrationRequestAsync(Guid requestId);
    Task RejectRegistrationRequestAsync(Guid requestId, string? reason = null);
    Task<AdminStatsDto> GetStatsAsync();
    Task ApproveAgentAsync(Guid agentId);
    Task RejectAgentAsync(Guid agentId, string? reason = null);
}