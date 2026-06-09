import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, GraduationCap, User, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

interface LoginProps {
  onSuccess: (userId: string) => void;
}

// Valid student ID format: P followed by 7 digits.
const STUDENT_ID_REGEX = /^P\d{7}$/;

export default function Login({ onSuccess }: LoginProps) {
  // Local state for the login form inputs and validation.
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [idError, setIdError] = useState('');
  const studentIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    studentIdRef.current?.focus();
  }, []);

  function handleStudentIdChange(val: string) {
    const upper = val.toUpperCase();
    setStudentId(upper);
    // Validate student ID as the user types.
    if (upper && !upper.startsWith('P')) {
      setIdError('Student ID must start with P');
    } else if (upper.length === 8 && !STUDENT_ID_REGEX.test(upper)) {
      setIdError('Format: P followed by 7 digits (e.g. P2936821)');
    } else {
      setIdError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!STUDENT_ID_REGEX.test(studentId)) {
      setIdError('Format: P followed by 7 digits (e.g. P2936821)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Call backend login and save the returned token/user data.
      const res = await api.login(studentId, password);
      localStorage.setItem('lz_token', res.token);
      localStorage.setItem('lz_user', JSON.stringify(res.user));
      onSuccess(res.user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d3b38 0%, #0a2e2b 40%, #061a18 100%)' }}
      >
        {/* Building silhouette overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines to suggest architecture */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Glow blobs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(20,180,150,0.12) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(20,160,130,0.08) 0%, transparent 70%)' }} />

          {/* Faux building columns */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-3 px-8 opacity-10">
            {[200, 280, 240, 320, 200, 260, 180].map((h, i) => (
              <div key={i} className="bg-white rounded-t-sm flex-1" style={{ height: h }} />
            ))}
          </div>
        </div>

        {/* Top — logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.8} />
            <span className="text-white font-bold text-xl tracking-tight">LearningZone</span>
          </div>
        </div>

        {/* Middle — headline */}
        <div className="relative z-10 px-10 pb-10">
          <h1 className="text-4xl font-bold text-white leading-[1.15] mb-4">
            Elevate Your Academic<br />Journey.
          </h1>
          <p className="text-[#8ab8b4] text-[15px] leading-relaxed max-w-[300px]">
            Access your course materials, grades, and resources in one unified command center designed for student success.
          </p>
        </div>

        {/* Bottom — security badge */}
        <div className="relative z-10 px-10 pb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
              <ShieldCheck className="w-5 h-5 text-[#6de0d0]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-white text-xs font-semibold tracking-widest uppercase">DMU Secure Login</p>
              <p className="text-[#8ab8b4] text-xs">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between bg-white px-8 py-10 lg:px-14 lg:py-12">

        {/* Top spacer / mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <GraduationCap className="w-6 h-6 text-[#0d3b38]" />
          <span className="font-bold text-[#0d3b38] text-lg">LearningZone</span>
        </div>

        {/* Form section — vertically centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[380px]">

            <h2 className="text-[28px] font-bold text-gray-900 leading-tight mb-1">
              Welcome to LearningZone
            </h2>
            <p className="text-slate-500 text-sm mb-8">Sign in to your DMU student account.</p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Student ID */}
              <div>
                <label htmlFor="studentId"
                  className="block text-[11px] font-bold tracking-widest uppercase mb-2"
                  style={{ color: '#6d28d9' }}
                >
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    ref={studentIdRef}
                    id="studentId"
                    type="text"
                    value={studentId}
                    onChange={(e) => handleStudentIdChange(e.target.value)}
                    placeholder="e.g., P1234567"
                    maxLength={8}
                    autoComplete="username"
                    spellCheck={false}
                    className={cn(
                      'w-full h-11 pl-10 pr-4 rounded-lg border text-gray-900 text-sm font-mono tracking-widest bg-white',
                      'placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400',
                      'outline-none transition-all duration-150',
                      idError
                        ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                        : 'border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 hover:border-violet-400'
                    )}
                  />
                </div>
                {idError && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {idError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password"
                  className="block text-[11px] font-bold tracking-widest uppercase mb-2"
                  style={{ color: '#6d28d9' }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={cn(
                      'w-full h-11 pl-10 pr-11 rounded-lg border text-gray-900 text-sm bg-white',
                      'outline-none transition-all duration-150',
                      'border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 hover:border-violet-400'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-violet-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold transition-colors"
                  style={{ color: '#0d8a7a' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0a6e61')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#0d8a7a')}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Global error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !studentId || !password}
                className={cn(
                  'w-full h-11 rounded-lg font-semibold text-sm text-white',
                  'flex items-center justify-center gap-2',
                  'transition-all duration-150 active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
                )}
                style={{ background: loading || !studentId || !password ? '#4a7a76' : '#0d3b38' }}
                onMouseEnter={(e) => {
                  if (!loading && studentId && password)
                    (e.currentTarget as HTMLButtonElement).style.background = '#0a2e2b';
                }}
                onMouseLeave={(e) => {
                  if (!loading && studentId && password)
                    (e.currentTarget as HTMLButtonElement).style.background = '#0d3b38';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Support text */}
            <p className="mt-6 text-sm text-slate-500 text-center">
              New to DMU?{' '}
              <button
                type="button"
                className="font-semibold underline-offset-2 hover:underline transition-colors"
                style={{ color: '#0d8a7a' }}
              >
                Contact IT Support
              </button>{' '}
              for your login credentials.
            </p>

          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((link) => (
            <button
              key={link}
              type="button"
              className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 hover:text-slate-600 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
