import Image from 'next/image';
import Link from 'next/link';

const LOGO = '/marketing/company_logo.png';

export function LandingNav() {
  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="#top" aria-label="Lanceflows home">
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
          <Link href="/" className="active">
            Overview
          </Link>
          <Link href="#about-short">Services</Link>
          <Link href="#why">Case Studies</Link>
        </nav>
        <div className="top-actions">
          <Link className="btn btn-ghost" href="/auth/signin">
            Sign in
          </Link>
          <Link className="btn btn-primary" href="#contact">
            Contact us
          </Link>
        </div>
      </div>
    </header>
  );
}
