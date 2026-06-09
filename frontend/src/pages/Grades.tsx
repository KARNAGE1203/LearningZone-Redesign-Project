import { useState, useEffect } from 'react';
import {
  ChevronRight, CheckCircle2, Clock,
  Trophy, MoreHorizontal, Download,
  Bell, Search, HelpCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { useNotifications } from '../context/NotificationContext';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GradesProps {
  onBack:     () => void;
  onNavigate: (page: CoursePageNav) => void;
}
// ─── Data ─────────────────────────────────────────────────────────────────────
// ─── Data ─────────────────────────────────────────────────────────────────────

const GRADE_RING_R = 46;
const GRADE_RING_C = 2 * Math.PI * GRADE_RING_R;
const GRADE_PCT    = 0.72;

const ASSESSMENTS_ROWS = [
  {
    borderColor: '#10B981', badge: 'ASSIGNMENT', badgeBg: '#f0fdf4', badgeFg: '#059669',
    title: 'Kernel Module Project', meta: 'Weight: 25% · Oct 12',
    score: 88, maxScore: 100, barColor: '#10B981',
    status: 'GRADED', statusBg: '#f0fdf4', statusFg: '#059669',
    link: 'Review Attempt →', linkColor: '#0d8a7a',
    feedback: {
      author: 'Dr. Sayed Ahmed', initials: 'SA', timestamp: '2 days ago',
      preview: 'Your implementation was exemplary, showing a deep understanding of memory management.',
      full:    'Your implementation of the Kernel Module was exemplary, showing a deep understanding of memory management. The modular design choices were well-considered and your inline documentation made the logic easy to follow. Keep up this standard for upcoming submissions.',
    },
  },
  {
    borderColor: '#F59E0B', badge: 'PHASE TEST', badgeBg: '#fffbeb', badgeFg: '#d97706',
    title: 'Midterm Examination', meta: 'Weight: 30% · Nov 5',
    score: 64, maxScore: 100, barColor: '#F59E0B',
    status: 'GRADED', statusBg: '#fffbeb', statusFg: '#d97706',
    link: 'Review Attempt →', linkColor: '#0d8a7a',
    feedback: {
      author: 'Dr. Sayed Ahmed', initials: 'SA', timestamp: '3 days ago',
      preview: 'Results suggest a need for more focus on OSI Layer 3 protocols before Phase Test 2.',
      full:    'The midterm results suggest a need for more focus on OSI Layer 3 protocols. Some answers showed good conceptual understanding but lacked the technical depth expected at this level. Review the lecture slides on IP routing and subnetting. I\'ve uploaded supplementary materials on IP routing that should help bridge this gap before Phase Test 2.',
    },
  },
  {
    borderColor: '#F59E0B', badge: 'LAB', badgeBg: '#fffbeb', badgeFg: '#d97706',
    title: 'Protocol Design Lab', meta: 'Weight: 15% · Dec 2',
    score: null, maxScore: 100, barColor: '#D1D5DB',
    status: 'IN PROGRESS', statusBg: '#fffbeb', statusFg: '#d97706',
    link: 'View Brief →', linkColor: '#d97706',
    feedback: null,
  },
];

const SCORE_BARS = [
  { label: 'PT1', pct: 85, color: '#10B981', filled: true  },
  { label: 'PT2', pct: 60, color: '#F59E0B', filled: true  },
  { label: 'PT3', pct: 0,  color: '#D1D5DB', filled: false },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Grades({ onBack, onNavigate }: GradesProps) {
  // `ready` animates the grade ring on mount.
  const [ready,            setReady]            = useState(false);
  const [search,           setSearch]           = useState('');
  const [expandedFeedback, setExpandedFeedback] = useState<number[]>([]);
  const { unreadCount, openDrawer } = useNotifications();

  function toggleFeedback(i: number) {
    // Expand or collapse the selected feedback card.
    setExpandedFeedback(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i],
    );
  }

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  // The dashboard uses a small animation delay after mounting.

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="student" activePage="grades" onNavigate={onNavigate} onBack={onBack} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* ── Top Navbar (matches Dashboard) ── */}
        {/* This top nav mirrors the dashboard and holds search + notifications. */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 md:px-6 lg:px-8 shrink-0 z-20">

          <div className="hidden md:flex items-center gap-2 text-sm shrink-0 min-w-0">
            <span
              className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors whitespace-nowrap"
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-700 font-semibold truncate max-w-[200px] lg:max-w-[300px]">
              Grades · CTEC1704D
            </span>
          </div>

          <div className="flex-1 relative max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-4 lg:mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search assessments…"
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
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  GRADES · CTEC1704D_2025_604
                </p>
                <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
                  Operating Systems and Networks
                </h1>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Academic Year 2025/26 · Block 4
                </p>
              </div>
              <button
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0 cursor-pointer transition-all duration-150 hover:bg-white/10 active:scale-[0.97]"
                style={{ border: '1.5px solid rgba(255,255,255,0.4)', color: 'white' }}
              >
                <Download className="w-4 h-4" strokeWidth={1.8} />
                Export Grades
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="px-6 lg:px-8 py-3 flex items-center gap-2 text-sm border-b border-slate-100 bg-white">
            <span className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">My Courses</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold" style={{ color: '#0d8a7a' }}>Operating Systems and Networks</span>
          </div>

          {/* Page content */}
          <div className="px-6 lg:px-8 py-6 space-y-6 pb-12">

            {/* ── SECTION 1: Overall Performance ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-base font-bold text-slate-800 mb-6">Overall Performance</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Column 1: Grade ring */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative w-[120px] h-[120px]">
                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r={GRADE_RING_R} fill="none" stroke="#F3F4F6" strokeWidth="9" />
                      <circle
                        cx="60" cy="60" r={GRADE_RING_R}
                        fill="none" stroke="#10B981" strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={GRADE_RING_C}
                        strokeDashoffset={ready ? GRADE_RING_C * (1 - GRADE_PCT) : GRADE_RING_C}
                        style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'JetBrains Mono, monospace' }}>72%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-500 mb-2">Overall Grade</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      PASS
                    </span>
                  </div>
                </div>

                {/* Column 2: Quick stats */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Tests Completed</p>
                      <p className="text-lg font-extrabold text-slate-900">2 of 3</p>
                      <p className="text-xs text-slate-400 mt-0.5">1 remaining</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-amber-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Next Assessment</p>
                      <p className="text-lg font-extrabold text-slate-900">Phase Test 2</p>
                      <span className="inline-flex mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                        Tomorrow · 14:00
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Trophy className="w-4 h-4 text-teal-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Highest Score</p>
                      <p className="text-lg font-extrabold" style={{ color: '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>88%</p>
                      <p className="text-xs text-slate-400 mt-0.5">Kernel Module Project</p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Score trend */}
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-4">Score Trend</p>
                  <div className="flex items-end gap-3" style={{ height: '96px' }}>
                    {SCORE_BARS.map(({ label, pct, color, filled }) => (
                      <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                        <span className="text-[11px] font-bold" style={{ color: filled ? color : '#9CA3AF' }}>
                          {filled ? `${pct}%` : '—'}
                        </span>
                        <div className="w-full flex items-end" style={{ height: '64px' }}>
                          {filled ? (
                            <div
                              className="w-full rounded-t-md transition-all duration-700"
                              style={{
                                height:     ready ? `${Math.round(pct * 0.64)}px` : '0px',
                                background: color,
                                transition: 'height 1.2s cubic-bezier(0.16,1,0.3,1)',
                              }}
                            />
                          ) : (
                            <div className="w-full rounded-t-md border-2 border-dashed border-slate-200" style={{ height: '64px' }} />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION 2: Assessment Breakdown ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-800">Assessment Breakdown</h2>
                <button className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2" style={{ color: '#0d8a7a' }}>
                  Sort by Weight
                </button>
              </div>

              <div className="space-y-3">
                {ASSESSMENTS_ROWS.map((row, i) => {
                  const isExpanded = expandedFeedback.includes(i);
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                      style={{ borderLeft: `4px solid ${row.borderColor}` }}
                    >
                      {/* Main row */}
                      <div className="px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">

                        <div className="flex-1 min-w-0">
                          <span className="inline-flex text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full mb-2" style={{ background: row.badgeBg, color: row.badgeFg }}>
                            {row.badge}
                          </span>
                          <p className="text-[15px] font-bold text-slate-900 mb-1">{row.title}</p>
                          <p className="text-xs text-slate-400">{row.meta}</p>
                        </div>

                        <div className="sm:w-36 shrink-0">
                          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">Score</p>
                          <p className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {row.score !== null ? `${row.score}/${row.maxScore}` : `--/${row.maxScore}`}
                          </p>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width:      ready && row.score !== null ? `${row.score}%` : '0%',
                                background: row.barColor,
                                transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                          <span className="text-[10px] font-extrabold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full" style={{ background: row.statusBg, color: row.statusFg }}>
                            {row.status}
                          </span>
                          <button className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2 whitespace-nowrap" style={{ color: row.linkColor }}>
                            {row.link}
                          </button>
                        </div>

                        <button className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Feedback strip */}
                      {row.feedback ? (
                        <div style={{ borderTop: '1px solid #f1f5f9' }}>

                          {/* Collapsed preview row */}
                          <div className="px-5 sm:px-6 py-2.5 flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-extrabold shrink-0"
                              style={{ background: 'linear-gradient(135deg, #1E1B4B, #3730A3)' }}
                            >
                              {row.feedback.initials}
                            </div>
                            <p className="flex-1 text-xs text-slate-500 truncate min-w-0">
                              <span className="font-semibold text-slate-600">{row.feedback.author}:</span>{' '}
                              {row.feedback.preview}
                            </p>
                            <button
                              onClick={() => toggleFeedback(i)}
                              className="flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:opacity-70"
                              style={{ color: '#0d8a7a' }}
                            >
                              {isExpanded ? 'Hide' : 'View feedback'}
                              {isExpanded
                                ? <ChevronUp   className="w-3 h-3" />
                                : <ChevronDown className="w-3 h-3" />
                              }
                            </button>
                          </div>

                          {/* Expanded full feedback */}
                          {isExpanded && (
                            <div className="px-5 sm:px-6 pb-4">
                              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                                <div className="flex items-center justify-between gap-4 mb-2.5">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-extrabold shrink-0"
                                      style={{ background: 'linear-gradient(135deg, #1E1B4B, #3730A3)' }}
                                    >
                                      {row.feedback.initials}
                                    </div>
                                    <p className="text-[13px] font-semibold text-slate-700">
                                      Feedback from {row.feedback.author}
                                    </p>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{row.feedback.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-3" style={{ lineHeight: '1.65' }}>
                                  {row.feedback.full}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                                    style={{ background: 'linear-gradient(135deg, #0d8a7a, #14b8a6)', boxShadow: '0 3px 10px rgba(13,138,122,0.22)' }}
                                  >
                                    Reply to Instructor
                                  </button>
                                  <button className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-white cursor-pointer transition-all duration-150 active:scale-[0.97]">
                                    View Resources
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* No feedback yet for in-progress assessments */
                        <div
                          className="px-5 sm:px-6 py-2.5 flex items-center gap-2"
                          style={{ borderTop: '1px solid #f1f5f9' }}
                        >
                          <p className="text-xs text-slate-400 italic">Feedback will be available once graded.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
