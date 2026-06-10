import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, FileText, FlaskConical, PlayCircle } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import type { VideoMaterial } from '../components/VideoPlayerModal';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseMaterialsProps {
  onBack:     () => void;
  onHome?:    () => void;
  onNavigate: (page: CoursePageNav) => void;
}

// ─── Types ───────────────────────────────────────────────────────────────────
// Types used to describe materials and filters on the page.

type ItemType   = 'slides' | 'lab' | 'video';
type ItemStatus = 'viewed' | 'not-started';
type FilterKey  = 'All' | 'Slides' | 'Labs' | 'Videos';

interface WeekItem {
  type:     ItemType;
  title:    string;
  format:   string;
  duration: string | null;
  status:   ItemStatus;
  // Video-specific optional fields
  id?:            string;
  url?:           string;
  progress?:      number;
  resumeFrom?:    number;
  relatedSlides?: { id: string; title: string; url: string };
  relatedLab?:    { id: string; title: string; url: string };
}

interface Week {
  id:    number;
  topic: string;
  items: WeekItem[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WEEKS: Week[] = [
  {
    id: 34, topic: 'Memory & Virtualization',
    items: [
      { type: 'slides', title: '"Memory Management"',      format: 'PDF',   duration: null,     status: 'viewed'      },
      { type: 'lab',    title: '"Virtual Memory Lab"',     format: 'PDF',   duration: null,     status: 'not-started' },
      {
        type: 'video', title: '"Segmentation vs Paging"', format: 'Video', duration: '45 min', status: 'not-started',
        id:   'v-34',
        url:  'https://www.youtube.com/watch?v=26QPDBe-NB8',
        relatedSlides: { id: 's-34', title: 'Memory Management',  url: '#' },
        relatedLab:    { id: 'l-34', title: 'Virtual Memory Lab', url: '#' },
      },
    ],
  },
  {
    id: 33, topic: 'Process Sync & Concurrency',
    items: [
      { type: 'slides', title: '"Semaphores & Mutex"',        format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'lab',    title: '"Deadlock Detection Lab"',    format: 'PDF',   duration: null,     status: 'viewed' },
      {
        type: 'video', title: '"Producer-Consumer Problem"', format: 'Video', duration: '38 min', status: 'viewed',
        id:   'v-33',
        url:  'https://www.youtube.com/watch?v=vF8WN4b1qvc',
        resumeFrom: 1245,
        relatedSlides: { id: 's-33', title: 'Semaphores & Mutex',      url: '#' },
        relatedLab:    { id: 'l-33', title: 'Deadlock Detection Lab',  url: '#' },
      },
    ],
  },
  {
    id: 32, topic: 'Scheduling Algorithms',
    items: [
      { type: 'slides', title: '"CPU Scheduling"',        format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'lab',    title: '"Scheduling Simulation"', format: 'PDF',   duration: null,     status: 'viewed' },
      {
        type: 'video', title: '"FCFS vs Round Robin"', format: 'Video', duration: '52 min', status: 'viewed',
        id:  'v-32',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        relatedSlides: { id: 's-32', title: 'CPU Scheduling',        url: '#' },
        relatedLab:    { id: 'l-32', title: 'Scheduling Simulation', url: '#' },
      },
    ],
  },
  {
    id: 31, topic: 'Introduction to OS',
    items: [
      { type: 'slides', title: '"OS Architecture Overview"', format: 'PDF',   duration: null,     status: 'viewed' },
      { type: 'lab',    title: '"System Calls Lab"',         format: 'PDF',   duration: null,     status: 'viewed' },
      {
        type: 'video', title: '"Kernel vs User Space"', format: 'Video', duration: '29 min', status: 'viewed',
        id:  'v-31',
        url: 'https://www.youtube.com/watch?v=9GDX-IyZ_C8',
        relatedSlides: { id: 's-31', title: 'OS Architecture Overview', url: '#' },
        relatedLab:    { id: 'l-31', title: 'System Calls Lab',         url: '#' },
      },
    ],
  },
];

const TYPE_META: Record<ItemType, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  slides: { label: 'Lecture Slides', color: '#2563eb', bg: '#eff6ff', Icon: FileText      },
  lab:    { label: 'Lab Document',   color: '#d97706', bg: '#fffbeb', Icon: FlaskConical  },
  video:  { label: 'Video',          color: '#7c3aed', bg: '#f5f3ff', Icon: PlayCircle    },
};

const FILTER_TYPE: Record<FilterKey, ItemType | null> = {
  All: null, Slides: 'slides', Labs: 'lab', Videos: 'video',
};

const FILTERS: FilterKey[] = ['All', 'Slides', 'Labs', 'Videos'];

// ─── Main component ───────────────────────────────────────────────────────────

export default function CourseMaterials({ onBack, onHome, onNavigate }: CourseMaterialsProps) {
  // Active filter for the materials list.
  const [activeFilter,   setActiveFilter]   = useState<FilterKey>('All');
  const [expandedWeeks,  setExpandedWeeks]  = useState<Set<number>>(new Set([34]));
  const [materialSearch, setMaterialSearch] = useState('');

  // ── Video modal state ───────────────────────────────────────────────────────
  const [videoModalOpen,    setVideoModalOpen]    = useState(false);
  const [selectedVideo,     setSelectedVideo]     = useState<VideoMaterial | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // ── All video items in order (for next/previous navigation) ─────────────────
  const allVideos = useMemo<VideoMaterial[]>(() =>
    WEEKS.flatMap(week =>
      week.items
        .filter((item): item is WeekItem & { url: string } =>
          item.type === 'video' && !!item.url,
        )
        .map(item => ({
          id:          item.id ?? `v-${week.id}`,
          type:        'video' as const,
          title:       item.title,
          weekNumber:  week.id,
          weekTopic:   week.topic,
          duration:    item.duration ?? '',
          url:         item.url,
          progress:    item.progress,
          resumeFrom:  item.resumeFrom,
          relatedSlides: item.relatedSlides,
          relatedLab:    item.relatedLab,
        })),
    ), []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function toggleWeek(id: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function filteredItems(items: WeekItem[]): WeekItem[] {
    // Filter by selected material type and search term.
    const typeFilter = FILTER_TYPE[activeFilter];
    let result = typeFilter ? items.filter((i) => i.type === typeFilter) : items;
    const q = materialSearch.trim().toLowerCase();
    if (q) result = result.filter((i) => i.title.toLowerCase().includes(q));
    return result;
  }

  function handleWatchVideo(item: WeekItem, week: Week) {
    if (!item.url) return;
    const video: VideoMaterial = {
      id:          item.id ?? `v-${week.id}`,
      type:        'video',
      title:       item.title,
      weekNumber:  week.id,
      weekTopic:   week.topic,
      duration:    item.duration ?? '',
      url:         item.url,
      progress:    item.progress,
      resumeFrom:  item.resumeFrom,
      relatedSlides: item.relatedSlides,
      relatedLab:    item.relatedLab,
    };
    // Remember the selected video and open the modal.
    const idx = allVideos.findIndex(v => v.id === video.id);
    setCurrentVideoIndex(idx >= 0 ? idx : 0);
    setSelectedVideo(video);
    setVideoModalOpen(true);
  }

  function handleNextVideo() {
    const next = allVideos[currentVideoIndex + 1];
    if (next) {
      setCurrentVideoIndex(prev => prev + 1);
      setSelectedVideo(next);
    }
  }

  function handlePreviousVideo() {
    const prev = allVideos[currentVideoIndex - 1];
    if (prev) {
      setCurrentVideoIndex(prev => prev - 1);
      setSelectedVideo(prev);
    }
  }

  function showUnavailable(title: string) {
    window.alert(`${title} preview is not available in this preview.`);
  }

  const actionLabel = (type: ItemType) =>
    type === 'slides' ? 'View' : type === 'lab' ? 'Open' : 'Watch';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="course" activePage="materials" onNavigate={onNavigate} onBack={onBack} onHome={onHome} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
        {/* Course header strip shows the active course and module. */}
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              MATERIALS · CTEC1704D_2025_604
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
            <span
              onClick={onBack}
              className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
            >
              CTEC1704D
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold" style={{ color: '#0d8a7a' }}>Materials</span>
          </div>

          {/* Materials content */}
          <div className="px-6 lg:px-8 py-6 pb-12">

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
                  <div key={week.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Week header */}
                    <button
                      onClick={() => toggleWeek(week.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-[15px] font-extrabold text-slate-800">Week {week.id}</span>
                        <span className="text-slate-300">—</span>
                        <span className="text-sm font-medium text-slate-500 truncate">{week.topic}</span>
                      </div>
                      <ChevronDown
                        className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-slate-600 transition-all duration-300"
                        strokeWidth={2}
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    {/* Items */}
                    <div
                      style={{
                        maxHeight:  isExpanded ? '600px' : '0px',
                        opacity:    isExpanded ? 1 : 0,
                        overflow:   'hidden',
                        transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease',
                      }}
                    >
                      <div className="divide-y divide-slate-100 border-t border-slate-100">
                        {visible.map((item, idx) => {
                          const meta   = TYPE_META[item.type];
                          const viewed = item.status === 'viewed';

                          return (
                            <div key={idx} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                                <meta.Icon className="w-4 h-4" style={{ color: meta.color }} strokeWidth={1.8} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-0.5" style={{ color: meta.color }}>
                                  {meta.label}
                                </p>
                                <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-[11px] text-slate-400 font-medium">{item.format}</span>
                                  {item.duration && (
                                    <>
                                      <span className="text-slate-300 text-[11px]">·</span>
                                      <span className="text-[11px] text-slate-400">{item.duration}</span>
                                    </>
                                  )}
                                  <span className={cn(
                                    'text-[9px] font-extrabold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full',
                                    viewed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                  )}>
                                    {viewed ? 'Viewed' : 'Not Started'}
                                  </span>
                                </div>
                              </div>

                              {viewed ? (
                                <button
                                  onClick={() => item.type === 'video' ? handleWatchVideo(item, week) : showUnavailable(item.title)}
                                  className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all"
                                >
                                  {actionLabel(item.type)}
                                </button>
                              ) : (
                                <button
                                  onClick={() => item.type === 'video' ? handleWatchVideo(item, week) : showUnavailable(item.title)}
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
          </div>
        </main>
      </div>

      {/* Video player modal */}
      <VideoPlayerModal
        isOpen={videoModalOpen}
        onClose={() => {
          setVideoModalOpen(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
        onNext={handleNextVideo}
        onPrevious={handlePreviousVideo}
        hasNext={currentVideoIndex < allVideos.length - 1}
        hasPrevious={currentVideoIndex > 0}
        currentIndex={currentVideoIndex}
        totalCount={allVideos.length}
      />
    </div>
  );
}
