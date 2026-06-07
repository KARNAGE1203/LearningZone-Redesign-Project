import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, BookOpen, BarChart2, Calendar,
  Settings, HelpCircle, LogOut, Bell, Search, Plus, ArrowRight,
  Clock, FileText, MessageSquare, TrendingUp, AlertTriangle, Star,
  ChevronRight, Megaphone, Target, Users, Menu, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeProps {
  userId: string;
  onLogout: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',  active: true  },
  { icon: BookOpen,         label: 'My Courses', active: false },
  { icon: BarChart2,        label: 'Grades',     active: false },
  { icon: Calendar,         label: 'Schedule',   active: false },
  { icon: Settings,         label: 'Settings',   active: false },
];

const STATS = [
  { label: 'GPA',        value: '3.75', sub: 'out of 4.0',          icon: Star,     ring: '#10b981', bg: '#f0fdf4', fg: '#059669' },
  { label: 'Credits',    value: '18',   sub: '20 enrolled this sem', icon: BookOpen, ring: '#3b82f6', bg: '#eff6ff', fg: '#2563eb' },
  { label: 'Attendance', value: '92%',  sub: 'this semester',        icon: Target,   ring: '#f59e0b', bg: '#fffbeb', fg: '#d97706' },
  { label: 'Next Due',   value: '2d',   sub: 'Phase Test 2 · Jun 2', icon: AlertTriangle, ring: '#ef4444', bg: '#fef2f2', fg: '#dc2626' },
];

const DEADLINES = [
  { month: 'JUN', day: '02', title: 'Phase Test 2', course: 'CTECH 1704D', daysLeft: 2,  urgent: true  },
  { month: 'JUN', day: '05', title: 'Final Exam',   course: 'CTECH 1704D', daysLeft: 5,  urgent: false },
  { month: 'JUN', day: '10', title: 'Lab Report',   course: 'MATH 2201',   daysLeft: 10, urgent: false },
];

const TODAY_CLASSES = [
  { time: '10:00', end: '11:30 AM', title: 'Operating Systems',    room: 'GH 2.01', live: true  },
  { time: '02:00', end: '03:30 PM', title: 'Discrete Mathematics', room: 'VP 3.10', live: false },
];

const ANNOUNCEMENTS = [
  { initials: 'MH', color: '#0d8a7a', title: 'Exam Schedule Released',  body: 'Midterm schedules are now available in the portal. Please review your slots.', time: '2 hours ago' },
  { initials: 'MA', color: '#7c3aed', title: 'New Reading Material',     body: 'Prof. Al-Ibaisi uploaded revision material for Phase Test 2.',                  time: 'Yesterday'   },
  { initials: 'IT', color: '#64748b', title: 'Campus Wi-Fi Maintenance', body: 'Network maintenance this Saturday 2–6 AM. Plan your submissions accordingly.',   time: '2 days ago'  },
];

const COURSE_MINI = [
  { label: 'Materials',  value: '24', icon: FileText, color: '#d97706', bg: '#fffbeb' },
  { label: 'Pending',    value: '3',  icon: Clock,    color: '#ef4444', bg: '#fef2f2' },
  { label: 'Classmates', value: '89', icon: Users,    color: '#2563eb', bg: '#eff6ff' },
];

// SVG ring math: r=30, circumference ≈ 188.5, A- = 90 %
const RING_R  = 30;
const RING_C  = 2 * Math.PI * RING_R;
const GRADE_PCT = 0.90;

// ─── Sidebar content (shared between desktop + mobile drawer) ──────

function SidebarContent({ onClose, onLogout }: { onClose?: () => void; onLogout?: () => void }) {
  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#0d8a7a' }}>
            <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-base leading-none tracking-tight">LearningZone</p>
            <p className="text-slate-400 text-[11px] mt-1">Student Portal</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Request CTA */}
      <div className="px-5 py-5">
        <button
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.97] shadow-md"
          style={{ background: '#0d8a7a', boxShadow: '0 4px 12px rgba(13,138,122,0.28)' }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Request
        </button>
      </div>

      {/* Nav label */}
      <p className="px-6 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400">
        Navigation
      </p>

      {/* Primary nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={cn(
              'w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all duration-150 text-left relative',
              active
                ? 'bg-teal-50 text-teal-800 font-semibold'
                : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
            )}
            style={active ? { boxShadow: 'inset 3px 0 0 #0d8a7a' } : {}}
          >
            <Icon
              className={cn('w-5 h-5 shrink-0', active ? 'text-teal-600' : 'text-slate-400')}
              strokeWidth={active ? 2.2 : 1.8}
            />
            {label}
            {active && <span className="ml-auto w-2 h-2 rounded-full bg-teal-500" />}
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-4 pb-7 pt-5 space-y-1 border-t border-slate-200">
        <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer transition-all duration-150 text-left">
          <HelpCircle className="w-5 h-5 shrink-0 text-slate-400" strokeWidth={1.8} />
          Help
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all duration-150 text-left group"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" strokeWidth={1.8} />
          Logout
        </button>
      </div>

    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function Home({ userId: _userId, onLogout }: HomeProps) {
  const [search,     setSearch]     = useState('');
  const [ready,      setReady]      = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Trigger enter animations slightly after paint
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  // Close drawer on lg breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setDrawerOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR — hidden below lg
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex lg:w-[240px] shrink-0 flex-col h-full bg-white border-r border-slate-200">
        <SidebarContent onLogout={onLogout} />
      </aside>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER — slides in from left
      ══════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-slate-200 flex flex-col',
          'transition-transform duration-300 ease-in-out lg:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setDrawerOpen(false)} onLogout={onLogout} />
      </div>

      {/* ══════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* ── Top Navbar ── */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 md:px-6 lg:px-8 shrink-0 z-20">

          {/* Hamburger — mobile/tablet only */}
          <button
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb — hide on small screens */}
          <div className="hidden md:flex items-center gap-2 text-sm shrink-0 min-w-0">
            <span className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors whitespace-nowrap">My Courses</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-700 font-semibold truncate max-w-[200px] lg:max-w-[320px]">
              CTECH1704D: Operating Systems and Networks
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-4 lg:mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses, materials…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-teal-400/25 border border-transparent focus:border-teal-300 transition-all duration-150"
            />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">
            <button
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" strokeWidth={1.8} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button
              className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <button
              className="w-10 h-10 rounded-full cursor-pointer ml-1 ring-2 ring-transparent hover:ring-teal-400 transition-all duration-200 overflow-hidden"
              aria-label="Profile"
            >
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #0d8a7a)' }}>
                <span className="text-white text-xs font-bold">DS</span>
              </div>
            </button>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto">

          {/* Hero Banner */}
          <div
            className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-12 md:px-10 lg:py-14"
            style={{ background: 'linear-gradient(130deg, #1e1b4b 0%, #312e81 55%, #3730a3 100%)' }}
          >
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-16 right-10 w-72 h-72 md:w-96 md:h-96 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.15), transparent 65%)' }} />
              <div className="absolute -bottom-12 left-[38%] w-56 h-56 md:w-72 md:h-72 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.10), transparent 65%)' }} />
              <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>

            <div
              className="relative z-10 max-w-2xl"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#a5b4fc' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Block 4 · Summer 2026
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
                Welcome back, Danish.
              </h1>
              <p className="text-indigo-200/80 text-sm sm:text-base leading-relaxed">
                Your academic overview is looking strong.{' '}
                <span className="text-white font-semibold">2 upcoming deadlines</span> need your attention this week.
              </p>
            </div>
          </div>

          {/* Stats row — overlaps hero */}
          <div className="px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 mb-5 md:mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {STATS.map(({ label, value, sub, icon: Icon, ring, bg, fg }, i) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-100 cursor-default hover:shadow-xl hover:-translate-y-1"
                  style={{
                    borderTop: `3px solid ${ring}`,
                    opacity: ready ? 1 : 0,
                    transform: ready ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
                    transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms, box-shadow 0.2s ease`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">{label}</p>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: fg }} />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold leading-none" style={{ color: fg }}>{value}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main content grid */}
          <div className="px-4 sm:px-6 lg:px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

            {/* ── LEFT — full width on mobile, 2/3 on desktop ── */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">

              {/* Active Course card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0d8a7a, #34d399)' }} />

                <div className="p-5 sm:p-6 lg:p-7">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Active Course</span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 tracking-wider">
                          CTECH 1704D
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-1.5">
                        Operating Systems and Networks
                      </h2>
                      <p className="text-sm font-semibold" style={{ color: '#0d8a7a' }}>
                        Prof. Muhammad Al-Ibaisi · MWF 10:00 AM
                      </p>
                    </div>

                    {/* Animated SVG grade ring */}
                    <div className="relative shrink-0 w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] flex items-center justify-center">
                      <svg
                        width="100%" height="100%"
                        viewBox="0 0 70 70"
                        style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
                      >
                        <circle cx="35" cy="35" r={RING_R} fill="none" stroke="#f1f5f9" strokeWidth="5" />
                        <circle
                          cx="35" cy="35" r={RING_R}
                          fill="none" stroke="#0d8a7a" strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={RING_C}
                          strokeDashoffset={ready ? RING_C * (1 - GRADE_PCT) : RING_C}
                          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        />
                      </svg>
                      <span className="relative z-10 text-lg sm:text-[20px] font-extrabold" style={{ color: '#0d8a7a' }}>A-</span>
                    </div>
                  </div>

                  {/* Mini metrics */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    {COURSE_MINI.map(({ label, value, icon: Icon, color, bg }) => (
                      <div key={label} className="rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5" style={{ background: bg }}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                        </div>
                        <div>
                          <p className="text-base sm:text-xl font-extrabold text-slate-900 leading-none">{value}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5 sm:mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-600">Course Progress</span>
                      <span className="text-sm font-extrabold text-slate-800">55%</span>
                    </div>
                    <div className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: ready ? '55%' : '0%',
                          background: 'linear-gradient(90deg, #0d8a7a, #34d399)',
                          transition: 'width 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: ready ? '0 0 10px rgba(52,211,153,0.4)' : 'none',
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">Week 8 of 14</span>
                      <span className="text-xs text-slate-400">6 weeks remaining</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                      style={{ background: '#0d8a7a', boxShadow: '0 4px 12px rgba(13,138,122,0.28)' }}
                    >
                      Go to Course
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all duration-150 active:scale-[0.97]">
                      View Syllabus
                    </button>
                    <button className="hidden sm:flex ml-auto items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Grade History
                    </button>
                  </div>
                </div>
              </div>

              {/* Reading List + Discussion Board */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 cursor-pointer group hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
                    style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}>
                    <FileText className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#d97706' }} />
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-800">Reading List</h3>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">3 new</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 sm:mb-5">
                    3 new articles added for Week 8 discussion.
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-3" style={{ color: '#0d8a7a' }}>
                    View articles
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 cursor-pointer group hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
                    style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}>
                    <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#7c3aed' }} />
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-800">Discussion Board</h3>
                    <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">2 replies</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 sm:mb-5">
                    2 replies to your post on "Heuristic Evaluation".
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-3" style={{ color: '#0d8a7a' }}>
                    View discussion
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT — full width on mobile, 1/3 on desktop ── */}
            <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5 lg:gap-6 lg:space-y-0">

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-slate-800">Upcoming Deadlines</h3>
                  </div>
                  <button className="text-xs font-semibold cursor-pointer hover:underline" style={{ color: '#0d8a7a' }}>
                    View all
                  </button>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {DEADLINES.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                      <div
                        className="flex flex-col items-center justify-center w-11 h-13 sm:w-12 sm:h-14 rounded-xl shrink-0 text-white"
                        style={{ background: d.urgent ? '#ef4444' : '#334155', boxShadow: d.urgent ? '0 4px 10px rgba(239,68,68,0.28)' : 'none' }}
                      >
                        <span className="text-[9px] font-extrabold uppercase tracking-wider leading-none">{d.month}</span>
                        <span className="text-xl font-extrabold leading-tight">{d.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{d.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{d.course}</p>
                        <span className={cn(
                          'inline-flex mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                          d.urgent ? 'bg-red-50 text-red-600' : d.daysLeft <= 7 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                        )}>
                          In {d.daysLeft} {d.daysLeft === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors border border-dashed border-slate-200 hover:border-slate-300 rounded-xl">
                  View Full Calendar
                </button>
              </div>

              {/* Today's Classes */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-slate-800">Today's Classes</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Mon, Jun 2</span>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  {TODAY_CLASSES.map((c, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all duration-150',
                        c.live ? 'border-teal-200 bg-teal-50/60 hover:bg-teal-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <div className="w-1.5 h-10 sm:h-12 rounded-full shrink-0" style={{ background: c.live ? '#0d8a7a' : '#cbd5e1' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.time} – {c.end}</p>
                        <p className="text-xs text-slate-400">{c.room}</p>
                      </div>
                      {c.live && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements */}
              <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Megaphone className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-slate-800">Announcements</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">3 new</span>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  {ANNOUNCEMENTS.map((a, i) => (
                    <div
                      key={i}
                      className="flex gap-3.5 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      style={{ borderLeft: '3px solid #0d8a7a', paddingLeft: '12px' }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0 mt-0.5" style={{ background: a.color }}>
                        {a.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{a.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{a.body}</p>
                        <p className="text-[10px] text-slate-300 mt-1.5 font-medium">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
