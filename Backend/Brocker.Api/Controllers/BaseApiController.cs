using Brocker.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Brocker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected OkObjectResult OkEnvelope<T>(T data, string? message = null, object? meta = null)
    {
        var res = new ApiResponse<T> { Success = true, Message = message, Data = data, Meta = meta };
        return Ok(res);
    }

    protected BadRequestObjectResult BadRequestEnvelope(string message, object? errors = null)
    {
        var res = new ApiResponse<object?> { Success = false, Message = message, Data = null, Meta = errors };
        return BadRequest(res);
    }

    protected NotFoundObjectResult NotFoundEnvelope(string message)
    {
        var res = new ApiResponse<object?> { Success = false, Message = message, Data = null };
        return NotFound(res);
    }
}