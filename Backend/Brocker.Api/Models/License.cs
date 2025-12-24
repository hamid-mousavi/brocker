namespace Brocker.Api.Models;

public class License
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public bool IsPublic { get; set; } = true; // Only public licenses are shown in profile
}