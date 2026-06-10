import { useState, useEffect } from 'react';
import {
  GraduationCap, Search, Bell, ArrowRight, CheckCircle2,
  Globe, Mountain, Building2, CalendarDays, Library, Headphones,
  Users, Megaphone, Calendar, ExternalLink, ChevronRight,
  Network,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNotifications } from '../context/NotificationContext';
import { AvatarDropdown } from '../components/AvatarDropdown';
import { TIMELINE } from '../data/courses';
import type { CoursePageNav } from '../App';

interface HomeProps {
  onEnterCourse:      () => void;
  onContinueLearning: () => void;
  onViewCourse:       (block: number) => void;
  onNavigate:         (page: CoursePageNav) => void;
  onLogout:           () => void;
}

// ─── Static data ────────────────────────────────────────────────────────────
// Static page content used to render the dashboard-like landing homepage.

const NAV_LINKS = ['My Courses', 'Calendar', 'Library', 'Support'] as const;

const ANNOUNCEMENTS = [
  // Announcement cards shown in the home page feed.
  {
    tag: 'DMU WIDE', tagColor: '#7c3aed', tagBg: '#f5f3ff',
    title: 'DMU Support Fund — Applications Close June 12',
    preview: 'Have you applied to the DMU Support Fund yet? The fund closes Friday 12th June at 5pm...',
    time: 'Wed, 3 June · 2:08 PM', unread: true,
  },
  {
    tag: 'DUBAI CAMPUS', tagColor: '#0369a1', tagBg: '#f0f9ff',
    title: 'Block 4 Exam Schedule Released',
    preview: 'The examination timetable for Block 4 has been published. Please review your assigned slots...',
    time: 'Mon, 1 June', unread: true,
  },
  {
    tag: 'STUDENT SERVICES', tagColor: '#047857', tagBg: '#f0fdf4',
    title: 'Request for Professional Certifications Evidence',
    preview: 'Students are requested to submit evidence of professional certifications and micro-credentials...',
    time: '24 May', unread: false,
  },
];

const COMMUNITIES = [
  { icon: Globe,        name: 'Dubai Community',    sub: '342 members',                color: '#0369a1', bg: '#e0f2fe' },
  { icon: Mountain,     name: 'BaseCamp',            sub: 'First year orientation hub', color: '#059669', bg: '#d1fae5' },
  { icon: Building2,    name: 'Faculty of Tech',     sub: 'Arts & Culture 2023/27',     color: '#7c3aed', bg: '#ede9fe' },
  { icon: CalendarDays, name: 'Pre-Induction 25/26', sub: 'Orientation resources',       color: '#d97706', bg: '#fef3c7' },
];

const CALENDAR_EVENTS = [
  { day: '29', month: 'May', event: 'Phase Test 2',               chip: 'Assessment', chipColor: '#dc2626', chipBg: '#fef2f2' },
  { day: '12', month: 'Jun', event: 'Block 4 Exams Close',        chip: 'Deadline',   chipColor: '#d97706', chipBg: '#fffbeb' },
  { day: '20', month: 'Jun', event: 'Summer Break Begins',        chip: 'Term Date',  chipColor: '#0369a1', chipBg: '#eff6ff' },
  { day: '01', month: 'Sep', event: 'Academic Year 2026/27',      chip: 'Term Date',  chipColor: '#0369a1', chipBg: '#eff6ff' },
];

const QUICK_LINKS = [
  { icon: Library,      label: 'Library',          color: '#7c3aed', bg: '#ede9fe' },
  { icon: Headphones,   label: 'IT Support',       color: '#0369a1', bg: '#e0f2fe' },
  { icon: GraduationCap,label: 'Academic Support', color: '#059669', bg: '#d1fae5' },
  { icon: Building2,    label: 'MyDMU',            color: '#d97706', bg: '#fef3c7' },
];

const ACTIVE_RING_R = 48;
const ACTIVE_RING_C = 2 * Math.PI * ACTIVE_RING_R;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home({ onEnterCourse, onContinueLearning, onViewCourse, onNavigate, onLogout }: HomeProps) {
  // Delay used to animate in the hero section once the page mounts.
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const { unreadCount, openDrawer } = useNotifications();

  function handleNavLink(link: typeof NAV_LINKS[number]) {
    if (link === 'My Courses') return onNavigate('dashboard');
    if (link === 'Library') return onNavigate('resources');
    return onNavigate('notifications');
  }

  function handleQuickLink(label: string) {
    if (label === 'Library' || label === 'MyDMU') return onNavigate('resources');
    return onNavigate('notifications');
  }

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  // The page layout is divided into header, hero, and summary sections.

  return (
    <div
      className="min-h-screen"
      style={{ background: '#f4f2ee', fontFamily: 'Inter, system-ui, sans-serif' }}
    >

      {/* ══════════════════════════════════════════════════════════
          TOP NAVIGATION
      ══════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80"
        // Sticky top nav maintains access to search and notifications.
        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-16 flex items-center gap-5">

          {/* Logo — click scrolls to top (home) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer transition-opacity hover:opacity-75 active:opacity-50"
            aria-label="Go to home"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#0d8a7a' }}
            >
              <GraduationCap className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="font-bold text-slate-900 text-[15px] tracking-tight">LearningZone</span>
          </button>

          <div className="w-px h-5 bg-slate-200 shrink-0" />

          {/* Centre nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => handleNavLink(link)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
                  link === 'My Courses'
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                )}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-60 xl:w-72 h-9 pl-9 pr-4 rounded-lg bg-slate-100 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-teal-400/25 border border-transparent focus:border-teal-300 transition-all"
              />
            </div>

            <button
              onClick={openDrawer}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 flex items-center justify-center text-white font-bold leading-none"
                  style={{
                    minWidth:     unreadCount > 9 ? 18 : 14,
                    height:       14,
                    fontSize:     9,
                    background:   '#EF4444',
                    borderRadius: 999,
                    paddingLeft:  unreadCount > 9 ? 3 : 0,
                    paddingRight: unreadCount > 9 ? 3 : 0,
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AvatarDropdown onNavigate={onNavigate} onLogout={onLogout} variant="topnav" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(140deg, #1a0a2e 0%, #2d1b69 38%, #0d3b38 78%, #0a5f53 100%)',
          minHeight: 200,
        }}
      >
        {/* Texture + blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-dots" width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.9" fill="white" />
                <circle cx="24" cy="24" r="0.5" fill="white" />
                <circle cx="44" cy="8" r="0.6" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
          <div
            className="absolute -top-20 right-1/4 w-[420px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-10 w-72 h-56 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(13,138,122,0.2), transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-[35%] w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)' }}
          />
          {/* Knowledge-network illustration — academic theme, right panel */}
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0"
            style={{
              width: '52%',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 22%, black 48%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 22%, black 48%)',
            }}
          >
            <svg
              viewBox="0 0 500 240"
              preserveAspectRatio="xMaxYMid slice"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Low-poly facets */}
              <polygon points="250,40 340,20 320,90"  fill="rgba(167,139,250,0.07)" />
              <polygon points="320,90 400,60 380,140" fill="rgba(94,234,212,0.06)" />
              <polygon points="320,90 380,140 300,170" fill="rgba(139,92,246,0.05)" />
              <polygon points="400,60 470,90 460,160" fill="rgba(52,211,153,0.06)" />

              {/* Connection lines */}
              <line x1="320" y1="110" x2="230" y2="60"  stroke="rgba(196,181,253,0.25)" strokeWidth="1.3" />
              <line x1="320" y1="110" x2="420" y2="70"  stroke="rgba(94,234,212,0.25)"  strokeWidth="1.3" />
              <line x1="320" y1="110" x2="430" y2="170" stroke="rgba(110,231,183,0.22)" strokeWidth="1.3" />
              <line x1="320" y1="110" x2="250" y2="180" stroke="rgba(196,181,253,0.2)"  strokeWidth="1.2" />
              <line x1="420" y1="70"  x2="470" y2="30"  stroke="rgba(94,234,212,0.18)"  strokeWidth="1" />
              <line x1="430" y1="170" x2="480" y2="200" stroke="rgba(110,231,183,0.18)" strokeWidth="1" />
              <line x1="230" y1="60"  x2="180" y2="30"  stroke="rgba(196,181,253,0.16)" strokeWidth="1" />
              <line x1="250" y1="180" x2="200" y2="210" stroke="rgba(196,181,253,0.16)" strokeWidth="1" />

              {/* Small satellite nodes */}
              <circle cx="470" cy="30"  r="3.5" fill="rgba(94,234,212,0.4)"  stroke="rgba(94,234,212,0.6)"  strokeWidth="1" />
              <circle cx="480" cy="200" r="3.5" fill="rgba(110,231,183,0.4)" stroke="rgba(110,231,183,0.6)" strokeWidth="1" />
              <circle cx="180" cy="30"  r="3.5" fill="rgba(196,181,253,0.4)" stroke="rgba(196,181,253,0.6)" strokeWidth="1" />
              <circle cx="200" cy="210" r="3.5" fill="rgba(196,181,253,0.4)" stroke="rgba(196,181,253,0.6)" strokeWidth="1" />
              <circle cx="430" cy="170" r="6"   fill="rgba(110,231,183,0.28)" stroke="rgba(110,231,183,0.5)" strokeWidth="1.2" />

              {/* Secondary nodes */}
              <circle cx="230" cy="60" r="5" fill="rgba(94,234,212,0.32)"  stroke="rgba(94,234,212,0.55)"  strokeWidth="1.2" />
              <circle cx="420" cy="70" r="5" fill="rgba(167,139,250,0.28)" stroke="rgba(196,181,253,0.5)" strokeWidth="1.2" />

              {/* Central hub — graduation cap */}
              <circle cx="320" cy="110" r="30" fill="none" stroke="rgba(196,181,253,0.08)" strokeWidth="10" />
              <circle cx="320" cy="110" r="20" fill="rgba(99,102,241,0.22)" stroke="rgba(196,181,253,0.45)" strokeWidth="1.5" />
              <g transform="translate(309.8,99.8) scale(0.85)" fill="none" stroke="rgba(233,229,255,0.92)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.17a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </g>
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            {/* Left */}
            <div
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? 'translateY(0)' : 'translateY(-12px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-[11px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: '#a78bfa' }}
                >
                  Academic Year 2025/26 · Block 4 of 4
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-tight mb-3 tracking-tight">
                Welcome back, Danish.
              </h1>
              <p className="text-purple-200/75 text-base sm:text-lg leading-relaxed max-w-lg">
                You are in your{' '}
                <span className="font-semibold" style={{ color: '#fbbf24' }}>final block of the year.</span>
                {' '}One active module, 3 completed. Keep going.
              </p>
            </div>

            {/* Right stat chips */}
            <div
              className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? 'translateX(0)' : 'translateX(16px)',
                transition: 'opacity 0.7s ease 0.12s, transform 0.7s ease 0.12s',
              }}
            >
              {[
                { label: '4 Blocks This Year', dot: '#a78bfa' },
                { label: '3 Completed',         dot: '#34d399' },
                { label: '1 Active Now',         dot: '#fbbf24' },
              ].map(({ label, dot }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
                  <span className="text-sm font-semibold text-white whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8 lg:py-10 space-y-8 lg:space-y-10">

        {/* ── SECTION 2: ACTIVE COURSE ──────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-slate-500">Active Now</span>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'linear-gradient(130deg, #0d1b2a 0%, #1a2744 55%, #0d3b38 100%)',
              boxShadow: '0 20px 60px -10px rgba(13,59,56,0.5)',
            }}
          >
            {/* Card texture */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.035 }}>
                <defs>
                  <pattern id="card-dots" width="22" height="22" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.8" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#card-dots)" />
              </svg>
              <div
                className="absolute -top-20 -right-16 w-72 h-72 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(13,138,122,0.14), transparent 70%)' }}
              />
              {/* Decorative course icon */}
              <Network
                className="hidden sm:block absolute -right-10 -bottom-12 w-72 h-72"
                style={{ color: '#5eead4', opacity: 0.07 }}
                strokeWidth={0.8}
              />
            </div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">

                {/* Left */}
                <div className="flex-1 min-w-0">
                  {/* Chips */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span
                      className="text-[10px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-lg"
                      style={{
                        background: 'rgba(13,138,122,0.22)',
                        color: '#5eead4',
                        border: '1px solid rgba(13,138,122,0.3)',
                      }}
                    >
                      CTEC1704D_2025_604
                    </span>
                    <span
                      className="text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-lg"
                      style={{
                        background: 'rgba(239,68,68,0.18)',
                        color: '#fca5a5',
                        border: '1px solid rgba(239,68,68,0.28)',
                      }}
                    >
                      Phase Test 2 · Due Tomorrow
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-2 tracking-tight">
                    Operating Systems and Networks
                  </h2>
                  <p className="text-sm font-medium mb-7" style={{ color: 'rgba(94,234,212,0.75)' }}>
                    Prof. Muhammad Al-Ibaisi · MWF 10:00 AM
                  </p>

                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-slate-400">Course Progress</span>
                      <span className="text-sm font-extrabold text-white">67%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: ready ? '67%' : '0%',
                          background: 'linear-gradient(90deg, #0d8a7a, #34d399)',
                          boxShadow: ready ? '0 0 14px rgba(52,211,153,0.4)' : 'none',
                          transition: 'width 1.8s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
                      Week 9 of 14 · 5 weeks remaining
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={onEnterCourse}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                      style={{ background: '#0d8a7a', boxShadow: '0 6px 20px rgba(13,138,122,0.4)' }}
                    >
                      Go to Course
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onContinueLearning}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97]"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.16)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>

                {/* Right: SVG ring */}
                <div className="hidden lg:flex flex-col items-center gap-2 shrink-0">
                  <div className="relative w-28 h-28">
                    <svg
                      width="112" height="112" viewBox="0 0 112 112"
                      style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
                    >
                      <circle cx="56" cy="56" r={ACTIVE_RING_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
                      <circle
                        cx="56" cy="56" r={ACTIVE_RING_R}
                        fill="none" stroke="#0d8a7a" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={ACTIVE_RING_C}
                        strokeDashoffset={ready ? ACTIVE_RING_C * (1 - 0.67) : ACTIVE_RING_C}
                        style={{
                          transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)',
                          filter: 'drop-shadow(0 0 6px rgba(13,138,122,0.65))',
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">67%</span>
                      <span className="text-[10px] font-semibold" style={{ color: '#5eead4' }}>complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: COURSE CARDS (Academic Year timeline) ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-slate-500">
              Academic Year 2025/26
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIMELINE.map(({ block, course, grade, status, abbr, color, accentBg, icon: Icon }) => {
              const active = status === 'active';

              /* ── Active card (dark / teal) ─────────────────── */
              if (active) return (
                <div
                  key={block}
                  className="relative rounded-2xl overflow-hidden flex flex-col h-full"
                  style={{
                    background:   'linear-gradient(145deg, #0d1b2a 0%, #0d3b38 100%)',
                    border:       '1.5px solid rgba(13,138,122,0.5)',
                    boxShadow:    '0 8px 32px rgba(13,138,122,0.22)',
                  }}
                >
                  {/* Teal glow top bar */}
                  <div className="h-1" style={{ background: 'linear-gradient(90deg, #0d8a7a, #34d399)' }} />

                  {/* Decorative course icon (background) */}
                  <Icon
                    className="absolute -right-6 -bottom-8 w-44 h-44 pointer-events-none"
                    style={{ color: '#5eead4', opacity: 0.14 }}
                    strokeWidth={1}
                  />

                  <div className="relative z-10 p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-extrabold tracking-[0.18em] uppercase"
                        style={{ color: '#5eead4' }}
                      >
                        Block {block}
                      </span>
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold"
                        style={{
                          background: 'rgba(13,138,122,0.2)',
                          color:      '#5eead4',
                          border:     '1px solid rgba(94,234,212,0.18)',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
                        Active
                      </div>
                    </div>

                    {/* Course avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
                        style={{ background: 'rgba(13,138,122,0.35)', border: '1px solid rgba(94,234,212,0.2)' }}
                      >
                        {abbr}
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">{course}</h4>
                    </div>

                    {/* Grade */}
                    <div className="mb-5">
                      <p className="text-2xl font-extrabold text-white leading-none">{grade}</p>
                      <p className="text-[11px] mt-0.5 font-medium" style={{ color: 'rgba(94,234,212,0.6)' }}>
                        In Progress
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={onEnterCourse}
                        className="flex-1 py-2 text-xs font-bold text-white rounded-xl transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                        style={{ background: '#0d8a7a', boxShadow: '0 4px 14px rgba(13,138,122,0.38)' }}
                      >
                        Go to Course →
                      </button>
                    </div>
                  </div>
                </div>
              );

              /* ── Completed card (white) ─────────────────────── */
              return (
                <div
                  key={block}
                  onClick={() => onViewCourse(block)}
                  className="relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer group"
                >
                  {/* Coloured top bar */}
                  <div className="h-1 transition-opacity group-hover:opacity-90" style={{ background: color }} />

                  {/* Decorative course icon (background) */}
                  <Icon
                    className="absolute -right-6 -bottom-8 w-44 h-44 pointer-events-none transition-opacity group-hover:opacity-[0.11]"
                    style={{ color, opacity: 0.07 }}
                    strokeWidth={1}
                  />

                  <div className="relative z-10 p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-extrabold tracking-[0.18em] uppercase"
                        style={{ color }}
                      >
                        Block {block}
                      </span>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: accentBg }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color }} strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Course avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0"
                        style={{ background: accentBg, color }}
                      >
                        {abbr}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug">{course}</h4>
                    </div>

                    {/* Grade + completed badge */}
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <p className="text-2xl font-extrabold leading-none" style={{ color }}>
                          {grade}
                        </p>
                        <p className="text-[11px] mt-0.5 text-slate-400 font-medium">Final Grade</p>
                      </div>
                      <span
                        className="text-[9px] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                        style={{ background: accentBg, color }}
                      >
                        Completed
                      </span>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewCourse(block); }}
                      className="mt-auto w-full py-2 text-xs font-semibold rounded-xl transition-colors duration-150 cursor-pointer"
                      style={{
                        background: accentBg,
                        color,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.93)')}
                      onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                    >
                      View Course →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: TWO-COLUMN LAYOUT ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── LEFT (2/3) ─────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* University Announcements */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-800">University Announcements</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 ml-auto">
                  2 unread
                </span>
              </div>

              <div className="divide-y divide-slate-50">
                {ANNOUNCEMENTS.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer group hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="mt-2 shrink-0 w-2">
                      {a.unread && <span className="w-2 h-2 rounded-full bg-teal-500 block" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className="text-[9px] font-extrabold tracking-[0.14em] uppercase px-2 py-0.5 rounded"
                          style={{ background: a.tagBg, color: a.tagColor }}
                        >
                          {a.tag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{a.time}</span>
                      </div>
                      <p className={cn(
                        'text-sm font-semibold leading-snug mb-1',
                        a.unread ? 'text-slate-900' : 'text-slate-600'
                      )}>
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{a.preview}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-1 transition-colors" />
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('notifications')}
                className="mt-4 w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-600 cursor-pointer transition-colors border border-dashed border-slate-200 hover:border-teal-300 rounded-xl"
              >
                View All Announcements
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* My Communities */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-800">My Communities</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {COMMUNITIES.map(({ icon: Icon, name, sub, color, bg }) => (
                  <button
                    key={name}
                    onClick={() => onNavigate('notifications')}
                    className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all duration-150 text-left group w-full min-h-[100px]"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
                      <span
                        className="text-[10px] font-semibold mt-1.5 inline-block transition-colors group-hover:text-teal-600"
                        style={{ color: '#94a3b8' }}
                      >
                        View →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT (1/3) ────────────────────── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Academic Calendar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-800">Academic Calendar</h3>
              </div>

              <div className="space-y-2">
                {CALENDAR_EVENTS.map(({ day, month, event, chip, chipColor, chipBg }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div
                      className="flex flex-col items-center justify-center w-12 h-[52px] rounded-xl shrink-0 text-white"
                      style={{ background: 'linear-gradient(135deg, #334155, #1e293b)' }}
                    >
                      <span className="text-[9px] font-extrabold uppercase tracking-wider leading-none">{month}</span>
                      <span className="text-xl font-extrabold leading-tight">{day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event}</p>
                      <span
                        className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: chipBg, color: chipColor }}
                      >
                        {chip}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('notifications')}
                className="mt-4 w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-600 cursor-pointer transition-colors border border-dashed border-slate-200 hover:border-teal-300 rounded-xl"
              >
                View Full Calendar
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-800">Quick Links</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {QUICK_LINKS.map(({ icon: Icon, label, color, bg }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickLink(label)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all duration-150 group text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.8} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
