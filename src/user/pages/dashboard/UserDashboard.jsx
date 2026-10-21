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
import { useAuth } from '../../../context/AuthContext';
import KnowiixLogo from '../../../shared/components/KnowiixLogo';
import Navbar from '../../../shared/components/navbar';
import TodayPracticeCard from '../../components/today-practice';
import SkillProgressSection from '../../components/skill-progress';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = admin?.role === 'admin'
    ? 'Administrator'
    : (admin?.name || student.name || 'Administrator');

  // Full-width chart data configurations for 7d, 30d, 3m
  const chartConfigs = {
    '7d': {
      avg: '82.4%',
      acc: '86%',
      tests: '7 Tests',
      streak: '12 Days Active',
      pathArea: 'M 60,150 C 130,140 160,125 210,125 C 280,125 310,95 360,95 C 430,95 460,110 510,110 C 580,110 610,75 660,75 C 730,75 760,60 810,60 C 880,60 910,38 950,38 L 950,210 L 60,210 Z',
      pathLine: 'M 60,150 C 130,140 160,125 210,125 C 280,125 310,95 360,95 C 430,95 460,110 510,110 C 580,110 610,75 660,75 C 730,75 760,60 810,60 C 880,60 910,38 950,38',
      nodes: [
        { cx: 60, cy: 150, val: '70%' },
        { cx: 210, cy: 125, val: '75%' },
        { cx: 360, cy: 95, val: '81%' },
        { cx: 510, cy: 110, val: '78%' },
        { cx: 660, cy: 75, val: '86%' },
        { cx: 810, cy: 60, val: '89%' },
        { cx: 950, cy: 38, val: '94%' }
      ],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    '30d': {
      avg: '79.8%',
      acc: '83%',
      tests: '28 Tests',
      streak: '12 Days Active',
      pathArea: 'M 80,160 C 200,150 240,120 360,120 C 480,120 520,85 640,85 C 760,85 820,45 940,45 L 940,210 L 80,210 Z',
      pathLine: 'M 80,160 C 200,150 240,120 360,120 C 480,120 520,85 640,85 C 760,85 820,45 940,45',
      nodes: [
        { cx: 80, cy: 160, val: '68%' },
        { cx: 360, cy: 120, val: '76%' },
        { cx: 640, cy: 85, val: '84%' },
        { cx: 940, cy: 45, val: '92%' }
      ],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    '3m': {
      avg: '84.6%',
      acc: '88%',
      tests: '74 Tests',
      streak: '12 Days Active',
      pathArea: 'M 100,165 C 280,150 340,95 500,95 C 680,95 740,40 920,40 L 920,210 L 100,210 Z',
      pathLine: 'M 100,165 C 280,150 340,95 500,95 C 680,95 740,40 920,40',
      nodes: [
        { cx: 100, cy: 165, val: '65%' },
        { cx: 500, cy: 95, val: '81%' },
        { cx: 920, cy: 40, val: '95%' }
      ],
      labels: ['Month 1 (Basics)', 'Month 2 (Intermediate)', 'Month 3 (Mock Arena)']
    }
  };

  const [activeMetric, setActiveMetric] = useState('score'); // 'score' | 'accuracy' | 'tests'
  const activePeriod = dashboardData?.performance_overview?.[chartFilter] || chartConfigs[chartFilter] || chartConfigs['7d'];
  const recentAssessmentsList = dashboardData?.recent_assessments || [
    { id: '1', title: 'Aptitude Mock Test 01', icon: '🧠', score: '82%', score_num: 82, accuracy: '86%', date: 'Today', status: 'active', action_label: 'Launch', action_url: '/aptitude?mode=mock' },
    { id: '2', title: 'Technical Test 02', icon: '💻', score: '76%', score_num: 76, accuracy: '79%', date: 'Yesterday', status: 'completed', action_label: 'View', action_url: '/assessments' },
    { id: '3', title: 'Placement Mock Assessment', icon: '⭐', score: '88%', score_num: 88, accuracy: '91%', date: '3 days ago', status: 'completed', action_label: 'View', action_url: '/assessments' },
    { id: '4', title: 'Verbal Diagnostic Test', icon: '🗣', score: '70%', score_num: 70, accuracy: '74%', date: '5 days ago', status: 'completed', action_label: 'View', action_url: '/assessments' }
  ];

  // Resolve dynamic metric curve (Average Score, Overall Accuracy, or Tests Completed)
  const activeMetricData = activePeriod?.metrics?.[activeMetric] || {
    id: activeMetric,
    title: activeMetric === 'accuracy' ? 'Overall Accuracy' : activeMetric === 'tests' ? 'Tests Completed' : 'Average Score',
    color: activeMetric === 'accuracy' ? '#059669' : activeMetric === 'tests' ? '#7C3AED' : '#4285F4',
    gradientId: activeMetric === 'accuracy' ? 'dashAccGrad' : activeMetric === 'tests' ? 'dashTestsGrad' : 'dashScoreGrad',
    yMarkers: activeMetric === 'tests'
      ? (chartFilter === '3m' ? ['80', '60', '40', '0'] : chartFilter === '30d' ? ['32', '24', '16', '0'] : ['8', '6', '4', '0'])
      : ['90%', '75%', '60%', '0%'],
    pathLine: activePeriod.pathLine,
    pathArea: activePeriod.pathArea,
    nodes: activePeriod.nodes || [],
    labels: activePeriod.labels || []
  };

  return (
    <div className="user-dashboard-wrapper">
      {/* ==========================================================
          1. BOLTSHIFT FLOATING-CAPSULE NAVBAR
          ========================================================== */}
      <Navbar variant="user" />

      {/* ==========================================================
          TODAY'S PRACTICE / WELCOME CARD (EXACT REFERENCE STYLE)
          ========================================================== */}
      <TodayPracticeCard
        userName={displayName?.split(' ')[0] || 'Courtney'}
        greeting="Welcome back"
        subtitle="Complete your daily curated drills in Aptitude, Technical and Coding to maintain your placement readiness."
        streakDays={stats.streak_days || 12}
        completedCount={18}
        totalCount={21}
        onStartPractice={() => {
          const el = document.getElementById('skill-progress-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ==========================================================
          2. MAIN CONTENT AREA (FULL-WIDTH CONTAINER)
          ========================================================== */}
      <div className="student-dashboard-body">
        <main className="dashboard-content">


          {/* ==========================================================
                YOUR SKILL PROGRESS CARDS (EXACT REFERENCE DESIGN)
                ========================================================== */}
          <SkillProgressSection
            skillProgress={dashboardData?.skill_progress}
            aptitudeProgress={dashboardData?.aptitude_progress}
          />

          {/* ==========================================================
                5. PERFORMANCE OVERVIEW (FULL-WIDTH ANALYTICS CHART)
                ========================================================== */}
          <div className="dashboard-analytics-full-row" style={{ marginBottom: '32px' }}>
            <section className="card performance-overview-full-card" id="performance-chart-section">
              <div className="card-header-row">
                <div>
                  <h3 className="card-title">📊 Performance Overview</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-muted-text, #5F6368)', margin: '4px 0 0 0' }}>
                    {activeMetric === 'score' && '📊 Tracking your Average Diagnostic Score progression across evaluated assessments.'}
                    {activeMetric === 'accuracy' && '🎯 Tracking your Overall Accuracy and precision consistency across problems solved.'}
                    {activeMetric === 'tests' && '📝 Tracking your Tests Completed volume and diagnostic milestones over time.'}
                  </p>
                </div>
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

              {/* 4 Stats Metric Cards with Interactive Selection */}
              <div className="chart-stats-summary">
                <div
                  className={`chart-stat-item clickable-metric ${activeMetric === 'score' ? 'active-metric score' : ''}`}
                  onClick={() => setActiveMetric('score')}
                  role="button"
                  tabIndex={0}
                  title="Click to view Average Score trendline on graph"
                >
                  <div className="chart-stat-header">
                    <h4>Average Score</h4>
                    {activeMetric === 'score' && <span className="metric-active-badge score">● On Graph</span>}
                  </div>
                  <p style={{ color: '#202124' }}>{activePeriod.avg || '82.4%'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#059669' }}>
                    {activePeriod.trend || '↑ +6.2% this period'}
                  </span>
                </div>

                <div
                  className={`chart-stat-item clickable-metric ${activeMetric === 'accuracy' ? 'active-metric accuracy' : ''}`}
                  onClick={() => setActiveMetric('accuracy')}
                  role="button"
                  tabIndex={0}
                  title="Click to view Overall Accuracy trendline on graph"
                >
                  <div className="chart-stat-header">
                    <h4>Overall Accuracy</h4>
                    {activeMetric === 'accuracy' && <span className="metric-active-badge accuracy">● On Graph</span>}
                  </div>
                  <p style={{ color: '#059669' }}>{activePeriod.acc || '86%'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#059669' }}>Top 10% Batch Rank</span>
                </div>

                <div
                  className={`chart-stat-item clickable-metric ${activeMetric === 'tests' ? 'active-metric tests' : ''}`}
                  onClick={() => setActiveMetric('tests')}
                  role="button"
                  tabIndex={0}
                  title="Click to view Tests Completed curve on graph"
                >
                  <div className="chart-stat-header">
                    <h4>Tests Completed</h4>
                    {activeMetric === 'tests' && <span className="metric-active-badge tests">● On Graph</span>}
                  </div>
                  <p style={{ color: '#7C3AED' }}>{activePeriod.tests || '7 Tests'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#7C3AED' }}>100% Evaluated</span>
                </div>

                <div className="chart-stat-item">
                  <div className="chart-stat-header">
                    <h4>Active Consistency</h4>
                  </div>
                  <p style={{ color: '#D97706' }}>{activePeriod.streak || '12 Days Active'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#D97706' }}>🔥 Daily Streak Active</span>
                </div>
              </div>

              {/* Metric Selector Quick Pills */}
              <div className="chart-metric-selector-row">
                <span className="chart-metric-selector-title">Graph Display:</span>
                <div className="chart-metric-pills">
                  <button
                    type="button"
                    className={`metric-pill-btn score ${activeMetric === 'score' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('score')}
                  >
                    <span className="metric-pill-dot score"></span>
                    Average Score
                  </button>
                  <button
                    type="button"
                    className={`metric-pill-btn accuracy ${activeMetric === 'accuracy' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('accuracy')}
                  >
                    <span className="metric-pill-dot accuracy"></span>
                    Overall Accuracy
                  </button>
                  <button
                    type="button"
                    className={`metric-pill-btn tests ${activeMetric === 'tests' ? 'active' : ''}`}
                    onClick={() => setActiveMetric('tests')}
                  >
                    <span className="metric-pill-dot tests"></span>
                    Tests Completed
                  </button>
                </div>
              </div>

              {/* Full-Width Dynamic SVG Line Chart */}
              <div className="svg-chart-container full-width-chart-container">
                <svg
                  viewBox="0 0 1000 240"
                  style={{ width: '100%', height: '240px', overflow: 'visible' }}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="dashScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4285F4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4285F4" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="dashAccGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="dashTestsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="40" y1="50" x2="960" y2="50" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="100" x2="960" y2="100" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="150" x2="960" y2="150" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="200" x2="960" y2="200" stroke="#E2E8F0" strokeWidth="1.5" />

                  {/* Y-axis dynamic markers */}
                  {(activeMetricData.yMarkers || ['90%', '75%', '60%', '0%']).map((lbl, idx) => (
                    <text
                      key={idx}
                      x="32"
                      y={54 + idx * 50}
                      fill="#94A3B8"
                      fontSize="11"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {lbl}
                    </text>
                  ))}

                  {/* Gradient Area Fill under Curve */}
                  <path
                    id="chart-path-area"
                    d={activeMetricData.pathArea}
                    fill={`url(#${activeMetricData.gradientId || 'dashScoreGrad'})`}
                    style={{ transition: 'all 0.35s ease' }}
                  />

                  {/* Main Line Stroke */}
                  <path
                    id="chart-path-line"
                    d={activeMetricData.pathLine}
                    fill="none"
                    stroke={activeMetricData.color || '#4285F4'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ transition: 'all 0.35s ease' }}
                  />

                  {/* Nodes & Tooltips */}
                  {activeMetricData.nodes.map((node, i) => (
                    <g key={i} className="chart-node-group">
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="8"
                        fill={activeMetricData.color || '#4285F4'}
                        fillOpacity="0.18"
                      />
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="5"
                        fill="#FFFFFF"
                        stroke={activeMetricData.color || '#4285F4'}
                        strokeWidth="2.5"
                      />
                      {/* Tooltip badge */}
                      <rect
                        x={node.cx - 24}
                        y={node.cy - 28}
                        width="48"
                        height="20"
                        rx="6"
                        fill="#1E293B"
                      />
                      <text
                        x={node.cx}
                        y={node.cy - 14}
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {node.val}
                      </text>
                    </g>
                  ))}

                  {/* X-Axis Date Labels */}
                  {activeMetricData.labels.map((lbl, idx) => {
                    const xPos = activeMetricData.nodes[idx]?.cx || (idx * (900 / (activeMetricData.labels.length - 1 || 1)) + 50);
                    return (
                      <text
                        key={idx}
                        x={xPos}
                        y="222"
                        fill="#64748B"
                        fontSize="12"
                        fontWeight="500"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {lbl}
                      </text>
                    );
                  })}
                </svg>
              </div>
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
                  {recentAssessmentsList && recentAssessmentsList.length > 0 ? (
                    recentAssessmentsList.map((test, idx) => {
                      const scoreNum = test.score_num !== undefined ? test.score_num : (parseInt(test.score) || 0);
                      const pillStyle = scoreNum >= 85
                        ? { background: '#ecfdf5', color: '#059669' }
                        : scoreNum >= 75
                        ? { background: '#eef2ff', color: '#4338ca' }
                        : { background: '#fffbeb', color: '#d97706' };

                      return (
                        <tr key={test.id || idx}>
                          <td>
                            <div className="test-title-cell">
                              <span>{test.icon || '📝'}</span> {test.title}
                            </div>
                          </td>
                          <td>
                            <span className="score-pill-table" style={pillStyle}>
                              {test.score}
                            </span>
                          </td>
                          <td>{test.accuracy}</td>
                          <td>{test.date}</td>
                          <td>
                            <button
                              className="btn-table-view"
                              onClick={() => {
                                if (test.action_url) {
                                  navigate(test.action_url);
                                } else if (test.status === 'active' || test.action_label === 'Launch') {
                                  navigate('/aptitude?mode=mock');
                                } else {
                                  navigate('/assessments');
                                }
                              }}
                            >
                              {test.action_label || (test.status === 'active' ? 'Launch' : 'View')}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        No recent assessments found. Start your first practice mock test today!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
