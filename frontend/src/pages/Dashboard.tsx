import { useState, useEffect } from 'react';
import {
  Bell, Search, HelpCircle, ArrowRight,
  Clock, FileText, MessageSquare, TrendingUp, AlertTriangle,
  ChevronRight, Megaphone,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { useNotifications } from '../context/NotificationContext';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardProps {
  userId:     string;
  onBack:     () => void;
  onNavigate: (page: CoursePageNav) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Dashboard cards and announcement data used for the student dashboard layout.

const STATS = [
  { label: 'Materials Available', value: '24',    sub: 'This week',         icon: FileText,      ring: '#0d8a7a', bg: '#f0fdf4', fg: '#059669' },
  { label: 'Pending Items',       value: '3',     sub: 'Require attention', icon: Clock,         ring: '#f59e0b', bg: '#fffbeb', fg: '#d97706' },
  { label: 'Phase Test 2',        value: '2 days', sub: 'Jun 2 · 14:00',   icon: AlertTriangle, ring: '#ef4444', bg: '#fef2f2', fg: '#dc2626' },
];

const DEADLINES = [
  { month: 'JUN', day: '02', title: 'Phase Test 2', course: 'CTEC 1704D', daysLeft: 2,  urgent: true  },
  { month: 'JUN', day: '05', title: 'Final Exam',   course: 'CTEC 1704D', daysLeft: 5,  urgent: false },
  { month: 'JUN', day: '10', title: 'Lab Report',   course: 'CTEC 1704D', daysLeft: 10, urgent: false },
];

const ANNOUNCEMENTS = [
  { initials: 'MH', avatarColor: '#0d8a7a', borderColor: '#0d8a7a', title: 'Exam Schedule Released',   body: 'Midterm schedules are now available in the portal.',                              time: '1 hour ago' },
  { initials: 'MA', avatarColor: '#0d8a7a', borderColor: '#7c3aed', title: 'New Reading Material',     body: 'Prof. Al-Ibaisi uploaded revision material for Phase Test 2.',                  time: 'Yesterday'  },
  { initials: 'IT', avatarColor: '#64748b', borderColor: '#94a3b8', title: 'Campus Wi-Fi Maintenance', body: 'Network maintenance this Saturday 2–6 AM. Plan your submissions accordingly.',  time: '3 days ago' },
];

const COURSE_MINI = [
  { label: 'Materials', value: '24', icon: FileText, color: '#d97706', bg: '#fffbeb' },
  { label: 'Pending',   value: '3',  icon: Clock,    color: '#ef4444', bg: '#fef2f2' },
];

const RING_R    = 30;
const RING_C    = 2 * Math.PI * RING_R;
const GRADE_PCT = 0.90;

// ─── Main component ───────────────────────────────────────────────────────────

export default function Dashboard({ userId: _userId, onBack, onNavigate }: DashboardProps) {
  // Search query for the dashboard's top search input.
  const [search, setSearch] = useState('');
  const [ready,  setReady]  = useState(false);
  const { unreadCount, openDrawer } = useNotifications();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  // `ready` controls the entrance animation on the hero section.

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="student" activePage="dashboard" onNavigate={onNavigate} onBack={onBack} onHelp={openDrawer} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Main panel contains the top navbar and scrollable dashboard content. */}

        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 md:px-6 lg:px-8 shrink-0 z-20">

          <div className="hidden md:flex items-center gap-2 text-sm shrink-0 min-w-0">
            <span className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors whitespace-nowrap">My Courses</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-700 font-semibold truncate max-w-[200px] lg:max-w-[320px]">
              CTEC1704D: Operating Systems and Networks
            </span>
          </div>

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

          <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">
            <button
              onClick={openDrawer}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 flex items-center justify-center text-white font-bold leading-none"
                  style={{
                    minWidth:     unreadCount > 9 ? 18 : 14,
                    height:       14,
                    fontSize:     9,
                    background:   '#EF4444',
                    borderRadius: 999,
                    paddingLeft:  unreadCount > 9 ? 3 : 0,
                    paddingRight: unreadCount > 9 ? 3 : 0,
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={openDrawer}
              className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto">

          {/* Hero banner — OS & Networks course themed */}
          {/* This section gives the course summary and progress highlight. */}
          <div
            className="relative overflow-hidden px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 md:px-10 lg:pt-14 lg:pb-20"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #27247a 40%, #3730a3 100%)' }}
          >
            {/* Network topology illustration — right panel */}
            <div
              className="absolute right-0 top-0 bottom-0 pointer-events-none"
              style={{
                width: '62%',
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, black 48%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, black 48%)',
              }}
            >
              <svg
                viewBox="0 0 500 240"
                preserveAspectRatio="xMaxYMid slice"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Low-poly geometric facets */}
                <polygon points="395,0 500,0 480,85"      fill="rgba(99,102,241,0.15)" />
                <polygon points="480,85 500,0 500,155"    fill="rgba(79,70,229,0.20)" />
                <polygon points="325,95 468,8 500,108"    fill="rgba(129,140,248,0.09)" />
                <polygon points="408,140 500,162 492,240" fill="rgba(55,48,163,0.23)" />
                <polygon points="348,188 468,152 500,240" fill="rgba(99,102,241,0.11)" />
                <polygon points="265,68 358,8 428,88"     fill="rgba(139,92,246,0.09)" />
                <polygon points="428,88 358,8 472,12"     fill="rgba(79,70,229,0.13)" />
                <polygon points="285,148 362,192 428,152" fill="rgba(99,102,241,0.09)" />
                <polygon points="215,128 308,78 275,168"  fill="rgba(67,56,202,0.11)" />
                <polygon points="450,60 500,30 500,110"   fill="rgba(109,40,217,0.10)" />

                {/* Connection lines */}
                <line x1="352" y1="112" x2="282" y2="60"  stroke="rgba(165,180,252,0.28)" strokeWidth="1.5" />
                <line x1="352" y1="112" x2="428" y2="66"  stroke="rgba(165,180,252,0.28)" strokeWidth="1.5" />
                <line x1="352" y1="112" x2="446" y2="146" stroke="rgba(165,180,252,0.28)" strokeWidth="1.5" />
                <line x1="352" y1="112" x2="296" y2="165" stroke="rgba(165,180,252,0.28)" strokeWidth="1.5" />
                <line x1="352" y1="112" x2="225" y2="106" stroke="rgba(165,180,252,0.28)" strokeWidth="1.5" />
                <line x1="352" y1="112" x2="470" y2="110" stroke="rgba(165,180,252,0.28)" strokeWidth="1.5" />
                <line x1="282" y1="60"  x2="208" y2="50"  stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="282" y1="60"  x2="250" y2="120" stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="428" y1="66"  x2="406" y2="20"  stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="428" y1="66"  x2="506" y2="60"  stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="446" y1="146" x2="506" y2="150" stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="296" y1="165" x2="240" y2="190" stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="470" y1="110" x2="506" y2="60"  stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="470" y1="110" x2="554" y2="96"  stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="470" y1="110" x2="560" y2="160" stroke="rgba(165,180,252,0.22)" strokeWidth="1.2" />
                <line x1="554" y1="96"  x2="560" y2="160" stroke="rgba(165,180,252,0.18)" strokeWidth="1" />
                <line x1="225" y1="106" x2="250" y2="120" stroke="rgba(165,180,252,0.18)" strokeWidth="1" />

                {/* Edge / client nodes */}
                <circle cx="208" cy="50"  r="4.5" fill="rgba(139,92,246,0.38)"  stroke="rgba(196,181,253,0.52)" strokeWidth="1" />
                <circle cx="250" cy="120" r="4.5" fill="rgba(139,92,246,0.38)"  stroke="rgba(196,181,253,0.52)" strokeWidth="1" />
                <circle cx="406" cy="20"  r="4.5" fill="rgba(139,92,246,0.38)"  stroke="rgba(196,181,253,0.52)" strokeWidth="1" />
                <circle cx="506" cy="60"  r="4.5" fill="rgba(139,92,246,0.38)"  stroke="rgba(196,181,253,0.52)" strokeWidth="1" />
                <circle cx="506" cy="150" r="4.5" fill="rgba(139,92,246,0.38)"  stroke="rgba(196,181,253,0.52)" strokeWidth="1" />
                <circle cx="240" cy="190" r="4.5" fill="rgba(139,92,246,0.38)"  stroke="rgba(196,181,253,0.52)" strokeWidth="1" />
                <circle cx="554" cy="96"  r="4"   fill="rgba(139,92,246,0.32)"  stroke="rgba(196,181,253,0.45)" strokeWidth="1" />
                <circle cx="560" cy="160" r="4"   fill="rgba(139,92,246,0.32)"  stroke="rgba(196,181,253,0.45)" strokeWidth="1" />

                {/* Switch nodes */}
                <circle cx="225" cy="106" r="7" fill="rgba(99,102,241,0.40)" stroke="rgba(165,180,252,0.58)" strokeWidth="1.5" />
                <circle cx="470" cy="110" r="7" fill="rgba(99,102,241,0.40)" stroke="rgba(165,180,252,0.58)" strokeWidth="1.5" />

                {/* Server nodes */}
                <circle cx="282" cy="60"  r="9" fill="rgba(79,70,229,0.45)" stroke="rgba(165,180,252,0.62)" strokeWidth="1.5" />
                <circle cx="428" cy="66"  r="9" fill="rgba(79,70,229,0.45)" stroke="rgba(165,180,252,0.62)" strokeWidth="1.5" />
                <circle cx="446" cy="146" r="8" fill="rgba(79,70,229,0.42)" stroke="rgba(165,180,252,0.58)" strokeWidth="1.5" />
                <circle cx="296" cy="165" r="8" fill="rgba(79,70,229,0.42)" stroke="rgba(165,180,252,0.58)" strokeWidth="1.5" />

                {/* Core hub — outer glow rings + fill */}
                <circle cx="352" cy="112" r="27" fill="none" stroke="rgba(165,180,252,0.09)" strokeWidth="10" />
                <circle cx="352" cy="112" r="18" fill="none" stroke="rgba(165,180,252,0.18)" strokeWidth="2.5" />
                <circle cx="352" cy="112" r="13" fill="rgba(99,102,241,0.55)" stroke="rgba(165,180,252,0.75)" strokeWidth="2" />
                <circle cx="352" cy="112" r="5"  fill="rgba(196,181,253,0.9)" />
              </svg>
            </div>

            {/* Text content */}
            <div
              className="relative z-10 max-w-lg"
              style={{
                opacity:    ready ? 1 : 0,
                transform:  ready ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              {/* Pill badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.18em] uppercase"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#a5b4fc' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Block 4 · Summer 2026
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider"
                  style={{
                    background: 'rgba(99,102,241,0.28)',
                    color:      'rgba(196,181,253,0.92)',
                    border:     '1px solid rgba(165,180,252,0.22)',
                  }}
                >
                  CTEC1704D
                </span>
              </div>

              {/* Course name */}
              <h1 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-black text-white leading-[1.12] mb-3 tracking-tight">
                Operating Systems<br />
                <span style={{ color: '#a5b4fc' }}>&amp; Networks</span>
              </h1>

              {/* Sub-line */}
              <p className="text-indigo-200/75 text-sm leading-relaxed max-w-xs sm:max-w-sm">
                Week 34 · Memory Management &amp; Virtual Memory.{' '}
                <span className="text-white font-semibold">2 deadlines</span> need attention this week.
              </p>
            </div>
          </div>

          {/* Stats row — overlaps hero */}
          <div className="px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 mb-5 md:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {STATS.map(({ label, value, sub, icon: Icon, ring, bg, fg }, i) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-100 cursor-default hover:shadow-xl hover:-translate-y-1"
                  style={{
                    borderTop:  `3px solid ${ring}`,
                    opacity:    ready ? 1 : 0,
                    transform:  ready ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
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

            {/* ── LEFT: 2/3 ── */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">

              {/* Active Course card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0d8a7a, #34d399)' }} />

                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Active Course</span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 tracking-wider">
                          CTEC 1704D
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-1.5">
                        Operating Systems and Networks
                      </h2>
                      <p className="text-sm font-semibold" style={{ color: '#0d8a7a' }}>
                        Prof. Muhammad Al-Ibaisi · MWF 10:00 AM
                      </p>
                    </div>

                    {/* SVG grade ring */}
                    <div className="relative shrink-0 w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 70 70" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
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

                  {/* Mini metrics — 2 cards */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
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
                          width:      ready ? '55%' : '0%',
                          background: 'linear-gradient(90deg, #0d8a7a, #34d399)',
                          transition: 'width 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow:  ready ? '0 0 10px rgba(52,211,153,0.4)' : 'none',
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
                      onClick={() => onNavigate('materials')}
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                      style={{ background: '#0d8a7a', boxShadow: '0 4px 12px rgba(13,138,122,0.28)' }}
                    >
                      Continue Learning
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('course-info')}
                      className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all duration-150 active:scale-[0.97]"
                    >
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

            {/* ── RIGHT: 1/3 ── */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-5 lg:space-y-6">

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-slate-800">Upcoming Deadlines</h3>
                  </div>
                  <button
                    onClick={() => onNavigate('notifications')}
                    className="text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: '#0d8a7a' }}
                  >
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

                <button
                  onClick={() => onNavigate('notifications')}
                  className="w-full mt-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors border border-dashed border-slate-200 hover:border-teal-300 rounded-xl"
                >
                  View Full Calendar
                </button>
              </div>

              {/* Recent Announcements */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Megaphone className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-slate-800">Recent Announcements</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">3 new</span>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  {ANNOUNCEMENTS.map((a, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      style={{ borderLeft: `4px solid ${a.borderColor}`, paddingLeft: '12px' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0 mt-0.5"
                        style={{ background: a.avatarColor }}
                      >
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
