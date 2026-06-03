'use client';

import { getNavItemsForRole, type NavItem } from '@lanceflow/ui';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { MARKETING_LINKS, workspaceTileMeta, type MarketingLink } from '@/components/marketing/site-nav-config';
import type { MarketingNavPage } from '@/components/marketing/site-nav-config';

type SiteMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
  activePage?: MarketingNavPage;
  signOutAction?: ReactNode;
  workspaceLinks: NavItem[];
  signedIn: boolean;
};

function isMarketingActive(link: MarketingLink, activePage?: MarketingNavPage, pathname?: string) {
  if (link.href.startsWith('/#')) return false;
  if (activePage && link.page === activePage) return true;
  if (!activePage && link.href === '/' && pathname === '/') return true;
  if (pathname && link.href !== '/' && pathname.startsWith(link.href)) return true;
  return false;
}

export function SiteMenuDrawer({
  open,
  onClose,
  activePage,
  signOutAction,
  workspaceLinks,
  signedIn,
}: SiteMenuDrawerProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const label = session?.user?.name?.trim() || session?.user?.email || '';
  const role = session?.user?.role?.replace(/_/g, ' ') ?? '';

  if (!open) return null;

  return (
    <div className="site-menu">
      <button type="button" className="site-menu-backdrop" aria-label="Close menu" onClick={onClose} />
      <aside className="site-menu-panel" aria-label="Site navigation">
        {signedIn && label ? (
          <div className="site-menu-user">
            <span className="site-menu-user-avatar" aria-hidden>
              {label.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="site-menu-user-name">{label}</p>
              <p className="site-menu-user-role">{role}</p>
            </div>
          </div>
        ) : null}

        <div className="site-menu-scroll">
          <section className="site-menu-section">
          <h2 className="site-menu-heading">Website</h2>
          <div className="site-menu-links">
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  isMarketingActive(link, activePage, pathname)
                    ? 'site-menu-link active'
                    : 'site-menu-link'
                }
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {signedIn && workspaceLinks.length > 0 ? (
          <section className="site-menu-section">
            <h2 className="site-menu-heading">Workspace</h2>
            <div className="site-menu-tiles">
              {workspaceLinks.map((item) => {
                const meta = workspaceTileMeta(item.id);
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={active ? 'site-menu-tile active' : 'site-menu-tile'}
                    onClick={onClose}
                  >
                    <span className="site-menu-tile-icon" aria-hidden>
                      {meta.icon}
                    </span>
                    <span className="site-menu-tile-text">
                      <span className="site-menu-tile-label">{item.label}</span>
                      {meta.hint ? (
                        <span className="site-menu-tile-hint">{meta.hint}</span>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
        </div>

        <footer className="site-menu-footer">
          {signedIn ? (
            signOutAction ?? (
              <button
                type="button"
                className="site-menu-signout"
                onClick={() => {
                  onClose();
                  void signOut({ callbackUrl: '/' });
                }}
              >
                Sign out
              </button>
            )
          ) : (
            <Link className="btn btn-primary site-menu-signin" href="/auth/signin" onClick={onClose}>
              Sign in
            </Link>
          )}
        </footer>
      </aside>
    </div>
  );
}

export function useWorkspaceLinks(role: string) {
  return role ? getNavItemsForRole(role) : [];
}
