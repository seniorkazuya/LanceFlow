import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import * as React from 'react';

import { getNavItemsForRole } from '../nav';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export type AppShellUser = {
  email: string;
  displayName?: string | null;
  role: string;
};

export type AppShellLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export type AppShellProps = {
  user: AppShellUser;
  currentPath: string;
  children: React.ReactNode;
  /** Next.js `Link` or plain anchor — keeps @lanceflow/ui framework-agnostic. */
  LinkComponent: React.ComponentType<AppShellLinkProps>;
  signOutAction?: React.ReactNode;
  /** Right side of top bar (theme toggle, sign out, etc.) */
  headerActions?: React.ReactNode;
  /** Brand mark (e.g. logo image) shown in sidebar header */
  brandSlot?: React.ReactNode;
};

export function AppShell({
  user,
  currentPath,
  children,
  LinkComponent,
  signOutAction,
  headerActions,
  brandSlot,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navItems = getNavItemsForRole(user.role);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
        {brandSlot ?? (
          <LayoutDashboard className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">LanceFlow</p>
          <p className="text-xs text-muted-foreground">Performance ecosystem</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Main">
        {navItems.map((item) => {
          const active =
            currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          return (
            <LinkComponent
              key={item.id}
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/80'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </LinkComponent>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3 text-xs text-muted-foreground">
        <p className="truncate font-medium text-sidebar-foreground">
          {user.displayName ?? user.email}
        </p>
        <p className="truncate">{user.email}</p>
        <p className="mt-1 uppercase tracking-wide">{user.role}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar/95 backdrop-blur-xl md:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 h-full w-60 border-r border-sidebar-border bg-sidebar shadow-lg">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background/60 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground md:hidden">LanceFlow</span>
          </div>
          <div className="flex items-center gap-1">
            {headerActions ?? signOutAction ?? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Sign out via sidebar profile
              </span>
            )}
          </div>
        </header>
        <main className="lf-page-grid relative flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
