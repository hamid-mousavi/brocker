using Brocker.Api.Models;

namespace Brocker.Api.DTOs;

public class AgentSummaryDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public double RatingAverage { get; set; }
    public int NumberOfReviews { get; set; }
    public List<string> Customs { get; set; } = new();
    public List<string> GoodsTypes { get; set; } = new();
    public bool IsVerified { get; set; }
    public string Mobile { get; set; } = string.Empty;
    public List<string> PhoneNumbers { get; set; } = new();
}

public class AgentDetailDto : AgentSummaryDto
{
    public string Bio { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
    public List<LicenseDto> Licenses { get; set; } = new();
    public List<ReviewDto> Reviews { get; set; } = new();
    public RatingBreakdownDto RatingBreakdown { get; set; } = new();
}

public class LicenseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
}

public class ReviewDto
{
    public Guid Id { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class RatingBreakdownDto
{
    public int Stars5 { get; set; }
    public int Stars4 { get; set; }
    public int Stars3 { get; set; }
    public int Stars2 { get; set; }
    public int Stars1 { get; set; }
}