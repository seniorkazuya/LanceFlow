'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTION_LABELS: Record<string, string> = {
  clients: 'Clients',
  projects: 'Projects',
  workers: 'Team workload',
  'daily-reports': 'Daily report',
  hiring: 'Hiring',
  control: 'Control Center',
  'control-center': 'Control Center',
  ops: 'Ops console',
  sops: 'SOPs',
  audit: 'Audit log',
  dashboard: 'Dashboard',
};

function getBackTarget(pathname: string): { href: string; label: string } | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return null;

  const parentSegments = segments.slice(0, -1);
  const parentHref = `/${parentSegments.join('/')}`;
  const parentKey = parentSegments[parentSegments.length - 1] ?? 'dashboard';
  const label = SECTION_LABELS[parentKey] ?? parentKey.replace(/-/g, ' ');

  return { href: parentHref, label };
}

export function AppPageBar() {
  const pathname = usePathname();
  const back = getBackTarget(pathname);

  if (!back) return null;

  return (
    <nav className="app-page-bar" aria-label="Page navigation">
      <Link href={back.href} className="app-back-link">
        ← Back to {back.label}
      </Link>
    </nav>
  );
}
