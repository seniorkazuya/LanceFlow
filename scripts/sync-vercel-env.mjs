#!/usr/bin/env node
/**
 * Push selected keys from repo-root `.env` to the linked Vercel project (apps/web).
 *
 * Prerequisites:
 *   pnpm vercel:login
 *   pnpm vercel:link
 *
 * Usage:
 *   pnpm vercel:env:sync
 *   pnpm vercel:env:sync -- --env production
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const webRoot = path.join(repoRoot, 'apps', 'web');
const envPath = path.join(repoRoot, '.env');
const webProjectJson = path.join(webRoot, '.vercel', 'project.json');
const repoJson = path.join(repoRoot, '.vercel', 'repo.json');
const PREVIEW_GIT_BRANCH = 'staging';
const STAGING_APP_URL = 'https://lance-flow-web.vercel.app';

const DEFAULT_KEYS = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'AZURE_AD_CLIENT_ID',
  'AZURE_AD_CLIENT_SECRET',
  'AZURE_AD_TENANT_ID',
  'DEV_AUTH_EMAIL',
  'DEV_AUTH_PASSWORD',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
  'SENTRY_DSN',
  'REDIS_URL',
  'AUTH_URL',
];

const DEFAULT_TARGETS = ['production', 'preview'];

function isVercelLinked() {
  if (existsSync(webProjectJson)) return true;
  if (!existsSync(repoJson)) return false;
  try {
    const data = JSON.parse(readFileSync(repoJson, 'utf8'));
    return data.projects?.some(
      (project) =>
        project.name === 'lance-flow-web' ||
        project.directory === 'apps/web' ||
        project.directory === 'apps\\web'
    );
  } catch {
    return false;
  }
}

function parseEnvFile(filePath) {
  const vars = {};
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function runVercel(args) {
  const result = spawnSync('pnpm', ['exec', 'vercel', ...args, '--non-interactive'], {
    cwd: webRoot,
    stdio: 'pipe',
    encoding: 'utf8',
    env: { ...process.env, CI: '1' },
    shell: true,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    console.error(detail || `vercel ${args.join(' ')} failed`);
    process.exit(result.status ?? 1);
  }
  return result.stdout?.trim() ?? '';
}

function setVercelEnv(key, target, value) {
  if (target === 'preview') {
    runVercel(['env', 'add', key, 'preview', PREVIEW_GIT_BRANCH, '--value', value, '--yes', '--force']);
    return;
  }
  runVercel(['env', 'add', key, target, '--value', value, '--yes', '--force']);
}

function parseArgs(argv) {
  const envFlag = argv.indexOf('--env');
  const targets =
    envFlag >= 0 && argv[envFlag + 1]
      ? argv.slice(envFlag + 1).filter((arg) => !arg.startsWith('--'))
      : DEFAULT_TARGETS;
  return targets.length > 0 ? targets : DEFAULT_TARGETS;
}

function deployValueForKey(key, value, target) {
  if (target !== 'production' && target !== 'preview') return value;
  if (key === 'AUTH_URL' || key === 'NEXT_PUBLIC_APP_URL') {
    return value.includes('localhost') ? STAGING_APP_URL : value;
  }
  if (key === 'REDIS_URL' && /localhost|127\.0\.0\.1/i.test(value)) {
    return null;
  }
  return value;
}

if (!isVercelLinked()) {
  console.error('Vercel project not linked. Run: pnpm vercel:link');
  process.exit(1);
}

if (!existsSync(envPath)) {
  console.error(`Missing ${envPath}`);
  process.exit(1);
}

const vars = parseEnvFile(envPath);
const targets = parseArgs(process.argv.slice(2));
const jobs = [];

for (const key of DEFAULT_KEYS) {
  const value = vars[key]?.trim();
  if (!value) continue;
  for (const target of targets) {
    const deployValue = deployValueForKey(key, value, target);
    if (deployValue == null) continue;
    jobs.push({ key, target, value: deployValue });
  }
}

console.log(`Syncing ${jobs.length} env values to: ${targets.join(', ')}`);

let done = 0;
for (const job of jobs) {
  done += 1;
  process.stdout.write(`[${done}/${jobs.length}] ${job.key} (${job.target})… `);
  setVercelEnv(job.key, job.target, job.value);
  console.log('ok');
}

console.log('Done. Redeploy for runtime changes: pnpm vercel:deploy');
