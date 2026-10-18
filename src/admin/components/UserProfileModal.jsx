import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  User,
  Mail,
  Building,
  Briefcase,
  GraduationCap,
  FileText,
  Edit3,
  Save,
  Check,
  LogOut,
  Flame,
  Trophy,
  Target,
  Code2,
  Sparkles,
  ShieldCheck,
  IdCard,
  RefreshCw,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser }) {
  const { logout, updateAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    college_name: '',
    department: '',
    graduation_year: 2026,
    bio: '',
    avatar_url: ''
  });

  // Sync state whenever modal opens or user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college_name: user.college_name || '',
        department: user.department || '',
        graduation_year: user.graduation_year || 2026,
        bio: user.bio || '',
        avatar_url: user.avatar_url || ''
      });
      setIsEditing(false);
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const currentUser = user || {};
  const isStudent = (currentUser.role || 'student').toLowerCase() === 'student';
  const roleLabel = isStudent ? 'Student Member' : 'System Administrator';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    handleInputChange('avatar_url', newAvatar);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const payload = {
        id: currentUser.id,
        email: currentUser.email,
        name: formData.name.trim(),
        college_name: formData.college_name.trim(),
        department: formData.department.trim(),
        graduation_year: Number(formData.graduation_year) || 2026,
        bio: formData.bio.trim(),
        avatar_url: formData.avatar_url.trim() || currentUser.avatar_url
      };

      const res = await axios.put('/api/v1/students/profile', payload);

      if (res.data) {
        if (onUpdateUser) onUpdateUser(res.data);
        if (updateAdmin) updateAdmin(res.data);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to save changes. Please verify your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface, #1e293b)',
          color: 'var(--text-primary, #f8fafc)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isStudent
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              {isStudent ? <Sparkles size={17} /> : <ShieldCheck size={17} />}
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'inherit' }}>
                {isEditing ? 'Edit Profile' : 'User Profile'}
              </h2>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)' }}>
                {isEditing ? 'Modify and update your personal details in MySQL' : 'Account overview & credentials'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSaving}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
          >
            <X size={17} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 140px)'
          }}
        >
          {/* Success / Error Alerts */}
          {saveSuccess && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                color: '#4ade80',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}
            >
              <Check size={16} />
              <span>Profile successfully updated in MySQL database!</span>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '13px',
                marginBottom: '18px'
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Profile Hero Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              padding: '18px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '20px'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={
                  (isEditing ? formData.avatar_url : currentUser.avatar_url) ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name || 'Student'}`
                }
                alt={currentUser.name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #6366f1',
                  background: '#0f172a',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                }}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={handleGenerateAvatar}
                  title="Generate new avatar seed"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    border: '2px solid #1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={13} />
                </button>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    margin: 0,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentUser.name || 'Anonymous User'}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '12px',
                    backgroundColor: isStudent ? 'rgba(99, 102, 241, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: isStudent ? '#a5b4fc' : '#fca5a5',
                    border: isStudent ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'
                  }}
                >
                  {roleLabel}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '5px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.65)'
                }}
              >
                <Mail size={13} color="#94a3b8" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '6px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#94a3b8'
                }}
              >
                <span>ID: {currentUser.student_id || currentUser.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar (For Students or Admin) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '22px'
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '10px 8px',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <Trophy size={16} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                {currentUser.total_points || 0}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Points</div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '10px 8px',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <Flame size={16} color="#f97316" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                {currentUser.streak_days || 0}d
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Streak</div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '10px 8px',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <Code2 size={16} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                {currentUser.coding_problems_solved ?? currentUser.problems_solved ?? 0}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Solved</div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '10px 8px',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <Target size={16} color="#10b981" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                {currentUser.overall_accuracy ? `${currentUser.overall_accuracy}%` : '85%'}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Accuracy</div>
            </div>
          </div>

          {/* VIEW MODE vs EDIT MODE */}
          {!isEditing ? (
            /* ================= VIEW MODE ================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <Building size={13} color="#6366f1" />
                    <span>COLLEGE / INSTITUTE</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                    {currentUser.college_name || 'Not specified'}
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <Briefcase size={13} color="#6366f1" />
                    <span>DEPARTMENT</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                    {currentUser.department || 'Not specified'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                  <GraduationCap size={14} color="#6366f1" />
                  <span>GRADUATION BATCH</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                  Class of {currentUser.graduation_year || 2026}
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                  <FileText size={13} color="#6366f1" />
                  <span>ABOUT / BIO</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.85)' }}>
                  {currentUser.bio || 'No bio written yet. Click Edit Profile to add one!'}
                </p>
              </div>
            </div>
          ) : (
            /* ================= EDIT MODE ================= */
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px 0 36px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    College / Institute
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.college_name}
                      onChange={(e) => handleInputChange('college_name', e.target.value)}
                      placeholder="e.g. National Institute of Tech"
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px 0 36px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Building size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Department
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="e.g. Computer Science & Eng"
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px 0 36px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Briefcase size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Graduation Year
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.graduation_year}
                      onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px 0 36px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      {[2024, 2025, 2026, 2027, 2028, 2029].map((yr) => (
                        <option key={yr} value={yr} style={{ backgroundColor: '#1e293b' }}>
                          Class of {yr}
                        </option>
                      ))}
                    </select>
                    <GraduationCap size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Avatar DiceBear Seed
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.avatar_url}
                      onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                      placeholder="Avatar image URL"
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px 0 36px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Camera size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Bio / About
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell other students and recruiters about yourself..."
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                  <FileText size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            title="Sign out of account"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: '8px'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'transparent',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
                  }}
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setErrorMessage(null);
                  }}
                  disabled={isSaving}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'transparent',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
