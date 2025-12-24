namespace Brocker.Api.Models;

public class AgentAnalytics
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AgentId { get; set; }
    public int ProfileViews { get; set; }
    public int PendingApprovals { get; set; }
}