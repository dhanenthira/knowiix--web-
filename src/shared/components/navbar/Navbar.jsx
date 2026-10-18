import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserProfileModal from '../UserProfileModal';
import KnowiixLogo from '../KnowiixLogo';
import logoImage from '../../assets/knowiix-logo.jpg';
import './Navbar.css';

// User navigation items (functionality and menu items 100% preserved)
const USER_NAV_ITEMS = [
  { name: 'Dashboard', path: '/student' },
  { name: 'Learning & Notes', path: '/learning' },
  { name: 'Daily Practice', path: '/student#daily-practice-focus', isAnchor: true },
  { name: 'Aptitude', path: '/aptitude' },
  { name: 'Technical', path: '/questions?category=Technical' },
  { name: 'Coding', path: '/coding/practice' }
];

// Admin navigation items (functionality and menu items 100% preserved)
const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Students', path: '/students' },
  { name: 'Question Bank', path: '/questions' },
  { name: 'Aptitude Arena', path: '/aptitude' },
  { name: 'Coding Problems', path: '/coding' },
  { name: 'Learning & Notes', path: '/learning' },
  { name: 'Assessments', path: '/assessments' },
  { name: 'Battle Rooms', path: '/battles' },
  { name: 'Analytics', path: '/analytics' }
];

export default function Navbar({ variant }) {
  const { admin, logout, updateAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State for popups
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Determine if this navbar instance is Admin or User
  const isRoleAdmin = admin?.role === 'admin';
  const isVariantAdmin = variant ? variant === 'admin' : isRoleAdmin;

  const navItems = isVariantAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
  const brandLink = isVariantAdmin ? '/dashboard' : '/student';
  const brandTag = isVariantAdmin ? 'Admin' : 'Student';

  // Profile text & avatar details
  const displayName = admin?.name || (isVariantAdmin ? 'System Administrator' : 'Ananya Kumar');
  const userEmail = admin?.email || (isVariantAdmin ? 'admin@codearena.com' : 'ananya@student.edu');
  const avatarUrl = admin?.avatar_url || (isVariantAdmin
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80');

  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleAnchorClick = (e, path) => {
    e.preventDefault();
    const hash = path.split('#')[1];
    if (location.pathname === '/student') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/student');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isTabActive = (itemPath, isAnchor) => {
    if (isAnchor) {
      return location.hash === '#daily-practice-focus';
    }
    if (itemPath === '/student' && (location.pathname === '/student' || location.pathname === '/student/dashboard' || location.pathname === '/user/dashboard')) {
      return true;
    }
    if (itemPath === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    if (itemPath === '/coding/practice' && (location.pathname.startsWith('/coding') || location.pathname.startsWith('/practice/coding'))) {
      return true;
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  return (
    <>
      <header className="bolt-navbar-header">
        <div className="bolt-navbar-container">
          {/* ================= 1. BRAND SECTION (LEFT) ================= */}
          <Link to={brandLink} className="bolt-navbar-brand" title="Knowiix Learning Arena">
            <div className="bolt-brand-logo-box">
              <img src={logoImage} alt="Knowiix Logo" className="bolt-brand-logo-img" />
            </div>
            <span className="bolt-brand-title">Knowiix</span>
            <span className={`bolt-brand-tag ${isVariantAdmin ? 'admin-badge' : 'user-badge'}`}>
              {brandTag}
            </span>
          </Link>

          {/* ================= 2. SEGMENTED CAPSULE TRACK (CENTER) ================= */}
          <div className="bolt-nav-track-wrapper">
            <nav className="bolt-nav-track">
              {navItems.map((item) => {
                const active = isTabActive(item.path, item.isAnchor);

                if (item.isAnchor) {
                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      className={`bolt-nav-pill-btn ${active ? 'active' : ''}`}
                      onClick={(e) => handleAnchorClick(e, item.path)}
                    >
                      {item.name}
                    </a>
                  );
                }

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`bolt-nav-pill-btn ${active ? 'active' : ''}`}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* ================= 3. RIGHT ACTIONS CLUSTER ================= */}
          <div className="bolt-navbar-actions">
            {/* 3.1 Search Button (Matching Reference Image) */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button
                className="bolt-action-icon-btn"
                title="Search courses, questions, notes"
                aria-label="Search"
                onClick={() => setIsSearchOpen(prev => !prev)}
              >
                <Search size={17} />
              </button>

              {isSearchOpen && (
                <div className="bolt-quick-search-dropdown">
                  <div className="bolt-search-input-box">
                    <Search size={15} style={{ color: 'var(--color-muted-text, #5F6368)' }} />
                    <input
                      type="text"
                      placeholder="Quick search questions, topics, code..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          navigate(`/questions?search=${encodeURIComponent(searchQuery.trim())}`);
                          setIsSearchOpen(false);
                        }
                      }}
                      className="bolt-quick-search-input"
                    />
                    {searchQuery && (
                      <button className="bolt-search-clear-btn" onClick={() => setSearchQuery('')}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3.2 Notification Bell Button */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className="bolt-action-icon-btn"
                title="Notifications"
                aria-label="Notifications"
                onClick={() => setIsNotifOpen(prev => !prev)}
              >
                <Bell size={17} />
                <span className="bolt-notif-dot"></span>
              </button>

              {isNotifOpen && (
                <div className="bolt-notif-dropdown">
                  <div className="bolt-notif-list-header">
                    <span>Notifications</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-accent, #4285F4)', fontWeight: 500 }}>2 unread</span>
                  </div>
                  <div className="bolt-notif-item">
                    <span className="bolt-notif-bullet"></span>
                    <div>
                      <div className="bolt-notif-title">New Coding Challenge Live</div>
                      <div className="bolt-notif-desc">Weekly Algorithm Contest is now live in Coding Practice!</div>
                    </div>
                  </div>
                  <div className="bolt-notif-item">
                    <span className="bolt-notif-bullet" style={{ background: '#0F9D58' }}></span>
                    <div>
                      <div className="bolt-notif-title">Streak Milestone Achieved!</div>
                      <div className="bolt-notif-desc">You are on a 12-day active practice streak. Keep it up!</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3.3 User Profile Avatar with Caret (Matching Reference Image) */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div
                className="bolt-profile-avatar-capsule"
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                title="Account menu"
                role="button"
                tabIndex={0}
              >
                <div className="bolt-avatar-wrapper">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="bolt-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="bolt-avatar-fallback"
                    style={{ display: avatarUrl ? 'none' : 'flex' }}
                  >
                    {initials}
                  </div>
                </div>
                <ChevronDown size={14} className={`bolt-profile-caret ${isProfileMenuOpen ? 'open' : ''}`} />
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="bolt-dropdown-menu">
                  <div className="bolt-dropdown-header">
                    <div className="bolt-dropdown-user-name">{displayName}</div>
                    <div className="bolt-dropdown-user-email">{userEmail}</div>
                  </div>

                  <button
                    className="bolt-dropdown-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (isVariantAdmin) {
                        setIsProfileModalOpen(true);
                      } else {
                        navigate('/profile');
                      }
                    }}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </button>

                  <button
                    className="bolt-dropdown-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (isVariantAdmin) {
                        setIsProfileModalOpen(true);
                      } else {
                        navigate('/profile');
                      }
                    }}
                  >
                    <Settings size={15} />
                    <span>Account Settings</span>
                  </button>

                  <div className="bolt-dropdown-divider"></div>

                  <button
                    className="bolt-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              className="bolt-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`bolt-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => {
            const active = isTabActive(item.path, item.isAnchor);
            if (item.isAnchor) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  className={`bolt-nav-pill-btn ${active ? 'active' : ''}`}
                  onClick={(e) => handleAnchorClick(e, item.path)}
                >
                  {item.name}
                </a>
              );
            }
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`bolt-nav-pill-btn ${active ? 'active' : ''}`}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Admin Profile Modal */}
      {isVariantAdmin && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={admin}
          onUpdateUser={updateAdmin}
        />
      )}
    </>
  );
}
