using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;
using RealEstate.Api.Models;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await db.Users.OrderByDescending(x=>x.CreatedAt).ToListAsync());
    [HttpPost] public async Task<IActionResult> Create(AppUser user)
    {
        if (string.IsNullOrWhiteSpace(user.FullName) || string.IsNullOrWhiteSpace(user.Email)) return BadRequest();
        user.Id=0; db.Users.Add(user); await db.SaveChangesAsync(); return Ok(user);
    }
    [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, AppUser input)
    {
        var u=await db.Users.FindAsync(id); if(u is null)return NotFound();
        u.FullName=input.FullName; u.Email=input.Email; u.Phone=input.Phone; u.Role=input.Role; u.Status=input.Status;
        await db.SaveChangesAsync(); return Ok(u);
    }
    [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id)
    {
        var u=await db.Users.FindAsync(id); if(u is null)return NotFound();
        db.Users.Remove(u); await db.SaveChangesAsync(); return NoContent();
    }
}
