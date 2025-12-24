using Brocker.Api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Brocker.Api.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user, out DateTime expires)
    {
        var key = _config["Jwt:Key"] ?? "dev_secret_key_replace";
        var secKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
        var creds = new SigningCredentials(secKey, SecurityAlgorithms.HmacSha256);
        expires = DateTime.UtcNow.AddHours(12);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name ?? user.Phone),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        if (user.AgentId.HasValue)
            claims.Add(new Claim("agent_id", user.AgentId.ToString()));

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}