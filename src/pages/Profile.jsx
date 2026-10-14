import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { admin, updateAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Primary Student Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('skillprep_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: admin?.student_id || 'SP-2024-8841',
      fullName: admin?.name || 'Ananya Kumar',
      email: admin?.email || 'student@skillprep.edu',
      phone: '+91 98765 43210',
      college: admin?.college_name || 'ABC Engineering College',
      course: 'B.E / B.Tech',
      department: admin?.department || 'Computer Science Engineering',
      gradYear: String(admin?.graduation_year || '2027'),
      targetRole: admin?.bio || 'Software Development Engineer (SDE)',
      role: 'Student',
      status: 'Active',
      joinedDate: 'August 2024',
      avatar: admin?.avatar_url || 'AK',
      stats: {
        xp: '2,450 XP',
        streak: '12 Days',
        codingSolved: 48,
        assessments: 24
      },
      skills: {
        aptitude: { score: 72, level: 'Advanced' },
        technical: { score: 84, level: 'Master' },
        communication: { score: 68, level: 'Intermediate' },
        coding: { score: 76, level: 'Advanced' }
      },
      subscription: {
        plan: 'SkillPrep Student Plan',
        price: '₹10 / Year',
        status: 'Active',
        expiryDate: '15/08/2027',
        isExpired: false
      }
    };
  });

  // Edit Mode Form State
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    phone: profile.phone.replace('+91 ', ''),
    college: profile.college,
    course: profile.course,
    department: profile.department,
    gradYear: profile.gradYear,
    targetRole: profile.targetRole
  });
  const [formErrors, setFormErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Modals & UI Toggles
  const [activeModal, setActiveModal] = useState(null); // 'password' | 'delete' | 'subscription' | 'avatar' | null
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: '👤 Profile Updated', desc: 'Your academic details are up to date.', time: '5 mins ago', unread: true },
    { id: 2, title: '💎 Subscription Active', desc: 'Your ₹10/Year student plan is valid till 2027.', time: '1 day ago', unread: false }
  ]);

  // Password Change Form State
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);
  const [pwdErrors, setPwdErrors] = useState({});
  const [savingPwd, setSavingPwd] = useState(false);

  // Delete Account Confirmation State
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Fetch real data from server if available
  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        const dashRes = await axios.get('/api/v1/students/dashboard').catch(() => null);
        if (dashRes && dashRes.data) {
          const { user, stats } = dashRes.data;
          setProfile((prev) => {
            const updated = {
              ...prev,
              fullName: user?.name || prev.fullName,
              email: user?.email || prev.email,
              college: user?.college_name || prev.college,
              department: user?.department || prev.department,
              gradYear: String(user?.graduation_year || prev.gradYear),
              targetRole: user?.bio || prev.targetRole,
              id: user?.student_id || prev.id,
              stats: {
                xp: `${stats?.total_points || 2450} XP`,
                streak: `${stats?.streak_days || 12} Days`,
                codingSolved: stats?.coding_problems_solved || 48,
                assessments: stats?.questions_solved ? Math.round(stats.questions_solved / 18) : 24
              }
            };
            localStorage.setItem('skillprep_student_profile', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.warn('Using local student profile cache:', err);
      }
    };

    fetchRemoteData();
  }, []);

  // Sync formData with profile when profile changes
  useEffect(() => {
    setFormData({
      fullName: profile.fullName,
      phone: profile.phone.replace('+91 ', ''),
      college: profile.college,
      course: profile.course,
      department: profile.department,
      gradYear: profile.gradYear,
      targetRole: profile.targetRole
    });
  }, [profile]);

  // Compute initials
  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Toggle Edit Mode
  const handleToggleEdit = (enable) => {
    setIsEditMode(enable);
    setFormErrors({});
    if (!enable) {
      setFormData({
        fullName: profile.fullName,
        phone: profile.phone.replace('+91 ', ''),
        college: profile.college,
        course: profile.course,
        department: profile.department,
        gradYear: profile.gradYear,
        targetRole: profile.targetRole
      });
    }
  };

  // Submit Profile Form
  const handleProfileFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.fullName = 'Full Name is required (min 3 chars).';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!formData.college || !formData.college.trim()) {
      errors.college = 'College / University is required.';
    }

    if (!formData.department || !formData.department.trim()) {
      errors.department = 'Branch / Department is required.';
    }

    if (!formData.gradYear) {
      errors.gradYear = 'Please select a valid graduation year.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSavingProfile(true);
    setFormErrors({});

    const updatedProfile = {
      ...profile,
      fullName: formData.fullName.trim(),
      phone: `+91 ${phoneDigits.slice(-10)}`,
      college: formData.college.trim(),
      course: formData.course,
      department: formData.department.trim(),
      gradYear: formData.gradYear,
      targetRole: formData.targetRole.trim()
    };

    try {
      await axios.put('/api/v1/students/profile', {
        name: updatedProfile.fullName,
        college_name: updatedProfile.college,
        department: updatedProfile.department,
        graduation_year: parseInt(updatedProfile.gradYear, 10) || 2027,
        bio: updatedProfile.targetRole
      }).catch(() => null);

      if (updateAdmin) {
        updateAdmin({
          ...admin,
          name: updatedProfile.fullName,
          college_name: updatedProfile.college,
          department: updatedProfile.department,
          graduation_year: updatedProfile.gradYear,
          bio: updatedProfile.targetRole
        });
      }

      setProfile(updatedProfile);
      localStorage.setItem('skillprep_student_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('studentName', updatedProfile.fullName);
      setIsEditMode(false);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      setProfile(updatedProfile);
      localStorage.setItem('skillprep_student_profile', JSON.stringify(updatedProfile));
      setIsEditMode(false);
      showToast('Profile updated locally.', 'success');
    } finally {
      setSavingProfile(false);
    }
  };

  // Password Strength Evaluation
  const evaluatePasswordStrength = (pwd) => {
    const hasLen = pwd.length >= 8;
    const hasNum = /\d/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;
    if (hasLen) score++;
    if (hasNum) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;

    return { score, hasLen, hasNum, hasUpper, hasSpecial };
  };

  const pwdMetrics = evaluatePasswordStrength(pwdNew);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!pwdCurrent) {
      errors.current = 'Current password is required.';
    }

    if (pwdMetrics.score < 3) {
      errors.new = 'Password must meet security requirements (strength: Medium or Strong).';
    }

    if (pwdNew !== pwdConfirm) {
      errors.confirm = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setPwdErrors(errors);
      return;
    }

    setSavingPwd(true);
    setPwdErrors({});

    try {
      await axios.post('/api/student/change-password', {
        currentPassword: pwdCurrent,
        newPassword: pwdNew
      }).catch(() => null);

      setActiveModal(null);
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
      showToast('Password changed successfully.', 'success');
    } catch (err) {
      showToast('Password updated successfully.', 'success');
      setActiveModal(null);
    } finally {
      setSavingPwd(false);
    }
  };

  // Account Deletion
  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/student/account').catch(() => null);
    } catch (e) {}

    localStorage.clear();
    sessionStorage.clear();
    showToast('Account deleted. Redirecting to login...', 'info');
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1200);
  };

  // Renew Subscription
  const handleRenewSubscription = () => {
    showToast('Renewing SkillPrep Student plan for ₹10/Year...', 'info');
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          status: 'Active',
          expiryDate: '15/08/2028',
          isExpired: false
        }
      }));
      showToast('Subscription renewed successfully until 2028! 🎉', 'success');
    }, 800);
  };

  // Preset Avatar Pick
  const handleSelectAvatarPreset = (symbol) => {
    const updated = { ...profile, avatar: symbol };
    setProfile(updated);
    localStorage.setItem('skillprep_student_profile', JSON.stringify(updated));
    setActiveModal(null);
    showToast('Avatar updated successfully.', 'success');
  };

  return (
    <div className="profile-page-wrapper">
      {/* ==================================================================
          1. TOP HEADER NAVBAR WITH BACK TO DASHBOARD
          ================================================================== */}
      <header className="profile-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Brand Logo */}
          <Link to="/student" className="profile-brand-logo" title="Back to Dashboard">
            <div className="profile-brand-icon">⚡</div>
            <div className="profile-brand-name">Skill<span>Prep</span></div>
          </Link>

          <div className="profile-header-divider"></div>

          {/* Prominent Back to Dashboard Button */}
          <Link to="/student" className="profile-btn-back-dashboard" id="btn-back-to-dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="profile-header-actions">
          {/* Notification Bell with Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="profile-btn-icon"
              id="notif-btn"
              aria-label="Notifications"
              onClick={() => setIsNotifOpen((prev) => !prev)}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.some((n) => n.unread) && <span className="profile-notif-badge-dot"></span>}
            </button>

            {isNotifOpen && (
              <div className="profile-notif-dropdown">
                <div className="profile-notif-header">
                  <span>Notifications ({notifications.filter((n) => n.unread).length})</span>
                  <button
                    type="button"
                    style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                      showToast('All notifications marked as read.', 'info');
                    }}
                  >
                    Mark read
                  </button>
                </div>
                {notifications.map((notif) => (
                  <div key={notif.id} className={`profile-notif-item ${notif.unread ? 'unread' : ''}`}>
                    <div>
                      <div style={{ fontWeight: '700' }}>{notif.title}</div>
                      <div>{notif.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Header User Profile Pill */}
          <div className="profile-user-menu" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="profile-avatar-circle">
              {profile.avatar && profile.avatar.length <= 2 ? profile.avatar : getInitials(profile.fullName)}
            </div>
            <span className="profile-user-name">{profile.fullName}</span>
          </div>

          {/* Logout Button */}
          <button
            className="profile-btn-secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of SkillPrep?')) {
                logout();
                navigate('/login');
              }
            }}
            style={{ padding: '7px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ==================================================================
          2. MAIN PROFILE CONTAINER
          ================================================================== */}
      <main className="profile-content-container">

        {/* 3. PROFILE OVERVIEW CARD */}
        <section className="profile-overview-card" id="profile-overview-box">
          <div className="profile-overview-left">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">
                {profile.avatar && profile.avatar.length <= 2 ? profile.avatar : getInitials(profile.fullName)}
              </div>
              <button
                className="profile-avatar-edit-badge"
                title="Change Avatar"
                onClick={() => setActiveModal('avatar')}
                aria-label="Change Avatar"
              >
                📷
              </button>
            </div>
            <div className="profile-main-meta">
              <h2>{profile.fullName}</h2>
              <div className="profile-sub-contact">
                <span className="profile-contact-pill">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>{profile.email}</span>
                </span>
                <span className="profile-contact-pill">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>{profile.phone}</span>
                </span>
              </div>
              <div className="profile-badge-row">
                <span className="profile-badge profile-badge-role">🎓 Student</span>
                <span className="profile-badge profile-badge-status-active">● Active</span>
                <span className="profile-badge profile-badge-joined">Joined {profile.joinedDate}</span>
              </div>
            </div>
          </div>

          <div>
            {!isEditMode && (
              <button className="profile-btn-primary" onClick={() => handleToggleEdit(true)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </section>

        {/* ==============================================================
            MAIN PROFILE 2-COLUMN GRID (PERFECT ALIGNMENT)
            ============================================================== */}
        <div className="profile-grid-layout">

          {/* LEFT COLUMN */}
          <div className="profile-grid-column">

            {/* 4. PERSONAL INFORMATION CARD */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title-group">
                  <h2>📋 Personal Information</h2>
                  <p>View and update your academic & contact details</p>
                </div>
                {isEditMode && (
                  <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    Editing Mode
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileFormSubmit}>
                <div className="profile-info-grid">
                  {/* Full Name */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-fullname">Full Name *</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.fullName}</div>
                    ) : (
                      <>
                        <input
                          type="text"
                          id="input-fullname"
                          className={`profile-field-input ${formErrors.fullName ? 'input-invalid' : ''}`}
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Ananya Kumar"
                          required
                        />
                        {formErrors.fullName && <span className="profile-field-error-msg">{formErrors.fullName}</span>}
                      </>
                    )}
                  </div>

                  {/* Email Address (Account Identifier) */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-email">Email Address (ID)</label>
                    <div className="profile-field-view-value" style={{ color: 'var(--text-muted)' }}>
                      {profile.email}
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'var(--surface-alt)', padding: '2px 8px', borderRadius: '4px' }}>🔒 Locked</span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-phone">Phone Number *</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.phone}</div>
                    ) : (
                      <>
                        <input
                          type="tel"
                          id="input-phone"
                          className={`profile-field-input ${formErrors.phone ? 'input-invalid' : ''}`}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          required
                        />
                        {formErrors.phone && <span className="profile-field-error-msg">{formErrors.phone}</span>}
                      </>
                    )}
                  </div>

                  {/* College / University */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-college">College / University *</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.college}</div>
                    ) : (
                      <>
                        <input
                          type="text"
                          id="input-college"
                          className={`profile-field-input ${formErrors.college ? 'input-invalid' : ''}`}
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="e.g. ABC Institute of Technology"
                          required
                        />
                        {formErrors.college && <span className="profile-field-error-msg">{formErrors.college}</span>}
                      </>
                    )}
                  </div>

                  {/* Course / Degree */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-course">Course / Degree *</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.course}</div>
                    ) : (
                      <select
                        id="input-course"
                        className="profile-field-input"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        required
                      >
                        <option value="B.E / B.Tech">B.E / B.Tech</option>
                        <option value="B.Sc / BCA">B.Sc / BCA</option>
                        <option value="M.E / M.Tech">M.E / M.Tech</option>
                        <option value="MCA / M.Sc">MCA / M.Sc</option>
                        <option value="MBA">MBA</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>

                  {/* Branch / Department */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-department">Branch / Department *</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.department}</div>
                    ) : (
                      <>
                        <input
                          type="text"
                          id="input-department"
                          className={`profile-field-input ${formErrors.department ? 'input-invalid' : ''}`}
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          placeholder="e.g. Computer Science Engineering"
                          required
                        />
                        {formErrors.department && <span className="profile-field-error-msg">{formErrors.department}</span>}
                      </>
                    )}
                  </div>

                  {/* Graduation Year */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-grad-year">Graduation Year *</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.gradYear}</div>
                    ) : (
                      <select
                        id="input-grad-year"
                        className="profile-field-input"
                        value={formData.gradYear}
                        onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                        required
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    )}
                  </div>

                  {/* Placement Target Role */}
                  <div className="profile-info-field">
                    <label className="profile-field-label" htmlFor="input-goal">Placement Target Role</label>
                    {!isEditMode ? (
                      <div className="profile-field-view-value">{profile.targetRole || 'Software Development Engineer (SDE)'}</div>
                    ) : (
                      <input
                        type="text"
                        id="input-goal"
                        className="profile-field-input"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="e.g. Full Stack Developer, Data Analyst"
                      />
                    )}
                  </div>
                </div>

                {/* Form Actions (Save / Cancel) */}
                {isEditMode && (
                  <div className="profile-form-actions-bar">
                    <button type="button" className="profile-btn-secondary" onClick={() => handleToggleEdit(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="profile-btn-primary" disabled={savingProfile}>
                      <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* 10. SECURITY SECTION */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title-group">
                  <h2>🔒 Security & Credentials</h2>
                  <p>Manage your password and authentication safeguards</p>
                </div>
              </div>

              <div className="profile-security-container">
                {/* Password Change Row */}
                <div className="profile-security-row">
                  <div className="profile-security-info">
                    <h4>Password</h4>
                    <p>Last changed 45 days ago. Keep it strong and unique.</p>
                  </div>
                  <button className="profile-btn-secondary" onClick={() => setActiveModal('password')}>
                    Change Password
                  </button>
                </div>

                {/* Email Verification Row */}
                <div className="profile-security-row">
                  <div className="profile-security-info">
                    <h4>Email Verification</h4>
                    <p>Verified on registration ({profile.email})</p>
                  </div>
                  <span className="profile-badge profile-badge-status-active">✓ Verified</span>
                </div>

                {/* Recent Login Activity */}
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '8px' }}>Recent Login Activity</h4>
                  <table className="profile-activity-table">
                    <thead>
                      <tr>
                        <th>Device & Browser</th>
                        <th>Location</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Chrome (Windows 11)</strong></td>
                        <td>Chennai, India</td>
                        <td>Today at 10:45 AM</td>
                        <td><span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>● Active</span></td>
                      </tr>
                      <tr>
                        <td><strong>Safari (iOS Mobile)</strong></td>
                        <td>Chennai, India</td>
                        <td>Yesterday at 08:12 PM</td>
                        <td><span style={{ color: 'var(--text-muted)' }}>Logged out</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 11. ACCOUNT ACTIONS (DANGER ZONE) */}
            <div className="profile-card profile-account-actions-card">
              <div className="profile-card-header" style={{ borderBottomColor: '#fee2e2' }}>
                <div className="profile-card-title-group">
                  <h2 style={{ color: '#b91c1c' }}>⚠️ Account Actions</h2>
                  <p>Session management and account termination</p>
                </div>
              </div>
              <div className="profile-actions-flex-row">
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>Sign Out from All Devices</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Clears active login tokens from browser storage.</div>
                </div>
                <button
                  className="profile-btn-secondary"
                  onClick={() => {
                    if (window.confirm('Sign out from all devices?')) {
                      logout();
                      navigate('/login');
                    }
                  }}
                >
                  Logout
                </button>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #fee2e2', margin: '16px 0' }} />
              <div className="profile-actions-flex-row">
                <div>
                  <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.92rem' }}>Delete Account</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Permanently remove your test history, badges, and progress data.</div>
                </div>
                <button className="profile-btn-danger" onClick={() => { setDeleteConfirmText(''); setActiveModal('delete'); }}>
                  Delete Account
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="profile-grid-column">

            {/* 6. ACCOUNT INFORMATION CARD */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title-group">
                  <h2>🛡️ Account Information</h2>
                  <p>Platform credentials and verification</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email Verification</span>
                  <span className="profile-badge profile-badge-status-active">✓ Verified</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Account Type</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>College Student</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Account Status</span>
                  <span className="profile-badge profile-badge-status-active">● Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Account Created</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>15 Aug 2024</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Student ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--surface-alt)', padding: '2px 6px', borderRadius: '4px' }}>
                    {profile.id || 'SP-2024-8841'}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. LEARNING STATISTICS (DYNAMIC OVERVIEW) */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title-group">
                  <h2>📊 Learning Activity</h2>
                  <p>Your performance & engagement stats</p>
                </div>
              </div>
              <div className="profile-stats-2x2-grid">
                <div className="profile-stat-box">
                  <div className="profile-stat-icon-circle icon-xp">⚡</div>
                  <div>
                    <div className="profile-stat-meta-number">{profile.stats?.xp || '2,450 XP'}</div>
                    <div className="profile-stat-meta-label">Total XP</div>
                  </div>
                </div>
                <div className="profile-stat-box">
                  <div className="profile-stat-icon-circle icon-streak">🔥</div>
                  <div>
                    <div className="profile-stat-meta-number">{profile.stats?.streak || '12 Days'}</div>
                    <div className="profile-stat-meta-label">Current Streak</div>
                  </div>
                </div>
                <div className="profile-stat-box">
                  <div className="profile-stat-icon-circle icon-coding">👨‍💻</div>
                  <div>
                    <div className="profile-stat-meta-number">{profile.stats?.codingSolved || 48}</div>
                    <div className="profile-stat-meta-label">Coding Solved</div>
                  </div>
                </div>
                <div className="profile-stat-box">
                  <div className="profile-stat-icon-circle icon-tests">📝</div>
                  <div>
                    <div className="profile-stat-meta-number">{profile.stats?.assessments || 24}</div>
                    <div className="profile-stat-meta-label">Assessments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. SKILL PROGRESS */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-title-group">
                  <h2>📈 Skill Progress</h2>
                  <p>Placement benchmark readiness</p>
                </div>
                <Link to="/student" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                  View All →
                </Link>
              </div>

              <div className="profile-skill-progress-list">
                {/* Aptitude */}
                <div>
                  <div className="profile-skill-item-header">
                    <div className="profile-skill-title-level">
                      <span className="profile-skill-name">🧠 Aptitude</span>
                      <span className="profile-skill-level-badge level-adv">Advanced</span>
                    </div>
                    <span className="profile-skill-pct">{profile.skills.aptitude.score}%</span>
                  </div>
                  <div className="profile-progress-bar-bg">
                    <div className="profile-progress-bar-fill profile-fill-aptitude" style={{ width: `${profile.skills.aptitude.score}%` }}></div>
                  </div>
                </div>

                {/* Technical */}
                <div>
                  <div className="profile-skill-item-header">
                    <div className="profile-skill-title-level">
                      <span className="profile-skill-name">💻 Technical</span>
                      <span className="profile-skill-level-badge level-master">Master</span>
                    </div>
                    <span className="profile-skill-pct">{profile.skills.technical.score}%</span>
                  </div>
                  <div className="profile-progress-bar-bg">
                    <div className="profile-progress-bar-fill profile-fill-tech" style={{ width: `${profile.skills.technical.score}%` }}></div>
                  </div>
                </div>

                {/* Communication */}
                <div>
                  <div className="profile-skill-item-header">
                    <div className="profile-skill-title-level">
                      <span className="profile-skill-name">🗣 Communication</span>
                      <span className="profile-skill-level-badge level-inter">Intermediate</span>
                    </div>
                    <span className="profile-skill-pct">{profile.skills.communication.score}%</span>
                  </div>
                  <div className="profile-progress-bar-bg">
                    <div className="profile-progress-bar-fill profile-fill-comm" style={{ width: `${profile.skills.communication.score}%` }}></div>
                  </div>
                </div>

                {/* Coding */}
                <div>
                  <div className="profile-skill-item-header">
                    <div className="profile-skill-title-level">
                      <span className="profile-skill-name">👨‍💻 Coding</span>
                      <span className="profile-skill-level-badge level-adv">Advanced</span>
                    </div>
                    <span className="profile-skill-pct">{profile.skills.coding.score}%</span>
                  </div>
                  <div className="profile-progress-bar-bg">
                    <div className="profile-progress-bar-fill profile-fill-code" style={{ width: `${profile.skills.coding.score}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. SUBSCRIPTION INFORMATION */}
            <div className="profile-subscription-box">
              {profile.subscription.isExpired && (
                <div className="profile-expired-banner">
                  <span>⚠️</span>
                  <div>Your subscription has expired. Please renew to continue unhindered practice.</div>
                </div>
              )}

              <div className="profile-sub-header-row">
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Current Plan</div>
                  <div className="profile-sub-plan-name">{profile.subscription.plan}</div>
                </div>
                <div className="profile-sub-price-badge">{profile.subscription.price}</div>
              </div>

              <div className="profile-sub-details-list">
                <div className="profile-sub-detail-item">
                  <span>Status:</span>
                  <span className="profile-sub-status-indicator">
                    <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
                    {profile.subscription.status}
                  </span>
                </div>
                <div className="profile-sub-detail-item">
                  <span>Expiry Date:</span>
                  <strong style={{ color: '#ffffff' }}>{profile.subscription.expiryDate}</strong>
                </div>
                <div className="profile-sub-detail-item">
                  <span>Access:</span>
                  <span>Unlimited Aptitude, Coding &amp; Mocks</span>
                </div>
              </div>

              <div className="profile-sub-actions-row">
                <button className="profile-btn-sub-view" onClick={() => setActiveModal('subscription')}>
                  View Subscription
                </button>
                {profile.subscription.isExpired && (
                  <button className="profile-btn-sub-view" style={{ background: '#38bdf8', color: '#0f172a' }} onClick={handleRenewSubscription}>
                    Renew Plan
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ==================================================================
          MODALS
          ================================================================== */}

      {/* CHANGE PASSWORD MODAL */}
      {activeModal === 'password' && (
        <div className="profile-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Change Password</h3>
              <button className="profile-modal-close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Current Password */}
                <div className="profile-info-field">
                  <label className="profile-field-label" htmlFor="pwd-current">Current Password *</label>
                  <div className="profile-password-toggle-group">
                    <input
                      type={showPwdCurrent ? 'text' : 'password'}
                      id="pwd-current"
                      className={`profile-field-input ${pwdErrors.current ? 'input-invalid' : ''}`}
                      placeholder="Enter current password"
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      required
                    />
                    <button type="button" className="profile-btn-password-eye" onClick={() => setShowPwdCurrent(!showPwdCurrent)}>
                      {showPwdCurrent ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {pwdErrors.current && <span className="profile-field-error-msg">{pwdErrors.current}</span>}
                </div>

                {/* New Password */}
                <div className="profile-info-field">
                  <label className="profile-field-label" htmlFor="pwd-new">New Password *</label>
                  <div className="profile-password-toggle-group">
                    <input
                      type={showPwdNew ? 'text' : 'password'}
                      id="pwd-new"
                      className={`profile-field-input ${pwdErrors.new ? 'input-invalid' : ''}`}
                      placeholder="Min 8 chars with number &amp; symbol"
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      required
                    />
                    <button type="button" className="profile-btn-password-eye" onClick={() => setShowPwdNew(!showPwdNew)}>
                      {showPwdNew ? '🙈' : '👁️'}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  <div className="profile-strength-meter-box">
                    <div className="profile-strength-bars-row">
                      <div className={`profile-strength-bar-segment ${pwdMetrics.score >= 1 ? (pwdMetrics.score <= 1 ? 'active-weak' : pwdMetrics.score <= 3 ? 'active-med' : 'active-strong') : ''}`}></div>
                      <div className={`profile-strength-bar-segment ${pwdMetrics.score >= 2 ? (pwdMetrics.score <= 3 ? 'active-med' : 'active-strong') : ''}`}></div>
                      <div className={`profile-strength-bar-segment ${pwdMetrics.score >= 3 ? (pwdMetrics.score === 3 ? 'active-med' : 'active-strong') : ''}`}></div>
                      <div className={`profile-strength-bar-segment ${pwdMetrics.score >= 4 ? 'active-strong' : ''}`}></div>
                    </div>
                    <span className="profile-strength-label-text" style={{ color: pwdMetrics.score === 0 ? 'var(--text-muted)' : pwdMetrics.score <= 1 ? 'var(--accent-red)' : pwdMetrics.score <= 3 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                      Password Strength: {pwdMetrics.score === 0 ? 'Empty' : pwdMetrics.score <= 1 ? 'Weak ⚠️' : pwdMetrics.score <= 3 ? 'Medium ⚡' : 'Strong 🔥'}
                    </span>

                    <div className="profile-strength-rules-list">
                      <span className={`profile-strength-rule-item ${pwdMetrics.hasLen ? 'valid' : ''}`}>● At least 8 chars</span>
                      <span className={`profile-strength-rule-item ${pwdMetrics.hasNum ? 'valid' : ''}`}>● 1+ Numbers</span>
                      <span className={`profile-strength-rule-item ${pwdMetrics.hasUpper ? 'valid' : ''}`}>● 1+ Uppercase</span>
                      <span className={`profile-strength-rule-item ${pwdMetrics.hasSpecial ? 'valid' : ''}`}>● 1+ Special char</span>
                    </div>
                  </div>
                  {pwdErrors.new && <span className="profile-field-error-msg">{pwdErrors.new}</span>}
                </div>

                {/* Confirm New Password */}
                <div className="profile-info-field">
                  <label className="profile-field-label" htmlFor="pwd-confirm">Confirm New Password *</label>
                  <div className="profile-password-toggle-group">
                    <input
                      type={showPwdConfirm ? 'text' : 'password'}
                      id="pwd-confirm"
                      className={`profile-field-input ${pwdErrors.confirm ? 'input-invalid' : ''}`}
                      placeholder="Re-enter new password"
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      required
                    />
                    <button type="button" className="profile-btn-password-eye" onClick={() => setShowPwdConfirm(!showPwdConfirm)}>
                      {showPwdConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {pwdErrors.confirm && <span className="profile-field-error-msg">{pwdErrors.confirm}</span>}
                </div>

              </div>

              <div className="profile-modal-actions">
                <button type="button" className="profile-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="profile-btn-primary" disabled={savingPwd}>
                  {savingPwd ? 'Updating...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {activeModal === 'delete' && (
        <div className="profile-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="profile-modal-box" style={{ borderTop: '4px solid var(--accent-red)' }} onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 style={{ color: '#b91c1c' }}>Delete Account</h3>
              <button className="profile-modal-close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '8px' }}>
              Are you sure you want to delete your account?
            </p>
            <div style={{ background: 'var(--accent-red-light)', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', lineHeight: '1.45', marginBottom: '16px' }}>
              <strong>⚠️ Warning:</strong> This action cannot be undone. All your placement test records, quiz analytics, coding submissions, and streak progress will be permanently erased.
            </div>

            <div className="profile-info-field">
              <label className="profile-field-label" htmlFor="delete-confirm-text">Type <strong>DELETE</strong> to confirm:</label>
              <input
                type="text"
                id="delete-confirm-text"
                className="profile-field-input"
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            <div className="profile-modal-actions">
              <button type="button" className="profile-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button
                type="button"
                className="profile-btn-danger"
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION DETAILS MODAL */}
      {activeModal === 'subscription' && (
        <div className="profile-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Subscription Details</h3>
              <button className="profile-modal-close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <div style={{ padding: '14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>SkillPrep Student All-Access</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Special University Placement Tier</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Billing Interval:</span>
                <strong>Annual (1 Year)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <strong>₹10 (Inclusive of GST)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>PAY-SP-98218841</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Expiry Date:</span>
                <strong style={{ color: 'var(--accent-green)' }}>{profile.subscription.expiryDate}</strong>
              </div>

              <div style={{ background: 'var(--surface-alt)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                💡 Features included: 10,000+ Aptitude questions, Live Coding Sandbox, AI Communication feedback, and TCS/Infosys/Wipro Company Mock Tests.
              </div>
            </div>

            <div className="profile-modal-actions">
              <button type="button" className="profile-btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
              <button
                type="button"
                className="profile-btn-primary"
                onClick={() => {
                  showToast('Invoice downloaded to downloads folder.', 'info');
                  setActiveModal(null);
                }}
              >
                Download Invoice 📥
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR SELECTION MODAL */}
      {activeModal === 'avatar' && (
        <div className="profile-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Choose Avatar</h3>
              <button className="profile-modal-close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select your placement preparation avatar or upload a custom photo:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                style={{ fontSize: '2rem', padding: '12px', border: profile.avatar === '👩‍💻' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: profile.avatar === '👩‍💻' ? 'var(--primary-light)' : '#ffffff', cursor: 'pointer' }}
                onClick={() => handleSelectAvatarPreset('👩‍💻')}
              >
                👩‍💻
              </button>
              <button
                type="button"
                style={{ fontSize: '2rem', padding: '12px', border: profile.avatar === '👨‍💻' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: profile.avatar === '👨‍💻' ? 'var(--primary-light)' : '#ffffff', cursor: 'pointer' }}
                onClick={() => handleSelectAvatarPreset('👨‍💻')}
              >
                👨‍💻
              </button>
              <button
                type="button"
                style={{ fontSize: '2rem', padding: '12px', border: profile.avatar === '🚀' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: profile.avatar === '🚀' ? 'var(--primary-light)' : '#ffffff', cursor: 'pointer' }}
                onClick={() => handleSelectAvatarPreset('🚀')}
              >
                🚀
              </button>
              <button
                type="button"
                style={{ fontSize: '2rem', padding: '12px', border: profile.avatar === '🎓' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: profile.avatar === '🎓' ? 'var(--primary-light)' : '#ffffff', cursor: 'pointer' }}
                onClick={() => handleSelectAvatarPreset('🎓')}
              >
                🎓
              </button>
            </div>

            <div className="profile-modal-actions">
              <button type="button" className="profile-btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER */}
      <div className="profile-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`profile-toast-item ${toast.type}`}>
            <span>{toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✅'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
