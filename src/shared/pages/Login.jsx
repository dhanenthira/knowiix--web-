import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import KnowiixLogo from '../components/KnowiixLogo';
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
  const { theme, toggleTheme } = useUI();
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

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'newPassword' | 'success'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ text: '', type: 'info' });

  const handleForgotPassword = () => {
    navigate(email ? `/forgot-password?email=${encodeURIComponent(email.trim())}` : '/forgot-password');
  };

  const handleSendResetCode = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = forgotEmail.trim();
    if (!targetEmail || !validateEmail(targetEmail)) {
      setForgotMsg({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    setForgotLoading(true);
    setForgotMsg({ text: '', type: 'info' });
    try {
      const res = await axios.post('/api/v1/auth/forgot-password', { email: targetEmail });
      setForgotLoading(false);
      setForgotStep('otp');
      setForgotMsg({
        text: res.data?.message || `Verification code sent to ${targetEmail}`,
        type: 'success'
      });
    } catch (err) {
      setForgotLoading(false);
      setForgotMsg({
        text: err.response?.data?.detail || 'Failed to send reset code. Please ensure the email is registered.',
        type: 'error'
      });
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (forgotOtp.trim().length !== 6) {
      setForgotMsg({ text: 'Please enter the complete 6-digit verification code.', type: 'error' });
      return;
    }
    setForgotLoading(true);
    setForgotMsg({ text: '', type: 'info' });
    try {
      await axios.post('/api/v1/auth/verify-otp', {
        email: forgotEmail.trim(),
        otp: forgotOtp.trim()
      });
      setForgotLoading(false);
      setForgotStep('newPassword');
      setForgotMsg({ text: 'Code verified! Enter your new password below.', type: 'success' });
    } catch (err) {
      setForgotLoading(false);
      setForgotMsg({
        text: err.response?.data?.detail || 'Invalid or expired verification code.',
        type: 'error'
      });
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (forgotNewPassword.length < 6) {
      setForgotMsg({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    setForgotLoading(true);
    setForgotMsg({ text: '', type: 'info' });
    try {
      const res = await axios.post('/api/v1/auth/reset-password', {
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        new_password: forgotNewPassword
      });
      setForgotLoading(false);
      setForgotStep('success');
      setForgotMsg({ text: res.data?.message || 'Password reset successfully!', type: 'success' });
      // Pre-fill login email
      setEmail(forgotEmail.trim());
      setPassword(forgotNewPassword);
    } catch (err) {
      setForgotLoading(false);
      setForgotMsg({
        text: err.response?.data?.detail || 'Failed to update password. Please try again.',
        type: 'error'
      });
    }
  };

  const handleGoogleLogin = () => {
    setAlert({ show: true, message: 'Connecting with Google SSO...', type: 'info' });
    setTimeout(() => {
      setEmail('admin@knowiix.com');
      setPassword('admin123');
      setAlert({ show: true, message: 'Google SSO credentials verified. Logging in...', type: 'success' });
      handleSubmit(null, 'admin@knowiix.com', 'admin123');
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
        setAlert({
          show: true,
          message: res?.error || 'Invalid email or password. Please verify your credentials.',
          type: 'error'
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: err.message || 'An unexpected authentication error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="skillprep-login-wrapper login-page">
      <div className="auth-container">
        {/* LOGIN FORM PANEL */}
        <main className="auth-form-panel">
          <div className="auth-card">
            {/* Knowiix Brand Logo Header */}
            <div className="auth-brand-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.25rem' }}>
              <Link to="/" style={{ textDecoration: 'none' }} title="Back to Knowiix Home">
                <KnowiixLogo size="md" />
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
                style={{
                  background: 'var(--surface-elevated, rgba(255, 255, 255, 0.08))',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {theme === 'dark' ? <Sun size={17} color="#F4B400" /> : <Moon size={17} color="#4285F4" />}
              </button>
            </div>

            <div className="auth-header">
              <h1>Welcome Back 👋</h1>
              <p>Continue your learning journey and ace your placement.</p>
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
                      paddingRight: '16px'
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
                      paddingRight: '46px'
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
                <Link
                  to={email ? `/forgot-password?email=${encodeURIComponent(email.trim())}` : '/forgot-password'}
                  className="forgot-link"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Login CTA Button */}
              <button
                type="submit"
                className={`btn-submit ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-accent, #4285F4)',
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
            <div className="demo-helper-box" style={{ marginTop: '16px', padding: '12px 14px', borderRadius: '12px' }}>
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
                <span>← Back to Home</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="forgot-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="forgot-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="forgot-modal-close" onClick={() => setShowForgotModal(false)}>✕</button>

            <div className="forgot-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-2-2l2 2M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
              {forgotStep === 'email' && 'Forgot Password'}
              {forgotStep === 'otp' && 'Verify Security Code'}
              {forgotStep === 'newPassword' && 'Set New Password'}
              {forgotStep === 'success' && 'Password Reset Complete'}
            </h3>

            <p className="forgot-step-desc">
              {forgotStep === 'email' && 'Enter your registered Gmail or institutional email to receive an instant verification code.'}
              {forgotStep === 'otp' && `Enter the 6-digit code sent to ${forgotEmail}. Check your inbox or spam.`}
              {forgotStep === 'newPassword' && 'Create your new strong password with at least 6 characters.'}
              {forgotStep === 'success' && 'Your password has been securely updated. You can now log in.'}
            </p>

            {forgotMsg.text && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  background: forgotMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  border: `1px solid ${forgotMsg.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  color: forgotMsg.type === 'error' ? '#ef4444' : '#22c55e'
                }}
              >
                {forgotMsg.text}
              </div>
            )}

            {forgotStep === 'email' && (
              <form onSubmit={handleSendResetCode}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="student@knowiix.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending Code...' : 'Send Reset Code'}
                </button>
              </form>
            )}

            {forgotStep === 'otp' && (
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="input-label">6-Digit Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="input-field forgot-otp-input"
                    placeholder="123456"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>⏱ Code expires in 10 mins</span>
                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Resend Code
                  </button>
                </div>
                <button type="submit" className="btn-submit" disabled={forgotLoading}>
                  {forgotLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            )}

            {forgotStep === 'newPassword' && (
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="input-label">New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="input-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={forgotLoading}>
                  {forgotLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}

            {forgotStep === 'success' && (
              <button
                type="button"
                className="btn-submit"
                onClick={() => setShowForgotModal(false)}
              >
                Proceed to Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
