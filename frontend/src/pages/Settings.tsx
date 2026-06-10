import { useState } from 'react';
import {
  Bell, Megaphone, Award, Clock, Mail,
  Palette, ShieldCheck, Eye, Activity,
  Download, LogOut,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { cn } from '../lib/utils';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SettingsProps {
  onBack:     () => void;
  onNavigate: (page: CoursePageNav) => void;
  onLogout:   () => void;
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="relative w-11 h-6 rounded-full shrink-0 cursor-pointer transition-colors duration-200"
      style={{ background: checked ? '#0d8a7a' : '#e2e8f0' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({
  icon: Icon, title, description, checked, onChange,
}: {
  icon:        React.ElementType;
  title:       string;
  description: string;
  checked:     boolean;
  onChange:    () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
        </div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const THEMES = ['Light', 'Dark', 'System'] as const;

export default function Settings({ onBack, onNavigate, onLogout }: SettingsProps) {
  // Notification preferences
  const [courseAlerts,   setCourseAlerts]   = useState(true);
  const [uniAnnouncements, setUniAnnouncements] = useState(true);
  const [gradeReleases,  setGradeReleases]  = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Appearance
  const [theme, setTheme] = useState<typeof THEMES[number]>('Light');
  const [compactMode, setCompactMode] = useState(false);

  // Privacy
  const [showProfile, setShowProfile] = useState(true);
  const [activityStatus, setActivityStatus] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="student" activePage="settings" onNavigate={onNavigate} onBack={onBack} onLogout={onLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Page header */}
          <div className="px-6 lg:px-8 py-6 border-b bg-white" style={{ borderColor: '#E8E8E4' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: '#9CA3AF' }}>
              STUDENT PORTAL
            </p>
            <h1 className="text-[28px] font-bold leading-tight" style={{ color: '#1A1A1A' }}>
              Settings
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-8 py-6 pb-12">
            <div className="max-w-[720px] mx-auto space-y-6">

              {/* SECTION 1: Notification Preferences */}
              <SectionCard icon={Bell} title="Notification Preferences">
                <div className="divide-y divide-slate-50">
                  <ToggleRow
                    icon={Bell}
                    title="Course Alerts"
                    description="Lectures, labs and assignment updates"
                    checked={courseAlerts}
                    onChange={() => setCourseAlerts((v) => !v)}
                  />
                  <ToggleRow
                    icon={Megaphone}
                    title="University Announcements"
                    description="DMU-wide news and campus updates"
                    checked={uniAnnouncements}
                    onChange={() => setUniAnnouncements((v) => !v)}
                  />
                  <ToggleRow
                    icon={Award}
                    title="Grade Releases"
                    description="Notify when results are published"
                    checked={gradeReleases}
                    onChange={() => setGradeReleases((v) => !v)}
                  />
                  <ToggleRow
                    icon={Clock}
                    title="Deadline Reminders"
                    description="Reminders 24h and 1h before due dates"
                    checked={deadlineReminders}
                    onChange={() => setDeadlineReminders((v) => !v)}
                  />
                  <ToggleRow
                    icon={Mail}
                    title="Email Notifications"
                    description="Receive notifications at danish.saini@my.dmu.ac.uk"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications((v) => !v)}
                  />
                </div>
              </SectionCard>

              {/* SECTION 2: Appearance */}
              <SectionCard icon={Palette} title="Appearance">
                <div className="divide-y divide-slate-50">
                  <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Theme</p>
                      <p className="text-xs text-slate-500 mt-0.5">Choose how LearningZone looks to you</p>
                    </div>
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 gap-1 shrink-0">
                      {THEMES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={cn(
                            'px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150',
                            theme === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <ToggleRow
                    icon={Palette}
                    title="Compact Mode"
                    description="Reduce spacing for more content"
                    checked={compactMode}
                    onChange={() => setCompactMode((v) => !v)}
                  />
                </div>
              </SectionCard>

              {/* SECTION 3: Privacy */}
              <SectionCard icon={ShieldCheck} title="Privacy">
                <div className="divide-y divide-slate-50">
                  <ToggleRow
                    icon={Eye}
                    title="Show Profile to Classmates"
                    description="Allow classmates to see your name and course details"
                    checked={showProfile}
                    onChange={() => setShowProfile((v) => !v)}
                  />
                  <ToggleRow
                    icon={Activity}
                    title="Activity Status"
                    description="Show when you were last active"
                    checked={activityStatus}
                    onChange={() => setActivityStatus((v) => !v)}
                  />
                </div>
              </SectionCard>

              {/* SECTION 4: Account */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Account</h2>
                </div>

                <div className="divide-y divide-slate-50">
                  <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Download className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Export My Data</p>
                        <p className="text-xs text-slate-500 mt-0.5">Download all your course data and grades</p>
                      </div>
                    </div>
                    <button
                      className="text-sm font-semibold cursor-pointer hover:underline underline-offset-2 shrink-0"
                      style={{ color: '#0d8a7a' }}
                    >
                      Export →
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <LogOut className="w-4 h-4 text-red-500" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-500">Sign Out</p>
                        <p className="text-xs text-slate-500 mt-0.5">Sign out of LearningZone on this device</p>
                      </div>
                    </div>
                    <button
                      onClick={onLogout}
                      className="text-sm font-semibold cursor-pointer hover:underline underline-offset-2 shrink-0 text-red-500"
                    >
                      Sign Out →
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
