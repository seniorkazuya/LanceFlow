import type { Metadata } from 'next';

import { CaseStudyPage } from '@/components/marketing/case-study-page';

export const metadata: Metadata = {
  title: 'Case Studies — Lanceflows | Selected Project Examples',
  description:
    'Selected, anonymized project examples showing how Lanceflows applies senior engineering judgment, AI, cloud architecture, and automation to real business problems.',
  icons: {
    icon: '/marketing/favicon.png',
    apple: '/marketing/favicon.png',
  },
};

export default function CaseStudyRoutePage() {
  return <CaseStudyPage />;
}
