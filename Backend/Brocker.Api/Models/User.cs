namespace Brocker.Api.Models;

public enum UserRole { Admin, Agent, User }

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Phone { get; set; } = string.Empty; // login via phone/OTP
    public string? Name { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public Guid? AgentId { get; set; } // link to agent if user is agent operator
    public bool IsAgentApproved { get; set; }
    public bool IsProfileCompleted { get; set; }
}