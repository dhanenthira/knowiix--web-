import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Edit3,
  Share2,
  CheckCircle2,
  Eye,
  MessageSquare,
  Award,
  Star,
  Flame,
  Code2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Info,
  Lock,
  ExternalLink,
  Shield,
  CreditCard,
  Key,
  LogOut,
  X,
  Check,
  TrendingUp,
  Layers,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  Building,
  GraduationCap,
  Briefcase,
  Camera,
  Upload,
  Globe,
  Github,
  Linkedin,
  AlertCircle,
  RefreshCw,
  Trophy,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../shared/components/navbar';
import technicalApi, { codingApi } from '../../api/technicalApi';
import './Profile.css';

const AVATAR_PRESETS = [
  { id: 'p1', label: 'Dev Portrait (Smile)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80' },
  { id: 'p2', label: 'Engineer Guy', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { id: 'p3', label: 'Tech Woman', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 'p4', label: 'Casual Coder', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  { id: 'p5', label: 'Leader', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80' },
  { id: 'p6', label: 'Hacker', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' },
  { id: 'p7', label: 'Code Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dhanenthira' },
  { id: 'p8', label: 'LeetCoder', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dhanen' },
  { id: 'p9', label: 'Pixel Hero', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CoderHero' },
  { id: 'p10', label: 'Initials', url: 'INITIALS' }
];

export default function Profile() {
  const { admin, updateAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Active view: 'leetcode' (LeetCode profile) or 'settings' (Academic & Account settings)
  const [activeView, setActiveView] = useState('leetcode');

  // Sub-tabs in bottom section
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'contests' | 'analytics' | 'badges' | 'skills'

  // Loading & Global error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Heatmap Year filter
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [hoveredCell, setHoveredCell] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // --- Real Profile State ---
  const [profileData, setProfileData] = useState({
    username: admin?.name ? admin.name.toLowerCase().replace(/\s+/g, '') : 'coder',
    fullName: admin?.name || 'Coder',
    avatar: admin?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'Competitive programmer solving problems daily.',
    college: admin?.college_name || 'Institute of Technology',
    country: 'India',
    githubUrl: '',
    linkedinUrl: '',
    createdAt: null,
    globalRank: 1,
    currentStreak: 0,
    totalSolved: 0,
    email: admin?.email || '',
    department: admin?.department || 'Computer Science',
    gradYear: String(admin?.graduation_year || '2026'),
    targetRole: admin?.bio || 'Software Development Engineer'
  });

  // Edit form state
  const [formData, setFormData] = useState({ ...profileData });

  // Coding Statistics State (Real from MySQL)
  const [codingStats, setCodingStats] = useState({
    totalSolved: 0,
    totalProblems: 0,
    solvingPercentage: 0,
    easySolved: 0,
    easyTotal: 0,
    medSolved: 0,
    medTotal: 0,
    hardSolved: 0,
    hardTotal: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    acceptanceRate: 0,
    attemptingCount: 0,
    beatsPercentage: 0
  });

  // Activity & Heatmap State
  const [activityData, setActivityData] = useState({
    year: currentYear,
    availableYears: [currentYear, currentYear - 1, currentYear - 2],
    totalSubmissions: 0,
    activeDays: 0,
    currentStreak: 0,
    maxStreak: 0,
    calendar: {}
  });

  // Contest Performance State
  const [contestData, setContestData] = useState({
    currentRating: 1500,
    bestRating: 1500,
    contestsAttended: 0,
    globalRank: null,
    ratingHistory: [],
    participations: []
  });

  // Performance Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    languages: [],
    solvedOverTime: []
  });

  // Topic Skills State
  const [skillsData, setSkillsData] = useState({
    fundamental: [],
    intermediate: [],
    advanced: []
  });

  // Badges State
  const [badgesData, setBadgesData] = useState({
    earnedCount: 0,
    totalBadges: 0,
    badges: []
  });

  // Submissions Table State (Filters & Pagination)
  const [submissionsList, setSubmissionsList] = useState([]);
  const [submissionsPagination, setSubmissionsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [submissionFilters, setSubmissionFilters] = useState({
    difficulty: 'all',
    status: 'all',
    language: 'all'
  });
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Community Stats
  const [communityStats] = useState({
    views: 142,
    viewsLastWeek: 18,
    solution: 12,
    solutionLastWeek: 2,
    discuss: 5,
    discussLastWeek: 1,
    reputation: 64,
    reputationLastWeek: 8
  });

  // Fetch all user profile sections from Backend
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Profile Info
      const profileRes = await codingApi.getUserProfile('me').catch(() => null);
      if (profileRes) {
        const mappedProfile = {
          username: profileRes.username || 'coder',
          fullName: profileRes.full_name || admin?.name || 'Coder',
          avatar: profileRes.avatar_url || admin?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          bio: profileRes.bio || 'Competitive programmer & algorithm enthusiast.',
          college: profileRes.college || admin?.college_name || 'Institute of Technology',
          country: profileRes.country || 'India',
          githubUrl: profileRes.github_url || '',
          linkedinUrl: profileRes.linkedin_url || '',
          createdAt: profileRes.created_at,
          globalRank: profileRes.global_rank || 1,
          currentStreak: profileRes.current_streak || 0,
          totalSolved: profileRes.total_solved || 0,
          email: profileRes.email || admin?.email || '',
          department: admin?.department || 'Computer Science',
          gradYear: String(admin?.graduation_year || '2026'),
          targetRole: admin?.bio || 'Software Development Engineer'
        };
        setProfileData(mappedProfile);
        setFormData(mappedProfile);
      }

      // 2. Fetch Coding Statistics
      const statsRes = await codingApi.getUserStats('me').catch(() => null);
      if (statsRes) {
        setCodingStats({
          totalSolved: statsRes.total_solved ?? 0,
          totalProblems: statsRes.total_problems ?? 0,
          solvingPercentage: statsRes.solving_percentage ?? 0,
          easySolved: statsRes.easy?.solved ?? statsRes.easy_solved ?? 0,
          easyTotal: statsRes.easy?.total ?? statsRes.easy_total ?? 0,
          medSolved: statsRes.medium?.solved ?? statsRes.med_solved ?? 0,
          medTotal: statsRes.medium?.total ?? statsRes.med_total ?? 0,
          hardSolved: statsRes.hard?.solved ?? statsRes.hard_solved ?? 0,
          hardTotal: statsRes.hard?.total ?? statsRes.hard_total ?? 0,
          totalSubmissions: statsRes.total_submissions ?? 0,
          acceptedSubmissions: statsRes.accepted_submissions ?? 0,
          acceptanceRate: statsRes.acceptance_rate ?? 0,
          attemptingCount: statsRes.attempting ?? statsRes.attempting_count ?? 0,
          beatsPercentage: statsRes.beats_percentage ?? 0
        });
      }

      // 3. Fetch Contests
      const contestsRes = await codingApi.getUserContests('me').catch(() => null);
      if (contestsRes) {
        setContestData({
          currentRating: contestsRes.current_rating || 1500,
          bestRating: contestsRes.best_rating || 1500,
          contestsAttended: contestsRes.contests_attended || 0,
          globalRank: contestsRes.global_rank,
          ratingHistory: contestsRes.rating_history || [],
          participations: contestsRes.history || contestsRes.participations || []
        });
      }

      // 4. Fetch Skills
      const skillsRes = await codingApi.getUserSkills('me').catch(() => null);
      if (skillsRes) {
        setSkillsData({
          fundamental: skillsRes.fundamental || [],
          intermediate: skillsRes.intermediate || [],
          advanced: skillsRes.advanced || []
        });
      }

      // 5. Fetch Badges
      const badgesRes = await codingApi.getUserBadges('me').catch(() => null);
      if (badgesRes) {
        setBadgesData({
          earnedCount: badgesRes.earned_count || 0,
          totalBadges: badgesRes.total_badges || 0,
          badges: badgesRes.badges || []
        });
      }

      // 6. Fetch Analytics
      const analyticsRes = await codingApi.getUserAnalytics('me').catch(() => null);
      if (analyticsRes) {
        setAnalyticsData({
          languages: analyticsRes.languages || [],
          solvedOverTime: analyticsRes.solved_over_time || []
        });
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setError('Unable to load profile data. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Fetch Activity Heatmap when Year changes
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const yearParam = selectedYear === 'Current' ? null : parseInt(selectedYear, 10);
        const actRes = await codingApi.getUserActivity('me', yearParam).catch(() => null);
        if (actRes) {
          setActivityData({
            year: actRes.year,
            availableYears: actRes.available_years || [currentYear, currentYear - 1, currentYear - 2],
            totalSubmissions: actRes.total_submissions || 0,
            activeDays: actRes.active_days || 0,
            currentStreak: actRes.current_streak || 0,
            maxStreak: actRes.max_streak || 0,
            calendar: actRes.calendar || {}
          });
        }
      } catch (e) {
        console.warn('Failed to load activity heatmap:', e);
      }
    };
    fetchActivity();
  }, [selectedYear, currentYear]);

  // Fetch Submissions List when pagination or filters change
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoadingSubmissions(true);
      const params = {
        page: submissionsPagination.page,
        limit: submissionsPagination.limit
      };
      if (submissionFilters.difficulty !== 'all') {
        params.difficulty = submissionFilters.difficulty;
      }
      if (submissionFilters.status !== 'all') {
        params.status = submissionFilters.status;
      }
      if (submissionFilters.language !== 'all') {
        params.language = submissionFilters.language;
      }

      const res = await codingApi.getUserSubmissionsList('me', params).catch(() => null);
      if (res) {
        setSubmissionsList(res.submissions || []);
        setSubmissionsPagination((prev) => ({
          ...prev,
          total: res.total || 0,
          pages: res.total_pages || res.pages || 1
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch submissions list:', e);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [submissionsPagination.page, submissionsPagination.limit, submissionFilters]);

  // Trigger initial fetch
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Compute 53-week Heatmap grid from activityData.calendar
  const heatmapGrid = useMemo(() => {
    const weeks = [];
    const targetYear = activityData.year || currentYear;
    // For current year, calculate back 52 weeks from today. For past year, Jan 1 to Dec 31.
    const isCurrent = targetYear === currentYear;
    const endDate = isCurrent ? new Date() : new Date(targetYear, 11, 31);

    for (let w = 52; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const offset = w * 7 + (6 - d);
        const cellDate = new Date(endDate);
        cellDate.setDate(endDate.getDate() - offset);

        const dateStr = cellDate.toISOString().split('T')[0];
        const count = activityData.calendar[dateStr] || 0;

        days.push({
          date: dateStr,
          formattedDate: cellDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          month: cellDate.toLocaleDateString('en-US', { month: 'short' }),
          dayOfWeek: d,
          count: count
        });
      }
      weeks.unshift(days);
    }
    return weeks;
  }, [activityData.calendar, activityData.year, currentYear]);

  // Dynamic month labels across 53 weeks
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = '';
    heatmapGrid.forEach((week, wIdx) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth && wIdx % 4 === 0) {
        labels.push({ label: firstDay.month, col: wIdx });
        lastMonth = firstDay.month;
      }
    });
    return labels;
  }, [heatmapGrid]);

  // Handle Avatar Image File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Image size should be less than 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
        showToast('Photo selected! Click Save Changes to apply.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Edit Profile Save (Saves directly to MySQL)
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    try {
      setSavingProfile(true);
      const payload = {
        full_name: formData.fullName,
        avatar_url: formData.avatar,
        bio: formData.bio,
        college: formData.college,
        country: formData.country,
        github_url: formData.githubUrl,
        linkedin_url: formData.linkedinUrl
      };

      await codingApi.updateUserProfile(payload);

      // Update state and auth
      setProfileData((prev) => ({
        ...prev,
        ...formData
      }));

      if (updateAdmin) {
        updateAdmin({
          ...admin,
          name: formData.fullName,
          avatar_url: formData.avatar,
          college_name: formData.college,
          bio: formData.bio
        });
      }

      setIsEditModalOpen(false);
      showToast('Profile updated and saved to database!', 'success');
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Copy Profile Link
  const handleShareProfile = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Profile link copied to clipboard!', 'success');
    } else {
      showToast('Sharing not supported on this browser', 'info');
    }
  };

  // Circular gauge calculations
  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(
    codingStats.totalSolved / Math.max(codingStats.totalProblems, 1),
    1
  );
  const strokeDashoffset = circumference - (progressRatio > 0 ? progressRatio * circumference : 0);

  // Determine heatmap cell color intensity
  const getCellColorClass = (count) => {
    if (count === 0) return '';
    if (count === 1) return 'cell-lvl-1';
    if (count === 2) return 'cell-lvl-2';
    if (count >= 3 && count < 5) return 'cell-lvl-3';
    return 'cell-lvl-4';
  };

  return (
    <div className="lc-profile-wrapper">
      {/* 1. Global Navigation */}
      <Navbar variant="user" />

      {/* 2. Top Profile Sub-Navigation Banner */}
      <div className="lc-top-banner-bar">
        <div className="lc-top-banner-inner">
          <div className="lc-banner-tabs">
            <button
              className={`lc-banner-tab-btn ${activeView === 'leetcode' ? 'active' : ''}`}
              onClick={() => setActiveView('leetcode')}
            >
              <Code2 size={16} />
              <span>Technical Profile</span>
            </button>
            <button
              className={`lc-banner-tab-btn ${activeView === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveView('settings')}
            >
              <SlidersHorizontal size={16} />
              <span>Academic &amp; Account Settings</span>
            </button>
          </div>

          <div className="lc-banner-right-actions">
            <div className="lc-quick-stat-badge" title="Current Daily Streak">
              <Flame size={15} className="lc-flame-icon" />
              <span>Streak: <strong>{activityData.currentStreak || profileData.currentStreak}</strong> d</span>
            </div>
            <div className="lc-quick-stat-badge" title="Global Rank">
              <Trophy size={14} className="lc-trophy-icon" />
              <span>Rank: <strong>#{profileData.globalRank || 1}</strong></span>
            </div>
            <button className="lc-action-share-pill" onClick={handleShareProfile}>
              <Share2 size={14} />
              <span>Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Container */}
      <main className="lc-main-container">
        {loading && !profileData.username ? (
          <div className="lc-loading-state">
            <RefreshCw size={32} className="lc-spin" />
            <p>Loading LeetCode profile records from database...</p>
          </div>
        ) : error && !profileData.username ? (
          <div className="lc-error-state">
            <AlertCircle size={36} color="#d93025" />
            <p>{error}</p>
            <button className="lc-btn-save-settings" onClick={loadProfile}>
              Retry
            </button>
          </div>
        ) : activeView === 'leetcode' ? (
          <div className="lc-two-column-layout">
            {/* =========================================================
                LEFT COLUMN: USER INFO, SOCIALS, COMMUNITY, LANGUAGES, SKILLS
                ========================================================= */}
            <aside className="lc-left-column">
              {/* Card 1: User Profile Header Card */}
              <div className="lc-card lc-user-card">
                <div className="lc-user-top-row">
                  <div
                    className="lc-avatar-container"
                    onClick={() => {
                      setFormData({ ...profileData });
                      setIsEditModalOpen(true);
                    }}
                    title="Click to update avatar"
                  >
                    {profileData.avatar &&
                    (profileData.avatar.startsWith('http') || profileData.avatar.startsWith('data:')) ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.fullName}
                        className="lc-avatar-img"
                      />
                    ) : (
                      <div className="lc-avatar-placeholder">
                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="lc-avatar-edit-overlay">
                      <Camera size={18} />
                    </div>
                  </div>
                  <div className="lc-user-names">
                    <h1 className="lc-user-fullname">{profileData.fullName}</h1>
                    <div className="lc-user-handle">@{profileData.username}</div>
                    <div className="lc-rank-pill">
                      <span>Rank</span> <strong>#{profileData.globalRank || 1}</strong>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="lc-user-bio">
                  {profileData.bio || 'Competitive programmer & algorithm enthusiast.'}
                </p>

                {/* College, Country, Social Links */}
                <div className="lc-user-meta-list">
                  {profileData.college && (
                    <div className="lc-user-meta-item">
                      <Building size={14} className="lc-meta-icon" />
                      <span>{profileData.college}</span>
                    </div>
                  )}
                  {profileData.country && (
                    <div className="lc-user-meta-item">
                      <Globe size={14} className="lc-meta-icon" />
                      <span>{profileData.country}</span>
                    </div>
                  )}
                  {profileData.createdAt && (
                    <div className="lc-user-meta-item">
                      <Calendar size={14} className="lc-meta-icon" />
                      <span>Joined {new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Socials Row */}
                <div className="lc-social-links-row">
                  {profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lc-social-pill"
                      title="GitHub Profile"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profileData.linkedinUrl && (
                    <a
                      href={profileData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lc-social-pill"
                      title="LinkedIn Profile"
                    >
                      <Linkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>

                <div className="lc-profile-action-buttons">
                  <button
                    className="lc-btn-edit-profile"
                    onClick={() => {
                      setFormData({ ...profileData });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit3 size={14} />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    className="lc-btn-share-icon"
                    title="Share Profile"
                    onClick={handleShareProfile}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card 2: Community Stats */}
              <div className="lc-card lc-community-stats-card">
                <h3 className="lc-card-section-title">Community Stats</h3>
                <div className="lc-community-list">
                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-views">
                        <Eye size={16} />
                      </span>
                      <span className="lc-comm-label">Views</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.views}</span>
                      <span className="lc-comm-sub">Last week {communityStats.viewsLastWeek}</span>
                    </div>
                  </div>

                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-solution">
                        <CheckCircle2 size={16} />
                      </span>
                      <span className="lc-comm-label">Solution</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.solution}</span>
                      <span className="lc-comm-sub">Last week {communityStats.solutionLastWeek}</span>
                    </div>
                  </div>

                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-discuss">
                        <MessageSquare size={16} />
                      </span>
                      <span className="lc-comm-label">Discuss</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.discuss}</span>
                      <span className="lc-comm-sub">Last week {communityStats.discussLastWeek}</span>
                    </div>
                  </div>

                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-reputation">
                        <Star size={16} />
                      </span>
                      <span className="lc-comm-label">Reputation</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.reputation}</span>
                      <span className="lc-comm-sub">Last week {communityStats.reputationLastWeek}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Languages Breakdown (Database Driven) */}
              <div className="lc-card lc-languages-card">
                <h3 className="lc-card-section-title">Languages</h3>
                <div className="lc-languages-list">
                  {analyticsData.languages && analyticsData.languages.length > 0 ? (
                    analyticsData.languages.map((lang) => (
                      <div key={lang.language} className="lc-language-row">
                        <span className="lc-lang-badge">{lang.language}</span>
                        <span className="lc-lang-solved-count">
                          <strong>{lang.count}</strong> problems solved
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="lc-empty-inline-state">
                      <span>No submissions recorded yet</span>
                    </div>
                  )}
                </div>
              </div>

            </aside>

            {/* =========================================================
                RIGHT COLUMN: SOLVED PROGRESS, BADGES, CONTESTS, HEATMAP, SUBMISSIONS
                ========================================================= */}
            <section className="lc-right-column">
              {/* TOP ROW: SOLVED PROBLEMS CARD & BADGES CARD */}
              <div className="lc-top-widgets-grid">
                {/* Solved Problems Donut Widget */}
                <div className="lc-card lc-solved-problems-card">
                  <div className="lc-solved-donut-wrapper">
                    <svg
                      className="lc-donut-svg"
                      width="130"
                      height="130"
                      viewBox="0 0 130 130"
                    >
                      <circle
                        cx="65"
                        cy="65"
                        r={radius}
                        fill="transparent"
                        stroke="#f0f1f3"
                        strokeWidth={strokeWidth}
                      />
                      <circle
                        cx="65"
                        cy="65"
                        r={radius}
                        fill="transparent"
                        stroke="url(#solvedGradient)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 65 65)"
                      />
                      <defs>
                        <linearGradient
                          id="solvedGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#00b8a3" />
                          <stop offset="60%" stopColor="#ffc01e" />
                          <stop offset="100%" stopColor="#ff375f" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="lc-donut-center-text">
                      <div className="lc-donut-count">
                        <span className="lc-count-solved">{codingStats.totalSolved}</span>
                        <span className="lc-count-total">/{codingStats.totalProblems}</span>
                      </div>
                      <div className="lc-donut-solved-label">
                        <Check size={14} className="lc-check-icon" /> Solved
                      </div>
                      <div className="lc-donut-attempting-label">
                        <span className="lc-attempting-dot">●</span>{' '}
                        {codingStats.attemptingCount} Attempting
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown Bars */}
                  <div className="lc-difficulty-breakdown">
                    {/* Easy */}
                    <div className="lc-diff-row">
                      <div className="lc-diff-label diff-easy">Easy</div>
                      <div className="lc-diff-score">
                        <strong>{codingStats.easySolved}</strong>/
                        {codingStats.easyTotal}
                      </div>
                      <div className="lc-diff-bar-track">
                        <div
                          className="lc-diff-bar-fill fill-easy"
                          style={{
                            width: `${
                              codingStats.easyTotal > 0
                                ? Math.max((codingStats.easySolved / codingStats.easyTotal) * 100, 2)
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Medium */}
                    <div className="lc-diff-row">
                      <div className="lc-diff-label diff-med">Med.</div>
                      <div className="lc-diff-score">
                        <strong>{codingStats.medSolved}</strong>/
                        {codingStats.medTotal}
                      </div>
                      <div className="lc-diff-bar-track">
                        <div
                          className="lc-diff-bar-fill fill-med"
                          style={{
                            width: `${
                              codingStats.medTotal > 0
                                ? Math.max((codingStats.medSolved / codingStats.medTotal) * 100, 2)
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Hard */}
                    <div className="lc-diff-row">
                      <div className="lc-diff-label diff-hard">Hard</div>
                      <div className="lc-diff-score">
                        <strong>{codingStats.hardSolved}</strong>/
                        {codingStats.hardTotal}
                      </div>
                      <div className="lc-diff-bar-track">
                        <div
                          className="lc-diff-bar-fill fill-hard"
                          style={{
                            width: `${
                              codingStats.hardTotal > 0
                                ? Math.max((codingStats.hardSolved / codingStats.hardTotal) * 100, 0)
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Acceptance Rate & Submissions */}
                    <div className="lc-stats-extra-metrics">
                      <div className="lc-extra-metric-item">
                        <span>Acceptance Rate</span>
                        <strong>{codingStats.acceptanceRate}%</strong>
                      </div>
                      <div className="lc-extra-metric-item">
                        <span>Total Submissions</span>
                        <strong>{codingStats.totalSubmissions}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges Widget */}
                <div className="lc-card lc-badges-card">
                  <div className="lc-badges-header">
                    <span className="lc-badges-title">Badges &amp; Achievements</span>
                    <span className="lc-badges-count">{badgesData.earnedCount}</span>
                  </div>

                  {badgesData.badges && badgesData.badges.length > 0 ? (
                    <div
                      className="lc-badge-challenge-box"
                      onClick={() => setIsBadgesModalOpen(true)}
                      title="Click to view all achievements"
                    >
                      <div className="lc-badge-graphic-wrapper">
                        <div className="lc-badge-hex-glow"></div>
                        <div className="lc-badge-hex-shield">
                          <Award size={36} className="lc-badge-icon" />
                        </div>
                      </div>
                      <div className="lc-badge-details">
                        <div className="lc-badge-status-tag">
                          {badgesData.earnedCount > 0 ? 'Unlocked Achievements' : 'Locked Badge'}
                        </div>
                        <div className="lc-badge-name">
                          {badgesData.earnedCount > 0
                            ? `${badgesData.earnedCount} Badges Unlocked`
                            : 'First Problem Challenge'}
                        </div>
                        <div className="lc-badge-hint">
                          {badgesData.earnedCount > 0
                            ? 'Keep solving to earn streak and contest awards'
                            : 'Solve your first problem to earn a badge'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="lc-badge-challenge-box"
                      onClick={() => setIsBadgesModalOpen(true)}
                    >
                      <div className="lc-badge-graphic-wrapper">
                        <div className="lc-badge-hex-shield">
                          <Award size={36} className="lc-badge-icon" />
                        </div>
                      </div>
                      <div className="lc-badge-details">
                        <div className="lc-badge-status-tag">Locked Badge</div>
                        <div className="lc-badge-name">First Problem Solved</div>
                        <div className="lc-badge-hint">Solve problems in the arena to unlock badges</div>
                      </div>
                    </div>
                  )}

                  <div className="lc-badges-quick-footer">
                    <button
                      className="lc-link-text-btn"
                      onClick={() => setIsBadgesModalOpen(true)}
                    >
                      View All {badgesData.totalBadges} Badges
                    </button>
                  </div>
                </div>
              </div>

              {/* CONTEST PERFORMANCE SECTION */}
              <div className="lc-card lc-contest-section-card">
                <div className="lc-card-header-with-actions">
                  <div className="lc-contest-headline">
                    <Trophy size={18} className="lc-trophy-gold" />
                    <span className="lc-card-title">Contest Performance</span>
                  </div>
                  <div className="lc-contest-stats-pills">
                    <span className="lc-stat-pill">
                      Rating: <strong>{contestData.currentRating}</strong>
                    </span>
                    <span className="lc-stat-pill">
                      Best: <strong>{contestData.bestRating}</strong>
                    </span>
                    <span className="lc-stat-pill">
                      Attended: <strong>{contestData.contestsAttended}</strong>
                    </span>
                    {contestData.globalRank && (
                      <span className="lc-stat-pill">
                        Rank: <strong>#{contestData.globalRank}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {contestData.ratingHistory && contestData.ratingHistory.length > 0 ? (
                  <div className="lc-contest-chart-wrapper">
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart
                        data={contestData.ratingHistory}
                        margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                        <XAxis
                          dataKey="date"
                          stroke="#9aa0a6"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#9aa0a6"
                          fontSize={12}
                          domain={['dataMin - 100', 'dataMax + 100']}
                          tickLine={false}
                        />
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="lc-chart-custom-tooltip">
                                  <div className="lc-tooltip-title">{d.contest_name}</div>
                                  <div className="lc-tooltip-row">
                                    <span>Date:</span> <strong>{d.date}</strong>
                                  </div>
                                  <div className="lc-tooltip-row">
                                    <span>Rating:</span> <strong>{d.rating}</strong>
                                  </div>
                                  <div className="lc-tooltip-row">
                                    <span>Rank:</span> <strong>#{d.rank || '-'}</strong>
                                  </div>
                                  <div className="lc-tooltip-row">
                                    <span>Problems Solved:</span> <strong>{d.solved}</strong>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#ffc01e"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#ffc01e', stroke: '#ffffff', strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: '#ff9800' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="lc-contest-empty-state">
                    <Trophy size={32} className="lc-empty-trophy-icon" />
                    <p className="lc-empty-main-text">No contest participation recorded yet</p>
                    <p className="lc-empty-sub-text">
                      Compete in weekly coding contests to establish your contest rating, global ranking, and climb the platform leaderboard!
                    </p>
                    <Link to="/coding/contests" className="lc-btn-participate">
                      Explore Contests
                    </Link>
                  </div>
                )}
              </div>

              {/* SUBMISSIONS HEATMAP (ACTIVITY CALENDAR) */}
              <div className="lc-card lc-heatmap-card">
                <div className="lc-heatmap-header">
                  <div className="lc-heatmap-title-wrap">
                    <span className="lc-heatmap-title">
                      <strong>{activityData.totalSubmissions}</strong> submissions in{' '}
                      {activityData.year}
                    </span>
                    <button
                      className="lc-info-tooltip-btn"
                      title="Daily submissions recorded across practice problems and coding contests."
                    >
                      <Info size={14} />
                    </button>
                  </div>

                  <div className="lc-heatmap-meta-wrap">
                    <span className="lc-meta-pill">
                      Total active days: <strong>{activityData.activeDays}</strong>
                    </span>
                    <span className="lc-meta-pill">
                      Current streak: <strong>{activityData.currentStreak}</strong>
                    </span>
                    <span className="lc-meta-pill">
                      Max streak: <strong>{activityData.maxStreak}</strong>
                    </span>
                    <div className="lc-year-dropdown-wrap">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="lc-year-select"
                      >
                        {activityData.availableYears.map((yr) => (
                          <option key={yr} value={String(yr)}>
                            {yr}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="lc-select-chevron" />
                    </div>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="lc-heatmap-scroll-area">
                  <div className="lc-heatmap-grid-container">
                    {/* Top Month Labels */}
                    <div className="lc-heatmap-months-row">
                      {monthLabels.map((m) => (
                        <span
                          key={m.label + m.col}
                          className="lc-month-label"
                          style={{ left: `${m.col * 14.5}px` }}
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>

                    {/* Weeks Columns */}
                    <div className="lc-heatmap-weeks-row">
                      {heatmapGrid.map((week, wIndex) => (
                        <div key={wIndex} className="lc-heatmap-week-col">
                          {week.map((cell) => {
                            const colorClass = getCellColorClass(cell.count);
                            return (
                              <div
                                key={cell.date}
                                className={`lc-heatmap-day-cell ${colorClass}`}
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredCell({
                                    date: cell.formattedDate,
                                    count: cell.count,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 10
                                  });
                                }}
                                onMouseLeave={() => setHoveredCell(null)}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Heatmap Tooltip */}
                {hoveredCell && (
                  <div
                    className="lc-heatmap-tooltip"
                    style={{ left: `${hoveredCell.x}px`, top: `${hoveredCell.y}px` }}
                  >
                    <strong>{hoveredCell.count} submissions</strong> on {hoveredCell.date}
                  </div>
                )}
              </div>

              {/* PERFORMANCE ANALYTICS SECTION (RECHARTS) */}
              <div className="lc-card lc-analytics-card">
                <div className="lc-card-header-with-actions">
                  <div className="lc-contest-headline">
                    <TrendingUp size={18} className="lc-trend-icon" />
                    <span className="lc-card-title">Performance Analytics</span>
                  </div>
                </div>

                <div className="lc-analytics-charts-grid">
                  {/* Chart 1: Solved Over Time */}
                  <div className="lc-sub-chart-box">
                    <h4 className="lc-sub-chart-title">Problems Solved Trend (Last 6 Months)</h4>
                    {analyticsData.solvedOverTime && analyticsData.solvedOverTime.length > 0 ? (
                      <ResponsiveContainer width="100%" height={190}>
                        <AreaChart
                          data={analyticsData.solvedOverTime}
                          margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00b8a3" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#00b8a3" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                          <XAxis dataKey="month" stroke="#9aa0a6" fontSize={11} tickLine={false} />
                          <YAxis stroke="#9aa0a6" fontSize={11} tickLine={false} />
                          <RechartsTooltip />
                          <Area
                            type="monotone"
                            dataKey="solved"
                            name="Cumulative Solved"
                            stroke="#00b8a3"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#areaGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="lc-empty-chart-box">
                        <span>No historical submissions yet</span>
                      </div>
                    )}
                  </div>

                  {/* Chart 2: Submissions by Language */}
                  <div className="lc-sub-chart-box">
                    <h4 className="lc-sub-chart-title">Submissions by Language</h4>
                    {analyticsData.languages && analyticsData.languages.length > 0 ? (
                      <ResponsiveContainer width="100%" height={190}>
                        <BarChart
                          data={analyticsData.languages}
                          margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
                          <XAxis dataKey="language" stroke="#9aa0a6" fontSize={11} tickLine={false} />
                          <YAxis stroke="#9aa0a6" fontSize={11} tickLine={false} />
                          <RechartsTooltip />
                          <Bar dataKey="count" name="Submissions" radius={[4, 4, 0, 0]}>
                            {analyticsData.languages.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  ['#4285F4', '#00b8a3', '#ffc01e', '#ea4335', '#a142f4'][
                                    index % 5
                                  ]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="lc-empty-chart-box">
                        <span>No language records recorded yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: TABBED SUBMISSIONS, CONTESTS, SKILLS & BADGES */}
              <div className="lc-card lc-submissions-tab-card">
                <div className="lc-submissions-header-bar">
                  <div className="lc-sub-tabs-list">
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'recent' ? 'active' : ''}`}
                      onClick={() => setActiveTab('recent')}
                    >
                      <CheckCircle2 size={16} />
                      <span>Recent Submissions</span>
                    </button>
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'skills' ? 'active' : ''}`}
                      onClick={() => setActiveTab('skills')}
                    >
                      <Layers size={16} />
                      <span>Topic Skills</span>
                    </button>
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'badges' ? 'active' : ''}`}
                      onClick={() => setActiveTab('badges')}
                    >
                      <Award size={16} />
                      <span>Badges ({badgesData.earnedCount})</span>
                    </button>
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'contests' ? 'active' : ''}`}
                      onClick={() => setActiveTab('contests')}
                    >
                      <Trophy size={16} />
                      <span>Contest History</span>
                    </button>
                  </div>

                  <Link to="/technical" className="lc-view-all-link">
                    <span>Arena Practice</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* TAB 1: RECENT SUBMISSIONS WITH FILTERS & PAGINATION */}
                {activeTab === 'recent' && (
                  <div className="lc-tab-content-box">
                    {/* Filter controls */}
                    <div className="lc-submissions-filter-row">
                      <div className="lc-filter-select-group">
                        <label>Difficulty:</label>
                        <select
                          value={submissionFilters.difficulty}
                          onChange={(e) =>
                            setSubmissionFilters((prev) => ({ ...prev, difficulty: e.target.value }))
                          }
                          className="lc-filter-select"
                        >
                          <option value="all">All Difficulties</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div className="lc-filter-select-group">
                        <label>Status:</label>
                        <select
                          value={submissionFilters.status}
                          onChange={(e) =>
                            setSubmissionFilters((prev) => ({ ...prev, status: e.target.value }))
                          }
                          className="lc-filter-select"
                        >
                          <option value="all">All Statuses</option>
                          <option value="accepted">Accepted</option>
                          <option value="wrong_answer">Wrong Answer</option>
                          <option value="time_limit_exceeded">Time Limit Exceeded</option>
                        </select>
                      </div>

                      <div className="lc-filter-select-group">
                        <label>Language:</label>
                        <select
                          value={submissionFilters.language}
                          onChange={(e) =>
                            setSubmissionFilters((prev) => ({ ...prev, language: e.target.value }))
                          }
                          className="lc-filter-select"
                        >
                          <option value="all">All Languages</option>
                          <option value="java">Java</option>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                      </div>
                    </div>

                    {/* Submissions Table */}
                    {loadingSubmissions ? (
                      <div className="lc-sub-loading-wrap">
                        <RefreshCw size={24} className="lc-spin" />
                        <span>Loading submission records...</span>
                      </div>
                    ) : submissionsList.length > 0 ? (
                      <div className="lc-submissions-table">
                        <div className="lc-sub-table-header">
                          <span className="col-title">Problem</span>
                          <span className="col-status">Status</span>
                          <span className="col-lang">Language</span>
                          <span className="col-runtime">Runtime</span>
                          <span className="col-memory">Memory</span>
                          <span className="col-time">Date</span>
                        </div>

                        {submissionsList.map((sub) => {
                          const isAc = sub.status?.toLowerCase() === 'accepted';
                          const diffClass =
                            sub.difficulty?.toLowerCase() === 'easy'
                              ? 'badge-easy'
                              : sub.difficulty?.toLowerCase() === 'hard'
                              ? 'badge-hard'
                              : 'badge-med';

                          return (
                            <div key={sub.id} className="lc-submission-table-row">
                              <div className="col-title">
                                <Link
                                  to={`/technical/problem/${sub.problem_id}`}
                                  className="lc-problem-title-link"
                                >
                                  {sub.problem_title}
                                </Link>
                                <span className={`lc-diff-badge ${diffClass}`}>
                                  {sub.difficulty}
                                </span>
                              </div>

                              <div className="col-status">
                                <span className={`lc-sub-status-pill ${isAc ? 'ac' : 'err'}`}>
                                  {sub.status}
                                </span>
                              </div>

                              <div className="col-lang">
                                <span className="lc-sub-lang-pill">{sub.language}</span>
                              </div>

                              <div className="col-runtime">
                                {sub.runtime_ms !== null ? `${sub.runtime_ms} ms` : '-'}
                              </div>

                              <div className="col-memory">
                                {sub.memory_mb !== null ? `${sub.memory_mb} MB` : '-'}
                              </div>

                              <div className="col-time">
                                {sub.submitted_at
                                  ? new Date(sub.submitted_at).toLocaleDateString()
                                  : '-'}
                              </div>
                            </div>
                          );
                        })}

                        {/* Pagination controls */}
                        <div className="lc-pagination-row">
                          <span className="lc-pagination-info">
                            Showing {(submissionsPagination.page - 1) * submissionsPagination.limit + 1} to{' '}
                            {Math.min(
                              submissionsPagination.page * submissionsPagination.limit,
                              submissionsPagination.total
                            )}{' '}
                            of {submissionsPagination.total} submissions
                          </span>

                          <div className="lc-pagination-buttons">
                            <button
                              className="lc-page-btn"
                              disabled={submissionsPagination.page <= 1}
                              onClick={() =>
                                setSubmissionsPagination((prev) => ({
                                  ...prev,
                                  page: Math.max(1, prev.page - 1)
                                }))
                              }
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <span className="lc-page-indicator">
                              Page {submissionsPagination.page} of {submissionsPagination.pages || 1}
                            </span>
                            <button
                              className="lc-page-btn"
                              disabled={submissionsPagination.page >= submissionsPagination.pages}
                              onClick={() =>
                                setSubmissionsPagination((prev) => ({
                                  ...prev,
                                  page: prev.page + 1
                                }))
                              }
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="lc-empty-submissions-state">
                        <Code2 size={36} color="#9aa0a6" />
                        <h4>No submissions match the selected filters</h4>
                        <p>Solve problems in the Arena to see your submission history and performance benchmarks.</p>
                        <Link to="/technical" className="lc-btn-save-settings">
                          Start Solving Problems
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TOPIC SKILLS BREAKDOWN */}
                {activeTab === 'skills' && (
                  <div className="lc-tab-content-box">
                    <div className="lc-skills-comprehensive-view">
                      {/* Fundamental */}
                      <div className="lc-skill-detail-category">
                        <h4 className="lc-skill-cat-title">
                          <span className="lc-skill-level-dot dot-fundamental"></span>
                          Fundamental Topics
                        </h4>
                        <div className="lc-skills-cards-grid">
                          {skillsData.fundamental.map((topic) => (
                            <div key={topic.name} className="lc-topic-progress-card">
                              <div className="lc-topic-header">
                                <span className="lc-topic-name">{topic.name}</span>
                                <span className="lc-topic-count">
                                  <strong>{topic.solved}</strong> / {topic.total} solved
                                </span>
                              </div>
                              <div className="lc-topic-progress-bar">
                                <div
                                  className="lc-topic-progress-fill fundamental"
                                  style={{
                                    width: `${
                                      topic.total > 0 ? (topic.solved / topic.total) * 100 : 0
                                    }%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Intermediate */}
                      <div className="lc-skill-detail-category">
                        <h4 className="lc-skill-cat-title">
                          <span className="lc-skill-level-dot dot-intermediate"></span>
                          Intermediate Topics
                        </h4>
                        <div className="lc-skills-cards-grid">
                          {skillsData.intermediate.map((topic) => (
                            <div key={topic.name} className="lc-topic-progress-card">
                              <div className="lc-topic-header">
                                <span className="lc-topic-name">{topic.name}</span>
                                <span className="lc-topic-count">
                                  <strong>{topic.solved}</strong> / {topic.total} solved
                                </span>
                              </div>
                              <div className="lc-topic-progress-bar">
                                <div
                                  className="lc-topic-progress-fill intermediate"
                                  style={{
                                    width: `${
                                      topic.total > 0 ? (topic.solved / topic.total) * 100 : 0
                                    }%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advanced */}
                      <div className="lc-skill-detail-category">
                        <h4 className="lc-skill-cat-title">
                          <span className="lc-skill-level-dot dot-advanced"></span>
                          Advanced Topics
                        </h4>
                        <div className="lc-skills-cards-grid">
                          {skillsData.advanced.map((topic) => (
                            <div key={topic.name} className="lc-topic-progress-card">
                              <div className="lc-topic-header">
                                <span className="lc-topic-name">{topic.name}</span>
                                <span className="lc-topic-count">
                                  <strong>{topic.solved}</strong> / {topic.total} solved
                                </span>
                              </div>
                              <div className="lc-topic-progress-bar">
                                <div
                                  className="lc-topic-progress-fill advanced"
                                  style={{
                                    width: `${
                                      topic.total > 0 ? (topic.solved / topic.total) * 100 : 0
                                    }%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: BADGES GALLERY */}
                {activeTab === 'badges' && (
                  <div className="lc-tab-content-box">
                    <div className="lc-badges-gallery-grid">
                      {badgesData.badges.map((b) => (
                        <div
                          key={b.id}
                          className={`lc-badge-card-item ${b.is_unlocked ? 'unlocked' : 'locked'}`}
                        >
                          <div className="lc-badge-item-icon">
                            {b.is_unlocked ? (
                              <Award size={40} className="icon-earned" />
                            ) : (
                              <Lock size={36} className="icon-locked" />
                            )}
                          </div>
                          <div className="lc-badge-item-title">{b.name}</div>
                          <p className="lc-badge-item-desc">{b.description}</p>
                          <div className="lc-badge-item-status">
                            {b.is_unlocked ? (
                              <span className="badge-earned-tag">
                                Earned {b.earned_at ? new Date(b.earned_at).toLocaleDateString() : ''}
                              </span>
                            ) : (
                              <span className="badge-locked-tag">
                                Criteria: {b.criteria || 'Solve required challenges'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CONTEST HISTORY TABLE */}
                {activeTab === 'contests' && (
                  <div className="lc-tab-content-box">
                    {contestData.participations && contestData.participations.length > 0 ? (
                      <div className="lc-contest-history-table">
                        <div className="lc-contest-table-header">
                          <span>Contest</span>
                          <span>Rating</span>
                          <span>Rank</span>
                          <span>Solved</span>
                          <span>Date</span>
                        </div>
                        {contestData.participations.map((part) => (
                          <div key={part.id} className="lc-contest-table-row">
                            <span className="contest-name">
                              <strong>{part.contest_title}</strong>
                            </span>
                            <span className="contest-rating">
                              <strong>{part.rating}</strong>
                            </span>
                            <span className="contest-rank">
                              #{part.rank || '-'}
                            </span>
                            <span className="contest-solved">
                              {part.solved_count} problems
                            </span>
                            <span className="contest-date">
                              {part.participated_at
                                ? new Date(part.participated_at).toLocaleDateString()
                                : '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="lc-empty-submissions-state">
                        <Trophy size={36} color="#9aa0a6" />
                        <h4>No contest participations yet</h4>
                        <p>Take part in scheduled coding rounds to gain ranking points and earn contest trophies!</p>
                        <Link to="/coding/contests" className="lc-btn-save-settings">
                          View Upcoming Contests
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* =========================================================
              VIEW 2: ACADEMIC & ACCOUNT SETTINGS (PRESERVING ALL FEATURES)
              ========================================================= */
          <div className="lc-settings-layout">
            <div className="lc-card lc-settings-card">
              <h2 className="lc-settings-section-heading">🎓 Academic Information</h2>
              <div className="lc-settings-form-grid">
                <div className="lc-settings-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="lc-settings-input"
                  />
                </div>
                <div className="lc-settings-field">
                  <label>College / University</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="lc-settings-input"
                  />
                </div>
                <div className="lc-settings-field">
                  <label>Department / Major</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="lc-settings-input"
                  />
                </div>
                <div className="lc-settings-field">
                  <label>Graduation Year</label>
                  <input
                    type="text"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    className="lc-settings-input"
                  />
                </div>
                <div className="lc-settings-field">
                  <label>Target Placement Role</label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="lc-settings-input"
                  />
                </div>
                <div className="lc-settings-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="lc-settings-input disabled"
                  />
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <button
                  className="lc-btn-save-settings"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving...' : 'Save Academic Details'}
                </button>
              </div>
            </div>

            {/* Subscription & Plan Status */}
            <div className="lc-card lc-settings-card">
              <h2 className="lc-settings-section-heading">💎 Subscription &amp; Membership</h2>
              <div className="lc-sub-plan-box">
                <div className="lc-plan-info">
                  <div className="lc-plan-name">Student Plan</div>
                  <div className="lc-plan-price">₹10 / Year · Unlimited Technical &amp; Aptitude</div>
                  <div className="lc-plan-expiry">Valid until August 2027 · Active Status</div>
                </div>
                <span className="lc-plan-active-badge">● Active</span>
              </div>
            </div>

            {/* Security & Credentials */}
            <div className="lc-card lc-settings-card">
              <h2 className="lc-settings-section-heading">🔒 Security &amp; Credentials</h2>
              <div className="lc-security-row">
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Account Password</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                    Protect your test rankings, solutions, and account credentials.
                  </p>
                </div>
                <button className="lc-btn-outline" onClick={() => setIsPasswordModalOpen(true)}>
                  Change Password
                </button>
              </div>

              <div className="lc-security-row" style={{ marginTop: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Sign Out from Session</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                    End active login tokens and return to the login screen.
                  </p>
                </div>
                <button
                  className="lc-btn-outline danger"
                  onClick={() => {
                    if (window.confirm('Sign out from your account?')) {
                      logout();
                      navigate('/login');
                    }
                  }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          MODAL: EDIT PROFILE
          ========================================================= */}
      {isEditModalOpen && (
        <div className="lc-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="lc-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lc-modal-header">
              <h3>Edit Profile</h3>
              <button className="lc-modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="lc-modal-form">
              <div className="lc-modal-field">
                <label>Display Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="lc-modal-field">
                <label>Username / Handle</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              {/* Avatar Selection Section */}
              <div className="lc-modal-field">
                <label className="lc-modal-field-title">Avatar Selection</label>
                <div className="lc-avatar-edit-header-row">
                  <div className="lc-avatar-live-preview">
                    {formData.avatar &&
                    (formData.avatar.startsWith('http') || formData.avatar.startsWith('data:')) ? (
                      <img
                        src={formData.avatar}
                        alt="Selected Avatar"
                        className="lc-avatar-preview-img"
                      />
                    ) : (
                      <div className="lc-avatar-preview-placeholder">
                        {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>

                  <div className="lc-avatar-upload-col">
                    <label className="lc-btn-upload-file">
                      <Upload size={14} />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <span className="lc-upload-hint">PNG, JPG or WebP (max 3MB)</span>
                  </div>
                </div>

                {/* Preset Avatars Grid */}
                <div className="lc-presets-container">
                  <div className="lc-presets-subheading">Or choose from presets:</div>
                  <div className="lc-avatar-presets-grid">
                    {AVATAR_PRESETS.map((p) => {
                      const isSelected =
                        p.url === 'INITIALS'
                          ? !formData.avatar ||
                            (!formData.avatar.startsWith('http') &&
                              !formData.avatar.startsWith('data:'))
                          : formData.avatar === p.url;

                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`lc-preset-avatar-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (p.url === 'INITIALS') {
                              setFormData({ ...formData, avatar: '' });
                            } else {
                              setFormData({ ...formData, avatar: p.url });
                            }
                          }}
                          title={p.label}
                        >
                          {p.url === 'INITIALS' ? (
                            <div className="lc-preset-initials">
                              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                          ) : (
                            <img src={p.url} alt={p.label} className="lc-preset-img" />
                          )}
                          {isSelected && (
                            <div className="lc-preset-check-badge">
                              <Check size={10} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lc-modal-field">
                <label>College / University</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Bannari Amman Institute of Technology"
                />
              </div>

              <div className="lc-modal-field">
                <label>Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                />
              </div>

              <div className="lc-modal-grid-2col">
                <div className="lc-modal-field">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="lc-modal-field">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="lc-modal-field">
                <label>Bio</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell others about your technical journey..."
                ></textarea>
              </div>

              <div className="lc-modal-actions">
                <button
                  type="button"
                  className="lc-btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lc-btn-save-settings"
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ALL BADGES SHOWCASE
          ========================================================= */}
      {isBadgesModalOpen && (
        <div className="lc-modal-backdrop" onClick={() => setIsBadgesModalOpen(false)}>
          <div className="lc-modal-card lc-badges-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lc-modal-header">
              <h3>Badges &amp; Achievements Gallery</h3>
              <button className="lc-modal-close-btn" onClick={() => setIsBadgesModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="lc-badges-grid-popup">
              {badgesData.badges.map((b) => (
                <div
                  key={b.id}
                  className={`lc-badge-popup-item ${b.is_unlocked ? 'unlocked' : 'locked'}`}
                >
                  {b.is_unlocked ? (
                    <Award size={36} className="icon-earned" />
                  ) : (
                    <Lock size={32} className="icon-locked" />
                  )}
                  <div className="lc-badge-p-name">{b.name}</div>
                  <div className="lc-badge-p-desc">{b.description}</div>
                  <div className="lc-badge-p-sub">
                    {b.is_unlocked ? (
                      <span className="badge-earned-tag">
                        Earned {b.earned_at ? new Date(b.earned_at).toLocaleDateString() : ''}
                      </span>
                    ) : (
                      <span>Requirement: {b.criteria || 'Solve challenges'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: CHANGE PASSWORD
          ========================================================= */}
      {isPasswordModalOpen && (
        <div className="lc-modal-backdrop" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="lc-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lc-modal-header">
              <h3>Change Password</h3>
              <button className="lc-modal-close-btn" onClick={() => setIsPasswordModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsPasswordModalOpen(false);
                showToast('Password updated securely!', 'success');
              }}
              className="lc-modal-form"
            >
              <div className="lc-modal-field">
                <label>Current Password</label>
                <input type="password" required placeholder="••••••••" />
              </div>
              <div className="lc-modal-field">
                <label>New Password</label>
                <input type="password" required placeholder="••••••••" />
              </div>
              <div className="lc-modal-actions">
                <button
                  type="button"
                  className="lc-btn-outline"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="lc-btn-save-settings">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="lc-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="lc-toast-item">
            <Check size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
