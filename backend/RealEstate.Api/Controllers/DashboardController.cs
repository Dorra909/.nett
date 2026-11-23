using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var properties=await db.Properties.ToListAsync();
        var requests=await db.Requests.ToListAsync();
        return Ok(new {
            totalProperties=properties.Count,
            availableProperties=properties.Count(p=>p.Status=="Disponible"),
            totalUsers=await db.Users.CountAsync(),
            pendingRequests=requests.Count(r=>r.Status=="En attente"),
            unreadMessages=await db.Messages.CountAsync(m=>!m.IsRead),
            totalValue=properties.Where(p=>p.Transaction=="Vente").Sum(p=>p.Price),
            propertyTypes=properties.GroupBy(p=>p.Type).Select(g=>new { name=g.Key, value=g.Count() }),
            monthlyRequests=requests.GroupBy(r=>r.RequestedAt.ToString("MMM")).Select(g=>new { month=g.Key, demandes=g.Count() })
        });
    }
}
