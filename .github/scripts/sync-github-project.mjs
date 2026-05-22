#!/usr/bin/env node
/**
 * Sync LanceFlow Build (GitHub Project v2) from .github/project/board-sync.json
 * and optional PR merge events.
 *
 * Requires token with read:project + project (or GITHUB_TOKEN with projects: write
 * when project #4 is linked to seniorkazuya/LanceFlow).
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = join(__dirname, '..', 'project', 'board-sync.json');

const STORY_ID_RE =
  /\b(DEV|CORE|OPS|AUTO|KPI|PAY|HIRE|AI|SCALE)-\d{3}\b/i;

const PROJECT_QUERY = `
query LanceFlowProject($login: String!, $number: Int!, $cursor: String) {
  user(login: $login) {
    projectV2(number: $number) {
      id
      title
      fields(first: 30) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
        }
      }
      items(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          content {
            ... on Issue {
              number
              title
            }
            ... on DraftIssue {
              title
            }
          }
        }
      }
    }
  }
}
`;

const UPDATE_FIELD = `
mutation UpdateStatus(
  $projectId: ID!
  $itemId: ID!
  $fieldId: ID!
  $optionId: String!
) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { singleSelectOptionId: $optionId }
    }
  ) {
    projectV2Item {
      id
    }
  }
}
`;

const ADD_DRAFT = `
mutation AddDraft($projectId: ID!, $title: String!) {
  addProjectV2DraftIssue(input: { projectId: $projectId, title: $title }) {
    projectItem {
      id
    }
  }
}
`;

const ADD_ISSUE = `
mutation AddIssue($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
    item {
      id
    }
  }
}
`;

const ISSUE_NODE = `
query IssueNode($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $number) {
      id
    }
  }
}
`;

function parseArgs(argv) {
  const out = {
    event: process.env.SYNC_EVENT || 'manifest',
    base: process.env.PR_BASE || '',
    title: process.env.PR_TITLE || '',
    branch: process.env.PR_BRANCH || '',
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--event') out.event = argv[++i];
    else if (a === '--base') out.base = argv[++i];
    else if (a === '--title') out.title = argv[++i];
    else if (a === '--branch') out.branch = argv[++i];
    else if (a === '--dry-run') out.dryRun = true;
  }
  return out;
}

function extractStoryId(...texts) {
  for (const t of texts) {
    if (!t) continue;
    const m = String(t).match(STORY_ID_RE);
    if (m) return m[0].toUpperCase();
  }
  return null;
}

function columnForMerge(base) {
  if (base === 'main') return 'Done';
  if (base === 'staging') return 'QA / Staging';
  return null;
}

function columnForPrEvent(event, base) {
  if (event === 'pr-open' && base === 'staging') return 'In Review';
  return null;
}

async function graphql(token, query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'lanceflow-project-sync',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors?.length) {
    const msg = json.errors?.map((e) => e.message).join('; ') || res.statusText;
    throw new Error(`GraphQL failed: ${msg}`);
  }
  return json.data;
}

async function loadManifest() {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

async function fetchAllProjectItems(token, login, number) {
  const items = [];
  let cursor = null;
  let project = null;
  for (;;) {
    const data = await graphql(token, PROJECT_QUERY, {
      login,
      number,
      cursor,
    });
    project = data?.user?.projectV2;
    if (!project) throw new Error(`Project ${number} not found for @${login}`);
    items.push(...(project.items?.nodes ?? []));
    const page = project.items?.pageInfo;
    if (!page?.hasNextPage) break;
    cursor = page.endCursor;
  }
  return { project, items };
}

function itemStoryId(item) {
  const content = item.content;
  const title = content?.title ?? '';
  return extractStoryId(title);
}

function getStatusField(project, fieldName) {
  const fields = project.fields?.nodes ?? [];
  return fields.find((f) => f?.name === fieldName) ?? null;
}

function normalizeColumn(name) {
  return name.replace(/\s+/g, ' ').trim();
}

async function ensureItemForStory(
  token,
  projectId,
  repo,
  storyId,
  spec,
  itemByStory,
  statusField,
  optionByName,
  dryRun,
) {
  let item = itemByStory.get(storyId);
  if (item) return item;

  if (spec.issue) {
    const data = await graphql(token, ISSUE_NODE, {
      owner: repo.owner,
      repo: repo.name,
      number: spec.issue,
    });
    const issueId = data?.repository?.issue?.id;
    if (issueId) {
      if (dryRun) {
        console.log(`[dry-run] would add issue #${spec.issue} for ${storyId}`);
        return { id: `dry-${storyId}` };
      }
      const added = await graphql(token, ADD_ISSUE, {
        projectId,
        contentId: issueId,
      });
      item = added.addProjectV2ItemById.item;
      itemByStory.set(storyId, item);
      console.log(`Added issue #${spec.issue} to project (${storyId})`);
      return item;
    }
  }

  const title = spec.title ?? storyId;
  if (dryRun) {
    console.log(`[dry-run] would add draft "${title}" for ${storyId}`);
    return { id: `dry-${storyId}` };
  }
  const added = await graphql(token, ADD_DRAFT, { projectId, title });
  item = added.addProjectV2DraftIssue.projectItem;
  itemByStory.set(storyId, item);
  console.log(`Added draft card "${title}" (${storyId})`);
  return item;
}

async function setItemColumn(
  token,
  projectId,
  itemId,
  statusField,
  column,
  optionByName,
  dryRun,
) {
  const col = normalizeColumn(column);
  const optionId = optionByName.get(col);
  if (!optionId) {
    throw new Error(
      `Column "${col}" not found on Status field. Options: ${[...optionByName.keys()].join(', ')}`,
    );
  }
  if (dryRun) {
    console.log(`[dry-run] would set item ${itemId} → ${col}`);
    return;
  }
  await graphql(token, UPDATE_FIELD, {
    projectId,
    itemId,
    fieldId: statusField.id,
    optionId,
  });
  console.log(`Updated ${itemId} → ${col}`);
}

async function main() {
  const args = parseArgs(process.argv);
  const token = process.env.PROJECTS_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Missing PROJECTS_TOKEN or GITHUB_TOKEN');
    process.exit(1);
  }

  const manifest = await loadManifest();
  const { owner, number } = manifest.project;
  const repo = { owner: 'seniorkazuya', name: 'LanceFlow' };

  const { project, items } = await fetchAllProjectItems(token, owner, number);
  const statusField = getStatusField(project, manifest.statusFieldName);
  if (!statusField) {
    throw new Error(`Status field "${manifest.statusFieldName}" not found on project`);
  }

  const optionByName = new Map(
    (statusField.options ?? []).map((o) => [normalizeColumn(o.name), o.id]),
  );

  const itemByStory = new Map();
  for (const item of items) {
    const sid = itemStoryId(item);
    if (sid) itemByStory.set(sid, item);
  }

  const stories = { ...manifest.stories };

  if (args.event === 'pr-merged' || args.event === 'pr-open') {
    const storyId = extractStoryId(args.title, args.branch);
    const col =
      args.event === 'pr-merged'
        ? columnForMerge(args.base)
        : columnForPrEvent(args.event, args.base);
    if (storyId && col) {
      stories[storyId] = {
        ...(stories[storyId] ?? { title: storyId }),
        column: col,
      };
      console.log(`${args.event} → ${storyId} = ${col}`);
    } else {
      console.log(`${args.event}: no story ID in title/branch; manifest-only sync`);
    }
  }

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const [storyId, spec] of Object.entries(stories)) {
    const targetCol = spec.column;
    if (!targetCol) continue;

    let item = itemByStory.get(storyId);
    if (!item) {
      missing++;
      item = await ensureItemForStory(
        token,
        project.id,
        repo,
        storyId,
        spec,
        itemByStory,
        statusField,
        optionByName,
        args.dryRun,
      );
    }

    await setItemColumn(
      token,
      project.id,
      item.id,
      statusField,
      targetCol,
      optionByName,
      args.dryRun,
    );
    updated++;
  }

  console.log(
    `Sync complete (project ${number}): ${updated} updated, ${skipped} unchanged, ${missing} created`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
