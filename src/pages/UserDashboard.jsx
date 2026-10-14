import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Flame,
  Zap,
  Code2,
  Brain,
  MessageSquare,
  Trophy,
  ClipboardList,
  Swords,
  ChevronRight,
  TrendingUp,
  Search,
  Bell,
  LogOut,
  Shield,
  CheckCircle2,
  ArrowRight,
  Target,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

export default function UserDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState('7d');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch live student dashboard data
    axios.get('/api/v1/students/dashboard')
      .then(res => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Using demo data fallback for student dashboard:', err);
        setDashboardData(null);
        setLoading(false);
      });
  }, []);

  const student = dashboardData?.user || {
    name: 'Ananya Kumar',
    student_id: 'CA-2026-8042',
    college_name: 'Dept of Computer Science',
    streak_days: 12,
    total_points: 2450,
    overall_accuracy: 82.5,
    coding_problems_solved: 48,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya'
  };

  const stats = dashboardData?.stats || {
    overall_accuracy: 82.5,
    streak_days: 12,
    total_points: 2450,
    coding_problems_solved: 48,
    questions_solved: 426
  };

  // Chart data configurations for 7d, 30d, 3m
  const chartConfigs = {
    '7d': {
      avg: '82%',
      acc: '86%',
      tests: '7 Tests',
      pathArea: 'M 0,115 Q 75,95 150,75 T 300,50 T 450,25 L 450,160 L 0,160 Z',
      pathLine: 'M 0,115 Q 75,95 150,75 T 300,50 T 450,25',
      nodes: [
        { cx: 150, cy: 75, val: '76%' },
        { cx: 300, cy: 50, val: '84%' },
        { cx: 450, cy: 25, val: '92%' }
      ],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    '30d': {
      avg: '79%',
      acc: '83%',
      tests: '28 Tests',
      pathArea: 'M 0,130 Q 100,110 200,80 T 350,55 T 450,35 L 450,160 L 0,160 Z',
      pathLine: 'M 0,130 Q 100,110 200,80 T 350,55 T 450,35',
      nodes: [
        { cx: 150, cy: 95, val: '72%' },
        { cx: 300, cy: 65, val: '80%' },
        { cx: 450, cy: 35, val: '88%' }
      ],
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']
    },
    '3m': {
      avg: '84%',
      acc: '88%',
      tests: '74 Tests',
      pathArea: 'M 0,140 Q 120,90 240,65 T 380,40 T 450,20 L 450,160 L 0,160 Z',
      pathLine: 'M 0,140 Q 120,90 240,65 T 380,40 T 450,20',
      nodes: [
        { cx: 120, cy: 90, val: '75%' },
        { cx: 280, cy: 55, val: '85%' },
        { cx: 450, cy: 20, val: '94%' }
      ],
      labels: ['Month 1', 'Month 2', 'Month 3']
    }
  };

  const activeChart = chartConfigs[chartFilter] || chartConfigs['7d'];

  return (
    <div className="user-dashboard-wrapper">
      {/* ==========================================================
          1. UNIFIED HORIZONTAL TOP NAVIGATION BAR
          ========================================================== */}
      <header className="student-top-navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/student" className="navbar-brand">
            <div className="brand-icon">
              <Zap size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-name">
                Skill<span>Prep</span>
              </span>
              <span className="brand-tag">Student Arena</span>
            </div>
          </Link>

          {/* Desktop Horizontal Navigation Links (Matching Image) */}
          <nav className="navbar-nav-links">
            <Link to="/student" className="nav-tab active">
              <span className="nav-emoji">🏠</span>
              <span>DASHBOARD</span>
            </Link>

            <Link to="/learning" className="nav-tab">
              <span className="nav-emoji">📖</span>
              <span>LEARNING &amp; NOTES</span>
            </Link>

            <a
              href="#daily-practice-focus"
              className="nav-tab"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('daily-practice-focus')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="nav-emoji">📅</span>
              <span>DAILY PRACTICE</span>
            </a>

            <Link to="/questions?category=Aptitude" className="nav-tab">
              <span className="nav-emoji">🧠</span>
              <span>APTITUDE</span>
            </Link>

            <Link to="/questions?category=Technical" className="nav-tab">
              <span className="nav-emoji">💻</span>
              <span>TECHNICAL</span>
            </Link>

            <Link to="/coding" className="nav-tab">
              <span className="nav-emoji">👨‍💻</span>
              <span>CODING</span>
            </Link>
          </nav>

          {/* Navbar Right Actions */}
          <div className="navbar-actions">
            {/* User Profile Pill */}
            <div className="user-profile-pill">
              <img
                src={student.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya'}
                alt={student.name}
                className="user-avatar-img"
              />
              <div className="user-info-text">
                <div className="user-display-name">{student.name}</div>
                <div className="user-level-badge">Level 5 Achiever</div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="navbar-logout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subnav Scroll */}
        <div className="mobile-horizontal-subnav">
          <Link to="/student" className="mobile-nav-tab active">
            <span className="nav-emoji">🏠</span>
            <span>DASHBOARD</span>
          </Link>
          <Link to="/learning" className="mobile-nav-tab">
            <span className="nav-emoji">📖</span>
            <span>LEARNING &amp; NOTES</span>
          </Link>
          <a
            href="#daily-practice-focus"
            className="mobile-nav-tab"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('daily-practice-focus')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="nav-emoji">📅</span>
            <span>DAILY PRACTICE</span>
          </a>
          <Link to="/questions?category=Aptitude" className="mobile-nav-tab">
            <span className="nav-emoji">🧠</span>
            <span>APTITUDE</span>
          </Link>
          <Link to="/questions?category=Technical" className="mobile-nav-tab">
            <span className="nav-emoji">💻</span>
            <span>TECHNICAL</span>
          </Link>
          <Link to="/coding" className="mobile-nav-tab">
            <span className="nav-emoji">👨‍💻</span>
            <span>CODING</span>
          </Link>
        </div>
      </header>

      {/* ==========================================================
          2. MAIN CONTENT AREA (FULL-WIDTH CONTAINER)
          ========================================================== */}
      <div className="student-dashboard-body">
        <main className="dashboard-content">


          {/* ==========================================================
                4. DAILY PRACTICE — MAIN FOCUS
                ========================================================== */}
          <section className="daily-practice-card" id="daily-practice-focus">
            <div className="daily-top-row">
              <div className="daily-heading-group">
                <h3>📅 Today's Practice</h3>
                <p>Complete your daily curated drills to maintain your placement readiness.</p>
              </div>
              <div className="streak-fire-pill">
                <span>🔥</span> {stats.streak_days || 12} Day Streak
              </div>
            </div>

            {/* Big Progress Bar */}
            <div className="daily-progress-box">
              <div className="daily-progress-header">
                <span>Overall Daily Goal</span>
                <span style={{ color: '#34d399' }}>18 / 21 Completed (85%)</span>
              </div>
              <div className="progress-bar-large">
                <div className="progress-bar-fill-large" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* 4 Category Modules Grid */}
            <div className="practice-modules-grid">
              {/* Aptitude */}
              <div className="practice-module-item">
                <div className="module-head">
                  <div>
                    <div className="module-name">🧠 Aptitude</div>
                    <div className="module-count">10 Questions</div>
                  </div>
                  <span className="module-progress-text">8 / 10</span>
                </div>
                <button
                  className="btn-module-action btn-module-continue"
                  onClick={() => navigate('/questions')}
                >
                  Continue
                </button>
              </div>

              {/* Technical */}
              <div className="practice-module-item completed-item">
                <div className="module-head">
                  <div>
                    <div className="module-name">💻 Technical</div>
                    <div className="module-count">5 Questions</div>
                  </div>
                  <span className="module-badge-done">5 / 5 ✓</span>
                </div>
                <button className="btn-module-action btn-module-done">
                  Completed ✓
                </button>
              </div>

              {/* Communication */}
              <div className="practice-module-item">
                <div className="module-head">
                  <div>
                    <div className="module-name">🗣 Communication</div>
                    <div className="module-count">5 Questions</div>
                  </div>
                  <span className="module-progress-text">4 / 5</span>
                </div>
                <button
                  className="btn-module-action btn-module-continue"
                  onClick={() => navigate('/questions')}
                >
                  Continue
                </button>
              </div>

              {/* Coding */}
              <div className="practice-module-item">
                <div className="module-head">
                  <div>
                    <div className="module-name">👨‍💻 Coding</div>
                    <div className="module-count">1 Problem</div>
                  </div>
                  <span style={{ fontSize: '0.775rem', color: '#ea580c', fontWeight: 700 }}>Not Started</span>
                </div>
                <button
                  className="btn-module-action btn-module-coding"
                  onClick={() => navigate('/coding')}
                >
                  Start Coding
                </button>
              </div>
            </div>

            <div className="daily-action-footer">
              <button className="btn-hero-cta" onClick={() => navigate('/coding')}>
                <span>Continue Today's Practice</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

          {/* ==========================================================
                5 & 6. SKILL PROGRESS & PERFORMANCE OVERVIEW
                ========================================================== */}
          <div className="dashboard-grid-2col">
            {/* 5. SKILL PROGRESS */}
            <section className="card">
              <div className="card-header-row">
                <h3 className="card-title">📈 Your Skill Progress</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Overall: 75% Ready</span>
              </div>

              <div className="skill-progress-list">
                {/* Aptitude */}
                <div className="skill-progress-row">
                  <div className="skill-row-top">
                    <div className="skill-title-group">
                      <div className="skill-icon-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>🧠</div>
                      <span className="skill-name">Aptitude</span>
                    </div>
                    <div className="skill-stats-right">
                      <span className="skill-percentage">72%</span>
                      <span className="skill-trend-badge">↑ +8%</span>
                    </div>
                  </div>
                  <div className="skill-bar-container">
                    <div className="skill-bar-fill fill-aptitude" style={{ width: '72%' }}></div>
                  </div>
                  <div className="skill-sub-info">
                    <span>120 / 165 questions completed</span>
                    <span>Target: 90%</span>
                  </div>
                </div>

                {/* Technical */}
                <div className="skill-progress-row">
                  <div className="skill-row-top">
                    <div className="skill-title-group">
                      <div className="skill-icon-pill" style={{ background: '#eef2ff', color: '#4f46e5' }}>💻</div>
                      <span className="skill-name">Technical (DSA &amp; Core)</span>
                    </div>
                    <div className="skill-stats-right">
                      <span className="skill-percentage">84%</span>
                      <span className="skill-trend-badge">↑ +12%</span>
                    </div>
                  </div>
                  <div className="skill-bar-container">
                    <div className="skill-bar-fill fill-technical" style={{ width: '84%' }}></div>
                  </div>
                  <div className="skill-sub-info">
                    <span>186 / 220 questions completed</span>
                    <span>Target: 90%</span>
                  </div>
                </div>

                {/* Communication */}
                <div className="skill-progress-row">
                  <div className="skill-row-top">
                    <div className="skill-title-group">
                      <div className="skill-icon-pill" style={{ background: '#fffbeb', color: '#d97706' }}>🗣</div>
                      <span className="skill-name">Communication</span>
                    </div>
                    <div className="skill-stats-right">
                      <span className="skill-percentage">68%</span>
                      <span className="skill-trend-badge">↑ +5%</span>
                    </div>
                  </div>
                  <div className="skill-bar-container">
                    <div className="skill-bar-fill fill-comm" style={{ width: '68%' }}></div>
                  </div>
                  <div className="skill-sub-info">
                    <span>95 / 140 questions completed</span>
                    <span>Target: 85%</span>
                  </div>
                </div>

                {/* Coding */}
                <div className="skill-progress-row">
                  <div className="skill-row-top">
                    <div className="skill-title-group">
                      <div className="skill-icon-pill" style={{ background: '#ecfdf5', color: '#059669' }}>👨‍💻</div>
                      <span className="skill-name">Coding Problems</span>
                    </div>
                    <div className="skill-stats-right">
                      <span className="skill-percentage">76%</span>
                      <span className="skill-trend-badge">↑ +15%</span>
                    </div>
                  </div>
                  <div className="skill-bar-container">
                    <div className="skill-bar-fill fill-coding" style={{ width: '76%' }}></div>
                  </div>
                  <div className="skill-sub-info">
                    <span>48 / 65 problems completed</span>
                    <span>Target: 50+</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. PERFORMANCE OVERVIEW (ANALYTICS CHART) */}
            <section className="card" id="performance-chart-section">
              <div className="card-header-row">
                <h3 className="card-title">📊 Performance Overview</h3>
                <div className="filter-button-group">
                  <button
                    className={`btn-filter ${chartFilter === '7d' ? 'active' : ''}`}
                    onClick={() => setChartFilter('7d')}
                  >
                    7 Days
                  </button>
                  <button
                    className={`btn-filter ${chartFilter === '30d' ? 'active' : ''}`}
                    onClick={() => setChartFilter('30d')}
                  >
                    30 Days
                  </button>
                  <button
                    className={`btn-filter ${chartFilter === '3m' ? 'active' : ''}`}
                    onClick={() => setChartFilter('3m')}
                  >
                    3 Months
                  </button>
                </div>
              </div>

              <div className="chart-stats-summary">
                <div className="chart-stat-item">
                  <h4>Average Score</h4>
                  <p style={{ color: '#4f46e5' }}>{activeChart.avg}</p>
                </div>
                <div className="chart-stat-item">
                  <h4>Accuracy</h4>
                  <p style={{ color: '#10b981' }}>{activeChart.acc}</p>
                </div>
                <div className="chart-stat-item">
                  <h4>Total Tests</h4>
                  <p style={{ color: '#0f172a' }}>{activeChart.tests}</p>
                </div>
              </div>

              {/* SVG Line Chart */}
              <div className="svg-chart-container" style={{ marginTop: '16px' }}>
                <svg viewBox="0 0 450 160" style={{ width: '100%', height: '160px', overflow: 'visible' }}>
                  <line x1="0" y1="30" x2="450" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="75" x2="450" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="120" x2="450" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                  <defs>
                    <linearGradient id="dashScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    id="chart-path-area"
                    d={activeChart.pathArea}
                    fill="url(#dashScoreGrad)"
                  />
                  <path
                    id="chart-path-line"
                    d={activeChart.pathLine}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Nodes */}
                  {activeChart.nodes.map((node, i) => (
                    <circle
                      key={i}
                      cx={node.cx}
                      cy={node.cy}
                      r={i === activeChart.nodes.length - 1 ? 5.5 : 4.5}
                      fill={i === activeChart.nodes.length - 1 ? '#10b981' : '#4f46e5'}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Labels */}
                  {activeChart.labels.map((lbl, idx) => (
                    <text
                      key={idx}
                      x={idx * (430 / (activeChart.labels.length - 1 || 1)) + 10}
                      y="155"
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="sans-serif"
                    >
                      {lbl}
                    </text>
                  ))}
                </svg>
              </div>
            </section>
          </div>

          {/* ==========================================================
                7 & 9. WEAK AREAS & CODING PROGRESS
                ========================================================== */}
          <div className="dashboard-grid-bottom-2col">
            {/* 7. WEAK AREAS */}
            <section className="card">
              <div className="card-header-row">
                <h3 className="card-title">🎯 Areas to Improve</h3>
                <span style={{ fontSize: '0.775rem', color: '#ef4444', fontWeight: 700 }}>
                  Needs Attention
                </span>
              </div>

              <div className="weak-areas-list">
                <div className="weak-area-item">
                  <div className="weak-item-left">
                    <h4>Percentage (Quantitative Aptitude)</h4>
                    <p>Accuracy: 54% (Low)</p>
                  </div>
                  <button
                    className="btn-practice-weak"
                    onClick={() => navigate('/questions')}
                  >
                    Practice Now
                  </button>
                </div>

                <div className="weak-area-item">
                  <div className="weak-item-left">
                    <h4>Probability &amp; Permutation</h4>
                    <p>Accuracy: 61% (Moderate)</p>
                  </div>
                  <button
                    className="btn-practice-weak"
                    onClick={() => navigate('/questions')}
                  >
                    Practice Now
                  </button>
                </div>

                <div className="weak-area-item">
                  <div className="weak-item-left">
                    <h4>Grammar &amp; Sentence Correction</h4>
                    <p>Accuracy: 65% (Moderate)</p>
                  </div>
                  <button
                    className="btn-practice-weak"
                    onClick={() => navigate('/questions')}
                  >
                    Practice Now
                  </button>
                </div>
              </div>

              <div className="weak-area-hint">
                <span>💡</span>
                <span><strong>Pro Tip:</strong> Focus on these topics to improve your overall score by 12% in the next mock.</span>
              </div>
            </section>

            {/* 9. CODING PROGRESS */}
            <section className="card coding-progress-card">
              <div className="card-header-row">
                <h3 className="card-title">👨‍💻 Coding Progress</h3>
                <span className="badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>
                  IDE Sandbox
                </span>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '8px 0' }}>
                {stats.coding_problems_solved || 48} Problems Solved
              </div>

              <div className="coding-stats-bar-breakdown">
                <div className="code-stat-pill">
                  <span>Easy</span>
                  <strong className="color-easy">25</strong>
                </div>
                <div className="code-stat-pill">
                  <span>Medium</span>
                  <strong className="color-medium">18</strong>
                </div>
                <div className="code-stat-pill">
                  <span>Hard</span>
                  <strong className="color-hard">5</strong>
                </div>
              </div>

              <div className="coding-streak-banner">
                <span>🔥 Current Coding Streak</span>
                <span>7 Days Active</span>
              </div>

              <button
                className="btn-coding-cta"
                onClick={() => navigate('/coding')}
              >
                <span>Continue Coding</span>
                <ArrowRight size={18} />
              </button>
            </section>
          </div>

          {/* ==========================================================
                8. RECENT ASSESSMENTS TABLE
                ========================================================== */}
          <section className="card" id="recent-assessments-section">
            <div className="card-header-row">
              <h3 className="card-title">📝 Recent Assessments</h3>
              <Link to="/assessments" style={{ color: '#4f46e5', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                View All Results →
              </Link>
            </div>

            <div className="assessments-table-wrapper">
              <table className="assessments-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="test-title-cell">
                        <span>🧠</span> Aptitude Mock Test 01
                      </div>
                    </td>
                    <td><span className="score-pill-table">82%</span></td>
                    <td>86%</td>
                    <td>Today</td>
                    <td>
                      <button className="btn-table-view" onClick={() => navigate('/assessments')}>View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="test-title-cell">
                        <span>💻</span> Technical Test 02
                      </div>
                    </td>
                    <td><span className="score-pill-table">76%</span></td>
                    <td>79%</td>
                    <td>Yesterday</td>
                    <td>
                      <button className="btn-table-view" onClick={() => navigate('/assessments')}>View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="test-title-cell">
                        <span>⭐</span> Placement Mock Assessment
                      </div>
                    </td>
                    <td><span className="score-pill-table" style={{ background: '#ecfdf5', color: '#059669' }}>88%</span></td>
                    <td>91%</td>
                    <td>3 days ago</td>
                    <td>
                      <button className="btn-table-view" onClick={() => navigate('/assessments')}>View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="test-title-cell">
                        <span>🗣</span> Verbal Diagnostic Test
                      </div>
                    </td>
                    <td><span className="score-pill-table" style={{ background: '#fffbeb', color: '#d97706' }}>70%</span></td>
                    <td>74%</td>
                    <td>5 days ago</td>
                    <td>
                      <button className="btn-table-view" onClick={() => navigate('/assessments')}>View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
