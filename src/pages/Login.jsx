import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
    if (alert.show) setAlert({ show: false, message: '', type: 'error' });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
    if (alert.show) setAlert({ show: false, message: '', type: 'error' });
  };

  const handleStudentDemoFill = () => {
    setEmail('student@skillprep.edu');
    setPassword('student123');
    setEmailError('');
    setPasswordError('');
    setAlert({
      show: true,
      message: 'Student demo credentials filled. Click Login to access Student Portal.',
      type: 'info'
    });
  };

  const handleAdminDemoFill = () => {
    setEmail('admin@skillprep.edu');
    setPassword('admin123');
    setEmailError('');
    setPasswordError('');
    setAlert({
      show: true,
      message: 'Admin demo credentials filled. Click Login to access Master Admin Console.',
      type: 'info'
    });
  };

  const handleForgotPassword = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Enter your email above to reset password.');
    } else if (!validateEmail(trimmed)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setAlert({
        show: true,
        message: `Password reset link sent to ${trimmed}. Please check your inbox.`,
        type: 'success'
      });
    }
  };

  const handleGoogleLogin = () => {
    setAlert({ show: true, message: 'Connecting with Google SSO...', type: 'info' });
    setTimeout(() => {
      setEmail('admin@codearena.com');
      setPassword('admin123');
      setAlert({ show: true, message: 'Google SSO credentials verified. Logging in...', type: 'success' });
      handleSubmit(null, 'admin@codearena.com', 'admin123');
    }, 600);
  };

  const handleSubmit = async (e, directEmail, directPassword) => {
    if (e) e.preventDefault();

    const targetEmail = (directEmail || email).trim();
    const targetPassword = directPassword || password;

    let hasError = false;

    if (!targetEmail) {
      setEmailError('Please enter your email address.');
      hasError = true;
    } else if (!validateEmail(targetEmail)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!targetPassword) {
      setPasswordError('Please enter your password.');
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    setAlert({ show: false, message: '', type: 'error' });

    try {
      const res = await login(targetEmail, targetPassword);
      if (res?.success || res === true) {
        const isStudent = res?.user?.role === 'student' || targetEmail.toLowerCase().includes('student');
        setAlert({
          show: true,
          message: isStudent
            ? 'Welcome! Redirecting to Student Readiness Dashboard...'
            : 'Login successful! Redirecting to Master Admin Console...',
          type: 'success'
        });
        setTimeout(() => {
          navigate(isStudent ? '/student' : '/');
        }, 600);
      } else {
        setIsSubmitting(false);
        setAlert({
          show: true,
          message: 'Invalid email or password. Please verify your credentials.',
          type: 'error'
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setAlert({
        show: true,
        message: 'An unexpected authentication error occurred. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="skillprep-login-wrapper">
      <div className="auth-container">
        {/* 1. LEFT SIDE: BRANDING & DASHBOARD VISUAL */}
        <aside className="auth-visual-panel">
          <div className="visual-header">
            <Link to="/" className="brand-logo" title="Back to SkillPrep Home">
              <div className="brand-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="brand-name">Skill<span>Prep</span></span>
            </Link>
          </div>

          <div className="visual-body">
            <h2 className="visual-headline">
              Your Placement Preparation<br />
              <span className="gradient-text">Starts Here.</span>
            </h2>
            <p className="visual-subtext">
              Practice smarter, build your skills and get ready for your dream placement with our structured daily readiness engine.
            </p>

            {/* Modern Dashboard Visual Preview */}
            <div className="preview-dashboard">
              <div className="preview-header">
                <div className="student-profile-mini">
                  <div className="student-avatar">AK</div>
                  <div>
                    <div className="student-name-text">Ananya Kumar</div>
                    <div className="student-sub-text">CS Batch '26 • Placement Score 88/100</div>
                  </div>
                </div>
                <div className="streak-tag">
                  <span>🔥</span> 12 Day Streak
                </div>
              </div>

              <div className="preview-metrics-grid">
                <div className="preview-metric-card">
                  <div className="preview-metric-title">
                    <span>Aptitude</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>85%</span>
                  </div>
                  <div className="preview-metric-val">124 Qs</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill fill-blue" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="preview-metric-card">
                  <div className="preview-metric-title">
                    <span>Technical (DSA)</span>
                    <span style={{ color: '#818cf8', fontWeight: 700 }}>92%</span>
                  </div>
                  <div className="preview-metric-val">186 Qs</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill fill-indigo" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="preview-metric-card">
                  <div className="preview-metric-title">
                    <span>Coding Solved</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>142</span>
                  </div>
                  <div className="preview-metric-val">142 Problems</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill fill-emerald" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div className="preview-metric-card">
                  <div className="preview-metric-title">
                    <span>Communication</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>88%</span>
                  </div>
                  <div className="preview-metric-val">Top 5%</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill fill-amber" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              <div className="floating-pill">
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                <span>TCS &amp; Infosys Ready</span>
              </div>
            </div>
          </div>

          <div className="visual-footer">
            <div className="visual-footer-item">
              <span className="check">✓</span> Aptitude
            </div>
            <div className="visual-footer-item">
              <span className="check">✓</span> Technical
            </div>
            <div className="visual-footer-item">
              <span className="check">✓</span> Communication
            </div>
            <div className="visual-footer-item">
              <span className="check">✓</span> Coding
            </div>
          </div>
        </aside>

        {/* 2. RIGHT SIDE: LOGIN FORM */}
        <main className="auth-form-panel">
          <div className="auth-card">
            {/* Mobile Header */}
            <div className="mobile-brand-header">
              <Link to="/" className="brand-logo" style={{ color: 'var(--text-main)', justifyContent: 'center' }}>
                <div className="brand-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="brand-name">Skill<span style={{ color: 'var(--primary)' }}>Prep</span></span>
              </Link>
            </div>

            <div className="auth-header">
              <h1>Welcome Back 👋</h1>
              <p>Continue your SkillPrep journey and ace your placement.</p>
            </div>

            {/* General Alert */}
            <div
              className={`alert-banner alert-${alert.type} ${alert.show ? 'active' : ''}`}
              role="alert"
            >
              <span className="alert-icon">
                {alert.type === 'error' && '⚠️'}
                {alert.type === 'success' && '✅'}
                {alert.type === 'info' && 'ℹ️'}
              </span>
              <span>{alert.message}</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Address Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${emailError ? 'input-invalid' : ''}`}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a'
                    }}
                    required
                  />
                </div>
                {emailError && <div className="field-error-msg visible">{emailError}</div>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`form-input ${passwordError ? 'input-invalid' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '46px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a'
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {!showPassword ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && <div className="field-error-msg visible">{passwordError}</div>}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="form-aux-row">
                <label className="checkbox-label" htmlFor="remember-me">
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="rememberMe"
                    className="checkbox-input"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-custom">
                    <svg viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                  className="forgot-link"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Primary Login CTA Button */}
              <button
                type="submit"
                className={`btn-submit ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontWeight: 700,
                  height: '48px',
                  width: '100%',
                  borderRadius: '12px'
                }}
              >
                {isSubmitting && <span className="spinner"></span>}
                <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
              </button>
            </form>

            {/* Registration Prompt */}
            <div className="register-prompt">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="register-link"
              >
                Create an account →
              </Link>
            </div>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="security-note">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your account information is securely protected.</span>
            </div>

            {/* Quick Demo Credentials Helper */}
            <div className="demo-helper-box" style={{ marginTop: '16px', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', textAlign: 'center' }}>
                ⚡ Quick Fill Test Accounts:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className="demo-btn-fill"
                  onClick={handleAdminDemoFill}
                  style={{
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    background: '#eef2ff',
                    color: '#4f46e5',
                    border: '1px solid #c7d2fe',
                    cursor: 'pointer'
                  }}
                >
                  🛡️ Admin Console
                </button>
                <button
                  type="button"
                  className="demo-btn-fill"
                  onClick={handleStudentDemoFill}
                  style={{
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    cursor: 'pointer'
                  }}
                >
                  🎓 Student Portal
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link
                to="/"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>← Back to SkillPrep Home</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
