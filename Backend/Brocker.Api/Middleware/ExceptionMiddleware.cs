using System.Net;
using System.Text.Json;

namespace Brocker.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            httpContext.Response.ContentType = "application/json; charset=utf-8";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var res = new { success = false, message = "An error occurred", data = (object?)null };
            await httpContext.Response.WriteAsync(JsonSerializer.Serialize(res));
        }
    }
}