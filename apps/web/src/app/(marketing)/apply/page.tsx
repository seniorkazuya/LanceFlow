import type { Metadata } from 'next';

import { HiringApplyForm } from '@/components/hiring/apply-form';
import { MarketingShell } from '@/components/marketing/marketing-shell';

export const metadata: Metadata = {
  title: 'Apply — Lanceflows',
  description: 'Submit your resume to join the Lanceflows talent pipeline.',
};

export default function ApplyPage() {
  return (
    <MarketingShell activePage="overview">
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Careers</span>
          <h1>Join Lanceflows</h1>
          <p>
            Engineers, bidders, and callers — apply with your resume. We review every submission
            through our structured hiring pipeline.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <HiringApplyForm />
        </div>
      </section>
    </MarketingShell>
  );
}
