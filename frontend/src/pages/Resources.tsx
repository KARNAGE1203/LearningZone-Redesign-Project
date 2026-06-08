import { useState, useEffect } from 'react';
import {
  GraduationCap, LayoutDashboard, BarChart2, FileText, ClipboardList,
  BookOpen, ArrowLeft, Menu, X, ChevronRight, Database, Library,
  ExternalLink, Headphones, HelpCircle, Users, Link,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ResourcesProps {
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

const ELIBRARY = [
  {
    icon:   Database,
    title:  'IEEE Xplore Digital Library',
    sub:    'Engineering & CS journals',
    tag:    'Journal Database',
    link:   'Access Library →',
  },
  {
    icon:   Library,
    title:  'ACM Digital Library',
    sub:    'Computer science publications',
    tag:    'Research Papers',
    link:   'Access Library →',
  },
  {
    icon:   BookOpen,
    title:  'DMU Library Catalogue',
    sub:    'Books, eBooks, and journals',
    tag:    'DMU Resource',
    link:   'Search Catalogue →',
  },
];

const EXTERNAL = [
  {
    title:  'GeeksForGeeks — Operating Systems',
    domain: 'geeksforgeeks.org',
    desc:   'Comprehensive OS theory and examples for exam preparation.',
  },
  {
    title:  'MIT OpenCourseWare — OS Lectures',
    domain: 'ocw.mit.edu',
    desc:   'Free lecture notes from MIT's 6.828 Operating Systems course.',
  },
  {
    title:  'TutorialsPoint — OS Guide',
    domain: 'tutorialspoint.com',
    desc:   'Step-by-step OS concepts guide with clear examples.',
  },
];

const SUPPORT = [
  {
    icon:   Headphones,
    title:  'IT Support',
    sub:    'Technical issues, portal access',
    avail:  'Available 24/7',
    link:   'Get Help →',
  },
  {
    icon:   GraduationCap,
    title:  'Academic Support',
    sub:    'Study skills, assignment guidance',
    avail:  'Mon–Fri 9AM–5PM',
    link:   'Book Session →',
  },
  {
    icon:   Users,
    title:  'Student Services',
    sub:    'Wellbeing, accommodation, finance',
    avail:  'Drop-in or appointment',
    link:   'Contact →',
  },
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
          const active = page === 'resources';
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

export default function Resources({ onBackToHome, onNavigate }: ResourcesProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            <span className="text-sm font-semibold text-slate-700">Resources</span>
          </div>

          {/* Course header strip */}
          <div className="px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(130deg, #1E1B4B 0%, #3730A3 100%)' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              RESOURCES · CTEC1704D_2025_604
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
          <div className="px-6 lg:px-8 py-6 space-y-8 pb-12">

            {/* ── SECTION 1: E-Library ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Library className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
                </div>
                <h2 className="text-base font-bold text-slate-800">E-Library Access</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ELIBRARY.map(({ icon: Icon, title, sub, tag, link }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 group"
                    style={{ borderTop: '3px solid #0d8a7a' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-teal-600" strokeWidth={1.8} />
                    </div>
                    <p className="text-[14px] font-bold text-slate-900 mb-1 leading-snug">{title}</p>
                    <p className="text-xs text-slate-500 mb-3">{sub}</p>
                    <span className="inline-flex text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 mb-4">
                      {tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-150 group-hover:gap-3" style={{ color: '#0d8a7a' }}>
                      {link}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 2: External Resources ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Link className="w-4 h-4 text-blue-600" strokeWidth={1.8} />
                </div>
                <h2 className="text-base font-bold text-slate-800">External Resources</h2>
              </div>

              <div className="space-y-3">
                {EXTERNAL.map(({ title, domain, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md cursor-pointer transition-all duration-200 group"
                    style={{ borderLeft: '3px solid #3b82f6' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 mb-0.5">{title}</p>
                      <p className="text-[11px] text-blue-500 font-medium mb-1">{domain}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                    <button
                      className="flex items-center gap-1.5 text-sm font-semibold shrink-0 cursor-pointer transition-all duration-150 group-hover:gap-2"
                      style={{ color: '#3b82f6' }}
                    >
                      Open
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 3: Help and Support ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-amber-600" strokeWidth={1.8} />
                </div>
                <h2 className="text-base font-bold text-slate-800">Help and Support</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SUPPORT.map(({ icon: Icon, title, sub, avail, link }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 group"
                    style={{ borderTop: '3px solid #f59e0b' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-amber-600" strokeWidth={1.8} />
                    </div>
                    <p className="text-[14px] font-bold text-slate-900 mb-1">{title}</p>
                    <p className="text-xs text-slate-500 mb-2 leading-relaxed">{sub}</p>
                    <p className="text-[11px] font-semibold text-amber-600 mb-4">{avail}</p>
                    <button
                      className="text-sm font-semibold cursor-pointer hover:underline underline-offset-2 transition-colors"
                      style={{ color: '#d97706' }}
                    >
                      {link}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
