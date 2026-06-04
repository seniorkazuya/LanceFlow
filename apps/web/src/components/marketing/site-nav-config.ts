export type MarketingNavPage = 'overview' | 'services' | 'case-study' | 'apply';

export type MarketingLink = {
  href: string;
  label: string;
  page: MarketingNavPage;
};

export const MARKETING_LINKS: readonly MarketingLink[] = [
  { href: '/', label: 'Overview', page: 'overview' },
  { href: '/services', label: 'Services', page: 'services' },
  { href: '/case-study', label: 'Case Studies', page: 'case-study' },
  { href: '/#contact', label: 'Contact', page: 'overview' },
] as const;

/** Short labels + icons for workspace tiles in the menu drawer. */
export const WORKSPACE_TILE_META: Record<string, { icon: string; hint?: string }> = {
  dashboard: { icon: '◫', hint: 'Your home base' },
  apply: { icon: '✦', hint: 'Hiring application' },
  clients: { icon: '◎', hint: 'Client records' },
  'my-projects': { icon: '▣', hint: 'Your engagements' },
  projects: { icon: '▣', hint: 'Delivery pipeline' },
  workers: { icon: '◉', hint: 'Team capacity' },
  'daily-reports': { icon: '◷', hint: 'Engineer updates' },
  'ops-console': { icon: '⚙', hint: 'Operations tools' },
  'missing-reports': { icon: '!', hint: 'Follow-ups' },
  sops: { icon: '≡', hint: 'Playbooks' },
  control: { icon: '◈', hint: 'KPI oversight' },
  'hiring-pipeline': { icon: '→', hint: 'Candidate stages' },
  'hiring-ceo-queue': { icon: '★', hint: 'Top candidates' },
  audit: { icon: '⎘', hint: 'Activity history' },
};

export function workspaceTileMeta(navId: string) {
  return WORKSPACE_TILE_META[navId] ?? { icon: '•', hint: undefined };
}
