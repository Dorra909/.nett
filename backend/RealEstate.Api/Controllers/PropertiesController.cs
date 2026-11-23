using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;
using RealEstate.Api.Models;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? status)
    {
        var q = db.Properties.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(p => p.Title.Contains(search) || p.City.Contains(search) || p.Address.Contains(search));
        if (!string.IsNullOrWhiteSpace(status) && status != "Tous")
            q = q.Where(p => p.Status == status);
        return Ok(await q.OrderByDescending(p => p.CreatedAt).ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id) =>
        await db.Properties.FindAsync(id) is { } item ? Ok(item) : NotFound();

    [HttpPost]
    public async Task<IActionResult> Create(Property item)
    {
        if (string.IsNullOrWhiteSpace(item.Title) || string.IsNullOrWhiteSpace(item.City))
            return BadRequest(new { message = "Le titre et la ville sont obligatoires." });
        item.Id = 0;
        item.CreatedAt = DateTime.UtcNow;
        db.Properties.Add(item);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Property input)
    {
        var item = await db.Properties.FindAsync(id);
        if (item is null) return NotFound();
        item.Title=input.Title; item.Address=input.Address; item.City=input.City;
        item.Type=input.Type; item.Transaction=input.Transaction; item.Price=input.Price;
        item.Area=input.Area; item.Bedrooms=input.Bedrooms; item.Bathrooms=input.Bathrooms;
        item.Status=input.Status; item.ImageUrl=input.ImageUrl; item.Description=input.Description;
        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.Properties.FindAsync(id);
        if (item is null) return NotFound();
        db.Properties.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
