#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST = join(__dirname, '..', 'project', 'board-sync.json');
const STORY_ID_RE =
  /\b(DEV|CORE|OPS|AUTO|KPI|PAY|HIRE|AI|SCALE)-\d{3}\b/i;

const [mode, base, title = '', branch = ''] = process.argv.slice(2);

const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const storyId = (title.match(STORY_ID_RE) || branch.match(STORY_ID_RE))?.[0]?.toUpperCase();
if (!storyId || !m.stories[storyId]) {
  console.log('patch-board-sync: no matching story in manifest');
  process.exit(0);
}

if (mode === 'merged') {
  m.stories[storyId].column = base === 'main' ? 'Done' : 'QA / Staging';
} else if (mode === 'open') {
  m.stories[storyId].column = 'In Review';
} else {
  console.error('Usage: patch-board-sync.mjs <merged|open> <base> <title> [branch]');
  process.exit(1);
}

m.updated = new Date().toISOString().slice(0, 10);
writeFileSync(MANIFEST, `${JSON.stringify(m, null, 2)}\n`);
console.log(`patch-board-sync: ${storyId} → ${m.stories[storyId].column}`);
