using Brocker.Api.Data;
using Brocker.Api.DTOs;
using Brocker.Api.Models;
using Brocker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Brocker.Api.Controllers;

public class AuthController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthController(AppDbContext db, IJwtService jwt){ _db = db; _jwt = jwt; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Phone)) return BadRequestEnvelope("Phone is required");

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Phone == req.Phone);
        if (user == null)
        {
            user = new User{ Phone = req.Phone, Role = UserRole.User };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        // For demo, we skip OTP and issue token immediately
        var token = _jwt.GenerateToken(user, out var expires);
        var data = new LoginResponse{ AccessToken = token, ExpiresAt = expires, Role = user.Role.ToString() };
        return OkEnvelope(data, "Logged in");
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User?.Claims?.FirstOrDefault(c=>c.Type==System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(BadRequestEnvelope("Not authenticated"));
        var user = await _db.Users.FirstOrDefaultAsync(u=>u.Id==Guid.Parse(userId));
        if (user == null) return NotFoundEnvelope("User not found");

        var result = new { Id = user.Id, Phone = user.Phone, Name = user.Name, Role = user.Role.ToString(), IsAgentApproved = user.IsAgentApproved, IsProfileCompleted = user.IsProfileCompleted, AgentId = user.AgentId };
        return OkEnvelope(result);
    }
}