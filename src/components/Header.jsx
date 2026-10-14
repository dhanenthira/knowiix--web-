import React, { useState } from 'react';
import axios from 'axios';
import { Bell, ShieldCheck, Menu, X, User, Mail, Building, Briefcase, FileText, Check, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export default function Header({ title, subtitle }) {
  const { admin, updateAdmin, logout } = useAuth();
  const { toggleSidebar, theme, toggleTheme } = useUI();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [name, setName] = useState(admin?.name || 'System Administrator');
  const [department, setDepartment] = useState(admin?.department || 'Platform Core');
  const [collegeName, setCollegeName] = useState(admin?.college_name || 'CodeArena HQ');
  const [bio, setBio] = useState(admin?.bio || 'Lead System Architect & Admin');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleOpenProfile = () => {
    setName(admin?.name || 'System Administrator');
    setDepartment(admin?.department || 'Platform Core');
    setCollegeName(admin?.college_name || 'CodeArena HQ');
    setBio(admin?.bio || 'Lead System Architect & Admin');
    setSaveSuccess(false);
    setSaveError(null);
    setIsProfileOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await axios.put('/api/v1/students/profile', {
        name: name.trim(),
        department: department.trim(),
        college_name: collegeName.trim(),
        bio: bio.trim(),
      });

      if (res.data) {
        updateAdmin(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update admin profile:', err);
      setSaveError(err.response?.data?.detail || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (admin?.name || 'System Admin')
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          {/* Mobile Hamburger Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={toggleSidebar}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div style={{ minWidth: 0 }}>
            <h1 className="header-title" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="header-subtitle" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* System Status Pill */}
          <div className="status-pill" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            borderRadius: '20px',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            color: 'var(--success)',
            fontSize: '12px',
            fontWeight: 600
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--success)',
              boxShadow: '0 0 8px var(--success)'
            }}></span>
            <span>FastAPI Engine Online</span>
          </div>

          {/* Notifications */}
          <button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <Bell size={18} />
          </button>

          {/* Theme Toggle (Light / Dark mode matching Flutter) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="var(--warning)" /> : <Moon size={18} color="var(--primary)" />}
          </button>

          {/* Clickable Admin Profile */}
          <div
            onClick={handleOpenProfile}
            title="Click to view & edit admin profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              backgroundColor: 'var(--surface-elevated)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--error), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px'
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {admin?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Super Admin
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </header>

      {/* Admin Profile Modal */}
      {isProfileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '28px',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--error)'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Administrator Profile
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Master User Credentials & Settings
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsProfileOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Notification Alerts */}
            {saveSuccess && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: 'var(--success)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <Check size={16} />
                <span>Profile details successfully updated in database!</span>
              </div>
            )}

            {saveError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--error)',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {saveError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ paddingLeft: '34px', width: '100%', height: '40px', fontSize: '13px' }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      value={admin?.email || 'admin@codearena.com'}
                      disabled
                      style={{ paddingLeft: '34px', width: '100%', height: '40px', fontSize: '13px', opacity: 0.7, cursor: 'not-allowed' }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Organization / College</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      style={{ paddingLeft: '34px', width: '100%', height: '40px', fontSize: '13px' }}
                    />
                    <Building size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Department</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      style={{ paddingLeft: '34px', width: '100%', height: '40px', fontSize: '13px' }}
                    />
                    <Briefcase size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Administrator Bio</label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ width: '100%', paddingLeft: '34px', fontSize: '13px', resize: 'vertical' }}
                  />
                  <FileText size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsProfileOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                    style={{ minWidth: '120px' }}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
