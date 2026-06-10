import {
  ChevronRight, Database, Library,
  BookOpen, ExternalLink, Headphones,
  HelpCircle, Users, Link,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ResourcesProps {
  onLogout?:  () => void;
  onBack:     () => void;
  onHome?:    () => void;
  onNavigate: (page: CoursePageNav) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Resource cards and support links for the course resources page.

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
    desc:   "Free lecture notes from MIT's 6.828 Operating Systems course.",
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
    icon:   Users,
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Resources({ onBack, onHome, onNavigate }: ResourcesProps) {
  function showUnavailable(action: string) {
    window.alert(`${action} is not available in this preview.`);
  }

  // Render the resources page with course nav and external resource cards.
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="course" activePage="resources" onNavigate={onNavigate} onBack={onBack} onHome={onHome} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Course header strip */}
          {/* Header identifies current course context for the resources page. */}
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
            <span
              onClick={onBack}
              className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
            >
              CTEC1704D
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold" style={{ color: '#0d8a7a' }}>Resources</span>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-8 py-6 space-y-8 pb-12">

            {/* ── SECTION 1: E-Library ── */}
            {/* Official library services available to students. */}
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
                    onClick={() => showUnavailable(title)}
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
            {/* Curated external links for deeper study. */}
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
                      onClick={() => showUnavailable(title)}
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
                      onClick={() => showUnavailable(link)}
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
