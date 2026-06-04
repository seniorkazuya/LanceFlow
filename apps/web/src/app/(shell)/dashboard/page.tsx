import { RolePolicy, hasRole } from '@lanceflow/auth';
import { StatusBadge, statusToLevel } from '@lanceflow/ui';
import { UserRole } from '@lanceflow/types';
import Link from 'next/link';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

const staffQuickLinks = [
  { href: '/clients', label: 'Clients', note: 'Ops manage · Bidder read' },
  { href: '/control', label: 'Control Center', note: 'CEO / Ops KPI oversight' },
  { href: '/hiring/pipeline', label: 'Hiring pipeline', note: 'Stages, scores, time-to-hire' },
  { href: '/hiring/ceo-queue', label: 'Hiring CEO Queue', note: 'Top candidates & exceptions' },
] as const;

const portalClientQuickLinks = [
  {
    href: '/projects',
    label: 'My projects',
    note: 'Track delivery status, milestones, and payments for your work.',
  },
] as const;

const developerQuickLinks = [
  {
    href: '/apply',
    label: 'Apply',
    note: 'Submit or update your resume in the hiring pipeline.',
  },
] as const;

function quickLinksForRole(role: string) {
  if (role === UserRole.CLIENT) return portalClientQuickLinks;
  if (role === UserRole.DEVELOPER) return developerQuickLinks;

  return staffQuickLinks.filter((item) => {
    if (item.href === '/clients') return hasRole(role, RolePolicy.clientsRead);
    if (item.href === '/control') return hasRole(role, RolePolicy.controlCenter);
    if (item.href === '/hiring/pipeline') return hasRole(role, RolePolicy.hiringPipelineRead);
    if (item.href === '/hiring/ceo-queue') return hasRole(role, RolePolicy.hiringCeoQueue);
    return false;
  });
}

function dashboardDescription(role: string, email: string) {
  if (role === UserRole.CLIENT) {
    return (
      <>
        Signed in as <strong>{email}</strong>. Use <strong>My projects</strong> to see work linked to
        your email. If the list is empty, ask Ops to set your login email on your client record.
      </>
    );
  }
  if (role === UserRole.DEVELOPER) {
    return (
      <>
        Signed in as <strong>{email}</strong>. Complete your application or check hiring status from
        the sidebar.
      </>
    );
  }
  return (
    <>
      Signed in as <strong>{email}</strong>. Navigation matches your role — explore the sidebar or
      quick links below.
    </>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? '';
  const role = session?.user?.role ?? '';
  const quickLinks = quickLinksForRole(role);
  const isPortalUser = role === UserRole.CLIENT || role === UserRole.DEVELOPER;

  return (
    <ShellPage>
      <div className="app-page-head">
        <span className="eyebrow">Overview</span>
        <h1>Dashboard</h1>
        <p>{dashboardDescription(role, email)}</p>
      </div>

      {!isPortalUser ? (
        <div className="card app-panel">
          <p className="app-panel-label">System status</p>
          <div className="app-badge-row">
            <StatusBadge status="success" label="Platform" />
            <StatusBadge status="warning" label="Exceptions queue" />
            <StatusBadge status={statusToLevel('error')} label="Blocked payouts" />
          </div>
          <p className="app-panel-note">
            Live aggregates connect in KPI and automation stories — badges preview the design system.
          </p>
        </div>
      ) : null}

      {quickLinks.length > 0 ? (
        <div className="app-link-grid">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="card app-link-card">
              <h2>{item.label}</h2>
              <p>{item.note}</p>
              <span className="app-link-card-cta">Open →</span>
            </Link>
          ))}
        </div>
      ) : null}
    </ShellPage>
  );
}
