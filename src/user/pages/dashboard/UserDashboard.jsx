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

// Real-Time Cubic Bezier Path Generator for live streaming curves
const computeSvgPath = (values, labels, maxVal = 100.0, minVal = 0.0, unit = '%') => {
  const n = values.length;
  if (!n) return { nodes: [], labels: [], pathLine: '', pathArea: '' };
  const marginL = 60;
  const marginR = 950;
  const valRange = Math.max(1.0, maxVal - minVal);
  const nodes = values.map((val, idx) => {
    const cx = Math.round(marginL + (idx * (marginR - marginL)) / Math.max(1, n - 1));
    const norm = (Math.max(minVal, Math.min(maxVal, Number(val))) - minVal) / valRange;
    const cy = Math.max(35, Math.min(205, Math.round(200 - norm * 160)));
    const formatted = unit === '%' ? `${Math.round(val)}%` : `${Math.round(val)} ${unit}`.trim();
    return { cx, cy, val: formatted, raw: Math.round(Number(val) * 10) / 10 };
  });

  if (n === 1) {
    return {
      nodes,
      labels,
      pathLine: `M ${nodes[0].cx},${nodes[0].cy}`,
      pathArea: `M ${nodes[0].cx},${nodes[0].cy} L ${nodes[0].cx},210 Z`
    };
  }

  const parts = [`M ${nodes[0].cx},${nodes[0].cy}`];
  for (let i = 0; i < n - 1; i++) {
    const p0 = nodes[i];
    const p1 = nodes[i + 1];
    const dx = (p1.cx - p0.cx) / 2.0;
    const c1x = Math.round(p0.cx + dx * 0.7);
    const c1y = p0.cy;
    const c2x = Math.round(p1.cx - dx * 0.7);
    const c2y = p1.cy;
    parts.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p1.cx},${p1.cy}`);
  }
  const pathLine = parts.join(' ');
  const pathArea = `${pathLine} L ${nodes[nodes.length - 1].cx},210 L ${nodes[0].cx},210 Z`;
  return { nodes, labels, pathLine, pathArea };
};

export default function UserDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState('7d'); // 'live' | '7d' | '30d' | '3m'
  const [activeMetric, setActiveMetric] = useState('score'); // 'score' | 'accuracy' | 'tests'

  // Live skill stats fetched from database
  const [liveSkillStats, setLiveSkillStats] = useState({
    aptitude: { total: 0, solved: 0, remaining: 0, progress: 0.0 },
    technical: { total: 0, solved: 0, remaining: 0, progress: 0.0 },
    coding: { total: 0, solved: 0, remaining: 0, progress: 0.0 }
  });

  const fetchDashboardData = React.useCallback((isSilent = false) => {
    if (!isSilent) setLoading(true);

    let token = admin?.token;
    if (!token) {
      try {
        const saved = localStorage.getItem('codearena_admin');
        if (saved) {
          const parsed = JSON.parse(saved);
          token = parsed?.token || parsed?.access_token;
        }
      } catch (e) {}
    }
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    return axios.get('/api/v1/students/dashboard', config)
      .then(res => {
        setDashboardData(res.data);
        if (res.data?.skill_progress) {
          const sp = res.data.skill_progress;
          setLiveSkillStats({
            aptitude: {
              total: sp.aptitude?.total_problems ?? 0,
              solved: sp.aptitude?.problems_solved ?? 0,
              remaining: sp.aptitude?.problems_remaining ?? 0,
              progress: sp.aptitude?.progress_percentage ?? 0.0
            },
            technical: {
              total: sp.technical?.total_problems ?? 0,
              solved: sp.technical?.problems_solved ?? 0,
              remaining: sp.technical?.problems_remaining ?? 0,
              progress: sp.technical?.progress_percentage ?? 0.0
            },
            coding: {
              total: sp.coding?.total_problems ?? 0,
              solved: sp.coding?.problems_solved ?? 0,
              remaining: sp.coding?.problems_remaining ?? 0,
              progress: sp.coding?.progress_percentage ?? 0.0
            }
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Student dashboard fetch error:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Auto-update on window focus and on custom performance update events
    const onWindowFocus = () => fetchDashboardData(true);
    const onPerfUpdate = () => fetchDashboardData(true);

    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('student_performance_updated', onPerfUpdate);

    // Auto-polling every 6 seconds to capture any performance updates in real time
    const pollTimer = setInterval(() => {
      fetchDashboardData(true);
    }, 6000);

    return () => {
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('student_performance_updated', onPerfUpdate);
      clearInterval(pollTimer);
    };
  }, [fetchDashboardData]);


  const student = dashboardData?.user || {
    name: admin?.name || 'Student',
    student_id: admin?.student_id || '',
    college_name: admin?.college_name || '',
    streak_days: 0,
    total_points: 0,
    overall_accuracy: 0.0,
    coding_problems_solved: 0,
    avatar_url: admin?.avatar_url || ''
  };

  const stats = dashboardData?.stats || {
    overall_accuracy: 0.0,
    streak_days: 0,
    total_points: 0,
    coding_problems_solved: 0,
    questions_solved: 0,
    total_questions: 0
  };

  const displayName = admin?.name || student.name || 'Student';

  const emptyPeriod = {
    avg: '0.0%',
    acc: '0.0%',
    tests: '0 Tests',
    streak: `${stats.streak_days || 0} Days Active`,
    trend: stats.questions_solved > 0 ? 'Active Synced' : 'No test records yet',
    pathLine: 'M 40,200 L 960,200',
    pathArea: 'M 40,200 L 960,200 L 960,210 L 40,210 Z',
    nodes: [],
    labels: chartFilter === '3m' ? ['Month 1', 'Month 2', 'Month 3'] : chartFilter === '30d' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    metrics: {}
  };

  const activePeriod = dashboardData?.performance_overview?.[chartFilter] || emptyPeriod;

  // Real-time dynamic curve generation directly from actual user performance data
  const periodMetric = activePeriod?.metrics?.[activeMetric];
  const rawValues = (periodMetric?.values && periodMetric.values.length > 0)
    ? periodMetric.values
    : (periodMetric?.nodes && periodMetric.nodes.length > 0
        ? periodMetric.nodes.map(n => n.raw ?? 0)
        : [0, 0, 0, 0, 0, 0, 0]
      );
  const rawLabels = periodMetric?.labels || emptyPeriod.labels;

  const maxVal = activeMetric === 'tests'
    ? Math.max(4.0, Math.max(...rawValues, 0) * 1.25)
    : 100.0;
  const unit = activeMetric === 'tests' ? '' : '%';

  const computedSvg = computeSvgPath(rawValues, rawLabels, maxVal, 0.0, unit);

  const maxValInt = Math.ceil(maxVal);
  const dynamicYMarkers = activeMetric === 'tests'
    ? [
        `${maxValInt}`,
        `${Math.round(maxValInt * 0.75)}`,
        `${Math.round(maxValInt * 0.5)}`,
        '0'
      ]
    : ['100%', '75%', '50%', '0%'];

  const activeMetricData = {
    id: activeMetric,
    title: activeMetric === 'accuracy' ? 'Overall Accuracy' : activeMetric === 'tests' ? 'Tests Completed' : 'Average Score',
    color: activeMetric === 'accuracy' ? '#059669' : activeMetric === 'tests' ? '#7C3AED' : '#4285F4',
    gradientId: activeMetric === 'accuracy' ? 'dashAccGrad' : activeMetric === 'tests' ? 'dashTestsGrad' : 'dashScoreGrad',
    yMarkers: periodMetric?.yMarkers || dynamicYMarkers,
    pathLine: computedSvg.pathLine,
    pathArea: computedSvg.pathArea,
    nodes: computedSvg.nodes,
    labels: computedSvg.labels,
    rawValues
  };

  // 3 Skill Progress Cards derived from live database data
  const skillCardsData = [
    {
      id: 'aptitude',
      date: 'Updated from DB',
      tag: liveSkillStats.aptitude.solved > 0 ? 'Working' : 'Not Started',
      tagColor: 'purple',
      title: 'Aptitude & Problem Solving',
      subtitle: 'Quantitative & Logical Reasoning',
      totalProblems: liveSkillStats.aptitude.total,
      solvedProblems: liveSkillStats.aptitude.solved,
      remainingProblems: liveSkillStats.aptitude.remaining,
      progress: liveSkillStats.aptitude.progress,
      theme: 'purple',
      deadlineBadge: `${liveSkillStats.aptitude.remaining} Remaining`,
      path: '/aptitude'
    },
    {
      id: 'technical',
      date: 'Active Session',
      tag: liveSkillStats.technical.solved > 0 ? 'In Progress' : 'Not Started',
      tagColor: 'blue',
      title: 'Technical (DSA & Core)',
      subtitle: 'Data Structures, Algorithms & OS',
      totalProblems: liveSkillStats.technical.total,
      solvedProblems: liveSkillStats.technical.solved,
      remainingProblems: liveSkillStats.technical.remaining,
      progress: liveSkillStats.technical.progress,
      theme: 'blue',
      deadlineBadge: `${liveSkillStats.technical.remaining} Qs Left`,
      path: '/questions?category=Technical'
    },
    {
      id: 'coding',
      date: 'Daily Target',
      tag: liveSkillStats.coding.solved > 0 ? 'Working' : 'Not Started',
      tagColor: 'purple',
      title: 'Coding & Algorithms',
      subtitle: 'Competitive Programming Drills',
      totalProblems: liveSkillStats.coding.total,
      solvedProblems: liveSkillStats.coding.solved,
      remainingProblems: liveSkillStats.coding.remaining,
      progress: liveSkillStats.coding.progress,
      theme: 'purple',
      deadlineBadge: `${liveSkillStats.coding.remaining} Problems Left`,
      path: '/coding/practice'
    }
  ];

  const recentAssessmentsList = dashboardData?.recent_assessments || [];


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
        userName={displayName?.split(' ')[0] || 'Student'}
        greeting="Welcome back"
        subtitle="Complete your daily curated drills in Aptitude, Technical and Coding to maintain your placement readiness."
        streakDays={stats.streak_days || 0}
        completedCount={(stats.questions_solved || 0) + (stats.coding_problems_solved || 0)}
        totalCount={(stats.total_questions || 0) + (stats.coding_breakdown?.total || 0)}
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
            skillsData={skillCardsData}
            skillProgress={dashboardData?.skill_progress}
            aptitudeProgress={dashboardData?.aptitude_progress}
          />

          {/* ==========================================================
                5. PERFORMANCE OVERVIEW (FULL-WIDTH ANALYTICS CHART)
                ========================================================== */}
          <div className="dashboard-analytics-full-row" style={{ marginBottom: '24px' }}>
            <section className="card performance-overview-full-card" id="performance-chart-section">
              <div className="card-header-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 className="card-title">📊 Performance Overview</h3>
                    {chartFilter === 'live' ? (
                      <span className="realtime-live-indicator">
                        <span className="pulse-beacon-circle"></span>
                        REAL-TIME STREAMING
                      </span>
                    ) : (
                      <span className="realtime-sync-indicator" title="Connected to database and real-time event pipeline">
                        ● Real-Time Synced
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-muted-text, #5F6368)', margin: '4px 0 0 0' }}>
                    {activeMetric === 'score' && '📊 Tracking your Average Diagnostic Score progression across evaluated assessments.'}
                    {activeMetric === 'accuracy' && '🎯 Tracking your Overall Accuracy and precision consistency across problems solved.'}
                    {activeMetric === 'tests' && '📝 Tracking your Tests Completed volume and diagnostic milestones over time.'}
                  </p>
                </div>
                <div className="filter-button-group">
                  <button
                    className={`btn-filter live-filter-btn ${chartFilter === 'live' ? 'active live-active' : ''}`}
                    onClick={() => setChartFilter('live')}
                    title="Switch to Real-Time Dynamic Stream"
                  >
                    <span className="live-filter-dot"></span>
                    Live Stream
                  </button>
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
                  <p style={{ color: '#202124' }}>{activePeriod.avg || '0.0%'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#059669' }}>
                    {activePeriod.trend || 'Connected to Database'}
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
                  <p style={{ color: '#059669' }}>{activePeriod.acc || '0.0%'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#059669' }}>
                    {parseFloat(activePeriod.acc) > 0 ? 'Accuracy Calibrated' : 'Accuracy Baseline'}
                  </span>
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
                  <p style={{ color: '#7C3AED' }}>{activePeriod.tests || '0 Tests'}</p>
                  <span className="chart-stat-subtext" style={{ color: '#7C3AED' }}>
                    {parseInt(activePeriod.tests) > 0 ? 'Evaluated in DB' : '0 Evaluated'}
                  </span>
                </div>

                <div className="chart-stat-item">
                  <div className="chart-stat-header">
                    <h4>Active Consistency</h4>
                  </div>
                  <p style={{ color: '#D97706' }}>{activePeriod.streak || `${stats.streak_days || 0} Days Active`}</p>
                  <span className="chart-stat-subtext" style={{ color: '#D97706' }}>
                    {(stats.streak_days || 0) > 0 ? '🔥 Daily Streak Active' : 'Start Your Streak'}
                  </span>
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

              {/* Full-Width Dynamic SVG Line Chart with Real-Time Method */}
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
                  {activeMetricData.nodes.map((node, i) => {
                    const isLatest = i === activeMetricData.nodes.length - 1;
                    return (
                      <g key={i} className="chart-node-group">
                        {/* Real-time radar ping on active latest point */}
                        {isLatest && (
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r="16"
                            fill={activeMetricData.color || '#4285F4'}
                            fillOpacity="0.2"
                            className="live-radar-ping"
                          />
                        )}
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r="8"
                          fill={activeMetricData.color || '#4285F4'}
                          fillOpacity={isLatest ? 0.35 : 0.18}
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
                    );
                  })}

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
