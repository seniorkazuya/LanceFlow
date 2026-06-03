import Image from 'next/image';
import Link from 'next/link';

const LOGO = '/marketing/company_logo.png';

export type MarketingNavPage = 'overview' | 'services' | 'case-study';

const NAV_LINKS: { href: string; label: string; page: MarketingNavPage }[] = [
  { href: '/', label: 'Overview', page: 'overview' },
  { href: '/services', label: 'Services', page: 'services' },
  { href: '/case-study', label: 'Case Studies', page: 'case-study' },
];

type LandingNavProps = {
  activePage?: MarketingNavPage;
};

export function LandingNav({ activePage }: LandingNavProps) {
  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label="Lanceflows home">
          <Image
            className="logo-img"
            src={LOGO}
            alt="Lanceflows logo"
            width={120}
            height={44}
            style={{ width: 'auto', height: 44 }}
            priority
          />
          <span className="brand-text">
            <span className="brand-name">
              Lance<b>flows</b>
            </span>
            <span className="brand-tag">Software Engineering &amp; AI Services</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.page}
              href={item.href}
              className={activePage === item.page ? 'active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="top-actions">
          <Link className="btn btn-ghost" href="/auth/signin">
            Sign in
          </Link>
          <Link className="btn btn-ghost label-hide" href="/auth/signup">
            Sign up
          </Link>
          <Link className="btn btn-primary" href="/#contact">
            Contact us
          </Link>
        </div>
      </div>
    </header>
  );
}
