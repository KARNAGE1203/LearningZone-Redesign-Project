import { useState, useEffect } from 'react';
import {
  GraduationCap, ArrowLeft, LayoutDashboard, BarChart2,
  FileText, ClipboardList, BookOpen, Info, Menu, X, Bell,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AvatarDropdown } from './AvatarDropdown';
import type { CoursePageNav } from '../App';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  variant:      'student' | 'course' | 'archive';
  activePage:   string;
  onNavigate:   (page: CoursePageNav) => void;
  onBack:       () => void;
  onHome?:      () => void;
  onHelp?:      () => void;
  onLogout?:    () => void;
  /** Override the "course identity" block shown for the course/archive variants. */
  courseAbbr?:  string;
  courseLabel?: string;
  courseCode?:  string;
}

// ─── Nav config ───────────────────────────────────────────────────────────────
// Sidebar navigation items for student and course views.

const STUDENT_NAV: { icon: React.ElementType; label: string; page: CoursePageNav }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',     page: 'dashboard'     },
  { icon: BarChart2,       label: 'Grades',        page: 'grades'        },
  { icon: Bell,            label: 'Notifications', page: 'notifications' },
];

const COURSE_NAV: { icon: React.ElementType; label: string; page: CoursePageNav }[] = [
  { icon: FileText,        label: 'Materials',   page: 'materials'   },
  { icon: ClipboardList,   label: 'Assessments', page: 'assessments' },
  { icon: Info,            label: 'Course Info', page: 'course-info' },
  { icon: BookOpen,        label: 'Resources',   page: 'resources'   },
];

// ─── Inner content (shared between desktop aside and mobile drawer) ────────────

function Content({
  variant,
  activePage,
  onNavigate,
  onBack,
  onHome,
  onHelp,
  onLogout,
  onClose,
  courseAbbr,
  courseLabel,
  courseCode,
}: SidebarProps & { onClose?: () => void }) {
  const navItems = variant === 'student' ? STUDENT_NAV : variant === 'course' ? COURSE_NAV : [];

  // Shared sidebar content for both desktop and mobile drawer.
  return (
    <div className="flex flex-col h-full select-none">

      {/* Logo — click navigates to Dashboard (home) */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => { (onHome ?? onBack)(); onClose?.(); }}
          className="flex items-center gap-2.5 cursor-pointer rounded-xl px-1 py-1 -ml-1 transition-opacity duration-150 hover:opacity-75 active:opacity-60 text-left"
          aria-label="Go to Home"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <GraduationCap className="w-4 h-4 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-none tracking-tight">LearningZone</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.42)' }}>Student Portal</p>
          </div>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Back link */}
      <div className="px-3 pb-3 shrink-0">
        <button
          onClick={() => { onBack(); onClose?.(); }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 text-left"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          {variant === 'course' ? 'Back to Dashboard' : 'Back to Home'}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

      {/* Course identity block — course/archive variants only */}
      {(variant === 'course' || variant === 'archive') && (
        <div className="px-4 mb-4 flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)' }}
          >
            {courseAbbr ?? 'OS'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-[13px] font-semibold leading-snug truncate">{courseLabel ?? 'OS & Networks'}</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.42)' }}>{courseCode ?? 'CTEC1704D'}</p>
          </div>
        </div>
      )}

      {/* Section label */}
      {navItems.length > 0 && (
        <p
          className="px-5 mb-1.5 text-[9px] font-extrabold tracking-[0.2em] uppercase shrink-0"
          style={{ color: 'rgba(255,255,255,0.32)' }}
        >
          {variant === 'student' ? 'Overview' : 'Course Navigation'}
        </p>
      )}

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto">

        {/* Primary nav items */}
        {navItems.length > 0 && (
          <nav className="px-3 space-y-0.5">
            {navItems.map(({ icon: Icon, label, page }) => {
              const active = page === activePage;
              return (
                <button
                  key={label}
                  onClick={() => { onNavigate(page); onClose?.(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer transition-all duration-150 text-left"
                  style={
                    active
                      ? {
                          background: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          fontWeight: 700,
                          boxShadow: 'inset 3px 0 0 rgba(255,255,255,0.85)',
                        }
                      : { color: 'rgba(255,255,255,0.55)' }
                  }
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  }}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: active ? 'white' : 'rgba(255,255,255,0.5)' }}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {label}
                </button>
              );
            })}
          </nav>
        )}

        {variant === 'student' && onHelp && (
          <div className="px-3 pt-4 pb-2">
            <button
              onClick={() => { onHelp(); onClose?.(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer transition-all duration-150 text-left"
              style={{ color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
            >
              <HelpCircle className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.65)' }} strokeWidth={1.8} />
              Help & Support
            </button>
          </div>
        )}

        {/* Archive notice */}
        {variant === 'archive' && (
          <p className="px-5 text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            This course has been completed. You're viewing a read-only summary.
          </p>
        )}


      </div>

      {/* Profile */}
      <div
        className="px-4 pt-4 pb-5 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <AvatarDropdown
          onNavigate={(p) => { onNavigate(p); onClose?.(); }}
          onLogout={onLogout}
          variant="sidebar"
        />
      </div>
    </div>
  );
}

// ─── Exported Sidebar ─────────────────────────────────────────────────────────

export function Sidebar({ variant, activePage, onNavigate, onBack, onHome, onLogout, courseAbbr, courseLabel, courseCode }: SidebarProps) {
  const [open, setOpen] = useState(false);

  // Close the mobile drawer when we switch to desktop widths.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const h  = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const cp = { variant, activePage, onNavigate, onBack, onHome, onLogout, courseAbbr, courseLabel, courseCode };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:w-[220px] shrink-0 flex-col h-full"
        style={{ background: '#005159' }}
      >
        <Content {...cp} />
      </aside>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ background: '#005159' }}
      >
        <Content {...cp} onClose={() => setOpen(false)} />
      </div>

      {/* Mobile hamburger — floats top-left on sm/md screens */}
      <button
        className="fixed top-3 left-3 z-30 lg:hidden w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer shadow-lg"
        style={{ background: '#005159' }}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="w-[18px] h-[18px] text-white" />
      </button>
    </>
  );
}
