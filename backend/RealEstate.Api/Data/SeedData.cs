using RealEstate.Api.Models;

namespace RealEstate.Api.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        if (db.Properties.Any()) return;

        db.Properties.AddRange(
            new Property { Title="Villa contemporaine avec piscine", Address="Les Jardins de Carthage", City="Tunis", Type="Villa", Transaction="Vente", Price=780000, Area=320, Bedrooms=4, Bathrooms=3, Status="Disponible", ImageUrl="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900", Description="Villa lumineuse avec jardin et piscine." },
            new Property { Title="Appartement lumineux au centre", Address="Centre urbain nord", City="Tunis", Type="Appartement", Transaction="Location", Price=1800, Area=115, Bedrooms=3, Bathrooms=2, Status="Disponible", ImageUrl="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900", Description="Appartement moderne proche des commodités." },
            new Property { Title="Maison familiale avec terrasse", Address="Hammamet Nord", City="Nabeul", Type="Maison", Transaction="Vente", Price=420000, Area=210, Bedrooms=3, Bathrooms=2, Status="Réservé", ImageUrl="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900", Description="Maison agréable avec grande terrasse." },
            new Property { Title="Studio meublé moderne", Address="Sahloul", City="Sousse", Type="Studio", Transaction="Location", Price=950, Area=48, Bedrooms=1, Bathrooms=1, Status="Disponible", ImageUrl="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900", Description="Studio meublé idéal pour étudiant ou jeune actif." }
        );
        db.Users.AddRange(
            new AppUser { FullName="Amira Ben Salem", Email="amira@example.com", Phone="+216 22 345 678", Password="123456", Role="Administrateur" },
            new AppUser { FullName="Yassine Trabelsi", Email="yassine@example.com", Phone="+216 55 123 456", Password="123456", Role="Agent" },
            new AppUser { FullName="Sarra Khelifi", Email="sarra@example.com", Phone="+216 98 765 432", Password="123456", Role="Client" }
        );
        db.Requests.AddRange(
            new VisitRequest { ClientName="Nour Ben Ali", Email="nour@example.com", Phone="+216 20 111 222", PropertyTitle="Villa contemporaine avec piscine", Status="En attente", Message="Je souhaite visiter le bien samedi." },
            new VisitRequest { ClientName="Karim Mansour", Email="karim@example.com", Phone="+216 21 333 444", PropertyTitle="Appartement lumineux au centre", Status="Confirmée", Message="Disponible après 16h." },
            new VisitRequest { ClientName="Meriem Gharbi", Email="meriem@example.com", Phone="+216 27 555 666", PropertyTitle="Studio meublé moderne", Status="En attente", Message="Merci de me contacter." }
        );
        db.Messages.AddRange(
            new ContactMessage { SenderName="Ali Mabrouk", Email="ali@example.com", Subject="Question sur une villa", Content="Bonjour, le prix est-il négociable ?" },
            new ContactMessage { SenderName="Rim Saidi", Email="rim@example.com", Subject="Demande de partenariat", Content="Nous souhaitons discuter d'un partenariat." }
        );
        db.SaveChanges();
    }
}
