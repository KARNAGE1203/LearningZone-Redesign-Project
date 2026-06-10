import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { useNotifications } from '../context/NotificationContext';
import { NOTIF_TYPES, type NotificationType, type Notification } from '../types/notification';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationsProps {
  onBack:     () => void;
  onNavigate: (page: CoursePageNav) => void;
}

// ─── Filter helpers ───────────────────────────────────────────────────────────
// Notification list filters used to show specific statuses and types.

type StatusFilter = 'all' | 'unread' | 'read' | 'archived';

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all',      label: 'All'      },
  { key: 'unread',   label: 'Unread'   },
  { key: 'read',     label: 'Read'     },
  { key: 'archived', label: 'Archived' },
];

const TYPE_OPTIONS: { value: NotificationType | 'all'; label: string }[] = [
  { value: 'all',        label: 'All Types'  },
  { value: 'course',     label: 'Course'     },
  { value: 'university', label: 'University' },
  { value: 'grade',      label: 'Grade'      },
  { value: 'deadline',   label: 'Deadline'   },
  { value: 'system',     label: 'System'     },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function NotifCard({
  notif,
  onMarkRead,
  onArchive,
  onRestore,
  onDelete,
  onViewSource,
}: {
  // A single notification card with actions for mark read, archive, restore, delete.
  notif:       Notification;
  onMarkRead:  () => void;
  onArchive:   () => void;
  onRestore:   () => void;
  onDelete:    () => void;
  onViewSource: () => void;
}) {
  const type       = NOTIF_TYPES[notif.type];
  const isUnread   = notif.status === 'unread';
  const isArchived = notif.status === 'archived';

  return (
    <div
      className="rounded-xl mb-2 overflow-hidden"
      style={{
        background:  isUnread ? '#FFFFFF' : isArchived ? '#FAFAFA' : '#FAFAFA',
        opacity:     isArchived ? 0.85 : 1,
        border:      '1px solid #E8E8E4',
        borderLeft:  `4px solid ${type.border}`,
      }}
    >
      <div className="px-5 py-4">
        {/* Top row: type tag + timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: type.bg, color: type.text }}
          >
            {type.label}
          </span>
          <span className="text-[12px]" style={{ color: '#9CA3AF' }}>
            {notif.timestamp}
          </span>
        </div>

        {/* Title */}
        <p
          className="text-[15px] mb-1.5 leading-snug"
          style={{
            color:      '#1A1A1A',
            fontWeight: isUnread ? 600 : 400,
          }}
        >
          {notif.title}
        </p>

        {/* Full text */}
        <p
          className="text-[13px] leading-relaxed mb-4"
          style={{ color: '#6B6B6B', lineHeight: '1.6' }}
        >
          {notif.fullText}
        </p>

        {/* Bottom: source pill + actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#F0EFEA', color: '#6B6B6B' }}
          >
            {notif.source}
          </span>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onViewSource}
              className="text-[12px] font-semibold cursor-pointer hover:underline underline-offset-2"
              style={{ color: '#00897B' }}
            >
              View Source →
            </button>

            {isUnread && (
              <button
                onClick={onMarkRead}
                className="text-[12px] font-medium cursor-pointer hover:underline underline-offset-2"
                style={{ color: '#6B6B6B' }}
              >
                Mark Read
              </button>
            )}

            {!isArchived && (
              <button
                onClick={onArchive}
                className="text-[12px] font-medium cursor-pointer hover:underline underline-offset-2"
                style={{ color: '#9CA3AF' }}
              >
                Archive
              </button>
            )}

            {isArchived && (
              <>
                <button
                  onClick={onRestore}
                  className="text-[12px] font-semibold cursor-pointer hover:underline underline-offset-2"
                  style={{ color: '#00897B' }}
                >
                  Restore
                </button>
                <button
                  onClick={onDelete}
                  className="text-[12px] font-medium cursor-pointer hover:underline underline-offset-2 text-red-400"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ text, right }: { text: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 mt-6 first:mt-0">
      <span
        className="text-[11px] font-bold tracking-[0.18em] uppercase"
        style={{ color: '#9CA3AF' }}
      >
        {text}
      </span>
      {right}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Notifications({ onBack, onNavigate }: NotificationsProps) {
  // Notification state is provided by the context.
  const { notifications, markAsRead, markAllAsRead, archive, restore, deleteNotif, openDrawer } =
    useNotifications();

  function handleViewSource(notif: Notification) {
    if (notif.type === 'course') return onNavigate('materials');
    if (notif.type === 'grade') return onNavigate('grades');
    if (notif.type === 'deadline') return onNavigate('assessments');
    return onNavigate('notifications');
  }

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter,   setTypeFilter]   = useState<NotificationType | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Apply filters
  const filtered = notifications.filter(n => {
    // Apply type and status filters to the main notification list.
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (statusFilter === 'all') return true;
    return n.status === statusFilter;
  });

  // Sections (only used when statusFilter === 'all')
  const unread   = filtered.filter(n => n.status === 'unread');
  const read     = filtered.filter(n => n.status === 'read');
  const archived = filtered.filter(n => n.status === 'archived');

  // When a specific status filter is active, show all those items in one list
  const singleList = statusFilter !== 'all' ? filtered : null;

  const cardProps = (notif: Notification) => ({
    notif,
    onMarkRead:   () => markAsRead(notif.id),
    onArchive:    () => archive(notif.id),
    onRestore:    () => restore(notif.id),
    onDelete:     () => deleteNotif(notif.id),
    onViewSource: () => handleViewSource(notif),
  });

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#F0EFEA', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <Sidebar variant="student" activePage="notifications" onNavigate={onNavigate} onBack={onBack} onHelp={openDrawer} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* ── PAGE HEADER ── */}
          <div
            className="px-6 lg:px-8 py-6 flex items-center justify-between gap-4 border-b bg-white"
            style={{ borderColor: '#E8E8E4' }}
          >
            <div>
              <p
                className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1"
                style={{ color: '#9CA3AF' }}
              >
                STUDENT PORTAL
              </p>
              <h1
                className="text-[28px] font-bold leading-tight"
                style={{ color: '#1A1A1A' }}
              >
                Notifications
              </h1>
            </div>
            <button
              onClick={markAllAsRead}
              className="shrink-0 px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-150 hover:bg-slate-50"
              style={{
                color:       '#6B6B6B',
                border:      '1px solid #E8E8E4',
                background:  'white',
                borderRadius: 8,
              }}
            >
              Mark All Read
            </button>
          </div>

          {/* ── FILTER BAR ── */}
          {/* Controls for filtering notifications by status and type. */}
          <div className="px-6 lg:px-8 py-4">
            <div
              className="bg-white rounded-xl border px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
              style={{ borderColor: '#E8E8E4' }}
            >
              {/* Status pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {STATUS_FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-150',
                      statusFilter === key
                        ? 'text-white'
                        : 'hover:bg-slate-100'
                    )}
                    style={
                      statusFilter === key
                        ? { background: '#00897B', color: 'white' }
                        : { background: '#F0EFEA', color: '#6B6B6B' }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Type dropdown */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as NotificationType | 'all')}
                className="text-[13px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer outline-none focus:ring-2 focus:ring-teal-400/25 transition-all"
                style={{
                  borderColor: '#E8E8E4',
                  background:  'white',
                  color:        '#6B6B6B',
                }}
              >
                {TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="px-6 lg:px-8 pb-12">

            {singleList !== null ? (
              // Single-filter view
              <>
                <SectionLabel
                  text={`${statusFilter.toUpperCase()} · ${singleList.length}`}
                />
                {singleList.length === 0 ? (
                  <p className="text-[14px] py-8 text-center" style={{ color: '#9CA3AF' }}>
                    No {statusFilter} notifications
                  </p>
                ) : (
                  singleList.map(n => <NotifCard key={n.id} {...cardProps(n)} />)
                )}
              </>
            ) : (
              // All-view: three sections
              <>
                {/* UNREAD */}
                {(unread.length > 0 || statusFilter === 'all') && (
                  <>
                    <SectionLabel text={`UNREAD · ${unread.length}`} />
                    {unread.length === 0 ? (
                      <p className="text-[13px] pb-4" style={{ color: '#9CA3AF' }}>
                        All caught up!
                      </p>
                    ) : (
                      unread.map(n => <NotifCard key={n.id} {...cardProps(n)} />)
                    )}
                  </>
                )}

                {/* READ */}
                {read.length > 0 && (
                  <>
                    <SectionLabel text={`READ · ${read.length}`} />
                    {read.map(n => <NotifCard key={n.id} {...cardProps(n)} />)}
                  </>
                )}

                {/* ARCHIVED (collapsible) */}
                {archived.length > 0 && (
                  <>
                    <SectionLabel
                      text={`ARCHIVED · ${archived.length}`}
                      right={
                        <button
                          onClick={() => setShowArchived(v => !v)}
                          className="flex items-center gap-1.5 text-[12px] font-medium cursor-pointer"
                          style={{ color: '#9CA3AF' }}
                        >
                          {showArchived ? 'Hide' : 'Show Archived'}
                          <ChevronDown
                            className="w-3.5 h-3.5 transition-transform duration-200"
                            style={{ transform: showArchived ? 'rotate(180deg)' : 'none' }}
                          />
                        </button>
                      }
                    />
                    <div
                      style={{
                        maxHeight:  showArchived ? '2000px' : '0px',
                        overflow:   'hidden',
                        opacity:    showArchived ? 1 : 0,
                        transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease',
                      }}
                    >
                      {archived.map(n => <NotifCard key={n.id} {...cardProps(n)} />)}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
