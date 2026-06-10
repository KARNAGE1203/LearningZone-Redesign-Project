import { useState, useRef, useEffect } from 'react';
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Static student identity ───────────────────────────────────────────────────
// Mirrors the hardcoded student identity used across the portal (Sidebar, Home).

const STUDENT = {
  initials:  'DS',
  name:      'Danish Saini',
  subtitle:  'First Year · Computer Science',
  studentId: '2024-8842',
};

const MENU_ITEMS: { icon: React.ElementType; label: string; page: CoursePageNav }[] = [
  { icon: User,         label: 'View Profile', page: 'profile'  },
  { icon: SettingsIcon, label: 'Settings',      page: 'settings' },
];

// Default sign-out used when no onLogout handler is supplied (clears auth and reloads).
function defaultLogout() {
  localStorage.removeItem('lz_token');
  localStorage.removeItem('lz_user');
  window.location.reload();
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AvatarDropdownProps {
  onNavigate: (page: CoursePageNav) => void;
  onLogout?:  () => void;
  /** `topnav` = avatar in the page header, dropdown opens below.
   *  `sidebar` = avatar in the sidebar profile block, dropdown opens above. */
  variant?: 'topnav' | 'sidebar';
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AvatarDropdown({ onNavigate, onLogout, variant = 'topnav' }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function go(page: CoursePageNav) {
    onNavigate(page);
    setOpen(false);
  }

  function signOut() {
    setOpen(false);
    (onLogout ?? defaultLogout)();
  }

  return (
    <div ref={rootRef} className="relative">

      {/* ── Trigger ───────────────────────────────────────────────── */}
      {variant === 'topnav' ? (
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          aria-label="Open account menu"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0d8a7a)' }}
          >
            <span className="text-white text-[10px] font-bold">{STUDENT.initials}</span>
          </div>
          <span className="hidden lg:block text-sm font-medium text-slate-700">{STUDENT.name}</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 -mx-2 cursor-pointer transition-colors text-left"
          style={{ background: open ? 'rgba(255,255,255,0.06)' : 'transparent' }}
          onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
          aria-label="Open account menu"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0d8a7a)' }}
          >
            {STUDENT.initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-[13px] font-medium leading-none truncate">{STUDENT.name}</p>
            <p className="text-[11px] mt-1 truncate" style={{ color: 'rgba(255,255,255,0.42)' }}>Student</p>
          </div>
        </button>
      )}

      {/* ── Dropdown panel ────────────────────────────────────────── */}
      {open && (
        <div
          className={cn(
            'absolute z-[60] w-64 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden',
            variant === 'topnav'
              ? 'top-full right-0 mt-2'
              : 'bottom-full left-0 mb-2'
          )}
        >
          {/* Identity header */}
          <div className="p-4 flex items-center gap-3 border-b border-slate-100">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-extrabold shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #0d8a7a)' }}
            >
              {STUDENT.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{STUDENT.name}</p>
              <p className="text-xs text-slate-500 truncate">{STUDENT.subtitle}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Student ID: {STUDENT.studentId}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            {MENU_ITEMS.map(({ icon: Icon, label, page }) => (
              <button
                key={page}
                onClick={() => go(page)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100" />

          {/* Sign out */}
          <div className="p-2">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 cursor-pointer transition-colors text-left"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.8} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
