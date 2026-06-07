import { useState } from 'react';
import {
  GraduationCap, ArrowLeft, ChevronDown,
  LogOut, HelpCircle, Search, FileText, FlaskConical,
  PlayCircle, LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseMaterialsProps {
  onBack: () => void;
  onLogout: () => void;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type ItemType   = 'slides' | 'lab' | 'video';
type ItemStatus = 'viewed' | 'not-started';
type FilterKey  = 'All' | 'Slides' | 'Labs' | 'Videos';
type TabKey     = 'Materials' | 'Assessments' | 'Course Info' | 'Resources';

interface WeekItem {
  type: ItemType;
  title: string;
  format: string;
  duration: string | null;
  status: ItemStatus;
}

interface Week {
  id: number;
  topic: string;
  items: WeekItem[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WEEKS: Week[] = [
  {
    id: 34,
    topic: 'Memory & Virtualization',
    items: [
      { type: 'slides', title: '"Memory Management"',       format: 'PDF',   duration: null,      status: 'viewed'      },
      { type: 'lab',    title: '"Virtual Memory Lab"',      format: 'PDF',   duration: null,      status: 'not-started' },
      { type: 'video',  title: '"Segmentation vs Paging"',  format: 'Video', duration: '45 min',  status: 'not-started' },
    ],
  },
  {
    id: 33,
    topic: 'Process Sync & Concurrency',
    items: [
      { type: 'slides', title: '"Semaphores & Mutex"',          format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'lab',    title: '"Deadlock Detection Lab"',      format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'video',  title: '"Producer-Consumer Problem"',   format: 'Video', duration: '38 min', status: 'viewed' },
    ],
  },
  {
    id: 32,
    topic: 'Scheduling Algorithms',
    items: [
      { type: 'slides', title: '"CPU Scheduling"',              format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'lab',    title: '"Scheduling Simulation"',       format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'video',  title: '"FCFS vs Round Robin"',         format: 'Video', duration: '52 min', status: 'viewed' },
    ],
  },
  {
    id: 31,
    topic: 'Introduction to OS',
    items: [
      { type: 'slides', title: '"OS Architecture Overview"',    format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'lab',    title: '"System Calls Lab"',            format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'video',  title: '"Kernel vs User Space"',        format: 'Video', duration: '29 min', status: 'viewed' },
    ],
  },
];

const TYPE_META: Record<ItemType, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  slides: { label: 'Lecture Slides', color: '#2563eb', bg: '#eff6ff', Icon: FileText      },
  lab:    { label: 'Lab Document',   color: '#d97706', bg: '#fffbeb', Icon: FlaskConical  },
  video:  { label: 'Video',          color: '#7c3aed', bg: '#f5f3ff', Icon: PlayCircle    },
};

const FILTER_TYPE: Record<FilterKey, ItemType | null> = {
  All:    null,
  Slides: 'slides',
  Labs:   'lab',
  Videos: 'video',
};

const TABS:    TabKey[]    = ['Materials', 'Assessments', 'Course Info', 'Resources'];
const FILTERS: FilterKey[] = ['All', 'Slides', 'Labs', 'Videos'];

const COURSE_NAV = [
  'Materials', 'Assessments', 'Grades', 'Resources',
] as const;

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function CourseSidebar({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#0d8a7a' }}>
          <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-slate-900 font-bold text-base leading-none tracking-tight">LearningZone</p>
          <p className="text-slate-400 text-[11px] mt-1">Student Portal</p>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="px-5 py-4">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-2.5 h-10 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150"
          style={{ color: '#0d8a7a', border: '1.5px solid rgba(13,138,122,0.25)', background: 'rgba(13,138,122,0.06)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,138,122,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(13,138,122,0.06)')}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Back to Dashboard
        </button>
      </div>

      {/* Section label */}
      <p className="px-6 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400">
        Course Navigation
      </p>

      {/* Course nav */}
      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
        {COURSE_NAV.map((label) => {
          const active = label === 'Materials';
          return (
            <button
              key={label}
              className={cn(
                'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm cursor-pointer transition-all duration-150 text-left relative',
                active
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
              )}
              style={active ? { boxShadow: 'inset 3px 0 0 #0d8a7a' } : {}}
            >
              {label}
              {active && <span className="ml-auto w-2 h-2 rounded-full bg-teal-500" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function CourseMaterials({ onBack, onLogout }: CourseMaterialsProps) {
  const [activeTab,       setActiveTab]       = useState<TabKey>('Materials');
  const [activeFilter,    setActiveFilter]    = useState<FilterKey>('All');
  const [expandedWeeks,   setExpandedWeeks]   = useState<Set<number>>(new Set([34]));
  const [materialSearch,  setMaterialSearch]  = useState('');

  function toggleWeek(id: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function filteredItems(items: WeekItem[]): WeekItem[] {
    const typeFilter = FILTER_TYPE[activeFilter];
    let result = typeFilter ? items.filter((i) => i.type === typeFilter) : items;
    const q = materialSearch.trim().toLowerCase();
    if (q) result = result.filter((i) => i.title.toLowerCase().includes(q));
    return result;
  }

  const actionLabel = (type: ItemType) =>
    type === 'slides' ? 'View' : type === 'lab' ? 'Open' : 'Watch';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex lg:w-[240px] shrink-0 flex-col h-full bg-white border-r border-slate-200">
        <CourseSidebar onBack={onBack} onLogout={onLogout} />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">

          {/* Course header */}
          <div className="px-6 lg:px-8 pt-9">

            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#dc2626' }}
              >
                <span className="text-white text-[10px] font-extrabold leading-none">CS</span>
              </div>
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-slate-400">CS301</span>
            </div>

            <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mb-5">
              Operating Systems and Networks
            </h1>

            {/* Tab bar */}
            <div className="flex items-end gap-0 border-b border-slate-200 -mx-6 lg:-mx-8 px-6 lg:px-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-3 text-sm font-semibold cursor-pointer transition-all duration-150 border-b-2 -mb-px whitespace-nowrap',
                    activeTab === tab
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab body */}
          <div className="px-6 lg:px-8 pt-6 pb-12">

            {activeTab !== 'Materials' ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <LayoutGrid className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">{activeTab}</p>
                <p className="text-sm text-slate-400">This section is coming soon.</p>
              </div>
            ) : (
              <>
                {/* Filter + search row */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-150',
                          activeFilter === f
                            ? 'text-white shadow-sm'
                            : 'text-slate-600 bg-white border border-slate-200 hover:border-slate-300'
                        )}
                        style={activeFilter === f ? { background: '#0d8a7a' } : {}}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="relative ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search materials..."
                      value={materialSearch}
                      onChange={(e) => setMaterialSearch(e.target.value)}
                      className="w-52 h-9 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Week accordion list */}
                <div className="space-y-2.5">
                  {WEEKS.map((week) => {
                    const isExpanded = expandedWeeks.has(week.id);
                    const visible    = filteredItems(week.items);
                    if (visible.length === 0) return null;

                    return (
                      <div
                        key={week.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                      >
                        {/* Week header */}
                        <button
                          onClick={() => toggleWeek(week.id)}
                          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-[15px] font-extrabold text-slate-800">
                              Week {week.id}
                            </span>
                            <span className="text-slate-300">—</span>
                            <span className="text-sm font-medium text-slate-500 truncate">
                              {week.topic}
                            </span>
                          </div>
                          <ChevronDown
                            className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-slate-600 transition-all duration-300"
                            strokeWidth={2}
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>

                        {/* Items — always in DOM; CSS animates open/close */}
                        <div
                          style={{
                            maxHeight: isExpanded ? '600px' : '0px',
                            opacity: isExpanded ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease',
                          }}
                        >
                          <div className="divide-y divide-slate-100 border-t border-slate-100">
                            {visible.map((item, idx) => {
                              const meta  = TYPE_META[item.type];
                              const viewed = item.status === 'viewed';

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors"
                                >
                                  {/* Type icon */}
                                  <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: meta.bg }}
                                  >
                                    <meta.Icon
                                      className="w-4 h-4"
                                      style={{ color: meta.color }}
                                      strokeWidth={1.8}
                                    />
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-[10px] font-bold tracking-[0.12em] uppercase mb-0.5"
                                      style={{ color: meta.color }}
                                    >
                                      {meta.label}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                      {item.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <span className="text-[11px] text-slate-400 font-medium">
                                        {item.format}
                                      </span>
                                      {item.duration && (
                                        <>
                                          <span className="text-slate-300 text-[11px]">·</span>
                                          <span className="text-[11px] text-slate-400">
                                            {item.duration}
                                          </span>
                                        </>
                                      )}
                                      <span
                                        className={cn(
                                          'text-[9px] font-extrabold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full',
                                          viewed
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-100 text-slate-500'
                                        )}
                                      >
                                        {viewed ? 'Viewed' : 'Not Started'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action */}
                                  {viewed ? (
                                    <button className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all">
                                      {actionLabel(item.type)}
                                    </button>
                                  ) : (
                                    <button
                                      className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer transition-all hover:brightness-110 active:scale-[0.97]"
                                      style={{ background: '#0d8a7a', boxShadow: '0 2px 8px rgba(13,138,122,0.28)' }}
                                    >
                                      {actionLabel(item.type)}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
