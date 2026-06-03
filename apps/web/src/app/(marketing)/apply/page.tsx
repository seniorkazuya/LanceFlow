import type { Metadata } from 'next';

import { HiringApplyForm } from '@/components/hiring/apply-form';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Apply — Lanceflows',
  description: 'Submit your resume to join the Lanceflows talent pipeline.',
};

export default async function ApplyPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user?.email);
  const defaultFullName = session?.user?.name ?? '';
  const defaultEmail = session?.user?.email ?? '';

  return (
    <MarketingShell activePage="apply">
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Careers</span>
          <h1>Join Lanceflows</h1>
          <p>
            {signedIn
              ? 'Complete your hiring application below. Pick the role track that fits you — we review every resume through our structured pipeline.'
              : 'Engineers, bidders, and callers — apply with your resume. We review every submission through our structured hiring pipeline.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <HiringApplyForm
            defaultFullName={defaultFullName}
            defaultEmail={defaultEmail}
            signedIn={signedIn}
          />
        </div>
      </section>
    </MarketingShell>
  );
}
