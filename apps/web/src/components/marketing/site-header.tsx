'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, type ReactNode } from 'react';

import { NotificationBell } from '@/components/app/notification-bell';
import { MARKETING_LINKS, type MarketingNavPage } from '@/components/marketing/site-nav-config';
import { SiteMenuDrawer, useWorkspaceLinks } from '@/components/marketing/site-menu-drawer';

const LOGO = '/marketing/company_logo.png';

type SiteHeaderProps = {
  variant?: 'marketing' | 'workspace';
  activePage?: MarketingNavPage;
  brandHref?: string;
  brandTag?: string;
  signOutAction?: ReactNode;
};

export function SiteHeader({
  variant = 'marketing',
  activePage,
  brandHref,
  brandTag,
  signOutAction,
}: SiteHeaderProps) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = session?.user?.role ?? '';
  const signedIn = Boolean(session?.user?.email);
  const workspaceLinks = useWorkspaceLinks(role);
  const isWorkspace = variant === 'workspace';

  const homeHref = brandHref ?? (isWorkspace ? '/dashboard' : '/');
  const tagline =
    brandTag ?? (isWorkspace ? 'Workspace' : 'Software Engineering & AI Services');

  const showInlineMarketingLinks = !isWorkspace && status !== 'loading';

  return (
    <>
      <header>
        <div className="wrap nav site-header-bar">
          <Link className="brand" href={homeHref} aria-label="Lanceflows home">
            <Image
              className="logo-img"
              src={LOGO}
              alt=""
              width={120}
              height={44}
              style={{ width: 'auto', height: 44 }}
              priority
            />
            <span className="brand-text">
              <span className="brand-name">
                Lance<b>flows</b>
              </span>
              <span className="brand-tag">{tagline}</span>
            </span>
          </Link>

          {showInlineMarketingLinks ? (
            <nav className="nav-links site-header-links" aria-label="Website">
              {MARKETING_LINKS.filter((link) => !link.href.startsWith('/#')).map((item) => (
                <Link
                  key={item.page}
                  href={item.href}
                  className={activePage === item.page ? 'active' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="site-header-spacer" aria-hidden />
          )}

          <div className="site-header-actions">
            {isWorkspace && signedIn ? <NotificationBell /> : null}

            {!signedIn && status !== 'loading' ? (
              <>
                <Link className="btn btn-ghost site-header-signin" href="/auth/signin">
                  Sign in
                </Link>
                <Link className="btn btn-primary site-header-contact" href="/#contact">
                  Contact us
                </Link>
              </>
            ) : null}

            <button
              type="button"
              className="site-menu-trigger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="site-menu-trigger-icon" aria-hidden>
                {menuOpen ? '✕' : '☰'}
              </span>
              <span className="site-menu-trigger-label">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <SiteMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activePage={activePage}
        signOutAction={
          signOutAction ? (
            <div className="site-menu-signout-wrap" onClick={() => setMenuOpen(false)}>
              {signOutAction}
            </div>
          ) : undefined
        }
        workspaceLinks={workspaceLinks}
        signedIn={signedIn}
      />
    </>
  );
}
