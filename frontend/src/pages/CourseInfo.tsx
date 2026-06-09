import { useState, useEffect } from 'react';
import {
  ChevronRight, Mail, Clock, MapPin,
  CheckCircle2, ArrowRight, BookOpen,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseInfoProps {
  onLogout?:  () => void;
  onBack:     () => void;
  onHome?:    () => void;
  onNavigate: (page: CoursePageNav) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COURSE_DETAILS = [
  { label: 'Course Code',  value: 'CTEC1704D_2025_604'  },
  { label: 'Credit Hours', value: '20 Credits'           },
  { label: 'Block',        value: 'Block 4, Summer 2026' },
  { label: 'Schedule',     value: 'MWF 10:00 AM'         },
  { label: 'Delivery',     value: 'On Campus + Online'   },
];

const WEIGHTING_SEGMENTS = [
  { label: 'SAP',          pct: 10, color: '#0d8a7a' },
  { label: 'Phase Test 1', pct: 30, color: '#3b82f6' },
  { label: 'Phase Test 2', pct: 30, color: '#7c3aed' },
  { label: 'Phase Test 3', pct: 30, color: '#6366f1' },
];

const BLOCK_STEPS = [
  { label: 'Block A', marker: 'Sep – Oct', done: true,  active: false },
  { label: 'Block B', marker: 'Oct – Nov', done: true,  active: false },
  { label: 'Block C', marker: 'Week 34',   done: false, active: true  },
  { label: 'Block D', marker: 'Jun – Jul', done: false, active: false },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CourseInfo({ onBack, onHome, onNavigate }: CourseInfoProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="course" activePage="course-info" onNavigate={onNavigate} onBack={onBack} onHome={onHome} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              COURSE INFO · CTEC1704D_2025_604
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

          {/* Content: two-column 60/40 */}
          <div className="px-6 lg:px-8 py-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* ── LEFT (60%) ── */}
              <div className="lg:col-span-3 space-y-5">

                {/* Course Information card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <BookOpen className="w-5 h-5 text-teal-600" strokeWidth={1.8} />
                    <h2 className="text-[15px] font-bold text-slate-800">Course Information</h2>
                  </div>

                  <div className="border-t border-slate-100 mb-5" />

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                    {COURSE_DETAILS.map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">{label}</p>
                        <p className="text-[13px] font-semibold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mb-5" />

                  <h3 className="text-sm font-semibold text-slate-700 mb-2">About This Module</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    This module introduces students to the fundamental concepts of operating systems including process
                    management, memory allocation, file systems, and network protocols. Students will gain hands-on
                    experience through labs and applied coursework.
                  </p>
                </div>

                {/* Course Structure card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-[15px] font-bold text-slate-800 mb-5">Course Structure</h2>

                  {/* Assessment weighting bar */}
                  <div className="mb-2">
                    <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-3">Assessment Weighting</p>
                    <div className="w-full h-3 rounded-full overflow-hidden flex">
                      {WEIGHTING_SEGMENTS.map(({ label, pct, color }) => (
                        <div
                          key={label}
                          className="h-full"
                          style={{
                            width:      ready ? `${pct}%` : '0%',
                            background: color,
                            transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-7">
                    {WEIGHTING_SEGMENTS.map(({ label, pct, color }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
                        <span className="text-xs text-slate-600 font-medium">{label} ({pct}%)</span>
                      </div>
                    ))}
                  </div>

                  {/* Block timeline stepper */}
                  <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-4">Block Timeline</p>
                  <div className="relative">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:      ready ? '66%' : '0%',
                          background: 'linear-gradient(90deg, #0d8a7a, #34d399)',
                          transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-4 relative z-10">
                      {BLOCK_STEPS.map(({ label, marker, done, active }) => (
                        <div key={label} className="flex flex-col items-center text-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0"
                            style={
                              done
                                ? { background: '#0d8a7a', borderColor: '#0d8a7a' }
                                : active
                                ? { background: 'white', borderColor: '#0d8a7a', boxShadow: '0 0 0 4px rgba(13,138,122,0.15)' }
                                : { background: 'white', borderColor: '#e2e8f0' }
                            }
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                            ) : active ? (
                              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-200" />
                            )}
                          </div>
                          <span className="text-[11px] font-extrabold tracking-[0.1em] uppercase" style={{ color: active ? '#0d8a7a' : done ? '#0d8a7a' : '#94a3b8' }}>
                            {label}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: active ? '#0d8a7a' : '#94a3b8' }}>
                            {marker}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT (40%) ── */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                  <div className="flex flex-col items-center text-center mb-5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-extrabold mb-3"
                      style={{ background: 'linear-gradient(135deg, #1E1B4B, #3730A3)' }}
                    >
                      MA
                    </div>
                    <p className="text-[15px] font-bold text-slate-900">Prof. Muhammad Al-Ibaisi</p>
                    <p className="text-xs text-slate-500 mt-1">Senior Lecturer, Computer Science</p>
                  </div>

                  <div className="border-t border-slate-100 mb-5" />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Email</p>
                        <a
                          href="mailto:m.alibaisi@dmu.ac.uk"
                          className="text-sm font-semibold hover:underline underline-offset-2 transition-colors"
                          style={{ color: '#0d8a7a' }}
                        >
                          m.alibaisi@dmu.ac.uk
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Office Hours</p>
                        <p className="text-sm font-semibold text-slate-800">Mon / Wed 2:00 – 4:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-0.5">Location</p>
                        <p className="text-sm font-semibold text-slate-800">Gateway House, Room 3.08</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 my-5" />

                  <button
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                    style={{ background: 'linear-gradient(135deg, #0d8a7a, #14b8a6)', boxShadow: '0 4px 14px rgba(13,138,122,0.28)' }}
                  >
                    Send Email
                    <ArrowRight className="w-4 h-4" />
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
