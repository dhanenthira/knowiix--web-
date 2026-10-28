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
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useUI } from '../../../context/UIContext';
import UserProfileModal from '../../../admin/components/UserProfileModal';
import KnowiixLogo from '../KnowiixLogo';
import logoImage from '../../../assets/knowiix-logo.jpg';
import './Navbar.css';

// User navigation items (Technical section updated)
const USER_NAV_ITEMS = [
  { name: 'Dashboard', path: '/student' },
  { name: 'Learning & Notes', path: '/learning' },
  { name: 'Daily Practice', path: '/daily-practice' },
  { name: 'Aptitude', path: '/aptitude' },
  { name: 'Technical', path: '/technical' }
];

// Admin navigation items
const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Students', path: '/students' },
  { name: 'Question Bank', path: '/questions' },
  { name: 'Aptitude Arena', path: '/aptitude' },
  { name: 'Technical Problems', path: '/coding' },
  { name: 'Learning & Notes', path: '/learning' },
  { name: 'Assessments', path: '/assessments' },
  { name: 'Battle Rooms', path: '/battles' },
  { name: 'Analytics', path: '/analytics' }
];

export default function Navbar({ variant }) {
  const { admin, logout, updateAdmin } = useAuth();
  const { theme, toggleTheme } = useUI();
  const location = useLocation();
  const navigate = useNavigate();

  // State for popups
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-hide navbar on scroll down, show on scroll up or click
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Always visible near top of page
          if (currentScrollY <= 30) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 70) {
            // Scrolling down -> hide navbar & close open popups/mobile menu
            setIsVisible(false);
            setIsMobileMenuOpen(false);
            setIsProfileMenuOpen(false);
            setIsNotifOpen(false);
            setIsSearchOpen(false);
          } else if (currentScrollY < lastScrollYRef.current) {
            // Scrolling up -> show navbar
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const brandTag = isVariantAdmin ? 'Admin' : '';

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
    if ((itemPath === '/technical' || itemPath === '/coding/practice') && (location.pathname.startsWith('/technical') || location.pathname.startsWith('/coding') || location.pathname.startsWith('/practice/coding') || location.pathname.startsWith('/practice/technical'))) {
      return true;
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  return (
    <>
      {!isVisible && (
        <div
          className="bolt-navbar-reveal-trigger"
          onClick={() => setIsVisible(true)}
          title="Click to show navigation bar"
          aria-hidden="true"
        />
      )}
      <header
        className={`bolt-navbar-header ${!isVisible ? 'navbar-hidden' : ''}`}
        onClick={() => {
          if (!isVisible) setIsVisible(true);
        }}
      >
        <div className="bolt-navbar-container">
          {/* ================= 1. BRAND SECTION (LEFT) ================= */}
          <Link to={brandLink} className="bolt-navbar-brand" title="Knowiix Learning Arena">
            <div className="bolt-brand-logo-box">
              <img src={logoImage} alt="Knowiix Logo" className="bolt-brand-logo-img" />
            </div>
            <span className="bolt-brand-title">Knowiix</span>
            {brandTag && (
              <span className={`bolt-brand-tag ${isVariantAdmin ? 'admin-badge' : 'user-badge'}`}>
                {brandTag}
              </span>
            )}
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
                      <div className="bolt-notif-title">New Technical Challenge Live</div>
                      <div className="bolt-notif-desc">Weekly Algorithm Contest is now live in Technical Practice Arena!</div>
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

            {/* 3.3 Dark / Light Mode Toggle */}
            <button
              type="button"
              className="bolt-action-icon-btn bolt-theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} style={{ color: '#F4B400' }} /> : <Moon size={17} style={{ color: '#4285F4' }} />}
            </button>

            {/* 3.4 User Profile Avatar - Directly Moves to Profile Page */}
            <button
              type="button"
              className="bolt-profile-avatar-capsule"
              onClick={() => {
                if (isVariantAdmin) {
                  setIsProfileModalOpen(true);
                } else {
                  navigate('/profile');
                }
              }}
              title="My Profile"
              aria-label="My Profile"
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
            </button>

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

        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            className="bolt-mobile-drawer-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation Drawer */}
        <div className={`bolt-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="bolt-mobile-drawer-header">
            <div className="bolt-mobile-user-info">
              <span className="bolt-mobile-user-name">{displayName}</span>
              {brandTag && <span className="bolt-mobile-user-role">{brandTag}</span>}
            </div>
          </div>
          <div className="bolt-mobile-drawer-nav">
            {navItems.map((item) => {
              const active = isTabActive(item.path, item.isAnchor);
              if (item.isAnchor) {
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`bolt-nav-pill-btn ${active ? 'active' : ''}`}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleAnchorClick(e, item.path);
                    }}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          <div className="bolt-mobile-drawer-footer">
            <button
              className="bolt-mobile-profile-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} style={{ color: '#F4B400' }} /> : <Moon size={16} style={{ color: '#4285F4' }} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              className="bolt-mobile-profile-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isVariantAdmin) {
                  setIsProfileModalOpen(true);
                } else {
                  navigate('/profile');
                }
              }}
            >
              <User size={16} />
              <span>My Profile</span>
            </button>
            <button
              className="bolt-mobile-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="bolt-navbar-spacer" aria-hidden="true" />

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
