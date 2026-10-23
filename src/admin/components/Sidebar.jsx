import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Code2,
  Calendar,
  ClipboardCheck,
  Swords,
  BarChart3,
  LogOut,
  Sparkles,
  ExternalLink,
  Globe,
  X,
  BookOpen,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import KnowiixLogo from '../../shared/components/KnowiixLogo';

export default function Sidebar() {
  const { logout } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Admin Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Question Bank', path: '/questions', icon: HelpCircle },
    { name: 'Aptitude Arena', path: '/aptitude', icon: Brain },
    { name: 'Coding Problems', path: '/coding', icon: Code2 },
    { name: 'Learning & Notes', path: '/learning', icon: BookOpen },
    { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
    { name: 'Battle Rooms', path: '/battles', icon: Swords },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <KnowiixLogo size="md" />
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              paddingLeft: '48px'
            }}>
              Admin Console
            </span>
          </div>

          {/* Close button on mobile */}
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav List */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Switch to Student Portal & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              window.open('/landing', '_blank');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success, #10b981)',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.25)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={14} />
              <span>Student Portal</span>
            </span>
            <ExternalLink size={14} />
          </button>



          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: 'var(--error)',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

