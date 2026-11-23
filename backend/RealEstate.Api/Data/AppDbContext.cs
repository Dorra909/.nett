using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Models;

namespace RealEstate.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<VisitRequest> Requests => Set<VisitRequest>();
    public DbSet<ContactMessage> Messages => Set<ContactMessage>();
}
