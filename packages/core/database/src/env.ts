import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

let loaded = false;

function applyEnvLine(line: string): void {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eq = trimmed.indexOf('=');
  if (eq <= 0) return;
  const key = trimmed.slice(0, eq).trim();
  if (!key || process.env[key] !== undefined) return;
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

function loadEnvFile(envPath: string): void {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    applyEnvLine(line);
  }
}

/** Load repo-root `.env` when Prisma runs outside Next (or Next did not inject env). */
export function loadMonorepoEnv(): void {
  if (loaded) return;
  loaded = true;

  if (process.env.DATABASE_URL?.trim()) return;

  const searchDirs = [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '../..'),
    path.resolve(process.cwd(), '../../..'),
    path.resolve(process.cwd(), '../../../..'),
  ];

  for (const dir of searchDirs) {
    const envPath = path.join(dir, '.env');
    const workspaceFile = path.join(dir, 'pnpm-workspace.yaml');
    if (existsSync(envPath) && existsSync(workspaceFile)) {
      loadEnvFile(envPath);
      return;
    }
  }
}
