import type { Metadata } from 'next';

import { CaseStudyDetail } from '@/components/marketing/case-study-detail';
import { getAllMarketingCases, getMarketingCase, getMarketingCaseIds } from '@/data/marketing-cases-index';

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getMarketingCaseIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const c = getMarketingCase(id);
  return {
    title: c ? `${c.title} — Lanceflows` : 'Case Study — Lanceflows',
    description: c?.description ?? 'Detailed Lanceflows case study.',
    icons: {
      icon: '/marketing/favicon.png',
      apple: '/marketing/favicon.png',
    },
  };
}

export default async function CaseStudyDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  return <CaseStudyDetail id={id} />;
}
