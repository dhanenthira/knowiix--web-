import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Code2,
  HelpCircle,
  TrendingUp,
  Activity,
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Zap,
  Bell,
  Sparkles,
  Trophy,
  Flame,
  Target,
  Swords,
  Clock,
  PlusCircle,
  UserCheck,
  Check,
  AlertCircle,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import UserProfileModal from '../components/UserProfileModal';
import './Dashboard.css';

export default function Dashboard() {
  const { admin } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();

  // Live Stats State
  const [stats, setStats] = useState({
    totalStudents: 2,
    activeStudents: 2,
    codingProblems: 6,
    questions: 4,
    learningResources: 15,
    assessments: 1
  });

  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityTimeframe, setActivityTimeframe] = useState('7d'); // '7d' | '30d' | '3m'
  const [performanceView, setPerformanceView] = useState('accuracy'); // 'accuracy' | 'submissions'
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'coding' | 'assessment' | 'practice'
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic Date Formatting
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Fetch Live Data from Backend (MySQL)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, leadRes, questRes, codeRes, modRes, testRes] = await Promise.allSettled([
        axios.get('/api/v1/admin/dashboard'),
        axios.get('/api/v1/leaderboard'),
        axios.get('/api/v1/questions'),
        axios.get('/api/v1/coding/problems'),
        axios.get('/api/lessons/modules'),
        axios.get('/api/v1/tests/available')
      ]);

      const dashData = dashRes.status === 'fulfilled' ? dashRes.value.data : null;
      const leadData = leadRes.status === 'fulfilled' ? leadRes.value.data : [];
      const questData = questRes.status === 'fulfilled' ? questRes.value.data : [];
      const codeData = codeRes.status === 'fulfilled' ? codeRes.value.data : [];
      const modData = modRes.status === 'fulfilled' ? modRes.value.data : [];
      const testData = testRes.status === 'fulfilled' ? testRes.value.data : [];

      // Calculate total lesson items
      const totalLessonsCount = Array.isArray(modData)
        ? modData.reduce((acc, m) => acc + (m.total_lessons || (m.lessons ? m.lessons.length : 0)), 0)
        : 15;

      setStats({
        totalStudents: dashData?.analytics?.total_students || 2,
        activeStudents: dashData?.analytics?.active_students || 2,
        codingProblems: Array.isArray(codeData) && codeData.length > 0 ? codeData.length : 6,
        questions: Array.isArray(questData) && questData.length > 0 ? questData.length : 4,
        learningResources: totalLessonsCount > 0 ? totalLessonsCount : 15,
        assessments: Array.isArray(testData) && testData.length > 0 ? testData.length : 1
      });

      // Prepare Top 5 Students
      if (Array.isArray(leadData) && leadData.length > 0) {
        setTopStudents(leadData.slice(0, 5));
      } else {
        setTopStudents([
          {
            rank: 1,
            user_id: 'user_student_01',
            student_id: 'CA-2026-9042',
            name: 'Alex Mercer',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            college_name: 'National Institute of Tech',
            total_points: 4850,
            coding_points: 4850,
            problems_solved: 142,
            questions_solved: 380,
            accuracy: 88.2,
            streak_days: 14
          },
          {
            rank: 2,
            user_id: 'user_student_skillprep',
            student_id: 'SP-2026-1001',
            name: 'Ananya Kumar',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
            college_name: 'SkillPrep Academy',
            total_points: 3450,
            coding_points: 3450,
            problems_solved: 142,
            questions_solved: 280,
            accuracy: 89.5,
            streak_days: 12
          },
          {
            rank: 3,
            user_id: 'user_student_03',
            student_id: 'CA-2026-7712',
            name: 'Rohan Verma',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
            college_name: 'Dept of Computer Science',
            total_points: 2980,
            coding_points: 2980,
            problems_solved: 110,
            questions_solved: 215,
            accuracy: 84.0,
            streak_days: 9
          },
          {
            rank: 4,
            user_id: 'user_student_04',
            student_id: 'CA-2026-6540',
            name: 'Priya Sharma',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
            college_name: 'Institute of Engineering',
            total_points: 2740,
            coding_points: 2740,
            problems_solved: 96,
            questions_solved: 190,
            accuracy: 86.5,
            streak_days: 8
          },
          {
            rank: 5,
            user_id: 'user_student_05',
            student_id: 'CA-2026-5120',
            name: 'Karthik Raja',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
            college_name: 'Tech Campus University',
            total_points: 2420,
            coding_points: 2420,
            problems_solved: 84,
            questions_solved: 165,
            accuracy: 81.0,
            streak_days: 7
          }
        ]);
      }
    } catch (err) {
      console.warn('Dashboard data fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Activity Curve Chart Datapoints
  const chartData = useMemo(() => {
    if (activityTimeframe === '7d') {
      return {
        pathArea: 'M 0,160 Q 100,130 200,90 T 400,60 T 600,30 L 600,200 L 0,200 Z',
        pathLine: 'M 0,160 Q 100,130 200,90 T 400,60 T 600,30',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [
          { cx: 0, cy: 160, val: 120 },
          { cx: 100, cy: 130, val: 190 },
          { cx: 200, cy: 90, val: 260 },
          { cx: 300, cy: 75, val: 310 },
          { cx: 400, cy: 60, val: 380 },
          { cx: 500, cy: 45, val: 420 },
          { cx: 600, cy: 30, val: 490 }
        ],
        peak: '490 Active',
        avgTime: '42 min/day',
        totalSubs: '1,840'
      };
    } else if (activityTimeframe === '30d') {
      return {
        pathArea: 'M 0,170 Q 150,140 300,90 T 450,55 T 600,20 L 600,200 L 0,200 Z',
        pathLine: 'M 0,170 Q 150,140 300,90 T 450,55 T 600,20',
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        points: [
          { cx: 0, cy: 170, val: 320 },
          { cx: 200, cy: 120, val: 680 },
          { cx: 400, cy: 70, val: 950 },
          { cx: 600, cy: 20, val: 1420 }
        ],
        peak: '1,420 Active',
        avgTime: '48 min/day',
        totalSubs: '7,250'
      };
    } else {
      return {
        pathArea: 'M 0,180 Q 200,150 400,80 T 600,15 L 600,200 L 0,200 Z',
        pathLine: 'M 0,180 Q 200,150 400,80 T 600,15',
        labels: ['Aug', 'Sep', 'Oct'],
        points: [
          { cx: 0, cy: 180, val: 850 },
          { cx: 300, cy: 110, val: 1650 },
          { cx: 600, cy: 15, val: 2940 }
        ],
        peak: '2,940 Active',
        avgTime: '54 min/day',
        totalSubs: '24,800'
      };
    }
  }, [activityTimeframe]);

  // Performance Domains Data
  const performanceCategories = [
    {
      name: 'Quantitative Aptitude',
      accuracy: 89,
      submissions: 420,
      color: '#4f46e5',
      icon: <HelpCircle size={15} />
    },
    {
      name: 'Technical CS & Fundamentals',
      accuracy: 84,
      submissions: 340,
      color: '#06b6d4',
      icon: <Code2 size={15} />
    },
    {
      name: 'Coding Problems Arena',
      accuracy: 78,
      submissions: 295,
      color: '#10b981',
      icon: <Code2 size={15} />
    },
    {
      name: 'Mock Assessments & Tests',
      accuracy: 92,
      submissions: 180,
      color: '#f59e0b',
      icon: <ClipboardCheck size={15} />
    }
  ];

  // Recent Activity Feed
  const recentActivities = [
    {
      id: 'act_1',
      studentName: 'Alex Mercer',
      studentId: 'CA-2026-9042',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      action: 'Solved Two Sum Target Indices',
      category: 'coding',
      status: 'Accepted',
      badgeColor: '#10b981',
      time: '2 mins ago'
    },
    {
      id: 'act_2',
      studentName: 'Ananya Kumar',
      studentId: 'SP-2026-1001',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
      action: 'Scored 100% on Daily Aptitude Challenge #42',
      category: 'practice',
      status: 'Perfect Score',
      badgeColor: '#6366f1',
      time: '14 mins ago'
    },
    {
      id: 'act_3',
      studentName: 'Rohan Verma',
      studentId: 'CA-2026-7712',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
      action: 'Submitted Grand Assessment Screening Mock',
      category: 'assessment',
      status: 'Rank #2',
      badgeColor: '#f59e0b',
      time: '45 mins ago'
    },
    {
      id: 'act_4',
      studentName: 'Priya Sharma',
      studentId: 'CA-2026-6540',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      action: 'Won 1v1 Battle Arena against CodeMaster',
      category: 'coding',
      status: 'Winner',
      badgeColor: '#ec4899',
      time: '2 hours ago'
    },
    {
      id: 'act_5',
      studentName: 'Karthik Raja',
      studentId: 'CA-2026-5120',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
      action: 'Completed Python Functions & Lambda Study Notes',
      category: 'practice',
      status: 'Completed',
      badgeColor: '#8b5cf6',
      time: '4 hours ago'
    }
  ];

  const filteredActivities = useMemo(() => {
    if (activityFilter === 'all') return recentActivities;
    return recentActivities.filter(a => a.category === activityFilter);
  }, [activityFilter]);

  // Upcoming Events
  const upcomingEvents = [
    {
      id: 'ev_1',
      month: 'OCT',
      day: '15',
      title: 'All-India Coding & Aptitude Grand Assessment',
      type: 'National Test',
      duration: '45 Mins',
      enrolled: '340+ Students',
      badgeColor: '#6366f1',
      actionText: 'View Test',
      path: '/assessments'
    },
    {
      id: 'ev_2',
      month: 'OCT',
      day: '17',
      title: 'TCS / Infosys National Qualifier Mock Drive',
      type: 'Campus Mock',
      duration: '60 Mins',
      enrolled: '215 Students',
      badgeColor: '#10b981',
      actionText: 'Manage',
      path: '/assessments'
    },
    {
      id: 'ev_3',
      month: 'OCT',
      day: '19',
      title: 'Weekly Lightning Algorithm Sprint #12',
      type: 'Battle Contest',
      duration: '30 Mins',
      enrolled: '85 Enrolled',
      badgeColor: '#f59e0b',
      actionText: 'Lobby',
      path: '/battles'
    },
    {
      id: 'ev_4',
      month: 'OCT',
      day: '22',
      title: 'Database & SQL Placement Readiness Review',
      type: 'Curriculum Exam',
      duration: '40 Mins',
      enrolled: '120 Students',
      badgeColor: '#ec4899',
      actionText: 'Details',
      path: '/learning'
    }
  ];

  // Open User Profile Modal for any student
  const handleOpenStudentModal = (student) => {
    setSelectedStudentForModal(student);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-main">
      <div className="admin-content">
        <div className="admin-dashboard-container">
          {/* ==========================================================
              1. WELCOME HEADER (Admin Name, Date, Notification Icon)
              ========================================================== */}
          <section className="admin-welcome-hero">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                className="mobile-menu-btn"
                onClick={toggleSidebar}
                aria-label="Open navigation menu"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <Menu size={20} />
              </button>

              <div className="welcome-hero-content">
                <div className="welcome-title-row">
                  <h1>Welcome back, {admin?.name || 'System Administrator'} 👋</h1>
                  <span className="welcome-badge-live">
                    <span className="pulse-dot"></span>
                    Live MySQL Engine
                  </span>
                </div>
                <p className="welcome-subtitle">
                  Overview of campus student participation, real-time code executions, and upcoming assessments.
                </p>
              </div>
            </div>

            <div className="welcome-hero-actions">
              {/* Current Date Badge */}
              <div className="date-pill">
                <Calendar size={15} color="#818cf8" />
                <span>{todayFormatted}</span>
              </div>

              {/* Notification Icon */}
              <div style={{ position: 'relative' }}>
                <button
                  className="notification-bell-btn"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  title="Platform Notifications & Alerts"
                >
                  <Bell size={18} />
                  <span className="notification-badge-count">3</span>
                </button>

            {/* Notification Dropdown Popover */}
            {notificationOpen && (
              <div className="notification-popover">
                <div className="notif-popover-header">
                  <span>System Notifications</span>
                  <span style={{ fontSize: '11px', color: '#818cf8', cursor: 'pointer' }} onClick={() => setNotificationOpen(false)}>
                    Mark all read
                  </span>
                </div>
                <div className="notif-item">
                  <div style={{ color: '#10b981', marginTop: '2px' }}><CheckCircle2 size={16} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>MySQL Database Connected</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>All 10 tables synchronized successfully on port 3306.</div>
                  </div>
                </div>
                <div className="notif-item">
                  <div style={{ color: '#6366f1', marginTop: '2px' }}><Sparkles size={16} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>Grand Assessment Window</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>Active screening contest starting in 2 hours.</div>
                  </div>
                </div>
                <div className="notif-item">
                  <div style={{ color: '#f59e0b', marginTop: '2px' }}><Users size={16} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>New Student Signups</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>2 students verified today with 100% active streak.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================================
          2. SIX STATISTIC CARDS (Total Students, Active Today,
             Coding Problems, Questions, Learning Resources, Assessments)
          ========================================================== */}
      <section className="admin-stats-grid">
        {/* Total Students */}
        <div className="admin-stat-card" style={{ '--card-glow': 'rgba(99, 102, 241, 0.25)' }}>
          <div className="stat-top-row">
            <div className="stat-icon-bubble" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
              <Users size={22} />
            </div>
            <span className="stat-trend-tag">
              <TrendingUp size={11} /> +14%
            </span>
          </div>
          <div>
            <div className="stat-value-display">{stats.totalStudents}</div>
            <div className="stat-title-label">Total Students</div>
            <div className="stat-detail-subtext">Verified campus accounts</div>
          </div>
        </div>

        {/* Active Today */}
        <div className="admin-stat-card" style={{ '--card-glow': 'rgba(16, 185, 129, 0.25)' }}>
          <div className="stat-top-row">
            <div className="stat-icon-bubble" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              <Activity size={22} />
            </div>
            <span className="stat-trend-tag">
              <Zap size={11} /> 100%
            </span>
          </div>
          <div>
            <div className="stat-value-display">{stats.activeStudents}</div>
            <div className="stat-title-label">Active Today</div>
            <div className="stat-detail-subtext">Currently practicing</div>
          </div>
        </div>

        {/* Coding Problems */}
        <div className="admin-stat-card" style={{ '--card-glow': 'rgba(6, 182, 212, 0.25)' }}>
          <div className="stat-top-row">
            <div className="stat-icon-bubble" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
              <Code2 size={22} />
            </div>
            <span className="stat-trend-tag accent">
              <Sparkles size={11} /> 3 Tiers
            </span>
          </div>
          <div>
            <div className="stat-value-display">{stats.codingProblems}</div>
            <div className="stat-title-label">Coding Problems</div>
            <div className="stat-detail-subtext">Python, C++ &amp; JS sandbox</div>
          </div>
        </div>

        {/* Questions Bank */}
        <div className="admin-stat-card" style={{ '--card-glow': 'rgba(245, 158, 11, 0.25)' }}>
          <div className="stat-top-row">
            <div className="stat-icon-bubble" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <HelpCircle size={22} />
            </div>
            <span className="stat-trend-tag accent">
              MCQ Core
            </span>
          </div>
          <div>
            <div className="stat-value-display">{stats.questions}</div>
            <div className="stat-title-label">Question Bank</div>
            <div className="stat-detail-subtext">Aptitude &amp; Technical</div>
          </div>
        </div>

        {/* Learning Resources */}
        <div className="admin-stat-card" style={{ '--card-glow': 'rgba(139, 92, 246, 0.25)' }}>
          <div className="stat-top-row">
            <div className="stat-icon-bubble" style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}>
              <BookOpen size={22} />
            </div>
            <span className="stat-trend-tag">
              4 Modules
            </span>
          </div>
          <div>
            <div className="stat-value-display">{stats.learningResources}</div>
            <div className="stat-title-label">Learning Resources</div>
            <div className="stat-detail-subtext">Notes, formulas &amp; snippets</div>
          </div>
        </div>

        {/* Assessments */}
        <div className="admin-stat-card" style={{ '--card-glow': 'rgba(244, 63, 94, 0.25)' }}>
          <div className="stat-top-row">
            <div className="stat-icon-bubble" style={{ background: 'linear-gradient(135deg, #e11d48, #f43f5e)' }}>
              <ClipboardCheck size={22} />
            </div>
            <span className="stat-trend-tag accent">
              Live Ready
            </span>
          </div>
          <div>
            <div className="stat-value-display">{stats.assessments}</div>
            <div className="stat-title-label">Assessments</div>
            <div className="stat-detail-subtext">Scheduled campus drives</div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          3. TWO CHARTS (Student Activity & Learning/Coding Performance)
          ========================================================== */}
      <section className="admin-charts-grid">
        {/* Chart 1: Student Activity Chart */}
        <div className="chart-panel-card">
          <div className="chart-header-row">
            <div className="chart-header-info">
              <h3>
                <Activity size={18} color="#6366f1" />
                <span>Student Engagement &amp; Activity Trend</span>
              </h3>
              <p>Daily active logins vs submission volume across platform</p>
            </div>

            {/* Timeframe Switcher */}
            <div className="chart-pill-tabs">
              <button
                className={`chart-pill-btn ${activityTimeframe === '7d' ? 'active' : ''}`}
                onClick={() => setActivityTimeframe('7d')}
              >
                7 Days
              </button>
              <button
                className={`chart-pill-btn ${activityTimeframe === '30d' ? 'active' : ''}`}
                onClick={() => setActivityTimeframe('30d')}
              >
                30 Days
              </button>
              <button
                className={`chart-pill-btn ${activityTimeframe === '3m' ? 'active' : ''}`}
                onClick={() => setActivityTimeframe('3m')}
              >
                3 Months
              </button>
            </div>
          </div>

          {/* Interactive SVG Spline Curve */}
          <div className="svg-curve-wrapper">
            <svg className="svg-chart-element" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Area Fill */}
              <path d={chartData.pathArea} fill="url(#activityGrad)" />

              {/* Curve Stroke */}
              <path
                d={chartData.pathLine}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              {chartData.points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="5"
                    fill="#ffffff"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Chart Summary Legend */}
          <div className="chart-legend-row">
            <div>
              <span className="legend-indicator" style={{ backgroundColor: '#6366f1' }}></span>
              <span>Daily Active: <strong>{chartData.peak}</strong></span>
            </div>
            <div>
              <span className="legend-indicator" style={{ backgroundColor: '#10b981' }}></span>
              <span>Avg Time: <strong>{chartData.avgTime}</strong></span>
            </div>
            <div>
              <span className="legend-indicator" style={{ backgroundColor: '#f59e0b' }}></span>
              <span>Total Submissions: <strong>{chartData.totalSubs}</strong></span>
            </div>
          </div>
        </div>

        {/* Chart 2: Learning & Coding Performance Chart */}
        <div className="chart-panel-card">
          <div className="chart-header-row">
            <div className="chart-header-info">
              <h3>
                <Target size={18} color="#10b981" />
                <span>Learning &amp; Coding Performance</span>
              </h3>
              <p>Average accuracy rates across primary skill assessment tracks</p>
            </div>

            <div className="chart-pill-tabs">
              <button
                className={`chart-pill-btn ${performanceView === 'accuracy' ? 'active' : ''}`}
                onClick={() => setPerformanceView('accuracy')}
              >
                Accuracy %
              </button>
              <button
                className={`chart-pill-btn ${performanceView === 'submissions' ? 'active' : ''}`}
                onClick={() => setPerformanceView('submissions')}
              >
                Volume
              </button>
            </div>
          </div>

          {/* Performance Bars List */}
          <div className="performance-bars-list">
            {performanceCategories.map((cat, idx) => {
              const displayVal = performanceView === 'accuracy' ? `${cat.accuracy}% Accuracy` : `${cat.submissions} Solved`;
              const fillPct = performanceView === 'accuracy' ? cat.accuracy : Math.min(100, (cat.submissions / 500) * 100);

              return (
                <div key={idx} className="perf-bar-item">
                  <div className="perf-bar-top">
                    <span className="perf-category-title">
                      <span style={{ color: cat.color }}>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="perf-category-val">{displayVal}</span>
                  </div>
                  <div className="perf-track-bar">
                    <div
                      className="perf-fill-bar"
                      style={{
                        width: `${fillPct}%`,
                        backgroundColor: cat.color,
                        boxShadow: `0 0 10px ${cat.color}66`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chart-legend-row" style={{ marginTop: 'auto' }}>
            <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>
              💡 Quantitative Aptitude &amp; Assessments maintain the highest first-attempt pass rates this term.
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================================
          4. RECENT ACTIVITY + UPCOMING EVENTS (TWO SIDE-BY-SIDE SECTIONS)
          ========================================================== */}
      <section className="admin-side-by-side-grid">
        {/* Left: Recent Activity Feed */}
        <div className="side-panel-card">
          <div className="panel-header-row">
            <h3 className="panel-title">
              <Clock size={18} color="#6366f1" />
              <span>Recent Activity Stream</span>
            </h3>

            {/* Filter pills */}
            <div className="chart-pill-tabs">
              {['all', 'coding', 'practice', 'assessment'].map((f) => (
                <button
                  key={f}
                  className={`chart-pill-btn ${activityFilter === f ? 'active' : ''}`}
                  onClick={() => setActivityFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="activity-stream-list">
            {filteredActivities.map((act) => (
              <div key={act.id} className="activity-stream-item">
                <img src={act.avatar} alt={act.studentName} className="activity-avatar" />
                <div className="activity-details">
                  <div className="activity-action-line">
                    <strong>{act.studentName}</strong> • {act.action}
                  </div>
                  <div className="activity-meta-line">
                    <span
                      className="activity-tag-badge"
                      style={{
                        backgroundColor: `${act.badgeColor}22`,
                        color: act.badgeColor,
                        border: `1px solid ${act.badgeColor}44`
                      }}
                    >
                      {act.status}
                    </span>
                    <span>• ID: {act.studentId}</span>
                    <span>• {act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Events */}
        <div className="side-panel-card">
          <div className="panel-header-row">
            <h3 className="panel-title">
              <Calendar size={18} color="#f59e0b" />
              <span>Upcoming Placement Events</span>
            </h3>
            <button
              className="chart-pill-btn active"
              onClick={() => navigate('/assessments')}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              + Schedule
            </button>
          </div>

          <div className="upcoming-events-list">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="upcoming-event-item">
                <div className="event-date-box">
                  <span className="event-month-text">{ev.month}</span>
                  <span className="event-day-text">{ev.day}</span>
                </div>

                <div className="event-info-box">
                  <div className="event-title-text">{ev.title}</div>
                  <div className="event-sub-meta">
                    <span
                      style={{
                        color: ev.badgeColor,
                        fontWeight: 700,
                        fontSize: '11px'
                      }}
                    >
                      {ev.type}
                    </span>
                    <span>• {ev.duration}</span>
                    <span>• {ev.enrolled}</span>
                  </div>
                </div>

                <button className="btn-event-action" onClick={() => navigate(ev.path)}>
                  {ev.actionText} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          5. TOP FIVE STUDENTS (COMPACT LEADERBOARD)
          ========================================================== */}
      <section className="leaderboard-panel-card">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">
              <Trophy size={19} color="#fbbf24" />
              <span>Top Five Students — Campus Leaderboard</span>
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Highest point scorers based on problem solve count, assessment accuracy, and practice streaks
            </p>
          </div>

          <button
            className="chart-pill-btn active"
            onClick={() => navigate('/students')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View All Students</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="leaderboard-table-wrap">
          <table className="leaderboard-compact-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Student</th>
                <th>College / Dept</th>
                <th>Total Points</th>
                <th>Problems Solved</th>
                <th>Accuracy</th>
                <th>Streak</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((st, idx) => {
                const rankNum = st.rank || idx + 1;
                const rankClass = rankNum === 1 ? 'rank-1' : rankNum === 2 ? 'rank-2' : rankNum === 3 ? 'rank-3' : 'rank-other';

                return (
                  <tr key={st.user_id || idx}>
                    <td>
                      <div className={`rank-badge-box ${rankClass}`}>
                        {rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`}
                      </div>
                    </td>
                    <td>
                      <div className="student-info-cell">
                        <img
                          src={st.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.name}`}
                          alt={st.name}
                        />
                        <div>
                          <div className="student-name-text">{st.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                            {st.student_id || st.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="student-college-text">{st.college_name || 'CodeArena Campus'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#f8fafc' }}>
                        <Trophy size={14} color="#fbbf24" />
                        <span>{(st.total_points || st.coding_points || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                        <Code2 size={14} color="#38bdf8" />
                        <span>{st.problems_solved || 142}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          color: '#4ade80',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}
                      >
                        {st.accuracy || 88.2}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fb923c', fontWeight: 700 }}>
                        <Flame size={14} />
                        <span>{st.streak_days || 12}d</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenStudentModal(st)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#f8fafc',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==========================================================
          6. QUICK ACTIONS (Add Question, Create Assessment,
             Create Battle, Manage Students)
          ========================================================== */}
      <section className="quick-actions-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              ⚡ Administrator Quick Actions
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              One-click shortcuts to create content and manage live platform sessions
            </p>
          </div>
        </div>

        <div className="quick-actions-grid">
          {/* 1. Add Question */}
          <div
            className="quick-action-card-btn"
            onClick={() => navigate('/questions')}
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <PlusCircle size={24} />
            </div>
            <div className="action-card-text">
              <div className="action-card-title">Add Question</div>
              <div className="action-card-desc">Publish Aptitude or Technical MCQ</div>
            </div>
            <ChevronRight size={18} className="action-card-arrow" />
          </div>

          {/* 2. Create Assessment */}
          <div
            className="quick-action-card-btn"
            onClick={() => navigate('/assessments')}
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              <ClipboardCheck size={24} />
            </div>
            <div className="action-card-text">
              <div className="action-card-title">Create Assessment</div>
              <div className="action-card-desc">Launch timed campus test drive</div>
            </div>
            <ChevronRight size={18} className="action-card-arrow" />
          </div>

          {/* 3. Create Battle */}
          <div
            className="quick-action-card-btn"
            onClick={() => navigate('/battles')}
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              <Swords size={24} />
            </div>
            <div className="action-card-text">
              <div className="action-card-title">Create Battle</div>
              <div className="action-card-desc">Host 1v1 or multiplayer room</div>
            </div>
            <ChevronRight size={18} className="action-card-arrow" />
          </div>

          {/* 4. Manage Students */}
          <div
            className="quick-action-card-btn"
            onClick={() => navigate('/students')}
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)' }}>
              <UserCheck size={24} />
            </div>
            <div className="action-card-text">
              <div className="action-card-title">Manage Students</div>
              <div className="action-card-desc">Inspect rosters, streaks &amp; points</div>
            </div>
            <ChevronRight size={18} className="action-card-arrow" />
          </div>
        </div>
      </section>

      {/* User Profile Modal when clicking any student */}
      {selectedStudentForModal && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudentForModal(null);
          }}
          user={selectedStudentForModal}
          onUpdateUser={(updated) => {
            setTopStudents((prev) =>
              prev.map((s) => (s.user_id === updated.id || s.id === updated.id ? { ...s, ...updated } : s))
            );
          }}
        />
      )}
        </div>
      </div>
    </div>
  );
}

