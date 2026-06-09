import { useState, useEffect } from 'react';
import {
  FileText, Clock, AlertTriangle, ArrowRight,
  PlayCircle, FlaskConical, CheckCircle2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseOverviewProps {
  onBack:     () => void;
  onNavigate: (page: CoursePageNav) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

const QUICK_STATS = [
  { label: 'Materials Available', value: '24', sub: 'This week',           icon: FileText,      ring: '#0d8a7a', bg: '#f0fdf4', fg: '#059669' },
  { label: 'Pending Items',       value: '3',  sub: 'Require attention',   icon: Clock,         ring: '#f59e0b', bg: '#fffbeb', fg: '#d97706' },
  { label: 'Phase Test 2',        value: '2d', sub: 'Jun 2 · 14:00',       icon: AlertTriangle, ring: '#ef4444', bg: '#fef2f2', fg: '#dc2626' },
];

const RECENT_MATERIALS = [
  { type: 'slides', title: '"Memory Management"',       week: 34, viewed: true  },
  { type: 'lab',    title: '"Virtual Memory Lab"',      week: 34, viewed: false },
  { type: 'video',  title: '"Segmentation vs Paging"',  week: 34, viewed: false },
];

const TYPE_ICON: Record<string, { Icon: React.ElementType; color: string; bg: string }> = {
  slides: { Icon: FileText,     color: '#2563eb', bg: '#eff6ff' },
  lab:    { Icon: FlaskConical, color: '#d97706', bg: '#fffbeb' },
  video:  { Icon: PlayCircle,   color: '#7c3aed', bg: '#f5f3ff' },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CourseOverview({ onBack, onNavigate }: CourseOverviewProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="course" activePage="overview" onNavigate={onNavigate} onBack={onBack} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              OVERVIEW · CTEC1704D_2025_604
            </p>
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight mb-1">
              Operating Systems and Networks
            </h1>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Academic Year 2025/26 · Block 4 · Week 9 of 14
            </p>
          </div>

          {/* Breadcrumb */}
          <div className="px-6 lg:px-8 py-3 flex items-center gap-2 text-sm border-b border-slate-100 bg-white">
            <span className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">My Courses</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">Dashboard</span>
            <span className="text-slate-300">›</span>
            <span className="font-semibold" style={{ color: '#0d8a7a' }}>Overview</span>
          </div>

          <div className="px-6 lg:px-8 py-6 pb-12 space-y-6">

            {/* Progress + Stats row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

              {/* Progress ring card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center gap-3">
                <div className="relative w-[100px] h-[100px]">
                  <svg
                    width="100" height="100" viewBox="0 0 100 100"
                    style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
                  >
                    <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#F3F4F6" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r={RING_R}
                      fill="none" stroke="#0d8a7a" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={RING_C}
                      strokeDashoffset={ready ? RING_C * (1 - 0.67) : RING_C}
                      style={{
                        transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)',
                        filter: 'drop-shadow(0 0 6px rgba(13,138,122,0.4))',
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900">67%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500">Course Progress</p>
                  <p className="text-xs text-slate-400 mt-0.5">Week 9 of 14</p>
                </div>
              </div>

              {/* 3 stat cards */}
              {QUICK_STATS.map(({ label, value, sub, icon: Icon, ring, bg, fg }, i) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                  style={{
                    borderTop:  `3px solid ${ring}`,
                    opacity:    ready ? 1 : 0,
                    transform:  ready ? 'translateY(0)' : 'translateY(12px)',
                    transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400">{label}</p>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color: fg }} />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold" style={{ color: fg }}>{value}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Two-column: recent materials + upcoming assessments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Recent Materials */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-bold text-slate-800">Recent Materials</h2>
                  <button
                    onClick={() => onNavigate('materials')}
                    className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2"
                    style={{ color: '#0d8a7a' }}
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-3 mb-5">
                  {RECENT_MATERIALS.map((item, i) => {
                    const meta = TYPE_ICON[item.type];
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                          <meta.Icon className="w-4 h-4" style={{ color: meta.color }} strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Week {item.week}</p>
                        </div>
                        {item.viewed ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">Viewed</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">New</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => onNavigate('materials')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                  style={{ background: '#0d8a7a', boxShadow: '0 4px 12px rgba(13,138,122,0.28)' }}
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Upcoming Assessments */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-bold text-slate-800">Upcoming Assessments</h2>
                  <button
                    onClick={() => onNavigate('assessments')}
                    className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2"
                    style={{ color: '#0d8a7a' }}
                  >
                    View all →
                  </button>
                </div>

                {/* SAP — due tomorrow */}
                <div className="mb-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors" style={{ borderLeft: '4px solid #ef4444' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-red-50 text-red-600">ASSIGNMENT</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 shrink-0">Due Tomorrow</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Systems Analysis Project (SAP)</p>
                  <p className="text-xs text-slate-400 mt-1">Weight: 30% of Module</p>
                </div>

                {/* Phase Test 2 */}
                <div className="mb-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">PHASE TEST</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0">In 2 days</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Phase Test 2</p>
                  <p className="text-xs text-slate-400 mt-1">May 29, 2026 · 14:00</p>
                </div>

                {/* Phase Test 1 — completed */}
                <div className="p-4 rounded-xl border border-slate-100" style={{ borderLeft: '4px solid #10B981' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[9px] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">PHASE TEST</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Phase Test 1</p>
                  <p className="text-xs text-slate-400 mt-1">Oct 3, 2025 · Score: 78%</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
