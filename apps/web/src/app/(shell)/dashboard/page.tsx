import { GlassCard, PageHeader, SectionLabel, StatusBadge, statusToLevel } from '@lanceflow/ui';
import Link from 'next/link';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

const quickLinks = [
  { href: '/clients', label: 'Clients', note: 'Ops manage · Bidder read' },
  { href: '/control', label: 'Control Center', note: 'CEO / Ops KPI oversight' },
  { href: '/hiring/ceo-queue', label: 'Hiring CEO Queue', note: 'Top candidates & exceptions' },
] as const;

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? '';

  return (
    <ShellPage>
      <PageHeader
        label="overview"
        title="Dashboard"
        description={
          <>
            Signed in as <span className="text-foreground">{email}</span>. Navigation matches your
            role — explore the sidebar or quick links below.
          </>
        }
      />

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>system status</SectionLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status="success" label="Platform" />
          <StatusBadge status="warning" label="Exceptions queue" />
          <StatusBadge status={statusToLevel('error')} label="Blocked payouts" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Live aggregates connect in KPI and automation stories — badges preview the design system.
        </p>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => (
          <GlassCard
            key={item.href}
            className="group p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
          >
            <Link href={item.href} className="block">
              <h2 className="text-base font-semibold text-foreground group-hover:text-primary">
                {item.label}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
              <span className="mt-3 inline-block text-xs text-primary">Open →</span>
            </Link>
          </GlassCard>
        ))}
      </div>
    </ShellPage>
  );
}
