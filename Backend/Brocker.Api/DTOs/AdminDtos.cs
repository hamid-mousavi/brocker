namespace Brocker.Api.DTOs;

public class AdminStatsDto
{
    public int TotalAgents { get; set; }
    public int PendingApprovals { get; set; }
    public int PendingLicenses { get; set; }
}