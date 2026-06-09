import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react';
import type { Notification } from '../types/notification';
import { MOCK_NOTIFICATIONS } from '../lib/mockNotifications';

// ─── Storage helpers ──────────────────────────────────────────────────────────

const LS_KEY = 'lz_notifications';

function loadFromStorage(): Notification[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return MOCK_NOTIFICATIONS;
    const parsed = JSON.parse(raw) as Array<Omit<Notification, 'createdAt'> & { createdAt: string }>;
    return parsed.map(n => ({ ...n, createdAt: new Date(n.createdAt) }));
  } catch {
    return MOCK_NOTIFICATIONS;
  }
}

function saveToStorage(notifications: Notification[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(notifications));
  } catch { /* silent */ }
}

// ─── Context types ────────────────────────────────────────────────────────────

interface NotificationContextValue {
  notifications:   Notification[];
  unreadCount:     number;
  drawerOpen:      boolean;
  toasts:          Notification[];
  markAsRead:      (id: string) => void;
  markAllAsRead:   () => void;
  archive:         (id: string) => void;
  restore:         (id: string) => void;
  deleteNotif:     (id: string) => void;
  dismissToast:    (id: string) => void;
  openDrawer:      () => void;
  closeDrawer:     () => void;
  addNotification: (n: Notification) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(loadFromStorage);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [toasts,        setToasts]        = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // ── Mutators ──────────────────────────────────────────────────────────────

  const update = useCallback((id: string, patch: Partial<Notification>) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, ...patch } : n);
      saveToStorage(next);
      return next;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    update(id, { status: 'read' });
  }, [update]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n =>
        n.status === 'unread' ? { ...n, status: 'read' as const } : n
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const archive = useCallback((id: string) => {
    update(id, { status: 'archived' });
    // also remove from toasts if present
    setToasts(prev => prev.filter(t => t.id !== id));
  }, [update]);

  const restore = useCallback((id: string) => {
    update(id, { status: 'read' });
  }, [update]);

  const deleteNotif = useCallback((id: string) => {
    setNotifications(prev => {
      const next = prev.filter(n => n.id !== id);
      saveToStorage(next);
      return next;
    });
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const openDrawer  = useCallback(() => setDrawerOpen(true),  []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addNotification = useCallback((n: Notification) => {
    setNotifications(prev => {
      const next = [n, ...prev];
      saveToStorage(next);
      return next;
    });
    setToasts(prev => {
      const current = prev.slice(-2); // keep at most 2 existing so total ≤ 3
      return [...current, n];
    });
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    drawerOpen,
    toasts,
    markAsRead,
    markAllAsRead,
    archive,
    restore,
    deleteNotif,
    dismissToast,
    openDrawer,
    closeDrawer,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
