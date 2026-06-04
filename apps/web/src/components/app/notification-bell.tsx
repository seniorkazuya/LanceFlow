'use client';

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
    <div className="notify-root">
      <button
        type="button"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="notify-btn"
        onClick={toggleOpen}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="notify-btn-icon">
          <path
            d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
            fill="currentColor"
          />
        </svg>
        {unread > 0 ? (
          <span className="notify-badge">{unread > 9 ? '9+' : unread}</span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="notify-backdrop"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="notify-panel" role="dialog" aria-label="Notifications">
            <div className="notify-panel-head">
              <p className="notify-panel-title">Notifications</p>
              <p className="notify-panel-subtitle">
                {unread > 0 ? `${unread} unread` : 'All caught up'}
              </p>
            </div>
            <ul className="notify-panel-list">
              {loading ? (
                <li className="notify-empty">Loading…</li>
              ) : items.length === 0 ? (
                <li className="notify-empty">No notifications yet.</li>
              ) : (
                items.map((item) => (
                  <li key={item.id} className={item.readAt ? 'notify-item is-read' : 'notify-item'}>
                    <button
                      type="button"
                      className="notify-item-btn"
                      onClick={() => {
                        if (!item.readAt) void markRead(item.id);
                      }}
                    >
                      <p className="notify-item-title">{item.title}</p>
                      <p className="notify-item-body">{item.body}</p>
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
