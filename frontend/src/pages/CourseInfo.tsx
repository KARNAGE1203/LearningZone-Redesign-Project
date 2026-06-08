import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, BarChart2, FileText, ClipboardList,
  BookOpen, ArrowLeft, Menu, X, ChevronRight, Mail, Clock, MapPin,
  CheckCircle2, ArrowRight,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseInfoProps {
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

const COURSE_DETAILS = [
  { label: 'Course Code',  value: 'CTEC1704D_2025_604'  },
  { label: 'Credit Hours', value: '20 Credits'           },
  { label: 'Block',        value: 'Block 4, Summer 2026' },
  { label: 'Schedule',     value: 'MWF 10:00 AM'        },
  { label: 'Delivery',     value: 'On Campus + Online'  },
];

const WEIGHTING_SEGMENTS = [
  { label: 'SAP',         pct: 10, color: '#0d8a7a' },
  { label: 'Phase Test 1', pct: 30, color: '#3b82f6' },
  { label: 'Phase Test 2', pct: 30, color: '#7c3aed' },
  { label: 'Phase Test 3', pct: 30, color: '#6366f1' },
];

const BLOCK_STEPS = [
  { label: 'Block A', marker: 'Sep – Oct',   done: true,   active: false },
  { label: 'Block B', marker: 'Oct – Nov',   done: true,   active: false },
  { label: 'Block C', marker: 'Week 34',     done: false,  active: true  },
  { label: 'Block D', marker: 'Jun – Jul',   done: false,  active: false },
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
          const active = page === 'course-info' as CoursePageNav;
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

export default function CourseInfo({ onBackToHome, onNavigate }: CourseInfoProps) {
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
            <span className="text-sm font-semibold text-slate-700">Course Info</span>
          </div>

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
                          className="h-full transition-all duration-700"
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
                    {/* Track */}
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
                          <span
                            className="text-[11px] font-extrabold tracking-[0.1em] uppercase"
                            style={{ color: active ? '#0d8a7a' : done ? '#0d8a7a' : '#94a3b8' }}
                          >
                            {label}
                          </span>
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: active ? '#0d8a7a' : '#94a3b8' }}
                          >
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

                  {/* Professor avatar */}
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

                  {/* Contact details */}
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
