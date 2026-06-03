import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

const BRAND_ICON = '/brand/lanceflow-icon.png';

export function AuthPageShell({
  label,
  title,
  description,
  children,
  footer,
}: {
  label: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="section alt auth-page">
      <div className="wrap auth-page-inner">
        <div className="auth-page-head">
          <span className="eyebrow">{label}</span>
          <Image
            src={BRAND_ICON}
            alt="Lanceflows"
            width={120}
            height={120}
            className="auth-page-logo"
            priority
          />
          <h1>{title}</h1>
          <p className="auth-page-desc">{description}</p>
        </div>

        <div className="card auth-card">{children}</div>

        {footer ?? (
          <p className="auth-page-footer">
            <Link href="/">← Back to home</Link>
          </p>
        )}
      </div>
    </section>
  );
}
