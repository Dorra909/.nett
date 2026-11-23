namespace RealEstate.Api.Models;

public class Property
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string Type { get; set; } = "Appartement";
    public string Transaction { get; set; } = "Vente";
    public decimal Price { get; set; }
    public int Area { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public string Status { get; set; } = "Disponible";
    public string ImageUrl { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
