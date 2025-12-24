using Brocker.Api.Models;

namespace Brocker.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user, out DateTime expires);
}