import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, BarChart2, FileText, ClipboardList,
  BookOpen, ArrowLeft, Menu, X, ChevronRight, CheckCircle2, Clock,
  ChevronDown, Download, ArrowRight,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssessmentsProps {
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

const DATE_SHEET_ROWS = [
  { assessment: 'Phase Test 1', status: 'Completed', statusBg: '#f0fdf4', statusFg: '#059669', date: 'Oct 3, 2025' },
  { assessment: 'Phase Test 2', status: 'Upcoming',  statusBg: '#fffbeb', statusFg: '#d97706', date: 'May 29, 2026 · 14:00' },
  { assessment: 'Phase Test 3', status: 'Scheduled', statusBg: '#f8fafc', statusFg: '#64748b', date: 'Jun 12, 2026 · 10:00' },
];

const PAST_ASSESSMENTS = [
  { title: 'Phase Test 1',    date: 'Oct 3, 2025',  grade: '78%', gradeColor: '#10B981' },
  { title: 'Lab 5 Submission', date: 'Oct 14, 2025', grade: '85%', gradeColor: '#10B981' },
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
          const active = page === 'assessments';
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

export default function Assessments({ onBackToHome, onNavigate }: AssessmentsProps) {
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [pastExpanded,  setPastExpanded]  = useState(false);

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

      {/* Mobile drawer */}
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

          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
            <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700">Assessments</span>
          </div>

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              ASSESSMENTS · CTEC1704D_2025_604
            </p>
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
              Operating Systems and Networks
            </h1>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Academic Year 2025/26 · Block 4
            </p>
          </div>

          {/* Breadcrumb */}
          <div className="px-6 lg:px-8 py-3 flex items-center gap-2 text-sm border-b border-slate-100 bg-white">
            <span className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">My Courses</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold" style={{ color: '#0d8a7a' }}>Operating Systems and Networks</span>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-8 py-6 space-y-6 pb-12">

            {/* ── SECTION 1: Active Assessments ── */}
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-4">Active Assessments</h2>

              {/* Assignment card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4" style={{ borderTop: '4px solid #EF4444' }}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="inline-flex text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                      ASSIGNMENT
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 shrink-0">
                      <Clock className="w-3 h-3" />
                      Due Tomorrow · 14:00
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">Systems Analysis Project (SAP)</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    A comprehensive analysis of an operating system component. Must include architecture diagrams and performance benchmarks.
                  </p>

                  <div className="border-t border-slate-100 my-5" />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    {[
                      { label: 'Submission', value: 'via Portal'         },
                      { label: 'Weight',     value: '30% of Module'      },
                      { label: 'Format',     value: 'PDF Report'         },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex text-[10px] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                      In Progress
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all duration-150">
                        View Brief
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #0d8a7a, #14b8a6)', boxShadow: '0 4px 12px rgba(13,138,122,0.25)' }}
                      >
                        Submit Work
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date sheet card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ borderTop: '4px solid #00737A' }}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                      DATE SHEET
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-5">Phase Test Schedule — Block A</h3>

                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                      {['Assessment', 'Status', 'Date'].map((h) => (
                        <span key={h} className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400">{h}</span>
                      ))}
                    </div>
                    {DATE_SHEET_ROWS.map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 px-4 py-3.5 items-center"
                        style={{ borderBottom: i < DATE_SHEET_ROWS.length - 1 ? '0.5px solid #E5E7EB' : 'none' }}
                      >
                        <span className="text-sm font-semibold text-slate-800">{row.assessment}</span>
                        <span
                          className="inline-flex text-[10px] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full w-fit"
                          style={{ background: row.statusBg, color: row.statusFg }}
                        >
                          {row.status}
                        </span>
                        <span className="text-sm text-slate-600">{row.date}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 hover:bg-teal-50 active:scale-[0.98]"
                    style={{ color: '#0d8a7a', border: '1.5px solid rgba(13,138,122,0.3)' }}
                  >
                    <Download className="w-4 h-4" strokeWidth={1.8} />
                    Download Date Sheet
                  </button>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: Past Assessments (collapsible) ── */}
            <div>
              <button
                onClick={() => setPastExpanded((p) => !p)}
                className="w-full flex items-center justify-between text-left mb-3 cursor-pointer group"
              >
                <h2 className="text-base font-bold text-slate-800">Past Assessments</h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                  {pastExpanded ? 'Collapse' : 'Show all'}
                  <ChevronDown
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ transform: pastExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </div>
              </button>

              <div
                style={{
                  maxHeight:  pastExpanded ? '400px' : '0px',
                  opacity:    pastExpanded ? 1 : 0,
                  overflow:   'hidden',
                  transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease',
                }}
              >
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                  {PAST_ASSESSMENTS.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                      </div>
                      <span
                        className="text-sm font-extrabold px-2.5 py-1 rounded-full bg-emerald-50"
                        style={{ color: item.gradeColor }}
                      >
                        {item.grade}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">Graded</span>
                      <button className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2 shrink-0" style={{ color: '#0d8a7a' }}>
                        Review →
                      </button>
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
