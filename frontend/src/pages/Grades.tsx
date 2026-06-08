import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, BarChart2, FileText, ClipboardList,
  BookOpen, ArrowLeft, Menu, X, ChevronRight, CheckCircle2, Clock,
  Trophy, MoreHorizontal, Download,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GradesProps {
  onLogout:     () => void;
  onBackToHome: () => void;
  onNavigate:   (page: CoursePageNav) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',   page: 'dashboard'   as CoursePageNav },
  { icon: BarChart2,       label: 'Grades',       page: 'grades'      as CoursePageNav },
  { icon: FileText,        label: 'Materials',    page: 'materials'   as CoursePageNav },
  { icon: ClipboardList,   label: 'Assessments',  page: 'assessments' as CoursePageNav },
  { icon: BookOpen,        label: 'Resources',    page: 'resources'   as CoursePageNav },
];

const GRADE_RING_R = 46;
const GRADE_RING_C = 2 * Math.PI * GRADE_RING_R;
const GRADE_PCT    = 0.72;

const ASSESSMENTS_ROWS = [
  {
    borderColor: '#10B981',
    badge:       'ASSIGNMENT',
    badgeBg:     '#f0fdf4',
    badgeFg:     '#059669',
    title:       'Kernel Module Project',
    meta:        'Weight: 25% · Oct 12',
    score:       88,
    maxScore:    100,
    barColor:    '#10B981',
    status:      'GRADED',
    statusBg:    '#f0fdf4',
    statusFg:    '#059669',
    link:        'Review Attempt →',
    linkColor:   '#0d8a7a',
  },
  {
    borderColor: '#F59E0B',
    badge:       'PHASE TEST',
    badgeBg:     '#fffbeb',
    badgeFg:     '#d97706',
    title:       'Midterm Examination',
    meta:        'Weight: 30% · Nov 5',
    score:       64,
    maxScore:    100,
    barColor:    '#F59E0B',
    status:      'GRADED',
    statusBg:    '#fffbeb',
    statusFg:    '#d97706',
    link:        'Review Attempt →',
    linkColor:   '#0d8a7a',
  },
  {
    borderColor: '#F59E0B',
    badge:       'LAB',
    badgeBg:     '#fffbeb',
    badgeFg:     '#d97706',
    title:       'Protocol Design Lab',
    meta:        'Weight: 15% · Dec 2',
    score:       null,
    maxScore:    100,
    barColor:    '#D1D5DB',
    status:      'IN PROGRESS',
    statusBg:    '#fffbeb',
    statusFg:    '#d97706',
    link:        'View Brief →',
    linkColor:   '#d97706',
  },
];

const SCORE_BARS = [
  { label: 'PT1', pct: 85, color: '#10B981', filled: true  },
  { label: 'PT2', pct: 60, color: '#F59E0B', filled: true  },
  { label: 'PT3', pct: 0,  color: '#D1D5DB', filled: false },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function SidebarContent({
  onClose,
  onBackToHome,
  onNavigate,
}: {
  onClose?:     () => void;
  onBackToHome: () => void;
  onNavigate:   (page: CoursePageNav) => void;
}) {
  return (
    <div className="flex flex-col h-full">
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
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-5 py-5">
        <button
          onClick={onBackToHome}
          className="w-full flex items-center gap-2.5 h-10 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150"
          style={{ color: '#0d8a7a', border: '1.5px solid rgba(13,138,122,0.25)', background: 'rgba(13,138,122,0.06)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,138,122,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(13,138,122,0.06)')}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Back to Home
        </button>
      </div>

      <p className="px-6 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400">Navigation</p>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {SIDEBAR_NAV.map(({ icon: Icon, label, page }) => {
          const active = page === 'grades';
          return (
            <button
              key={label}
              onClick={() => onNavigate(page)}
              className={cn(
                'w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all duration-150 text-left',
                active ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
              )}
              style={active ? { boxShadow: 'inset 3px 0 0 #0d8a7a' } : {}}
            >
              <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-teal-600' : 'text-slate-400')} strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {active && <span className="ml-auto w-2 h-2 rounded-full bg-teal-500" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Grades({ onBackToHome, onNavigate }: GradesProps) {
  const [ready,      setReady]      = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const h  = (e: MediaQueryListEvent) => { if (e.matches) setDrawerOpen(false); };
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[240px] shrink-0 flex-col h-full bg-white border-r border-slate-200">
        <SidebarContent onBackToHome={onBackToHome} onNavigate={onNavigate} />
      </aside>

      {/* Mobile drawer backdrop */}
      <div
        className={cn('fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden', drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <div className={cn('fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden', drawerOpen ? 'translate-x-0' : '-translate-x-full')}>
        <SidebarContent onClose={() => setDrawerOpen(false)} onBackToHome={onBackToHome} onNavigate={onNavigate} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
            <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700">Grades</span>
          </div>

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
                    <svg
                      width="120" height="120" viewBox="0 0 120 120"
                      style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
                    >
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
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: filled ? color : '#9CA3AF' }}
                        >
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
                            <div
                              className="w-full rounded-t-md border-2 border-dashed border-slate-200"
                              style={{ height: '64px' }}
                            />
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
                {ASSESSMENTS_ROWS.map((row, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    style={{ borderLeft: `4px solid ${row.borderColor}` }}
                  >
                    <div className="px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">

                      {/* Left: badge + title + meta */}
                      <div className="flex-1 min-w-0">
                        <span
                          className="inline-flex text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full mb-2"
                          style={{ background: row.badgeBg, color: row.badgeFg }}
                        >
                          {row.badge}
                        </span>
                        <p className="text-[15px] font-bold text-slate-900 mb-1">{row.title}</p>
                        <p className="text-xs text-slate-400">{row.meta}</p>
                      </div>

                      {/* Center: score + bar */}
                      <div className="sm:w-36 shrink-0">
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">Score</p>
                        <p className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {row.score !== null ? `${row.score}/${row.maxScore}` : `--/${row.maxScore}`}
                        </p>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width:      ready && row.score !== null ? `${row.score}%` : '0%',
                              background: row.barColor,
                              transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Right: status + link + menu */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                        <span
                          className="text-[10px] font-extrabold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                          style={{ background: row.statusBg, color: row.statusFg }}
                        >
                          {row.status}
                        </span>
                        <button
                          className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2 whitespace-nowrap"
                          style={{ color: row.linkColor }}
                        >
                          {row.link}
                        </button>
                      </div>

                      <button className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 3: Instructor Feedback ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1E1B4B, #3730A3)' }}
                  >
                    SA
                  </div>
                  <p className="text-[15px] font-bold text-slate-900">Feedback from Dr. Sayed Ahmed</p>
                </div>
                <span className="text-xs text-slate-400 font-medium shrink-0">2 days ago</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-5" style={{ lineHeight: '1.65' }}>
                Your implementation of the Kernel Module was exemplary, showing a deep understanding of memory management.
                However, the midterm results suggest a need for more focus on OSI Layer 3 protocols. I've uploaded
                supplementary materials on IP routing that might help bridge this gap.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg, #0d8a7a, #14b8a6)', boxShadow: '0 4px 12px rgba(13,138,122,0.25)' }}
                >
                  Reply to Instructor
                </button>
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all duration-150 active:scale-[0.97]">
                  View Resources
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
