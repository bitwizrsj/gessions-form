import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, FileText, BarChart2, Shield, Users, ArrowRight, Mail, KeyRound, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

/* SVG icons not in lucide */
const GitBranch = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

/* ── Feature bullets ── */
const FEATURES = [
  { icon: FileText,  label: 'Powerful Form Builder' },
  { icon: GitBranch, label: 'Approval Workflows' },
  { icon: BarChart2, label: 'Real-time Analytics' },
  { icon: Users,     label: 'Team & Department Management' },
  { icon: Shield,    label: 'Enterprise-Grade Security' },
];

/* Microsoft logo */
const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

/* Google logo */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* Neutral asterisk logo mark */
const AsteriskLogo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line x1="14" y1="2" x2="14" y2="26" stroke="#5C4A3E" strokeWidth="4" strokeLinecap="round" />
    <line x1="2" y1="8" x2="26" y2="20" stroke="#5C4A3E" strokeWidth="4" strokeLinecap="round" />
    <line x1="26" y1="8" x2="2" y2="20" stroke="#5C4A3E" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/* Large decorative asterisk */
const BigAsterisk = () => (
  <svg width="260" height="260" viewBox="0 0 260 260" fill="none" style={{ opacity: 0.35 }}>
    <line x1="130" y1="10" x2="130" y2="250" stroke="#D3C7B6" strokeWidth="38" strokeLinecap="round" />
    <line x1="10" y1="75" x2="250" y2="185" stroke="#D3C7B6" strokeWidth="38" strokeLinecap="round" />
    <line x1="250" y1="75" x2="10" y2="185" stroke="#D3C7B6" strokeWidth="38" strokeLinecap="round" />
  </svg>
);

const LoginPage: React.FC = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(true);
  const [loading, setLoading]           = useState(false);

  const [showForgot, setShowForgot]     = useState(false);
  const [forgotEmail, setForgotEmail]   = useState('');
  const [forgotSent, setForgotSent]     = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlError = params.get('error');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      const ret = localStorage.getItem('returnUrl');
      if (ret) { localStorage.removeItem('returnUrl'); window.location.assign(ret); }
      else      { window.location.assign('/ai-chat'); }
    } else if (urlError) {
      console.error('Login error from URL:', urlError);
    }
    if (user && !urlToken) {
      const ret = localStorage.getItem('returnUrl');
      if (ret) { localStorage.removeItem('returnUrl'); navigate(ret, { replace: true }); }
      else      { navigate('/ai-chat', { replace: true }); }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        const ret = localStorage.getItem('returnUrl');
        if (ret) { localStorage.removeItem('returnUrl'); navigate(ret, { replace: true }); }
        else      { navigate('/ai-chat', { replace: true }); }
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    try {
      await authAPI.forgotPassword(forgotEmail.trim());
      setForgotSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF6EE' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3" style={{ borderColor: '#E8601C' }} />
          <p className="text-sm text-stone-400">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen flex"
        style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#FDF6EE' }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden lg:flex flex-col"
          style={{
            flex: '0 0 52%',
            background: '#FAF7F2',
            padding: '0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top nav bar */}
          <div className="flex items-center gap-2.5 px-10 pt-8 relative z-10">
            <AsteriskLogo size={26} />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#2C2520', letterSpacing: '-0.3px' }}>
              Forms by Gessions
            </span>
          </div>

          {/* Big decorative asterisk — top right */}
          <div style={{ position: 'absolute', top: -20, right: -40, zIndex: 1, pointerEvents: 'none' }}>
            <BigAsterisk />
          </div>

          {/* Hero text */}
          <div className="px-10 mt-16 relative z-10">
            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.08, color: '#2C2520', letterSpacing: '-1.5px', marginBottom: 16 }}>
              Beyond Forms.<br />Into Workflows.
            </h1>
            <p style={{ fontSize: 15, color: '#786E64', lineHeight: 1.6, maxWidth: 380, marginBottom: 36 }}>
              Create forms, collect responses, automate approvals,<br />
              and manage your organization's data — all in one place.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3.5">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: '#F5EFE6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color="#5C4A3E" />
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: '#2C2520' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration — building scene placeholder rendered with CSS */}
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 220,
              background: 'linear-gradient(to top, rgba(232,96,28,0.08) 0%, transparent 100%)',
              borderTop: '1px solid rgba(232,96,28,0.10)',
            }}
          >
            {/* Minimal illustrated silhouette strip */}
            <svg viewBox="0 0 600 200" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
              {/* Sky tint trees */}
              <ellipse cx="60" cy="140" rx="45" ry="55" fill="#E8A87C" opacity="0.5" />
              <ellipse cx="100" cy="130" rx="38" ry="48" fill="#D4784A" opacity="0.45" />
              <ellipse cx="510" cy="135" rx="50" ry="58" fill="#E8A87C" opacity="0.5" />
              <ellipse cx="560" cy="125" rx="40" ry="50" fill="#D4784A" opacity="0.4" />
              {/* Building */}
              <rect x="200" y="60" width="200" height="130" rx="2" fill="#f5f0e8" stroke="#d6cfc5" strokeWidth="1" />
              <rect x="240" y="40" width="30" height="22" rx="1" fill="#f0ebe0" stroke="#d6cfc5" strokeWidth="1" />
              {/* Tower */}
              <rect x="270" y="28" width="8" height="15" fill="#d6cfc5" />
              {/* Windows */}
              {[220,255,290,325,360].map(x => [80,110,140].map(y => (
                <rect key={`${x}-${y}`} x={x} y={y} width="18" height="20" rx="1" fill="#c8dff5" opacity="0.7" />
              )))}
              {/* Ground */}
              <rect x="0" y="188" width="600" height="12" fill="#c8b89a" opacity="0.4" />
              {/* Silhouette people */}
              {[140, 165, 420, 450, 475].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={170} r={5} fill="#2a2a2a" opacity="0.65" />
                  <rect x={x - 4} y={175} width={8} height={14} rx="2" fill="#2a2a2a" opacity="0.65" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="flex-1 flex flex-col"
          style={{ background: '#fff', boxShadow: '-2px 0 24px rgba(0,0,0,0.06)' }}
        >
          {/* Top right nav */}
          <div className="flex items-center justify-end px-10 pt-7 pb-2">
            <span style={{ fontSize: 13.5, color: '#786E64' }}>New to Forms by Gessions?&nbsp;</span>
            <Link
              to="/register"
              style={{ fontSize: 13.5, fontWeight: 700, color: '#5C4A3E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Create an account <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card */}
          <div className="flex-1 flex items-center justify-center px-8 py-10">
            <div style={{ width: '100%', maxWidth: 400 }}>

              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2 mb-8">
                <AsteriskLogo size={22} />
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Forms by Gessions</span>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: 6 }}>
                Sign in to Forms by Gessions
              </h2>
              <p style={{ fontSize: 13.5, color: '#888', marginBottom: 24 }}>
                Access your forms, workflows, and organization workspace.
              </p>

              {/* OAuth buttons */}
              <button
                type="button"
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                  window.location.href = `${apiUrl}/auth/google/login`;
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '10px 0', fontSize: 14, fontWeight: 600,
                  color: '#2a2a2a', background: '#fff', border: '1.5px solid #e0e0e0',
                  borderRadius: 10, cursor: 'pointer', marginBottom: 10,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8f8f8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <GoogleIcon /> Continue with Google
              </button>

              <button
                type="button"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '10px 0', fontSize: 14, fontWeight: 600,
                  color: '#2a2a2a', background: '#fff', border: '1.5px solid #e0e0e0',
                  borderRadius: 10, cursor: 'pointer', marginBottom: 18,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8f8f8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <MicrosoftIcon /> Continue with Microsoft
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 1, background: '#ebebeb' }} />
                <span style={{ fontSize: 12.5, color: '#aaa', whiteSpace: 'nowrap' }}>or sign in with email</span>
                <div style={{ flex: 1, height: 1, background: '#ebebeb' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>
                    Email address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px 12px 10px 36px', fontSize: 14,
                        color: '#1a1a1a', background: '#fafafa',
                        border: '1.5px solid #e0e0e0', borderRadius: 10, outline: 'none',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px 40px 10px 36px', fontSize: 14,
                        color: '#1a1a1a', background: '#fafafa',
                        border: '1.5px solid #e0e0e0', borderRadius: 10, outline: 'none',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5, color: '#444' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      style={{ width: 15, height: 15, accentColor: '#5C4A3E', cursor: 'pointer' }}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setForgotSent(false); setForgotEmail(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#5C4A3E', padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '12px 0', fontSize: 15, fontWeight: 700,
                    color: '#fff', background: loading ? '#8C7769' : '#5C4A3E',
                    border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 14px rgba(92,74,62,0.25)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#cf5519'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#E8601C'; }}
                >
                  {loading
                    ? <><div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in…</>
                    : 'Sign in'
                  }
                </button>

                {/* Terms */}
                <p style={{ fontSize: 11.5, color: '#aaa', textAlign: 'center', marginTop: 2 }}>
                  By signing in, you agree to our{' '}
                  <a href="#" style={{ color: '#E8601C', textDecoration: 'none' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#E8601C', textDecoration: 'none' }}>Privacy Policy</a>.
                </p>
              </form>

              {/* Enterprise footer */}
              <div
                style={{
                  marginTop: 28, padding: '14px 16px', background: '#fdf6ee',
                  borderRadius: 12, border: '1.5px solid #f0e8dc',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(92,74,62,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C4A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      <line x1="12" y1="12" x2="12" y2="16" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>For institutions and enterprises</div>
                    <div style={{ fontSize: 12, color: '#888', lineHeight: 1.4 }}>Set up your organization, add departments, and manage at scale.</div>
                  </div>
                </div>
                <button
                  style={{
                    flexShrink: 0, padding: '8px 14px', fontSize: 12.5, fontWeight: 700,
                    color: '#1a1a1a', background: '#fff', border: '1.5px solid #e0e0e0',
                    borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  Contact Sales
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Forgot Password modal ── */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #DDD5C7', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: '100%', maxWidth: 380, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #EDE5D8', background: '#FAF7F2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#F5EFE6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <KeyRound size={15} color="#5C4A3E" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#2C2520' }}>Forgot your password?</span>
              </div>
              <button onClick={() => setShowForgot(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#786E64', padding: 4, lineHeight: 0 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              {forgotSent ? (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ width: 56, height: 56, background: '#f0faf5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Mail size={26} color="#10b981" />
                  </div>
                  <h3 style={{ fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>Check your inbox</h3>
                  <p style={{ fontSize: 13.5, color: '#777', lineHeight: 1.6 }}>
                    If an account exists for <strong>{forgotEmail}</strong>, a reset link has been sent. It expires in <strong>15 minutes</strong>.
                  </p>
                  <button
                    onClick={() => setShowForgot(false)}
                    style={{ marginTop: 20, width: '100%', padding: '11px 0', background: '#5C4A3E', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: 13.5, color: '#777', lineHeight: 1.6, marginBottom: 4 }}>
                    Enter your account email and we'll send you a password reset link.
                  </p>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>Email address</label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="you@company.com"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14, color: '#1a1a1a', background: '#fafafa', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{ width: '100%', padding: '11px 0', background: '#5C4A3E', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: forgotLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: forgotLoading ? 0.7 : 1 }}
                  >
                    {forgotLoading
                      ? <><div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending…</>
                      : <>Send Reset Link <ArrowRight size={14} /></>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default LoginPage;
