namespace RealEstate.Api.Models;

public class ContactMessage
{
    public int Id { get; set; }
    public string SenderName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; }
}
