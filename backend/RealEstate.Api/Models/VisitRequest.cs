namespace RealEstate.Api.Models;

public class VisitRequest
{
    public int Id { get; set; }
    public string ClientName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string PropertyTitle { get; set; } = "";
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "En attente";
    public string Message { get; set; } = "";
}
