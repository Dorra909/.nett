using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestsController(AppDbContext db) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await db.Requests.OrderByDescending(x=>x.RequestedAt).ToListAsync());
    [HttpPut("{id:int}/status")] public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusDto dto)
    {
        var item=await db.Requests.FindAsync(id); if(item is null)return NotFound();
        item.Status=dto.Status; await db.SaveChangesAsync(); return Ok(item);
    }
    public record StatusDto(string Status);
}
