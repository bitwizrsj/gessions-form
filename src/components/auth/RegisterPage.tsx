import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Mail, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/* ── Neutral asterisk logo ── */
const AsteriskLogo = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line x1="14" y1="2" x2="14" y2="26" stroke="#5C4A3E" strokeWidth="4" strokeLinecap="round" />
    <line x1="2" y1="8" x2="26" y2="20" stroke="#5C4A3E" strokeWidth="4" strokeLinecap="round" />
    <line x1="26" y1="8" x2="2" y2="20" stroke="#5C4A3E" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/* ── Large decorative asterisk ── */
const BigAsterisk = () => (
  <svg width="260" height="260" viewBox="0 0 260 260" fill="none" style={{ opacity: 0.35 }}>
    <line x1="130" y1="10" x2="130" y2="250" stroke="#D3C7B6" strokeWidth="38" strokeLinecap="round" />
    <line x1="10" y1="75" x2="250" y2="185" stroke="#D3C7B6" strokeWidth="38" strokeLinecap="round" />
    <line x1="250" y1="75" x2="10" y2="185" stroke="#D3C7B6" strokeWidth="38" strokeLinecap="round" />
  </svg>
);

/* ── Google icon ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ── Shared input style helpers ── */
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px 10px 36px', fontSize: 14,
  color: '#1a1a1a', background: '#fafafa',
  border: '1.5px solid #e0e0e0', borderRadius: 10, outline: 'none',
};

const RegisterPage: React.FC = () => {
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [step, setStep]                         = useState(1); // 1: details, 2: OTP
  const [otp, setOtp]                           = useState('');

  const { register, verifyOTP, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const ret = localStorage.getItem('returnUrl');
      if (ret) { localStorage.removeItem('returnUrl'); navigate(ret, { replace: true }); }
      else      { navigate('/ai-chat', { replace: true }); }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { alert('Passwords do not match'); return; }
    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) setStep(2);
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { alert('Please enter a 6-digit code'); return; }
    setLoading(true);
    try {
      const success = await verifyOTP(email, otp);
      if (success) {
        const ret = localStorage.getItem('returnUrl');
        if (ret) { localStorage.removeItem('returnUrl'); navigate(ret, { replace: true }); }
        else      { navigate('/ai-chat', { replace: true }); }
      }
    } catch (err) {
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try { await register(name, email, password); }
    finally { setLoading(false); }
  };

  if (user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF6EE' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #f0e0d0', borderTopColor: '#E8601C', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13.5, color: '#999' }}>Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif", background: '#FAF7F2' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ flex: '0 0 52%', background: '#FAF7F2', position: 'relative', overflow: 'hidden', display: 'none' }}
          className="lg:block"
        >
          {/* This panel is shown via the flex child below for lg screens */}
        </div>

        {/* We render the left panel as a proper flex child */}
        <div
          className="hidden lg:flex flex-col"
          style={{ flex: '0 0 52%', background: '#FAF7F2', position: 'relative', overflow: 'hidden' }}
        >
          {/* Top nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '32px 40px 0', position: 'relative', zIndex: 10 }}>
            <AsteriskLogo size={26} />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', letterSpacing: '-0.3px' }}>Forms by Gessions</span>
          </div>

          {/* Decorative asterisk */}
          <div style={{ position: 'absolute', top: -20, right: -40, zIndex: 1, pointerEvents: 'none' }}>
            <BigAsterisk />
          </div>

          {/* Hero text */}
          <div style={{ padding: '64px 40px 0', position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.08, color: '#1a1a1a', letterSpacing: '-1.5px', marginBottom: 16 }}>
              Start collecting<br />smarter data.
            </h1>
            <p style={{ fontSize: 15, color: '#6b6b6b', lineHeight: 1.6, maxWidth: 380, marginBottom: 40 }}>
              Join thousands of teams using Forms by Gessions to automate
              approvals, collect responses, and manage workflows — all in one place.
            </p>

            {/* Benefits list */}
            {[
              'Free to get started — no credit card needed',
              'AI-powered form builder in seconds',
              'Real-time analytics & response tracking',
              'Team collaboration & department management',
              'Enterprise-grade security & compliance',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <CheckCircle size={17} color="#5C4A3E" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14.5, fontWeight: 500, color: '#2a2a2a' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Illustration strip */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(92,74,62,0.05) 0%, transparent 100%)', borderTop: '1px solid rgba(92,74,62,0.08)' }}>
            <svg viewBox="0 0 600 180" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
              <ellipse cx="60" cy="130" rx="45" ry="50" fill="#E8A87C" opacity="0.5" />
              <ellipse cx="100" cy="120" rx="38" ry="44" fill="#D4784A" opacity="0.4" />
              <ellipse cx="510" cy="125" rx="50" ry="54" fill="#E8A87C" opacity="0.5" />
              <ellipse cx="560" cy="115" rx="40" ry="46" fill="#D4784A" opacity="0.38" />
              <rect x="200" y="50" width="200" height="120" rx="2" fill="#f5f0e8" stroke="#d6cfc5" strokeWidth="1" />
              <rect x="240" y="34" width="30" height="18" rx="1" fill="#f0ebe0" stroke="#d6cfc5" strokeWidth="1" />
              <rect x="270" y="22" width="8" height="14" fill="#d6cfc5" />
              {[220,255,290,325,360].map(x => [68,96,124].map(y => (
                <rect key={`${x}-${y}`} x={x} y={y} width="18" height="18" rx="1" fill="#c8dff5" opacity="0.7" />
              )))}
              <rect x="0" y="172" width="600" height="8" fill="#c8b89a" opacity="0.35" />
              {[140,165,420,450,475].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={158} r={5} fill="#2a2a2a" opacity="0.6" />
                  <rect x={x-4} y={163} width={8} height={12} rx="2" fill="#2a2a2a" opacity="0.6" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, background: '#fff', boxShadow: '-2px 0 24px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>

          {/* Top-right nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '28px 40px 8px' }}>
            <span style={{ fontSize: 13.5, color: '#555' }}>Already have an account?&nbsp;</span>
            <Link to="/login" style={{ fontSize: 13.5, fontWeight: 700, color: '#5C4A3E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Sign in <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 32px 40px' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2 mb-8">
                <AsteriskLogo size={22} />
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Forms by Gessions</span>
              </div>

              {step === 1 ? (
                <>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: 6 }}>
                    Create your account
                  </h2>
                  <p style={{ fontSize: 13.5, color: '#888', marginBottom: 24 }}>
                    Set up your Forms by Gessions workspace in seconds.
                  </p>

                  {/* Google OAuth */}
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
                      borderRadius: 10, cursor: 'pointer', marginBottom: 16,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8f8f8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <GoogleIcon /> Continue with Google
                  </button>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: '#ebebeb' }} />
                    <span style={{ fontSize: 12.5, color: '#aaa' }}>or sign up with email</span>
                    <div style={{ flex: 1, height: 1, background: '#ebebeb' }} />
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Full name */}
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>Full name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input
                          type="text" autoComplete="name" required
                          value={name} onChange={e => setName(e.target.value)}
                          placeholder="Your full name"
                          style={inputStyle}
                          onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                          onBlur={e =>  { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>Email address</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input
                          type="email" autoComplete="email" required
                          value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          style={inputStyle}
                          onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                          onBlur={e =>  { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          type={showPassword ? 'text' : 'password'} autoComplete="new-password" required
                          value={password} onChange={e => setPassword(e.target.value)}
                          placeholder="Create a password"
                          style={{ ...inputStyle, paddingRight: 40 }}
                          onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                          onBlur={e =>  { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, lineHeight: 0 }}>
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 6 }}>Confirm password</label>
                      <div style={{ position: 'relative' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          type={showConfirm ? 'text' : 'password'} autoComplete="new-password" required
                          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repeat your password"
                          style={{ ...inputStyle, paddingRight: 40 }}
                          onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                          onBlur={e =>  { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, lineHeight: 0 }}>
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit" disabled={loading}
                      style={{
                        width: '100%', padding: '12px 0', fontSize: 15, fontWeight: 700,
                        color: '#fff', background: loading ? '#483A30' : '#5C4A3E',
                        border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 4px 14px rgba(92,74,62,0.25)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#483A30'; }}
                      onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#5C4A3E'; }}
                    >
                      {loading
                        ? <><div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending code…</>
                        : <>Create account <ArrowRight size={15} /></>
                      }
                    </button>

                    <p style={{ fontSize: 11.5, color: '#aaa', textAlign: 'center', marginTop: 2 }}>
                      By creating an account you agree to our{' '}
                      <a href="#" style={{ color: '#5C4A3E', textDecoration: 'none' }}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" style={{ color: '#5C4A3E', textDecoration: 'none' }}>Privacy Policy</a>.
                    </p>
                  </form>
                </>
              ) : (
                /* ── OTP Step ── */
                <>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 56, height: 56, background: '#F5EFE6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Mail size={26} color="#5C4A3E" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: 8 }}>
                      Check your inbox
                    </h2>
                    <p style={{ fontSize: 13.5, color: '#777', lineHeight: 1.6 }}>
                      We've sent a 6-digit verification code to<br />
                      <strong style={{ color: '#1a1a1a' }}>{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2a2a2a', marginBottom: 8, textAlign: 'center' }}>
                        Enter verification code
                      </label>
                      <input
                        type="text" maxLength={6} required
                        value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '14px 12px', fontSize: 28, fontWeight: 800,
                          letterSpacing: '0.4em', textAlign: 'center',
                          color: '#1a1a1a', background: '#fafafa',
                          border: '1.5px solid #e0e0e0', borderRadius: 12, outline: 'none',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#5C4A3E'; e.currentTarget.style.background = '#fff'; }}
                        onBlur={e =>  { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                      />
                    </div>

                    <button
                      type="submit" disabled={loading || otp.length !== 6}
                      style={{
                        width: '100%', padding: '12px 0', fontSize: 15, fontWeight: 700,
                        color: '#fff', background: '#5C4A3E',
                        border: 'none', borderRadius: 10,
                        cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 4px 14px rgba(92,74,62,0.25)',
                        opacity: (loading || otp.length !== 6) ? 0.6 : 1,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!loading && otp.length === 6) e.currentTarget.style.background = '#483A30'; }}
                      onMouseLeave={e => { if (!loading && otp.length === 6) e.currentTarget.style.background = '#5C4A3E'; }}
                    >
                      {loading
                        ? <><div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Verifying…</>
                        : <>Verify email <ArrowRight size={15} /></>
                      }
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                      <button
                        type="button" onClick={handleResendOTP} disabled={loading}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#5C4A3E', padding: 0 }}
                      >
                        Didn't receive the code? Resend
                      </button>
                      <button
                        type="button" onClick={() => setStep(1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#999', padding: 0 }}
                      >
                        ← Back to details
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default RegisterPage;
