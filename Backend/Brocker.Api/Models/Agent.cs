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

    // Contact
    public string Mobile { get; set; } = string.Empty;
    public List<string> PhoneNumbers { get; set; } = new();

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

public enum LegalType { Individual = 0, Company = 1 }

public class RegistrationRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public LegalType LegalType { get; set; } = LegalType.Individual;
    public string Mobile { get; set; } = string.Empty;
    public string OfficePhone { get; set; } = string.Empty;
    public string HomePhone { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public List<string> Customs { get; set; } = new();
    public List<string> GoodsTypes { get; set; } = new();
    public int YearsOfExperience { get; set; }
    public string Description { get; set; } = string.Empty;

    public List<RegistrationAttachment> Attachments { get; set; } = new();
    public List<RegistrationPhone> Phones { get; set; } = new();

    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class RegistrationPhone
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RegistrationRequestId { get; set; }
    public string Type { get; set; } = string.Empty; // mobile|office|home|fax|other
    public string Number { get; set; } = string.Empty;
}

public class RegistrationAttachment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RegistrationRequestId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}