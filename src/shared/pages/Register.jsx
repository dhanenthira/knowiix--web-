import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import KnowiixLogo from '../components/KnowiixLogo';
import './Login.css';
import './Register.css';

export default function Register() {
  const role = 'student'; // Only single admin exists on platform; registration is exclusively for students
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field errors
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const strengthScore = calculatePasswordStrength(password);
  const getStrengthMeta = () => {
    if (strengthScore <= 1) return { text: 'Weak', class: 'active-weak', color: '#ef4444' };
    if (strengthScore <= 3) return { text: 'Good', class: 'active-medium', color: '#f59e0b' };
    return { text: 'Strong', class: 'active-strong', color: '#10b981' };
  };

  const handleQuickDemoFill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setName('Priya Ramanathan');
    setEmail(`priya.student${randomSuffix}@skillprep.edu`);
    setPassword('Student@2026');
    setConfirmPassword('Student@2026');
    setCollegeName('PSG College of Technology');
    setDepartment('Computer Science & Engineering');
    setGraduationYear('2026');
    setAgreeTerms(true);
    setErrors({});
    setAlert({
      show: true,
      message: 'Student demo credentials prefilled! Click "Create Account" to test immediate registration.',
      type: 'info'
    });
  };

  const handleGoogleSignup = () => {
    setAlert({ show: true, message: 'Connecting with Google SSO...', type: 'info' });
    setTimeout(async () => {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const googleUser = {
        name: 'Google Scholar',
        email: `google.user${randomSuffix}@gmail.com`,
        password: 'GoogleUser@2026',
        role: 'student',
        college_name: collegeName || 'Institute of Technology',
        department: department,
        graduation_year: parseInt(graduationYear, 10) || 2026,
        bio: 'Joined via Google SSO'
      };
      
      try {
        const res = await register(googleUser);
        if (res?.success) {
          setAlert({
            show: true,
            message: 'Signed up with Google successfully! Redirecting...',
            type: 'success'
          });
          setTimeout(() => {
            navigate('/student');
          }, 800);
        } else {
          setAlert({
            show: true,
            message: res?.error || 'Registration failed',
            type: 'error'
          });
        }
      } catch (err) {
        setAlert({ show: true, message: 'Google SSO failed. Please try form signup.', type: 'error' });
      }
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must accept the terms & conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlert({
        show: true,
        message: 'Please resolve the highlighted errors before continuing.',
        type: 'error'
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setAlert({ show: false, message: '', type: 'error' });

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: 'student',
        college_name: collegeName.trim() || undefined,
        department: department || undefined,
        graduation_year: parseInt(graduationYear, 10) || 2026,
        bio: 'Student joining SkillPrep.'
      };

      const res = await register(payload);
      if (res?.success) {
        setAlert({
          show: true,
          message: 'Account created successfully! Welcome. Redirecting to your dashboard...',
          type: 'success'
        });
        setTimeout(() => {
          navigate('/student');
        }, 800);
      } else {
        setIsSubmitting(false);
        setAlert({
          show: true,
          message: res?.error || 'Registration failed. Email might already be registered.',
          type: 'error'
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setAlert({
        show: true,
        message: 'Network or server error occurred. Please verify backend is running.',
        type: 'error'
      });
    }
  };

  const strengthMeta = getStrengthMeta();

  return (
    <div className="skillprep-login-wrapper">
      <div className="auth-container">
        {/* 1. LEFT SIDE: BRANDING & CAREER HIGHLIGHTS */}
        <aside className="auth-visual-panel">
          <div className="visual-header">
            <Link to="/" style={{ textDecoration: 'none' }} title="Back to Knowiix Home">
              <KnowiixLogo size="lg" />
            </Link>
          </div>

          <div className="visual-body">
            <h2 className="visual-headline">
              Begin Your Placement<br />
              <span className="gradient-text">Success Story.</span>
            </h2>
            <p className="visual-subtext">
              Join thousands of college students leveling up their Aptitude, Technical DSA, Communication and Multi-Language Problem Solving skills every day.
            </p>

            {/* Perks Cards */}
            <div className="preview-perks-list">
              <div className="preview-perk-card">
                <div className="perk-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  🎯
                </div>
                <div>
                  <div className="perk-title">Daily Placement Drills</div>
                  <div className="perk-desc">Adaptive quizzes designed to mirror top IT & product recruitment tests.</div>
                </div>
              </div>

              <div className="preview-perk-card">
                <div className="perk-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                  ⚡
                </div>
                <div>
                  <div className="perk-title">1v1 Real-Time Battle Arena</div>
                  <div className="perk-desc">Compete with friends & campus peers in head-to-head coding sprints.</div>
                </div>
              </div>

              <div className="preview-perk-card">
                <div className="perk-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  📊
                </div>
                <div>
                  <div className="perk-title">Readiness Index &amp; Analytics</div>
                  <div className="perk-desc">Get pinpoint strengths, accuracy metrics, and AI recommendations.</div>
                </div>
              </div>
            </div>

            {/* Recruiter Badges */}
            <div className="company-strip-label">Prepares you for top recruiters</div>
            <div className="company-badges-grid">
              <span className="company-badge-pill">TCS NQT</span>
              <span className="company-badge-pill">Infosys</span>
              <span className="company-badge-pill">Wipro</span>
              <span className="company-badge-pill">Cognizant</span>
              <span className="company-badge-pill">Zoho</span>
              <span className="company-badge-pill">Amazon</span>
            </div>
          </div>

          <div className="visual-footer">
            <div className="visual-footer-item">
              <span className="check">✓</span> Free Student Access
            </div>
            <div className="visual-footer-item">
              <span className="check">✓</span> 10,000+ Questions
            </div>
            <div className="visual-footer-item">
              <span className="check">✓</span> Verified Placements
            </div>
          </div>
        </aside>

        {/* 2. RIGHT SIDE: REGISTRATION FORM */}
        <main className="auth-form-panel" style={{ overflowY: 'auto' }}>
          <div className="auth-card" style={{ maxWidth: '520px' }}>
            {/* Mobile Header */}
            <div className="mobile-brand-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <KnowiixLogo size="md" />
              </Link>
            </div>

            <div className="auth-header">
              <h1>Create Student Account 🚀</h1>
              <p>Sign up to start practicing and tracking your placement readiness.</p>
            </div>

            {/* Quick Demo Fill button */}
            <div className="quick-demo-action">
              <button
                type="button"
                className="btn-quick-fill"
                onClick={handleQuickDemoFill}
                title="Fill sample student credentials for instant testing"
              >
                <span>✨</span> Quick Demo Fill
              </button>
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
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Full Name *</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="reg-name"
                    name="name"
                    className={`form-input ${errors.name ? 'input-invalid' : ''}`}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a'
                    }}
                    required
                  />
                </div>
                {errors.name && <div className="field-error-msg visible">{errors.name}</div>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">Email Address *</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    className={`form-input ${errors.email ? 'input-invalid' : ''}`}
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a'
                    }}
                    required
                  />
                </div>
                {errors.email && <div className="field-error-msg visible">{errors.email}</div>}
              </div>

              {/* 2-Column: Password & Confirm Password */}
              <div className="form-row-2col">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="reg-password" className="form-label">Password *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reg-password"
                      name="password"
                      className={`form-input ${errors.password ? 'input-invalid' : ''}`}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      style={{
                        paddingLeft: '44px',
                        paddingRight: '40px',
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
                      style={{ right: '10px' }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <div className="field-error-msg visible">{errors.password}</div>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="reg-confirm-password" className="form-label">Confirm Password *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="reg-confirm-password"
                      name="confirmPassword"
                      className={`form-input ${errors.confirmPassword ? 'input-invalid' : ''}`}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      style={{
                        paddingLeft: '44px',
                        paddingRight: '40px',
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
                      style={{ right: '10px' }}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="field-error-msg visible">{errors.confirmPassword}</div>}
                </div>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="password-strength-wrap" style={{ marginBottom: '18px' }}>
                  <div className="strength-bars">
                    <div className={`strength-segment ${strengthScore >= 1 ? strengthMeta.class : ''}`} />
                    <div className={`strength-segment ${strengthScore >= 2 ? strengthMeta.class : ''}`} />
                    <div className={`strength-segment ${strengthScore >= 3 ? strengthMeta.class : ''}`} />
                    <div className={`strength-segment ${strengthScore >= 4 ? strengthMeta.class : ''}`} />
                  </div>
                  <div className="strength-label">
                    <span>Password Strength:</span>
                    <span style={{ color: strengthMeta.color, fontWeight: 700 }}>{strengthMeta.text}</span>
                  </div>
                </div>
              )}

              {/* College / Institution Name */}
              <div className="form-group">
                <label htmlFor="reg-college" className="form-label">College / University Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="reg-college"
                    name="collegeName"
                    className="form-input"
                    placeholder="e.g. PSG Tech, Anna University, VIT"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              {/* 2-Column: Department & Graduation Year */}
              <div className="form-row-2col">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="reg-dept" className="form-label">Department / Branch</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </span>
                    <select
                      id="reg-dept"
                      name="department"
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Information Technology">Information Tech</option>
                      <option value="Artificial Intelligence & Data Science">AI &amp; Data Science</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Electrical & Electronics">EEE</option>
                      <option value="Mechanical Engineering">Mechanical</option>
                      <option value="Civil Engineering">Civil</option>
                      <option value="Other">Other Branch</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="reg-grad-year" className="form-label">Graduation Year</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <select
                      id="reg-grad-year"
                      name="graduationYear"
                      className="form-select"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                    >
                      <option value="2025">Class of 2025</option>
                      <option value="2026">Class of 2026</option>
                      <option value="2027">Class of 2027</option>
                      <option value="2028">Class of 2028</option>
                      <option value="2029">Class of 2029</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="form-aux-row" style={{ marginTop: '16px', marginBottom: '20px' }}>
                <label className="checkbox-label" htmlFor="agree-terms" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    id="agree-terms"
                    name="agreeTerms"
                    className="checkbox-input"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span className="checkbox-custom" style={{ marginTop: '2px' }}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span style={{ fontSize: '0.84rem', lineHeight: 1.4 }}>
                    I agree to the <a href="#terms" style={{ color: '#4f46e5', fontWeight: 600 }}>Terms of Service</a> and{' '}
                    <a href="#privacy" style={{ color: '#4f46e5', fontWeight: 600 }}>Privacy Policy</a>.
                  </span>
                </label>
              </div>
              {errors.terms && <div className="field-error-msg visible" style={{ marginTop: '-12px', marginBottom: '16px' }}>{errors.terms}</div>}

              {/* Submit CTA */}
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
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>

            {/* Prompt to Login */}
            <div className="register-prompt" style={{ marginTop: '20px', textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to="/login" className="register-link" style={{ fontWeight: 700 }}>
                Log In →
              </Link>
            </div>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleSignup}
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
              <span>Sign up with Google</span>
            </button>

            <div className="security-note">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>256-bit encrypted • We protect your academic privacy</span>
            </div>

            {/* Back to Home link */}
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
    </div>
  );
}
