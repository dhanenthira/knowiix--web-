import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import KnowiixLogo from '../components/KnowiixLogo';
import './Login.css';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithSession, login } = useAuth();
  const { theme, toggleTheme } = useUI();

  // Current Step: 1 (Email) -> 2 (OTP) -> 3 (New Password) -> 4 (Success / Auto-login)
  const [step, setStep] = useState(1);

  // Form States
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [emailError, setEmailError] = useState('');

  // 6-digit OTP states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef([]);

  // Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 10-Minute Countdown Timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);

  // Status & Feedback Alert
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [isLoading, setIsLoading] = useState(false);

  // Run 10-minute countdown when timerActive is true
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setAlert({
        show: true,
        message: 'The 10-minute verification code has expired. Please request a new code.',
        type: 'error'
      });
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Format MM:SS for countdown timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strengthScore = calculatePasswordStrength(newPassword);
  const getStrengthMeta = () => {
    if (strengthScore <= 1) return { text: 'Weak', color: '#ef4444' };
    if (strengthScore <= 3) return { text: 'Good', color: '#f59e0b' };
    return { text: 'Strong', color: '#10b981' };
  };

  // STEP 1: Request 6-digit OTP to Email
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = email.trim();

    if (!targetEmail) {
      setEmailError('Please enter your email address.');
      return;
    }
    if (!validateEmail(targetEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setIsLoading(true);
    setAlert({ show: false, message: '', type: 'info' });

    try {
      const response = await axios.post('/api/v1/auth/forgot-password', {
        email: targetEmail
      });

      setIsLoading(false);
      setStep(2);
      setTimeLeft(600); // 10 minutes
      setTimerActive(true);
      setAlert({
        show: true,
        message: response.data?.message || `A 6-digit OTP valid for 10 minutes was sent to ${targetEmail}`,
        type: 'success'
      });

      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err) {
      setIsLoading(false);
      setAlert({
        show: true,
        message: err.response?.data?.detail || 'No account found with this email or server error. Please verify your address.',
        type: 'error'
      });
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (index, value) => {
    if (otpError) setOtpError('');
    const cleanVal = value.replace(/[^0-9]/g, '');

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal.slice(-1);
    setOtpDigits(nextDigits);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (!pasteData) return;

    const nextDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(nextDigits);
    const targetFocus = Math.min(pasteData.length, 5);
    otpInputRefs.current[targetFocus]?.focus();
  };

  // STEP 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    setOtpError('');
    setIsLoading(true);
    setAlert({ show: false, message: '', type: 'info' });

    try {
      await axios.post('/api/v1/auth/verify-otp', {
        email: email.trim(),
        otp: fullOtp
      });

      setIsLoading(false);
      setStep(3);
      setAlert({
        show: true,
        message: 'Code verified successfully! Now create your new password.',
        type: 'success'
      });
    } catch (err) {
      setIsLoading(false);
      setOtpError(err.response?.data?.detail || 'Invalid or expired verification code.');
      setAlert({
        show: true,
        message: err.response?.data?.detail || 'Invalid or expired verification code. Please check your email.',
        type: 'error'
      });
    }
  };

  // STEP 3: Reset Password & Direct Web App Entry
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();

    let hasError = false;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      hasError = true;
    } else if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your new password.');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setAlert({ show: false, message: '', type: 'info' });

    try {
      const fullOtp = otpDigits.join('');
      const response = await axios.post('/api/v1/auth/reset-password', {
        email: email.trim(),
        otp: fullOtp,
        new_password: newPassword
      });

      setIsLoading(false);
      setStep(4);
      setAlert({
        show: true,
        message: 'Password reset successful! Logging you into your dashboard...',
        type: 'success'
      });

      const { access_token, user } = response.data || {};

      if (access_token && user) {
        const userData = { ...user, token: access_token };
        loginWithSession(userData);
        const destination = user.role === 'admin' ? '/' : '/student';
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1200);
      } else {
        // Fallback login
        const loginRes = await login(email.trim(), newPassword);
        if (loginRes?.success) {
          const isStudent = loginRes.user?.role === 'student' || email.toLowerCase().includes('student');
          setTimeout(() => {
            navigate(isStudent ? '/student' : '/', { replace: true });
          }, 1200);
        } else {
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setAlert({
        show: true,
        message: err.response?.data?.detail || 'Failed to update password. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="skillprep-login-wrapper login-page">
      <div className="auth-container">
        <main className="auth-form-panel">
          <div className="auth-card" style={{ width: '100%', maxWidth: '480px' }}>
            {/* Knowiix Brand Logo */}
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

            {/* Stepper Node Progress */}
            <div className="forgot-step-indicator">
              <div className={`step-node ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-badge">{step > 1 ? '✓' : '1'}</div>
                <span className="step-label">Email</span>
              </div>
              <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
              <div className={`step-node ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <div className="step-badge">{step > 2 ? '✓' : '2'}</div>
                <span className="step-label">OTP</span>
              </div>
              <div className={`step-line ${step > 2 ? 'completed' : ''}`}></div>
              <div className={`step-node ${step === 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                <div className="step-badge">{step > 3 ? '✓' : '3'}</div>
                <span className="step-label">New Password</span>
              </div>
            </div>

            {/* Page Header */}
            <div className="auth-header">
              {step === 1 && (
                <>
                  <h1>Forgot Password? 🔐</h1>
                  <p>Enter your registered email. We will send a 6-digit OTP valid for 10 minutes.</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h1>Enter Verification Code 📩</h1>
                  <p>
                    We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <h1>Create New Password 🛡️</h1>
                  <p>Choose a secure password to protect your account and enter the platform.</p>
                </>
              )}
              {step === 4 && (
                <>
                  <h1>Password Reset Complete! 🎉</h1>
                  <p>Your password has been updated. Redirecting you to your dashboard...</p>
                </>
              )}
            </div>

            {/* Alert Banner */}
            <div
              className={`alert-banner alert-${alert.type} ${alert.show ? 'active' : ''}`}
              role="alert"
              style={{ marginBottom: '16px' }}
            >
              <span className="alert-icon">
                {alert.type === 'error' && '⚠️'}
                {alert.type === 'success' && '✅'}
                {alert.type === 'info' && 'ℹ️'}
              </span>
              <span>{alert.message}</span>
            </div>

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} noValidate>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Registered Email Address
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      className={`form-input ${emailError ? 'input-invalid' : ''}`}
                      placeholder="e.g. student@skillprep.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      autoComplete="email"
                      required
                      style={{
                        paddingLeft: '48px',
                        paddingRight: '16px',
                        backgroundColor: '#ffffff',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                  {emailError && <div className="field-error-msg visible">{emailError}</div>}
                </div>

                <button
                  type="submit"
                  className={`btn-submit ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    height: '48px',
                    width: '100%',
                    borderRadius: '12px',
                    marginTop: '8px'
                  }}
                >
                  {isLoading && <span className="spinner"></span>}
                  <span>{isLoading ? 'Sending OTP to Email...' : 'Send 10-Min OTP →'}</span>
                </button>
              </form>
            )}

            {/* STEP 2: Enter & Verify 6-digit OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} noValidate>
                {/* 10-Minute Expiry Countdown Bar */}
                <div className="otp-timer-box">
                  <div className={`otp-timer-display ${timeLeft < 120 ? 'expiring' : ''}`}>
                    <span>⏱ Valid for:</span>
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  <button
                    type="button"
                    className="resend-btn"
                    disabled={isLoading || timeLeft > 540}
                    onClick={handleRequestOtp}
                  >
                    Resend Code
                  </button>
                </div>

                <div className="form-group" style={{ textAlign: 'center' }}>
                  <label className="form-label" style={{ display: 'block', textAlign: 'center' }}>
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="otp-input-container" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className={`otp-digit-input ${digit ? 'filled' : ''}`}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                  {otpError && <div className="field-error-msg visible" style={{ textAlign: 'center' }}>{otpError}</div>}
                </div>

                <button
                  type="submit"
                  className={`btn-submit ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  style={{
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    height: '48px',
                    width: '100%',
                    borderRadius: '12px'
                  }}
                >
                  {isLoading && <span className="spinner"></span>}
                  <span>{isLoading ? 'Verifying Code...' : 'Verify OTP & Continue →'}</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    ← Change Email Address ({email})
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Create New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate>
                {/* New Password */}
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      className={`form-input ${passwordError ? 'input-invalid' : ''}`}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
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
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {!showNewPassword ? (
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

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>Strength:</span>
                        <span style={{ color: getStrengthMeta().color }}>{getStrengthMeta().text}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', height: '4px' }}>
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            style={{
                              height: '100%',
                              borderRadius: '2px',
                              backgroundColor: bar <= strengthScore ? getStrengthMeta().color : '#e2e8f0',
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className={`form-input ${confirmPasswordError ? 'input-invalid' : ''}`}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmPasswordError) setConfirmPasswordError('');
                      }}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {!showConfirmPassword ? (
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
                  {confirmPasswordError && <div className="field-error-msg visible">{confirmPasswordError}</div>}
                </div>

                <button
                  type="submit"
                  className={`btn-submit ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 700,
                    height: '48px',
                    width: '100%',
                    borderRadius: '12px',
                    marginTop: '8px'
                  }}
                >
                  {isLoading && <span className="spinner"></span>}
                  <span>{isLoading ? 'Updating & Logging In...' : 'Save Password & Enter App 🚀'}</span>
                </button>
              </form>
            )}

            {/* STEP 4: Success & Direct Access */}
            {step === 4 && (
              <div className="reset-success-box">
                <div className="success-icon-badge">
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Welcome Back!
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                  Your password has been reset securely. We are automatically entering the web application for you.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="spinner" style={{ borderColor: '#4f46e5', borderTopColor: 'transparent', width: '28px', height: '28px' }}></div>
                </div>
              </div>
            )}

            {/* Footer Back to Login Link */}
            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '13px',
                  color: '#4f46e5',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>← Back to Login</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
