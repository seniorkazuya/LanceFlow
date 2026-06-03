import type { Metadata } from 'next';

import { ServicesPage } from '@/components/marketing/services-page';

export const metadata: Metadata = {
  title: 'Services — Lanceflows | Software Engineering & AI',
  description:
    'Lanceflows software engineering and applied AI services — product engineering, AI & automation, cloud, data integration, architecture consulting, and ongoing growth.',
  icons: {
    icon: '/marketing/favicon.png',
    apple: '/marketing/favicon.png',
  },
};

export default function ServicesRoutePage() {
  return <ServicesPage />;
}
