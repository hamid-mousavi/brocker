using Brocker.Api.DTOs;

namespace Brocker.Api.Services;

public interface IAgentService
{
    Task<(IEnumerable<AgentSummaryDto> agents, int total)> GetAgentsAsync(int page, int pageSize, string? query = null, string? city = null, string? port = null, string? service = null);
    Task<AgentDetailDto?> GetAgentByIdAsync(Guid id, int reviewsPage = 1, int reviewsPageSize = 10);
    Task<AgentDashboardDto> GetAgentDashboardAsync(Guid agentId);
}

public class AgentDashboardDto
{
    public double ProfileCompletion { get; set; }
    public bool IsApproved { get; set; }
    public bool LicenseVerified { get; set; }
    public int ProfileViews { get; set; }
    public RatingBreakdownDto ReviewsSummary { get; set; } = new();
}