using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController(AppDbContext db) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await db.Messages.OrderByDescending(x=>x.SentAt).ToListAsync());
    [HttpPut("{id:int}/read")] public async Task<IActionResult> MarkRead(int id)
    {
        var item=await db.Messages.FindAsync(id); if(item is null)return NotFound();
        item.IsRead=true; await db.SaveChangesAsync(); return Ok(item);
    }
}
