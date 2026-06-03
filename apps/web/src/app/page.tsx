import type { Metadata } from 'next';

import { LandingPage } from '@/components/marketing/landing-page';

export const metadata: Metadata = {
  title: 'Lanceflows — Talent, in flow.',
  description:
    'Lanceflows connects clients with talented people who invest their strengths and earn the most — with seamless, confident flow.',
  icons: {
    icon: '/marketing/favicon.png',
    apple: '/marketing/favicon.png',
  },
};

export default function HomePage() {
  return <LandingPage />;
}
