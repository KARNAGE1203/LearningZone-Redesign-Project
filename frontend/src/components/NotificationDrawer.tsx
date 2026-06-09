import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNotifications } from '../context/NotificationContext';
import { NOTIF_TYPES, type Notification } from '../types/notification';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'unread' | 'course';

interface NotificationDrawerProps {
  onNavigate: (page: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function groupNotifications(notifs: Notification[]) {
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const groups: { label: string; items: Notification[] }[] = [
    { label: 'TODAY',     items: [] },
    { label: 'YESTERDAY', items: [] },
    { label: 'THIS WEEK', items: [] },
  ];

  for (const n of notifs) {
    if (n.status === 'archived') continue;
    if      (isSameDay(n.createdAt, today))     groups[0].items.push(n);
    else if (isSameDay(n.createdAt, yesterday)) groups[1].items.push(n);
    else                                         groups[2].items.push(n);
  }

  return groups.filter(g => g.items.length > 0);
}

// ─── Notification Item (compact drawer style) ─────────────────────────────────

function DrawerItem({
  notif,
  onView,
  onDismiss,
  onMarkRead,
}: {
  notif:       Notification;
  onView:      () => void;
  onDismiss:   () => void;
  onMarkRead:  () => void;
}) {
  const type    = NOTIF_TYPES[notif.type];
  const isUnread = notif.status === 'unread';

  return (
    <div
      className="py-3 border-b"
      style={{ borderColor: '#F0EFEA' }}
      onClick={isUnread ? onMarkRead : undefined}
    >
      <div className="flex items-start gap-2.5">
        {/* Unread dot */}
        <div className="mt-1.5 w-2 shrink-0 flex justify-center">
          {isUnread && (
            <span className="block w-2 h-2 rounded-full" style={{ background: '#00897B' }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: type tag + timestamp */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full shrink-0"
              style={{ background: type.bg, color: type.text }}
            >
              {type.label}
            </span>
            <span className="text-[11px] shrink-0" style={{ color: '#9CA3AF' }}>
              {notif.timestamp}
            </span>
          </div>

          {/* Title */}
          <p
            className="text-[14px] leading-snug mb-1 line-clamp-1"
            style={{
              color:      '#1A1A1A',
              fontWeight: isUnread ? 600 : 400,
            }}
          >
            {notif.title}
          </p>

          {/* Preview */}
          <p
            className="text-[12px] leading-relaxed mb-2 line-clamp-2"
            style={{ color: '#6B6B6B' }}
          >
            {notif.preview}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: '#F0EFEA', color: '#6B6B6B' }}
            >
              {notif.source}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={e => { e.stopPropagation(); onView(); }}
                className="text-[12px] font-semibold cursor-pointer hover:underline underline-offset-2"
                style={{ color: '#00897B' }}
              >
                View →
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDismiss(); }}
                className="text-[12px] font-medium cursor-pointer hover:underline underline-offset-2"
                style={{ color: '#9CA3AF' }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────

export function NotificationDrawer({ onNavigate }: NotificationDrawerProps) {
  const {
    notifications,
    drawerOpen,
    closeDrawer,
    markAsRead,
    markAllAsRead,
    archive,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all',    label: 'All'    },
    { key: 'unread', label: 'Unread' },
    { key: 'course', label: 'Course' },
  ];

  // Filter active notifications (exclude archived)
  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (n.status === 'archived') return false;
      if (activeTab === 'unread' && n.status !== 'unread')         return false;
      if (activeTab === 'course' && n.sourceType !== 'course')     return false;
      return true;
    });
  }, [notifications, activeTab]);

  const groups = useMemo(() => groupNotifications(filtered), [filtered]);

  const handleView = (notif: Notification) => {
    markAsRead(notif.id);
    closeDrawer();
    const segment = (notif.actionUrl ?? '/notifications').split('/').filter(Boolean).pop() ?? 'notifications';
    const page = ['materials', 'assessments', 'grades', 'overview', 'resources', 'course-info'].includes(segment)
      ? segment
      : 'notifications';
    onNavigate(page);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full z-[45] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ width: 380 }}
      >
        {/* ── Header ── */}
        <div className="px-5 py-5 border-b shrink-0" style={{ borderColor: '#E8E8E4' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold" style={{ color: '#1A1A1A' }}>
              Notifications
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="text-[13px] font-semibold cursor-pointer hover:underline underline-offset-2"
                style={{ color: '#00897B' }}
              >
                Mark All Read
              </button>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-100"
                style={{ color: '#6B6B6B' }}
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-5 border-b" style={{ borderColor: '#E8E8E4' }}>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="pb-2 text-[13px] font-medium cursor-pointer transition-colors"
                style={
                  activeTab === key
                    ? { color: '#00897B', borderBottom: '2px solid #00897B', marginBottom: -1 }
                    : { color: '#6B6B6B' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-5">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <p className="text-[14px] font-medium" style={{ color: '#9CA3AF' }}>No notifications</p>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.label}>
                {/* Group label */}
                <p
                  className="text-[11px] font-bold tracking-[0.2em] pt-4 pb-2"
                  style={{ color: '#9CA3AF' }}
                >
                  {group.label}
                </p>

                {/* Items */}
                {group.items.map(notif => (
                  <DrawerItem
                    key={notif.id}
                    notif={notif}
                    onView={() => handleView(notif)}
                    onDismiss={() => archive(notif.id)}
                    onMarkRead={() => markAsRead(notif.id)}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="px-5 py-4 border-t shrink-0"
          style={{ borderColor: '#E8E8E4' }}
        >
          <button
            onClick={() => { onNavigate('notifications'); closeDrawer(); }}
            className="w-full flex items-center justify-center text-[14px] font-medium cursor-pointer hover:underline underline-offset-2 transition-colors"
            style={{ color: '#00897B' }}
          >
            View All Notifications →
          </button>
        </div>
      </div>
    </>
  );
}
