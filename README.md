# Brocker (monorepo)

Services:
- Backend: `Backend/Brocker.Api`
- Frontend: `Front` (Vite + React)

Docker compose (Dev)
- `docker compose up -d --build` will start Postgres and the API. API will be available at `http://localhost:5000`.
- Set frontend dev env: create `.env.local` in `Front` with `VITE_API_URL=http://localhost:5000` and run the frontend normally (`npm install && npm run dev` or `pnpm install && pnpm dev`).

Notes:
- The API uses Postgres when `ConnectionStrings__DefaultConnection` is set (docker-compose sets it for you). Otherwise it falls back to InMemory DB for local dev.
- For production, use EF Migrations; the compose setup uses `EnsureCreated` for simplicity.
