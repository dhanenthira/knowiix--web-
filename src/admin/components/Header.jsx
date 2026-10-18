import React, { useState } from 'react';
import { Bell, Menu, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import UserProfileModal from './UserProfileModal';

export default function Header({ title, subtitle }) {
  const { admin, updateAdmin } = useAuth();
  const { toggleSidebar, theme, toggleTheme } = useUI();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

          {/* Theme Toggle (Light / Dark mode) */}
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
            onClick={() => setIsProfileOpen(true)}
            title="Click to view & edit admin profile"
            role="button"
            tabIndex={0}
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
                {admin?.role === 'student' ? 'Student Member' : 'Super Admin'}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </header>

      {/* User Profile Details & Edit Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={admin}
        onUpdateUser={updateAdmin}
      />
    </>
  );
}

