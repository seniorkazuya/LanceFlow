import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const repoEnvPath = path.resolve(packageRoot, '../../../.env');

function applyEnvLine(line) {
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

if (!process.env.DATABASE_URL?.trim() && existsSync(repoEnvPath)) {
  const content = readFileSync(repoEnvPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    applyEnvLine(line);
  }
}

const prismaCli = path.join(packageRoot, 'node_modules/prisma/build/index.js');
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [prismaCli, ...args], {
  cwd: packageRoot,
  env: process.env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
