# Local development on Windows

## Docker not found?

`docker compose` needs **Docker Desktop**. If PowerShell says `docker` is not recognized:

### Option A — Install Docker (local Postgres + Redis)

1. Install [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) (or run in **Admin** PowerShell):
   ```powershell
   winget install -e --id Docker.DockerDesktop --source winget
   ```
2. Start **Docker Desktop** from the Start menu and wait until it shows **Running**.
3. **Close and reopen** your terminal (refreshes `PATH`).
4. From the repo root:
   ```powershell
   docker compose up -d
   pnpm db:migrate:deploy
   pnpm dev
   ```

WSL 2 is required on Windows 10/11; the Docker installer usually enables it.

### Option B — No Docker (use Neon staging DB)

You only need Postgres for sign-in and migrations. Redis is optional locally (`/api/health` shows `redis: skipped`).

1. In [Neon](https://neon.tech), copy your **staging** connection string.
2. In `.env`, set:
   ```env
   DATABASE_URL="postgresql://...your-neon-url..."
   ```
   Leave `REDIS_URL` unset or commented out.
3. Run:
   ```powershell
   pnpm db:migrate:deploy
   pnpm dev
   ```

Use the same `AUTH_SECRET`, `DEV_AUTH_*`, and `AUTH_URL=http://localhost:3000` as in `.env.example`.

See also [AUTH.md](./AUTH.md).
