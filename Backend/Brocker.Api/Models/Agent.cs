namespace Brocker.Api.Models;

public class Agent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public double RatingAverage { get; set; }
    public int NumberOfReviews { get; set; }
    public List<string> Customs { get; set; } = new();
    public List<string> GoodsTypes { get; set; } = new();
    public bool IsVerified { get; set; }

    // Profile
    public string Bio { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public List<License> Licenses { get; set; } = new();

    // Analytics
    public AgentAnalytics? Analytics { get; set; }

    // Navigation
    public List<Review> Reviews { get; set; } = new();

    // Admin & status
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}