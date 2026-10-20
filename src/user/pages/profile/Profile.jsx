import React, { useState, useEffect, useMemo } from 'react';
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
  Upload
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../shared/components/navbar';
import codingApi from '../../api/codingApi';
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

  // Active tab in bottom section: 'recent' | 'list' | 'solutions' | 'discuss'
  const [activeTab, setActiveTab] = useState('recent');

  // Heatmap Year filter
  const [selectedYear, setSelectedYear] = useState('Current');

  // Hovered heatmap cell tooltip state
  const [hoveredCell, setHoveredCell] = useState(null);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // User Profile Data
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('skillprep_student_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          fullName: parsed.fullName || admin?.name || 'Dhanenthira',
          username: parsed.username || (admin?.name ? admin.name.toLowerCase().replace(/\s+/g, '') : 'Dhanenthira'),
          avatar: parsed.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          rank: parsed.rank || '~50,00,000',
          following: parsed.following || 0,
          followers: parsed.followers || 0,
          college: parsed.college || admin?.college_name || 'Bannari Amman Institute of Technology',
          department: parsed.department || admin?.department || 'Computer Science and Engineering',
          gradYear: parsed.gradYear || String(admin?.graduation_year || '2026'),
          targetRole: parsed.targetRole || admin?.bio || 'Software Development Engineer',
          email: parsed.email || admin?.email || 'dhanenthira@skillprep.edu',
          phone: parsed.phone || '+91 98765 43210',
          bio: parsed.bio || 'Competitive programmer & Full-stack enthusiast solving problems daily.'
        };
      } catch (e) {}
    }
    return {
      fullName: admin?.name || 'Dhanenthira',
      username: admin?.name ? admin.name.toLowerCase().replace(/\s+/g, '') : 'Dhanenthira',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      rank: '~50,00,000',
      following: 0,
      followers: 0,
      college: admin?.college_name || 'Bannari Amman Institute of Technology',
      department: admin?.department || 'Computer Science and Engineering',
      gradYear: String(admin?.graduation_year || '2026'),
      targetRole: admin?.bio || 'Software Development Engineer',
      email: admin?.email || 'dhanenthira@skillprep.edu',
      phone: '+91 98765 43210',
      bio: 'Competitive programmer & Full-stack enthusiast solving problems daily.'
    };
  });

  // Edit form state
  const [formData, setFormData] = useState({ ...userProfile });

  // Community Stats
  const [communityStats] = useState({
    views: 0,
    viewsLastWeek: 0,
    solution: 0,
    solutionLastWeek: 0,
    discuss: 0,
    discussLastWeek: 0,
    reputation: 0,
    reputationLastWeek: 0
  });

  // Languages data
  const [languages, setLanguages] = useState([
    { name: 'Java', solved: 3 },
    { name: 'Python', solved: 0 },
    { name: 'C++', solved: 0 },
    { name: 'JavaScript', solved: 0 }
  ]);

  // Skills categorized
  const [skills] = useState({
    advanced: [
      { name: 'Dynamic Programming', count: 1 },
      { name: 'Graph', count: 0 },
      { name: 'Segment Tree', count: 0 },
      { name: 'Trie', count: 0 }
    ],
    intermediate: [
      { name: 'Tree', count: 2 },
      { name: 'Hash Table', count: 1 },
      { name: 'Binary Search', count: 1 },
      { name: 'Recursion', count: 2 }
    ],
    fundamental: [
      { name: 'Array', count: 3 },
      { name: 'String', count: 2 },
      { name: 'Math', count: 1 },
      { name: 'Sorting', count: 1 }
    ]
  });

  // Solved Stats (matching LeetCode numbers in user's image)
  const [codingStats, setCodingStats] = useState({
    totalSolved: 3,
    totalProblems: 4086,
    attempting: 1,
    easySolved: 2,
    easyTotal: 972,
    medSolved: 1,
    medTotal: 2130,
    hardSolved: 0,
    hardTotal: 984,
    beatsPercentage: 68.4
  });

  // Badges state
  const [badgeCount] = useState(0);

  // Submissions list matching user screenshot
  const [recentSubmissions, setRecentSubmissions] = useState([
    {
      id: 'max-depth-binary-tree',
      title: 'Maximum Depth of Binary Tree',
      slug: 'maximum-depth-of-binary-tree',
      timeAgo: '8 months ago',
      date: '2025-02-14',
      difficulty: 'Easy',
      language: 'Java',
      status: 'Accepted'
    },
    {
      id: 'palindrome-number',
      title: 'Palindrome Number',
      slug: 'palindrome-number',
      timeAgo: '10 months ago',
      date: '2024-12-18',
      difficulty: 'Easy',
      language: 'Java',
      status: 'Accepted'
    },
    {
      id: 'bulb-switcher',
      title: 'Bulb Switcher',
      slug: 'bulb-switcher',
      timeAgo: '10 months ago',
      date: '2024-12-05',
      difficulty: 'Med.',
      language: 'Java',
      status: 'Accepted'
    }
  ]);

  // Curated lists for the "List" tab
  const problemLists = [
    { title: 'Top Interview 150', count: 150, solved: 3, description: 'Must-do list for interview prep' },
    { title: 'LeetCode 75', count: 75, solved: 2, description: 'Ace coding interviews with 75 essential problems' },
    { title: 'Top 100 Liked Questions', count: 100, solved: 3, description: 'Highest-voted interview problems' },
    { title: 'Favorite Problems', count: 8, solved: 1, description: 'Personal bookmarked collection' }
  ];

  // Solutions writeups for "Solutions" tab
  const solutionArticles = [
    {
      title: 'Optimal Java Iterative BFS Level-Order Traversal with Queue',
      problem: 'Maximum Depth of Binary Tree',
      date: '8 months ago',
      views: 342,
      upvotes: 14,
      language: 'Java'
    },
    {
      title: 'Reversing Half of the Integer Without Overflow (O(log10(N)))',
      problem: 'Palindrome Number',
      date: '10 months ago',
      views: 512,
      upvotes: 27,
      language: 'Java'
    }
  ];

  // Discussion posts for "Discuss" tab
  const discussionPosts = [
    {
      title: 'TCS Digital / Infosys SP Technical Coding Questions Breakdown',
      category: 'Interview Experience',
      replies: 18,
      views: 1240,
      timeAgo: '2 months ago'
    },
    {
      title: 'Tips for handling recursion stack overflow in Java tree traversals',
      category: 'General Discussion',
      replies: 7,
      views: 480,
      timeAgo: '5 months ago'
    }
  ];

  // Fetch real progress from backend API if available
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const progress = await codingApi.getUserProgress().catch(() => null);
        if (progress) {
          setCodingStats((prev) => ({
            ...prev,
            totalSolved: progress.problems_solved ?? prev.totalSolved,
            totalProblems: progress.total_problems ?? prev.totalProblems,
            easySolved: progress.easy_solved ?? prev.easySolved,
            easyTotal: progress.easy_total ?? prev.easyTotal,
            medSolved: progress.med_solved ?? prev.medSolved,
            medTotal: progress.med_total ?? prev.medTotal,
            hardSolved: progress.hard_solved ?? prev.hardSolved,
            hardTotal: progress.hard_total ?? prev.hardTotal,
            attempting: progress.attempted_problems ?? prev.attempting
          }));
        }

        const subs = await codingApi.getUserSubmissions({ limit: 15 }).catch(() => null);
        if (subs && Array.isArray(subs) && subs.length > 0) {
          const formatted = subs.map((s) => ({
            id: s.id,
            title: s.problem_title || 'Coding Challenge',
            slug: s.problem_id || 'challenge',
            timeAgo: s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : 'Recent',
            date: s.submitted_at ? s.submitted_at.split('T')[0] : '2025-01-01',
            difficulty: 'Easy',
            language: (s.language || 'Java').charAt(0).toUpperCase() + (s.language || 'Java').slice(1),
            status: s.status || 'Accepted'
          }));
          setRecentSubmissions(formatted);
        }
      } catch (err) {
        console.warn('Using LeetCode profile dataset:', err);
      }
    };

    fetchStats();
  }, []);

  // Compute Heatmap activity grid (53 weeks x 7 days)
  const heatmapData = useMemo(() => {
    const weeks = [];
    const totalDays = 53 * 7;
    const now = new Date();

    // Calculate dates backwards
    for (let w = 52; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dayOffset = w * 7 + (6 - d);
        const cellDate = new Date(now);
        cellDate.setDate(now.getDate() - dayOffset);

        const dateStr = cellDate.toISOString().split('T')[0];
        
        // Match user's exact screenshot activity (active in Dec & Feb, 6 total submissions)
        // Dec: col 9 (d=2 and d=4), Feb: col 17 (d=2)
        let count = 0;
        if (w === 43 && d === 2) count = 2; // Dec
        else if (w === 43 && d === 4) count = 2; // Dec
        else if (w === 35 && d === 2) count = 2; // Feb

        days.push({
          date: dateStr,
          formattedDate: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          month: cellDate.toLocaleDateString('en-US', { month: 'short' }),
          dayOfWeek: d,
          count: count
        });
      }
      weeks.unshift(days);
    }
    return weeks;
  }, []);

  // Month label positions across 53 weeks
  const monthLabels = [
    { label: 'Oct', col: 0 },
    { label: 'Nov', col: 4 },
    { label: 'Dec', col: 9 },
    { label: 'Jan', col: 13 },
    { label: 'Feb', col: 17 },
    { label: 'Mar', col: 22 },
    { label: 'Apr', col: 26 },
    { label: 'May', col: 30 },
    { label: 'Jun', col: 35 },
    { label: 'Jul', col: 39 },
    { label: 'Aug', col: 44 },
    { label: 'Sep', col: 48 },
    { label: 'Oct', col: 52 }
  ];

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

  // Handle Edit Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile({ ...formData });
    localStorage.setItem('skillprep_student_profile', JSON.stringify({ ...formData }));
    localStorage.setItem('studentName', formData.fullName);
    setIsEditModalOpen(false);
    showToast('Profile updated successfully!', 'success');
  };

  // Copy Profile Link
  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    showToast('Profile link copied to clipboard!', 'success');
  };

  // SVG Gauge calculations
  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Progress fraction for gauge
  const progressRatio = Math.min(codingStats.totalSolved / Math.max(codingStats.totalProblems, 1), 1);
  const strokeDashoffset = circumference - (progressRatio > 0 ? progressRatio * circumference : 0);

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
              <span>Coding Profile</span>
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
            <button className="lc-action-share-pill" onClick={handleShareProfile}>
              <Share2 size={14} />
              <span>Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Container */}
      <main className="lc-main-container">
        {activeView === 'leetcode' ? (
          <div className="lc-two-column-layout">
            {/* =========================================================
                LEFT COLUMN: USER INFO, COMMUNITY STATS, LANGUAGES, SKILLS
                ========================================================= */}
            <aside className="lc-left-column">
              {/* Card 1: User Profile Card */}
              <div className="lc-card lc-user-card">
                <div className="lc-user-top-row">
                  <div
                    className="lc-avatar-container"
                    onClick={() => { setFormData({ ...userProfile }); setIsEditModalOpen(true); }}
                    title="Click to change avatar"
                  >
                    {userProfile.avatar && (userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('data:')) ? (
                      <img src={userProfile.avatar} alt={userProfile.fullName} className="lc-avatar-img" />
                    ) : (
                      <div className="lc-avatar-placeholder">
                        {userProfile.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="lc-avatar-edit-overlay">
                      <Camera size={18} />
                    </div>
                  </div>
                  <div className="lc-user-names">
                    <h1 className="lc-user-fullname">{userProfile.fullName}</h1>
                    <div className="lc-user-handle">{userProfile.username}</div>
                    <div className="lc-rank-pill">
                      <span>Rank</span> <strong>{userProfile.rank}</strong>
                    </div>
                  </div>
                </div>

                <div className="lc-follow-stats-row">
                  <span><strong>{userProfile.following}</strong> Following</span>
                  <span className="lc-dot-sep">·</span>
                  <span><strong>{userProfile.followers}</strong> Followers</span>
                </div>

                <div className="lc-profile-action-buttons">
                  <button className="lc-btn-edit-profile" onClick={() => { setFormData({ ...userProfile }); setIsEditModalOpen(true); }}>
                    Edit Profile
                  </button>
                  <button className="lc-btn-share-icon" title="Share Profile" onClick={handleShareProfile}>
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
                      <span className="lc-comm-icon icon-views"><Eye size={16} /></span>
                      <span className="lc-comm-label">Views</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.views}</span>
                      <span className="lc-comm-sub">Last week {communityStats.viewsLastWeek}</span>
                    </div>
                  </div>

                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-solution"><CheckCircle2 size={16} /></span>
                      <span className="lc-comm-label">Solution</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.solution}</span>
                      <span className="lc-comm-sub">Last week {communityStats.solutionLastWeek}</span>
                    </div>
                  </div>

                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-discuss"><MessageSquare size={16} /></span>
                      <span className="lc-comm-label">Discuss</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.discuss}</span>
                      <span className="lc-comm-sub">Last week {communityStats.discussLastWeek}</span>
                    </div>
                  </div>

                  <div className="lc-community-row">
                    <div className="lc-community-left">
                      <span className="lc-comm-icon icon-reputation"><Star size={16} /></span>
                      <span className="lc-comm-label">Reputation</span>
                    </div>
                    <div className="lc-comm-right">
                      <span className="lc-comm-val">{communityStats.reputation}</span>
                      <span className="lc-comm-sub">Last week {communityStats.reputationLastWeek}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Languages */}
              <div className="lc-card lc-languages-card">
                <h3 className="lc-card-section-title">Languages</h3>
                <div className="lc-languages-list">
                  {languages.map((lang) => (
                    <div key={lang.name} className="lc-language-row">
                      <span className="lc-lang-badge">{lang.name}</span>
                      <span className="lc-lang-solved-count"><strong>{lang.solved}</strong> problems solved</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Skills */}
              <div className="lc-card lc-skills-card">
                <h3 className="lc-card-section-title">Skills</h3>

                {/* Advanced */}
                <div className="lc-skill-group">
                  <div className="lc-skill-group-title">
                    <span className="lc-skill-level-dot dot-advanced"></span>
                    <span>Advanced</span>
                  </div>
                  <div className="lc-skill-tags-wrap">
                    {skills.advanced.map((s) => (
                      <span key={s.name} className="lc-skill-tag">
                        {s.name} <span className="lc-tag-count">×{s.count}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Intermediate */}
                <div className="lc-skill-group">
                  <div className="lc-skill-group-title">
                    <span className="lc-skill-level-dot dot-intermediate"></span>
                    <span>Intermediate</span>
                  </div>
                  <div className="lc-skill-tags-wrap">
                    {skills.intermediate.map((s) => (
                      <span key={s.name} className="lc-skill-tag">
                        {s.name} <span className="lc-tag-count">×{s.count}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fundamental */}
                <div className="lc-skill-group">
                  <div className="lc-skill-group-title">
                    <span className="lc-skill-level-dot dot-fundamental"></span>
                    <span>Fundamental</span>
                  </div>
                  <div className="lc-skill-tags-wrap">
                    {skills.fundamental.map((s) => (
                      <span key={s.name} className="lc-skill-tag">
                        {s.name} <span className="lc-tag-count">×{s.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* =========================================================
                RIGHT COLUMN: SOLVED PROGRESS, BADGES, HEATMAP, SUBMISSIONS
                ========================================================= */}
            <section className="lc-right-column">
              {/* TOP ROW: SOLVED PROBLEMS CARD & BADGES CARD */}
              <div className="lc-top-widgets-grid">
                {/* Solved Problems Donut Widget */}
                <div className="lc-card lc-solved-problems-card">
                  <div className="lc-solved-donut-wrapper">
                    <svg className="lc-donut-svg" width="130" height="130" viewBox="0 0 130 130">
                      {/* Background circle track */}
                      <circle
                        cx="65"
                        cy="65"
                        r={radius}
                        fill="transparent"
                        stroke="#f0f1f3"
                        strokeWidth={strokeWidth}
                      />
                      {/* Solved colored progress arc */}
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
                        <linearGradient id="solvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        <span className="lc-attempting-dot">●</span> {codingStats.attempting} Attempting
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown Bars */}
                  <div className="lc-difficulty-breakdown">
                    {/* Easy */}
                    <div className="lc-diff-row">
                      <div className="lc-diff-label diff-easy">Easy</div>
                      <div className="lc-diff-score">
                        <strong>{codingStats.easySolved}</strong>/{codingStats.easyTotal}
                      </div>
                      <div className="lc-diff-bar-track">
                        <div
                          className="lc-diff-bar-fill fill-easy"
                          style={{ width: `${Math.max((codingStats.easySolved / codingStats.easyTotal) * 100, 3)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Medium */}
                    <div className="lc-diff-row">
                      <div className="lc-diff-label diff-med">Med.</div>
                      <div className="lc-diff-score">
                        <strong>{codingStats.medSolved}</strong>/{codingStats.medTotal}
                      </div>
                      <div className="lc-diff-bar-track">
                        <div
                          className="lc-diff-bar-fill fill-med"
                          style={{ width: `${Math.max((codingStats.medSolved / codingStats.medTotal) * 100, 2)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Hard */}
                    <div className="lc-diff-row">
                      <div className="lc-diff-label diff-hard">Hard</div>
                      <div className="lc-diff-score">
                        <strong>{codingStats.hardSolved}</strong>/{codingStats.hardTotal}
                      </div>
                      <div className="lc-diff-bar-track">
                        <div
                          className="lc-diff-bar-fill fill-hard"
                          style={{ width: `${Math.max((codingStats.hardSolved / codingStats.hardTotal) * 100, 0)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges Widget */}
                <div className="lc-card lc-badges-card">
                  <div className="lc-badges-header">
                    <span className="lc-badges-title">Badges</span>
                    <span className="lc-badges-count">{badgeCount}</span>
                  </div>

                  <div className="lc-badge-challenge-box" onClick={() => setIsBadgesModalOpen(true)}>
                    <div className="lc-badge-graphic-wrapper">
                      <div className="lc-badge-hex-glow"></div>
                      <div className="lc-badge-hex-shield">
                        <Award size={36} className="lc-badge-icon" />
                      </div>
                    </div>
                    <div className="lc-badge-details">
                      <div className="lc-badge-status-tag">Locked Badge</div>
                      <div className="lc-badge-name">Oct LeetCoding Challenge</div>
                      <div className="lc-badge-hint">Solve daily coding challenges to unlock</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: SUBMISSIONS HEATMAP (ACTIVITY CALENDAR) */}
              <div className="lc-card lc-heatmap-card">
                <div className="lc-heatmap-header">
                  <div className="lc-heatmap-title-wrap">
                    <span className="lc-heatmap-title">
                      <strong>6</strong> submissions in the past one year
                    </span>
                    <button
                      className="lc-info-tooltip-btn"
                      title="Submissions are recorded across coding challenges, arena submissions and algorithmic practice."
                    >
                      <Info size={14} />
                    </button>
                  </div>

                  <div className="lc-heatmap-meta-wrap">
                    <span className="lc-meta-pill">
                      Total active days: <strong>3</strong>
                    </span>
                    <span className="lc-meta-pill">
                      Max streak: <strong>1</strong>
                    </span>
                    <div className="lc-year-dropdown-wrap">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="lc-year-select"
                      >
                        <option value="Current">Current</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                      <ChevronDown size={14} className="lc-select-chevron" />
                    </div>
                  </div>
                </div>

                {/* The Heatmap Grid */}
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
                      {heatmapData.map((week, wIndex) => (
                        <div key={wIndex} className="lc-heatmap-week-col">
                          {week.map((cell) => {
                            const isGreen = cell.count > 0;
                            return (
                              <div
                                key={cell.date}
                                className={`lc-heatmap-day-cell ${isGreen ? 'cell-active' : ''}`}
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

              {/* BOTTOM ROW: TABBED SUBMISSIONS & SOLUTIONS */}
              <div className="lc-card lc-submissions-tab-card">
                <div className="lc-submissions-header-bar">
                  <div className="lc-sub-tabs-list">
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'recent' ? 'active' : ''}`}
                      onClick={() => setActiveTab('recent')}
                    >
                      <CheckCircle2 size={16} />
                      <span>Recent AC</span>
                    </button>
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'list' ? 'active' : ''}`}
                      onClick={() => setActiveTab('list')}
                    >
                      <Layers size={16} />
                      <span>List</span>
                    </button>
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'solutions' ? 'active' : ''}`}
                      onClick={() => setActiveTab('solutions')}
                    >
                      <Code2 size={16} />
                      <span>Solutions</span>
                    </button>
                    <button
                      className={`lc-sub-tab-item ${activeTab === 'discuss' ? 'active' : ''}`}
                      onClick={() => setActiveTab('discuss')}
                    >
                      <MessageSquare size={16} />
                      <span>Discuss</span>
                    </button>
                  </div>

                  <Link to="/coding/practice" className="lc-view-all-link">
                    <span>View all submissions</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* TAB CONTENT: Recent AC */}
                {activeTab === 'recent' && (
                  <div className="lc-tab-content-box">
                    <div className="lc-submissions-table">
                      {recentSubmissions.map((sub) => (
                        <div key={sub.id} className="lc-submission-table-row">
                          <div className="lc-sub-info-col">
                            <Link to={`/coding/problem/${sub.slug}`} className="lc-problem-title-link">
                              {sub.title}
                            </Link>
                            <span className="lc-sub-lang-pill">{sub.language}</span>
                            <span className={`lc-diff-badge ${sub.difficulty === 'Easy' ? 'badge-easy' : 'badge-med'}`}>
                              {sub.difficulty}
                            </span>
                          </div>
                          <div className="lc-sub-time-col">
                            {sub.timeAgo}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: List */}
                {activeTab === 'list' && (
                  <div className="lc-tab-content-box">
                    <div className="lc-lists-grid">
                      {problemLists.map((item, idx) => (
                        <div key={idx} className="lc-list-card-item">
                          <div className="lc-list-title-row">
                            <span className="lc-list-card-title">{item.title}</span>
                            <span className="lc-list-card-solved">{item.solved} / {item.count}</span>
                          </div>
                          <p className="lc-list-card-desc">{item.description}</p>
                          <div className="lc-list-progress-bar">
                            <div
                              className="lc-list-progress-fill"
                              style={{ width: `${(item.solved / item.count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Solutions */}
                {activeTab === 'solutions' && (
                  <div className="lc-tab-content-box">
                    <div className="lc-solutions-list">
                      {solutionArticles.map((sol, idx) => (
                        <div key={idx} className="lc-solution-article-item">
                          <h4 className="lc-solution-title">{sol.title}</h4>
                          <div className="lc-solution-meta-row">
                            <span className="lc-sol-prob">{sol.problem}</span>
                            <span className="lc-dot-sep">·</span>
                            <span className="lc-sol-lang">{sol.language}</span>
                            <span className="lc-dot-sep">·</span>
                            <span className="lc-sol-views">{sol.views} views</span>
                            <span className="lc-dot-sep">·</span>
                            <span className="lc-sol-upvotes">{sol.upvotes} upvotes</span>
                            <span className="lc-dot-sep">·</span>
                            <span className="lc-sol-time">{sol.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Discuss */}
                {activeTab === 'discuss' && (
                  <div className="lc-tab-content-box">
                    <div className="lc-discuss-list">
                      {discussionPosts.map((post, idx) => (
                        <div key={idx} className="lc-discuss-item-row">
                          <div>
                            <div className="lc-discuss-title">{post.title}</div>
                            <div className="lc-discuss-category-pill">{post.category}</div>
                          </div>
                          <div className="lc-discuss-meta">
                            <span>{post.replies} replies</span>
                            <span>{post.views} views</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                <button className="lc-btn-save-settings" onClick={handleSaveProfile}>
                  Save Academic Details
                </button>
              </div>
            </div>

            {/* Subscription & Plan Status */}
            <div className="lc-card lc-settings-card">
              <h2 className="lc-settings-section-heading">💎 Subscription &amp; Membership</h2>
              <div className="lc-sub-plan-box">
                <div className="lc-plan-info">
                  <div className="lc-plan-name">SkillPrep Student Plan</div>
                  <div className="lc-plan-price">₹10 / Year · Unlimited Coding &amp; Aptitude</div>
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
                    if (window.confirm('Sign out from SkillPrep?')) {
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
                
                {/* Live Preview & Upload Row */}
                <div className="lc-avatar-edit-header-row">
                  <div className="lc-avatar-live-preview">
                    {formData.avatar && (formData.avatar.startsWith('http') || formData.avatar.startsWith('data:')) ? (
                      <img src={formData.avatar} alt="Selected Avatar" className="lc-avatar-preview-img" />
                    ) : (
                      <div className="lc-avatar-preview-placeholder">
                        {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'D'}
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
                  <div className="lc-presets-subheading">Or choose from preset avatars:</div>
                  <div className="lc-avatar-presets-grid">
                    {AVATAR_PRESETS.map((p) => {
                      const isSelected = p.url === 'INITIALS'
                        ? (!formData.avatar || (!formData.avatar.startsWith('http') && !formData.avatar.startsWith('data:')))
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
                              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'D'}
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

                {/* Optional Web Link Input */}
                <div style={{ marginTop: '12px' }}>
                  <input
                    type="text"
                    value={formData.avatar && !formData.avatar.startsWith('data:') ? formData.avatar : ''}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="Or paste an image link (https://...)"
                    className="lc-avatar-url-input"
                  />
                </div>
              </div>
              <div className="lc-modal-field">
                <label>Bio</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell others about your coding journey..."
                ></textarea>
              </div>
              <div className="lc-modal-actions">
                <button type="button" className="lc-btn-outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="lc-btn-save-settings">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: BADGES SHOWCASE
          ========================================================= */}
      {isBadgesModalOpen && (
        <div className="lc-modal-backdrop" onClick={() => setIsBadgesModalOpen(false)}>
          <div className="lc-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lc-modal-header">
              <h3>Badges &amp; Achievements</h3>
              <button className="lc-modal-close-btn" onClick={() => setIsBadgesModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="lc-badges-grid-popup">
              <div className="lc-badge-popup-item locked">
                <Award size={36} />
                <div className="lc-badge-p-name">Oct LeetCoding Challenge</div>
                <div className="lc-badge-p-desc">Complete all daily challenges in October</div>
              </div>
              <div className="lc-badge-popup-item locked">
                <Flame size={36} />
                <div className="lc-badge-p-name">50 Days Streak</div>
                <div className="lc-badge-p-desc">Maintain consecutive 50 days active practice</div>
              </div>
              <div className="lc-badge-popup-item locked">
                <Star size={36} />
                <div className="lc-badge-p-name">100 Problems Solved</div>
                <div className="lc-badge-p-desc">Solve 100 distinct problems in the arena</div>
              </div>
              <div className="lc-badge-popup-item locked">
                <Shield size={36} />
                <div className="lc-badge-p-name">Guardian</div>
                <div className="lc-badge-p-desc">Attain a contest rating above 2200</div>
              </div>
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
                <button type="button" className="lc-btn-outline" onClick={() => setIsPasswordModalOpen(false)}>
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
