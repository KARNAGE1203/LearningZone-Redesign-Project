import { useState } from 'react';
import {
  Camera, CheckCircle2, User, Mail, GraduationCap, Lock,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { useNotifications } from '../context/NotificationContext';
import type { CoursePageNav } from '../App';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileProps {
  onBack:     () => void;
  onNavigate: (page: CoursePageNav) => void;
  onLogout:   () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Static identity stats shown on the profile identity card.

const STATS = [
  { label: 'Blocks',     value: '4'   },
  { label: 'Completed',  value: '3'   },
  { label: 'Avg Grade',  value: '74%' },
  { label: 'Active Now', value: '1'   },
];

const ACADEMIC_DETAILS = [
  { label: 'Programme',     value: 'BSc Computer Science'        },
  { label: 'Faculty',       value: 'Technology, Arts and Culture' },
  { label: 'Campus',        value: 'DMU Dubai'                    },
  { label: 'Academic Year', value: '2025/26'                      },
  { label: 'Current Block', value: 'Block 4, Summer 2026'         },
  { label: 'Student Type',  value: 'Full Time, On Campus'         },
];

// ─── Field (read / edit) ────────────────────────────────────────────────────

function Field({
  label, value, editing, onChange,
}: {
  label:    string;
  value:    string;
  editing:  boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">{label}</p>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-400/25 focus:border-teal-300 transition-all duration-150"
        />
      ) : (
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      )}
    </div>
  );
}

// ─── Section header (icon + title + edit/save/cancel) ───────────────────────

function SectionHeader({
  icon: Icon, title, editing, onEdit, onSave, onCancel, readOnly,
}: {
  icon:     React.ElementType;
  title:    string;
  editing?: boolean;
  onEdit?:    () => void;
  onSave?:    () => void;
  onCancel?:  () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
        </div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
      </div>

      {!readOnly && (
        editing ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 cursor-pointer hover:underline underline-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #0d8a7a, #14b8a6)', boxShadow: '0 3px 10px rgba(13,138,122,0.22)' }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="text-xs font-semibold cursor-pointer hover:underline underline-offset-2"
            style={{ color: '#0d8a7a' }}
          >
            Edit
          </button>
        )
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Profile({ onBack, onNavigate, onLogout }: ProfileProps) {
  const { openDrawer } = useNotifications();
  // Personal information — local edit state only, no backend persistence.
  const [personal, setPersonal] = useState({
    firstName:      'Danish',
    lastName:       'Saini',
    dob:            'March 15, 2005',
    nationality:    'Indian',
    studentId:      '2024-8842',
    enrollmentYear: '2024',
  });
  const [personalDraft, setPersonalDraft] = useState(personal);
  const [personalEditing, setPersonalEditing] = useState(false);

  // Contact details — local edit state only, no backend persistence.
  const [contact, setContact] = useState({
    email:           'danish.saini@my.dmu.ac.uk',
    phone:           '+971 50 123 4567',
    emergencyName:   'Rahul Saini (Father)',
    emergencyPhone:  '+971 55 987 6543',
  });
  const [contactDraft, setContactDraft] = useState(contact);
  const [contactEditing, setContactEditing] = useState(false);

  function startPersonalEdit() { setPersonalDraft(personal); setPersonalEditing(true); }
  function savePersonal()      { setPersonal(personalDraft); setPersonalEditing(false); }
  function cancelPersonal()    { setPersonalDraft(personal); setPersonalEditing(false); }

  function startContactEdit() { setContactDraft(contact); setContactEditing(true); }
  function saveContact()      { setContact(contactDraft); setContactEditing(false); }
  function cancelContact()    { setContactDraft(contact); setContactEditing(false); }

  function showUnavailable(action: string) {
    window.alert(`${action} is not available in this preview.`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      <Sidebar variant="student" activePage="profile" onNavigate={onNavigate} onBack={onBack} onLogout={onLogout} onHelp={openDrawer} />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">

          {/* Page header */}
          <div className="px-6 lg:px-8 py-6 border-b bg-white" style={{ borderColor: '#E8E8E4' }}>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: '#9CA3AF' }}>
              STUDENT PORTAL
            </p>
            <h1 className="text-[28px] font-bold leading-tight" style={{ color: '#1A1A1A' }}>
              Profile
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-8 py-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── LEFT: Identity card ── */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:sticky lg:top-6">

                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold mb-3"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #0d8a7a)' }}
                    >
                      DS
                    </div>
                    <button
                      onClick={() => showUnavailable('Changing your photo')}
                      className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:underline underline-offset-2"
                      style={{ color: '#0d8a7a' }}
                    >
                      <Camera className="w-3.5 h-3.5" strokeWidth={1.8} />
                      Change Photo
                    </button>

                    <h2 className="text-lg font-bold text-slate-900 mt-4">Danish Saini</h2>
                    <p className="text-sm text-slate-500 mt-1">Computer Science · Year 1</p>
                    <p className="text-xs text-slate-400 mt-1">DMU Dubai</p>
                  </div>

                  <div className="border-t border-slate-100 my-5" />

                  <div className="grid grid-cols-2 gap-3">
                    {STATS.map(({ label, value }) => (
                      <div key={label} className="text-center p-3 rounded-xl bg-slate-50">
                        <p className="text-lg font-extrabold text-slate-900">{value}</p>
                        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-slate-400 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 my-5" />

                  <p className="text-xs text-center text-slate-400">Member since September 2024</p>
                </div>
              </div>

              {/* ── RIGHT: Detail sections ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* SECTION 1: Personal Information */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <SectionHeader
                    icon={User}
                    title="Personal Information"
                    editing={personalEditing}
                    onEdit={startPersonalEdit}
                    onSave={savePersonal}
                    onCancel={cancelPersonal}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <Field
                      label="First Name"
                      value={personalEditing ? personalDraft.firstName : personal.firstName}
                      editing={personalEditing}
                      onChange={(v) => setPersonalDraft((d) => ({ ...d, firstName: v }))}
                    />
                    <Field
                      label="Last Name"
                      value={personalEditing ? personalDraft.lastName : personal.lastName}
                      editing={personalEditing}
                      onChange={(v) => setPersonalDraft((d) => ({ ...d, lastName: v }))}
                    />
                    <Field
                      label="Date of Birth"
                      value={personalEditing ? personalDraft.dob : personal.dob}
                      editing={personalEditing}
                      onChange={(v) => setPersonalDraft((d) => ({ ...d, dob: v }))}
                    />
                    <Field
                      label="Nationality"
                      value={personalEditing ? personalDraft.nationality : personal.nationality}
                      editing={personalEditing}
                      onChange={(v) => setPersonalDraft((d) => ({ ...d, nationality: v }))}
                    />
                    <Field
                      label="Student ID"
                      value={personalEditing ? personalDraft.studentId : personal.studentId}
                      editing={personalEditing}
                      onChange={(v) => setPersonalDraft((d) => ({ ...d, studentId: v }))}
                    />
                    <Field
                      label="Enrollment Year"
                      value={personalEditing ? personalDraft.enrollmentYear : personal.enrollmentYear}
                      editing={personalEditing}
                      onChange={(v) => setPersonalDraft((d) => ({ ...d, enrollmentYear: v }))}
                    />
                  </div>
                </div>

                {/* SECTION 2: Contact Details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <SectionHeader
                    icon={Mail}
                    title="Contact Details"
                    editing={contactEditing}
                    onEdit={startContactEdit}
                    onSave={saveContact}
                    onCancel={cancelContact}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">Email</p>
                      {contactEditing ? (
                        <input
                          type="email"
                          value={contactDraft.email}
                          onChange={(e) => setContactDraft((d) => ({ ...d, email: e.target.value }))}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-400/25 focus:border-teal-300 transition-all duration-150"
                        />
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800">{contact.email}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">Phone</p>
                      {contactEditing ? (
                        <input
                          type="text"
                          value={contactDraft.phone}
                          onChange={(e) => setContactDraft((d) => ({ ...d, phone: e.target.value }))}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-400/25 focus:border-teal-300 transition-all duration-150"
                        />
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800">{contact.phone}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">Emergency Contact</p>
                      {contactEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={contactDraft.emergencyName}
                            onChange={(e) => setContactDraft((d) => ({ ...d, emergencyName: e.target.value }))}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-400/25 focus:border-teal-300 transition-all duration-150"
                          />
                          <input
                            type="text"
                            value={contactDraft.emergencyPhone}
                            onChange={(e) => setContactDraft((d) => ({ ...d, emergencyPhone: e.target.value }))}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-400/25 focus:border-teal-300 transition-all duration-150"
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-slate-800">
                          {contact.emergencyName} · {contact.emergencyPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Academic Details (read-only) */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <SectionHeader icon={GraduationCap} title="Academic Details" readOnly />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-5">
                    {ACADEMIC_DETAILS.map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Active module card */}
                  <div
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: 'linear-gradient(145deg, #0d1b2a 0%, #0d3b38 100%)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
                      style={{ background: 'rgba(13,138,122,0.35)', border: '1px solid rgba(94,234,212,0.2)' }}
                    >
                      OS
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white leading-snug">Operating Systems and Networks</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(94,234,212,0.75)' }}>CTEC1704D · MWF 10:00 AM</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Security */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <SectionHeader icon={Lock} title="Security" readOnly />

                  <div className="divide-y divide-slate-50">
                    <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Change Password</p>
                        <p className="text-xs text-slate-500 mt-0.5">Last changed 3 months ago</p>
                      </div>
                      <button
                        onClick={() => showUnavailable('Changing your password')}
                        className="text-sm font-semibold cursor-pointer hover:underline underline-offset-2 shrink-0"
                        style={{ color: '#0d8a7a' }}
                      >
                        Change Password →
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500 mt-0.5">Not enabled</p>
                      </div>
                      <button
                        onClick={() => showUnavailable('Enabling two-factor authentication')}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.97] shrink-0"
                        style={{ background: 'linear-gradient(135deg, #0d8a7a, #14b8a6)', boxShadow: '0 4px 12px rgba(13,138,122,0.25)' }}
                      >
                        Enable
                      </button>
                    </div>
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
