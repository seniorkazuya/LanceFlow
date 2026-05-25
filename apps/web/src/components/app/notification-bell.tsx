'use client';

import { Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/notifications');
    if (!res.ok) return;
    const data = (await res.json()) as { unread: number; items: NotificationItem[] };
    setUnread(data.unread);
    setItems(data.items);
  }, []);

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    await refresh();
  }

  async function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      await refresh();
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-foreground transition hover:bg-white/[0.1]"
        onClick={toggleOpen}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover shadow-lg">
            <div className="border-b border-border px-3 py-2">
              <p className="text-sm font-medium text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">
                {unread > 0 ? `${unread} unread` : 'All caught up'}
              </p>
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {loading ? (
                <li className="px-3 py-4 text-sm text-muted-foreground">Loading…</li>
              ) : items.length === 0 ? (
                <li className="px-3 py-4 text-sm text-muted-foreground">No notifications yet.</li>
              ) : (
                items.map((item) => (
                  <li
                    key={item.id}
                    className={`border-b border-border/60 px-3 py-2 last:border-0 ${
                      item.readAt ? 'opacity-70' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (!item.readAt) void markRead(item.id);
                      }}
                    >
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
