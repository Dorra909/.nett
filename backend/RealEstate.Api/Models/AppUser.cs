namespace RealEstate.Api.Models;

public class AppUser
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Password { get; set; } = "";
    public string Role { get; set; } = "Client";
    public string Status { get; set; } = "Actif";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
