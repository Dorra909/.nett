# RealEstate Admin

Application de back-office immobilier basée sur **ASP.NET Core Web API (.NET 8)**, **Entity Framework Core + SQLite**, **React + Vite** et **Tailwind CSS**.

## Fonctionnalités
- Dashboard avec indicateurs et statistiques.
- CRUD des biens immobiliers (recherche, filtre, ajout, modification, suppression).
- Gestion des utilisateurs.
- Suivi des demandes de visite / renseignements.
- Gestion des messages.
- API REST documentée avec Swagger en développement.
- Données de démonstration créées automatiquement au premier démarrage.

## Prérequis
- .NET 8 SDK
- Node.js 20+
- npm

## Démarrage rapide

### 1. Backend
```bash
cd backend/RealEstate.Api
dotnet restore
dotnet run
```
API : `http://localhost:5080`  
Swagger : `http://localhost:5080/swagger`

La base SQLite `realestate.db` est créée automatiquement dans le dossier du projet.

### 2. Frontend
Dans un autre terminal :
```bash
cd frontend
npm install
npm run dev
```
Interface : `http://localhost:5173`

## Structure
```text
RealEstateAdmin/
├── backend/RealEstate.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   └── Program.cs
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── ...
```

## API principale
- `GET /api/dashboard`
- `GET /api/properties`, `GET /api/properties/{id}`, `POST`, `PUT`, `DELETE`
- `GET /api/users`, `POST`, `PUT`, `DELETE`
- `GET /api/requests`, `PUT /api/requests/{id}/status`
- `GET /api/messages`, `PUT /api/messages/{id}/read`

## Notes
- CORS est configuré pour `http://localhost:5173`.
- Cette version est un socle pédagogique fonctionnel. L'authentification réelle, l'upload sécurisé des images et les rôles/permissions peuvent être ajoutés comme extensions.
