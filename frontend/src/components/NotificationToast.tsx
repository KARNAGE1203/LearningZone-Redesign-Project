import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { NOTIF_TYPES, type Notification } from '../types/notification';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function actionUrlToPage(url: string): string {
  const segment = url.split('/').filter(Boolean).pop() ?? '';
  const map: Record<string, string> = {
    materials:     'materials',
    assessments:   'assessments',
    grades:        'grades',
    notifications: 'notifications',
    overview:      'overview',
    resources:     'resources',
    'course-info': 'course-info',
  };
  return map[segment] ?? 'notifications';
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

interface ToastItemProps {
  notif:      Notification;
  onDismiss:  () => void;
  onView:     () => void;
}

function ToastItem({ notif, onDismiss, onView }: ToastItemProps) {
  const [entered,  setEntered]  = useState(false);
  const [exiting,  setExiting]  = useState(false);
  const type = NOTIF_TYPES[notif.type];

  const startExit = useCallback(() => {
    setExiting(true);
    setTimeout(onDismiss, 280);
  }, [onDismiss]);

  // Enter animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Auto-dismiss for system / university
  useEffect(() => {
    if (notif.type === 'system' || notif.type === 'university') {
      const t = setTimeout(startExit, 8000);
      return () => clearTimeout(t);
    }
  }, [notif.type, startExit]);

  const style: React.CSSProperties = {
    transform: exiting
      ? 'translateX(120%)'
      : entered
      ? 'translateY(0)'
      : 'translateY(14px)',
    opacity:    exiting ? 0 : entered ? 1 : 0,
    transition: 'transform 280ms ease, opacity 280ms ease',
    borderLeft: `4px solid ${type.border}`,
  };

  return (
    <div
      className="bg-white rounded-xl border border-[#E8E8E4] shadow-lg p-4 w-full"
      style={style}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full shrink-0"
          style={{ background: type.bg, color: type.text }}
        >
          {type.label}
        </span>
        <button
          onClick={startExit}
          className="w-6 h-6 flex items-center justify-center rounded-md cursor-pointer transition-colors shrink-0"
          style={{ color: '#6B6B6B' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A1A1A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <p className="mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: '#1A1A1A' }}>
        {notif.title}
      </p>

      {/* Preview */}
      <p
        className="mt-1 text-[12px] leading-relaxed truncate"
        style={{ color: '#6B6B6B' }}
        title={notif.preview}
      >
        {notif.preview}
      </p>

      {/* Bottom row */}
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
          {notif.timestamp}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onView}
            className="text-[12px] font-semibold cursor-pointer hover:underline underline-offset-2 transition-colors"
            style={{ color: '#00897B' }}
          >
            View
          </button>
          <button
            onClick={startExit}
            className="text-[12px] font-medium cursor-pointer hover:underline underline-offset-2 transition-colors"
            style={{ color: '#6B6B6B' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast Stack ──────────────────────────────────────────────────────────────

interface NotificationToastProps {
  onNavigate: (page: string) => void;
}

export function NotificationToast({ onNavigate }: NotificationToastProps) {
  const { toasts, dismissToast, markAsRead } = useNotifications();
  // max 3 — newest at bottom (end of array)
  const visible = toasts.slice(-3);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ width: 320 }}
    >
      {visible.map(notif => (
        <div key={notif.id} className="pointer-events-auto">
          <ToastItem
            notif={notif}
            onDismiss={() => dismissToast(notif.id)}
            onView={() => {
              markAsRead(notif.id);
              dismissToast(notif.id);
              onNavigate(actionUrlToPage(notif.actionUrl ?? '/notifications'));
            }}
          />
        </div>
      ))}
    </div>
  );
}
