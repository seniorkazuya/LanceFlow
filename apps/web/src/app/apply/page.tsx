import { PageHeader } from '@lanceflow/ui';
import type { Metadata } from 'next';

import { HiringApplyForm } from '@/components/hiring/apply-form';
import { LandingNav } from '@/components/marketing/landing-nav';

export const metadata: Metadata = {
  title: 'Apply — LanceFlow',
  description: 'Submit your resume to join the LanceFlow talent pipeline.',
};

export default function ApplyPage() {
  return (
    <div className="lf-page-grid lf-mesh-bg relative min-h-screen">
      <LandingNav />
      <main className="mx-auto w-full max-w-xl px-6 py-12 lg:px-8">
        <PageHeader
          label="careers"
          title="Join LanceFlow"
          description="Engineers, bidders, and callers — apply with your resume. We review every submission through our structured hiring pipeline."
        />
        <div className="mt-8">
          <HiringApplyForm />
        </div>
      </main>
    </div>
  );
}
