import { useState, useEffect } from 'react';
import {
  ChevronRight, BookOpen, Calendar, User,
  CheckCircle2, ArrowLeft, Award,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TIMELINE } from '../data/courses';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseSummaryProps {
  courseBlock: number;
  onLogout?:   () => void;
  onBack:      () => void;
  onHome?:     () => void;
  onNavigate:  (page: CoursePageNav) => void;
}

const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

// ─── Main ─────────────────────────────────────────────────────────────────────
// Read-only summary of a completed course — final grade and assessment history.
export default function CourseSummary({ courseBlock, onLogout, onBack, onHome, onNavigate }: CourseSummaryProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const data = TIMELINE.find((c) => c.block === courseBlock) ?? TIMELINE[0];
  const {
    course, code, grade, abbr, color, accentBg,
    professor, schedule, description, assessments = [],
  } = data;

  const gradeNum = parseInt(grade, 10) || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar
        variant="archive"
        activePage="course-summary"
        onNavigate={onNavigate}
        onBack={onBack}
        onHome={onHome}
        onLogout={onLogout}
        courseAbbr={abbr}
        courseLabel={course}
        courseCode={code}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              COURSE ARCHIVE · {code}
            </p>
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
              {course}
            </h1>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Academic Year 2025/26 · Block {data.block} · Completed
            </p>
          </div>

          {/* Breadcrumb */}
          <div className="px-6 lg:px-8 py-3 flex items-center gap-2 text-sm border-b border-slate-100 bg-white">
            <span
              onClick={onBack}
              className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold" style={{ color }}>{course}</span>
          </div>

          {/* Content: two-column 60/40 */}
          <div className="px-6 lg:px-8 py-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* ── LEFT (60%) ── */}
              <div className="lg:col-span-3 space-y-5">

                {/* Course Information card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <BookOpen className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
                    <h2 className="text-[15px] font-bold text-slate-800">Course Information</h2>
                  </div>

                  <div className="border-t border-slate-100 mb-5" />

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                    {[
                      { label: 'Course Code',  value: code },
                      { label: 'Credit Hours', value: '20 Credits' },
                      { label: 'Block',        value: `Block ${data.block}, Academic Year 2025/26` },
                      { label: 'Schedule',     value: schedule ?? '—' },
                      { label: 'Module Lead',  value: professor ?? '—' },
                      { label: 'Status',       value: 'Completed' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">{label}</p>
                        <p className="text-[13px] font-semibold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mb-5" />

                  <h3 className="text-sm font-semibold text-slate-700 mb-2">About This Module</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {description ?? 'No description available for this module.'}
                  </p>
                </div>

                {/* Assessment Breakdown card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-[15px] font-bold text-slate-800 mb-5">Assessment Breakdown</h2>

                  {assessments.length > 0 ? (
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                        {['Assessment', 'Weighting', 'Grade'].map((h) => (
                          <span key={h} className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400">{h}</span>
                        ))}
                      </div>
                      {assessments.map((row, i) => (
                        <div
                          key={row.title}
                          className="grid grid-cols-3 px-4 py-3.5 items-center"
                          style={{ borderBottom: i < assessments.length - 1 ? '0.5px solid #E5E7EB' : 'none' }}
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color }} strokeWidth={2} />
                            <span className="text-sm font-semibold text-slate-800">{row.title}</span>
                          </div>
                          <span className="text-sm text-slate-600">{row.weight}</span>
                          <span className="text-sm font-extrabold" style={{ color }}>{row.grade}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No assessment records available for this module.</p>
                  )}
                </div>
              </div>

              {/* ── RIGHT (40%) ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* Final Grade card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Award className="w-5 h-5" style={{ color }} strokeWidth={1.8} />
                    <h2 className="text-[15px] font-bold text-slate-800">Final Grade</h2>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="64" cy="64" r={RING_R} fill="none" stroke={accentBg} strokeWidth="8" />
                        <circle
                          cx="64" cy="64" r={RING_R}
                          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={RING_C}
                          strokeDashoffset={ready ? RING_C * (1 - gradeNum / 100) : RING_C}
                          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1) 0.2s' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-slate-800">{grade}</span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Final Grade</span>
                      </div>
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full"
                      style={{ background: accentBg, color }}
                    >
                      <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                      Module Completed
                    </span>
                  </div>
                </div>

                {/* At a glance card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-[15px] font-bold text-slate-800 mb-4">At a Glance</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: accentBg }}>
                        <User className="w-4 h-4" style={{ color }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Module Lead</p>
                        <p className="text-sm font-semibold text-slate-800">{professor ?? '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: accentBg }}>
                        <Calendar className="w-4 h-4" style={{ color }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Schedule</p>
                        <p className="text-sm font-semibold text-slate-800">{schedule ?? '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 my-5" />

                  <button
                    onClick={onBack}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 hover:bg-slate-50 active:scale-[0.98]"
                    style={{ color: '#475569', border: '1.5px solid #e2e8f0' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
