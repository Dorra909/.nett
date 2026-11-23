using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;
using RealEstate.Api.Models;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/client")]
[Authorize]
public class ClientController(AppDbContext db) : ControllerBase
{
    private string? CurrentEmail => User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

    [HttpGet("properties")]
    public async Task<IActionResult> GetProperties()
    {
        var props = await db.Properties
            .Where(p => p.Status == "Disponible")
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        return Ok(props);
    }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] VisitRequest input)
    {
        if (string.IsNullOrWhiteSpace(CurrentEmail))
            return Unauthorized();

        var req = new VisitRequest
        {
            ClientName = input.ClientName,
            Email = input.Email ?? CurrentEmail,
            Phone = input.Phone,
            PropertyTitle = input.PropertyTitle,
            Message = input.Message,
            Status = "En attente",
            RequestedAt = DateTime.UtcNow
        };

        db.Requests.Add(req);
        await db.SaveChangesAsync();
        return Ok(req);
    }

    [HttpGet("requests")]
    public async Task<IActionResult> GetMyRequests()
    {
        if (string.IsNullOrWhiteSpace(CurrentEmail))
            return Unauthorized();

        var reqs = await db.Requests
            .Where(r => r.Email == CurrentEmail)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();
        return Ok(reqs);
    }

    [HttpGet("messages")]
    public async Task<IActionResult> GetMyMessages()
    {
        if (string.IsNullOrWhiteSpace(CurrentEmail))
            return Unauthorized();

        var msgs = await db.Messages
            .Where(m => m.Email == CurrentEmail)
            .OrderByDescending(m => m.SentAt)
            .ToListAsync();
        return Ok(msgs);
    }
}
