import Image from 'next/image';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Image
              src="/marketing/favicon.png"
              alt="Lanceflows"
              width={160}
              height={112}
              style={{ width: 160, height: 'auto', display: 'block', borderRadius: 12, marginBottom: 12 }}
            />
            <strong style={{ color: '#fff', fontSize: '1.2rem' }}>Lanceflows</strong>
            <p>
              Talent, in flow. We help clients and talented people invest their strengths and earn the
              most — seamlessly.
            </p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h4>Company</h4>
              <Link href="/services">Services</Link>
              <Link href="/case-study">Case Studies</Link>
              <Link href="/#about">About us</Link>
              <Link href="/#why">Why Lanceflows</Link>
              <Link href="/#contact">Contact</Link>
            </div>
            <div className="foot-col">
              <h4>For clients</h4>
              <Link href="/#why">Hire talent</Link>
              <Link href="/#contact">Request a quote</Link>
              <Link href="/auth/signin">Sign in</Link>
            </div>
            <div className="foot-col">
              <h4>For talent</h4>
              <Link href="/#why">Join us</Link>
              <Link href="/#contact">Apply</Link>
              <Link href="/auth/signin">Sign in</Link>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Lanceflows. All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
