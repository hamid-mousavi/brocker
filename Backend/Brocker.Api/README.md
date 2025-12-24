# Brocker API (Development)

This is a simple ASP.NET Core Web API intended to integrate with a Persian/RTL frontend.

Key features:
- JWT authentication (phone login/OTP stub)
- Agents list and profile endpoints
- Reviews with pagination and rating breakdown
- Admin endpoints for approvals and stats
- In-memory DB with seed data for quick development
- Swagger enabled
- CORS enabled for localhost frontends

Run:
- dotnet run -p Brocker.Api

Run (development with Swagger UI enabled):
- ASPNETCORE_ENVIRONMENT=Development dotnet run -p Brocker.Api

Example curl requests:
- List agents: curl http://localhost:5000/api/agents
- Login (dev/stubbed OTP): curl -X POST -H "Content-Type: application/json" -d '{"phone":"+989120000001"}' http://localhost:5000/api/auth/login
- Current user: curl -H "Authorization: Bearer <token>" http://localhost:5000/api/auth/me
- Agent detail: curl http://localhost:5000/api/agents/<agentId>
- Agent reviews: curl http://localhost:5000/api/agents/<agentId>/reviews
- Add review: curl -X POST -H "Content-Type: application/json" -d '{"reviewerName":"تست","rating":5,"comment":"آزمایشی"}' http://localhost:5000/api/agents/<agentId>/reviews

Notes:
- Swagger UI is enabled when running with ASPNETCORE_ENVIRONMENT=Development.
- POST /api/agents/{id}/reviews now returns the created review including its generated ID and CreatedAt timestamp for easier UI updates.

Docker & Postgres (development)
- Start services: `docker compose up -d` (runs Postgres and the API)
- The compose file exposes API at `http://localhost:5000` and Postgres on `5432`.
- Environment in `docker-compose.yml`:
  - POSTGRES_USER=brocker, POSTGRES_PASSWORD=brocker_pwd, POSTGRES_DB=brockerdb
  - ConnectionStrings__DefaultConnection uses `Host=db;Database=brockerdb;Username=brocker;Password=brocker_pwd`
- The API will apply EF Migrations automatically at startup when using a relational database (calls `db.Database.Migrate()`). For development you can also run migrations manually:
  - Install CLI tool: `dotnet tool install --global dotnet-ef` (if not installed)
  - Create migration: `dotnet ef migrations add InitialCreate -o Migrations --project Brocker.Api --startup-project Brocker.Api`
  - Apply migration: `dotnet ef database update --project Brocker.Api --startup-project Brocker.Api`

Design-time factory:
- A `DesignTimeDbContextFactory` exists to help `dotnet ef` find the DB provider and connection string (it reads `ConnectionStrings__DefaultConnection` env var or falls back to a localhost Postgres).

Frontend integration
- Vite-based frontend can point to the API using `VITE_API_URL=http://localhost:5000`
- Ensure CORS allows `http://localhost:5173` or the dev host you use.
- Example env in frontend `.env`: `VITE_API_URL=http://localhost:5000`

Security note
- JWT secret is set via `Jwt__Key` environment variable in docker-compose for local dev. Change in production and rotate secrets.

Standard response envelope:
{
  "success": true,
  "message": "optional",
  "data": { },
  "meta": { page, pageSize, total }
}

API highlights:
- POST /api/auth/login { phone }
- GET /api/auth/me
- GET /api/agents?page=1&pageSize=10
- GET /api/agents/{id}
- GET /api/agents/{id}/dashboard
- GET /api/agents/{agentId}/reviews?page=1&pageSize=10
- POST /api/agents/{agentId}/reviews
- Admin endpoints require JWT with role=Admin
- GET /api/admin/agents
- GET /api/admin/stats
- POST /api/admin/agents/{id}/approve

Notes for frontend:
- All text is UTF-8 and seed data uses Persian names to validate RTL rendering
- Responses are optimized for list and detail views with computed fields
