import { useState } from 'react';
import {
  ChevronRight, CheckCircle2, Clock,
  ChevronDown, Download, ArrowRight,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssessmentsProps {
  onBack:     () => void;
  onHome?:    () => void;
  onNavigate: (page: CoursePageNav) => void;
}
// ─── Data ─────────────────────────────────────────────────────────────────────
// Static data for active and past assessments shown on the assessments page.
const DATE_SHEET_ROWS = [
  { assessment: 'Phase Test 1', status: 'Completed', statusBg: '#f0fdf4', statusFg: '#059669', date: 'Oct 3, 2025'        },
  { assessment: 'Phase Test 2', status: 'Upcoming',  statusBg: '#fffbeb', statusFg: '#d97706', date: 'May 29, 2026 · 14:00' },
  { assessment: 'Phase Test 3', status: 'Scheduled', statusBg: '#f8fafc', statusFg: '#64748b', date: 'Jun 12, 2026 · 10:00' },
];

const PAST_ASSESSMENTS = [
  { title: 'Phase Test 1',    date: 'Oct 3, 2025',  grade: '78%', gradeColor: '#10B981' },
  { title: 'Lab 5 Submission', date: 'Oct 14, 2025', grade: '85%', gradeColor: '#10B981' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
// The main assessments page showing active and past assessments with details and actions.
export default function Assessments({ onBack, onHome, onNavigate }: AssessmentsProps) {
  // Control whether past assessments are shown.
  const [pastExpanded, setPastExpanded] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="course" activePage="assessments" onNavigate={onNavigate} onBack={onBack} onHome={onHome} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          {/* Header bar identifies the current course and module. */}
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
          {/* Breadcrumb helps users see the current path inside the course pages. */}
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
                        <span className="inline-flex text-[10px] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full w-fit" style={{ background: row.statusBg, color: row.statusFg }}>
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
            {/* Past assessment history can be toggled open or closed. */}
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
                      <span className="text-sm font-extrabold px-2.5 py-1 rounded-full bg-emerald-50" style={{ color: item.gradeColor }}>
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
