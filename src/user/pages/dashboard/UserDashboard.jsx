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

  const activeChart = chartConfigs[chartFilter] || chartConfigs['7d'];

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
          <SkillProgressSection aptitudeProgress={dashboardData?.aptitude_progress} />

          {/* ==========================================================
                5. PERFORMANCE OVERVIEW (FULL-WIDTH ANALYTICS CHART)
                ========================================================== */}
          <div className="dashboard-analytics-full-row" style={{ marginBottom: '32px' }}>
            <section className="card performance-overview-full-card" id="performance-chart-section">
              <div className="card-header-row">
                <div>
                  <h3 className="card-title">📊 Performance Overview</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-muted-text, #5F6368)', margin: '4px 0 0 0' }}>
                    Track your overall diagnostic scores, accuracy trends, and placement readiness over time.
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

              {/* 4 Stats Metric Cards */}
              <div className="chart-stats-summary">
                <div className="chart-stat-item">
                  <h4>Average Score</h4>
                  <p style={{ color: 'var(--color-text, #202124)' }}>{activeChart.avg}</p>
                  <span className="chart-stat-subtext" style={{ color: '#059669' }}>↑ +6.2% this period</span>
                </div>
                <div className="chart-stat-item">
                  <h4>Overall Accuracy</h4>
                  <p style={{ color: '#2563EB' }}>{activeChart.acc}</p>
                  <span className="chart-stat-subtext" style={{ color: '#2563EB' }}>Top 10% Batch Rank</span>
                </div>
                <div className="chart-stat-item">
                  <h4>Tests Completed</h4>
                  <p style={{ color: '#7C3AED' }}>{activeChart.tests}</p>
                  <span className="chart-stat-subtext" style={{ color: '#7C3AED' }}>100% Evaluated</span>
                </div>
                <div className="chart-stat-item">
                  <h4>Active Consistency</h4>
                  <p style={{ color: '#D97706' }}>{activeChart.streak}</p>
                  <span className="chart-stat-subtext" style={{ color: '#D97706' }}>🔥 Daily Streak Active</span>
                </div>
              </div>

              {/* Full-Width SVG Line Chart */}
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
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="40" y1="50" x2="960" y2="50" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="100" x2="960" y2="100" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="150" x2="960" y2="150" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="200" x2="960" y2="200" stroke="#E2E8F0" strokeWidth="1.5" />

                  {/* Y-axis percentage markers */}
                  <text x="30" y="54" fill="#94A3B8" fontSize="11" textAnchor="end" fontFamily="sans-serif">90%</text>
                  <text x="30" y="104" fill="#94A3B8" fontSize="11" textAnchor="end" fontFamily="sans-serif">75%</text>
                  <text x="30" y="154" fill="#94A3B8" fontSize="11" textAnchor="end" fontFamily="sans-serif">60%</text>
                  <text x="30" y="204" fill="#94A3B8" fontSize="11" textAnchor="end" fontFamily="sans-serif">0%</text>

                  {/* Gradient Area Fill under Curve */}
                  <path
                    id="chart-path-area"
                    d={activeChart.pathArea}
                    fill="url(#dashScoreGrad)"
                  />

                  {/* Main Line Stroke */}
                  <path
                    id="chart-path-line"
                    d={activeChart.pathLine}
                    fill="none"
                    stroke="#4285F4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Nodes & Tooltips */}
                  {activeChart.nodes.map((node, i) => (
                    <g key={i} className="chart-node-group">
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="8"
                        fill="#4285F4"
                        fillOpacity="0.18"
                      />
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="5"
                        fill="#FFFFFF"
                        stroke="#4285F4"
                        strokeWidth="2.5"
                      />
                      {/* Tooltip badge */}
                      <rect
                        x={node.cx - 20}
                        y={node.cy - 28}
                        width="40"
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
                  {activeChart.labels.map((lbl, idx) => {
                    const xPos = activeChart.nodes[idx]?.cx || (idx * (900 / (activeChart.labels.length - 1 || 1)) + 50);
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
                      <button className="btn-table-view" onClick={() => navigate('/aptitude?mode=mock')}>Launch</button>
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
