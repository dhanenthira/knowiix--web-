import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ClipboardCheck,
  Search,
  Filter,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  BarChart2,
  TrendingUp,
  X,
  ExternalLink,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Brain,
  Code2
} from 'lucide-react';
import Navbar from '../../../shared/components/navbar';
import DateRangePicker, { formatDisplayDate } from '../../components/calendar-range/DateRangePicker';
import './AssessmentResults.css';

export default function AssessmentResults() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: searchParams.get('startDate') || null,
    endDate: searchParams.get('endDate') || null
  });

  // Fetch assessment results from backend
  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // Build query string
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('start_date', dateRange.startDate);
      if (dateRange.endDate) params.append('end_date', dateRange.endDate);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const res = await axios.get(`/api/v1/students/assessments?${params.toString()}`, config);
      if (res.data && Array.isArray(res.data.assessments)) {
        setAssessments(res.data.assessments);
      }
    } catch (err) {
      console.warn('Error fetching assessment results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [dateRange.startDate, dateRange.endDate, selectedCategory, selectedStatus]);

  // Client-side instant search filter
  const filteredAssessments = useMemo(() => {
    return assessments.filter((test) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = test.title?.toLowerCase().includes(query);
        const matchesCat = test.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCat) return false;
      }
      return true;
    });
  }, [assessments, searchQuery]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = filteredAssessments.length;
    if (total === 0) {
      return { total: 0, avgScore: 0, avgAccuracy: 0, passedCount: 0, passRate: 0 };
    }
    const scores = filteredAssessments.map((a) => a.score_num ?? parseInt(a.score) ?? 0);
    const accuracies = filteredAssessments.map((a) => a.accuracy_num ?? parseInt(a.accuracy) ?? 0);
    const passed = filteredAssessments.filter((a) => a.status === 'Passed' || (a.score_num ?? 0) >= 70).length;

    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / total);
    const avgAccuracy = Math.round(accuracies.reduce((a, b) => a + b, 0) / total);
    const passRate = Math.round((passed / total) * 100);

    return { total, avgScore, avgAccuracy, passedCount: passed, passRate };
  }, [filteredAssessments]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Assessments' },
    { id: 'Mock Exam', label: 'Mock Exams' },
    { id: 'Aptitude', label: 'Aptitude' },
    { id: 'Technical', label: 'Technical' },
    { id: 'Communication', label: 'Communication' }
  ];

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setDateRange({ startDate: null, endDate: null });
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    dateRange.startDate ||
    dateRange.endDate
  );

  return (
    <div className="assessments-page-wrapper">
      {/* Floating Modern Capsule Navbar */}
      <Navbar variant="user" />

      <div className="assessments-main-container">
        {/* Breadcrumb Navigation & Top Action */}
        <div className="assessments-breadcrumb-row">
          <button
            type="button"
            className="btn-back-dash"
            onClick={() => navigate('/student')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="breadcrumb-pill">
            <span>Student Dashboard</span>
            <ChevronRight size={14} />
            <span className="current">Assessments & Results</span>
          </div>
        </div>

        {/* Page Header Hero */}
        <div className="assessments-header-card">
          <div className="assessments-header-content">
            <span className="assessments-badge">
              <Award size={14} /> PERFORMANCE & RESULTS ARCHIVE
            </span>
            <h1 className="assessments-page-title">Assessment Results & History</h1>
            <p className="assessments-page-subtitle">
              Filter through your comprehensive evaluation records by date range, track skill progression, and inspect granular sectional breakdowns.
            </p>
          </div>
          <div className="assessments-header-action">
            <button
              type="button"
              className="btn-start-mock"
              onClick={() => navigate('/aptitude?mode=mock')}
            >
              <Brain size={16} /> Launch Practice Mock
            </button>
          </div>
        </div>

        {/* Aggregate KPI Stat Cards */}
        <div className="assessments-kpi-grid">
          <div className="assessment-kpi-card">
            <div className="kpi-icon-wrapper blue">
              <ClipboardCheck size={22} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Tests Evaluated</span>
              <div className="kpi-val-row">
                <span className="kpi-value">{stats.total}</span>
                <span className="kpi-subtext">in active view</span>
              </div>
            </div>
          </div>

          <div className="assessment-kpi-card">
            <div className="kpi-icon-wrapper green">
              <TrendingUp size={22} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Average Score</span>
              <div className="kpi-val-row">
                <span className="kpi-value">{stats.avgScore}%</span>
                <span className="kpi-pill success">
                  {stats.avgScore >= 75 ? 'Optimal' : 'Needs Practice'}
                </span>
              </div>
            </div>
          </div>

          <div className="assessment-kpi-card">
            <div className="kpi-icon-wrapper purple">
              <BarChart2 size={22} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Average Accuracy</span>
              <div className="kpi-val-row">
                <span className="kpi-value">{stats.avgAccuracy}%</span>
                <span className="kpi-subtext">precision rate</span>
              </div>
            </div>
          </div>

          <div className="assessment-kpi-card">
            <div className="kpi-icon-wrapper amber">
              <CheckCircle2 size={22} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Passing Benchmark</span>
              <div className="kpi-val-row">
                <span className="kpi-value">{stats.passedCount} / {stats.total}</span>
                <span className="kpi-pill success">{stats.passRate}% Passed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control & Filter Bar */}
        <div className="assessments-control-bar">
          {/* Top Row: Search & Date Range Picker */}
          <div className="control-row-top">
            {/* Search Input */}
            <div className="search-input-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by test name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Controls Right: Date Range Picker & Status Filter */}
            <div className="controls-right-group">
              {/* SHADCN UI DATE RANGE PICKER */}
              <div className="picker-wrapper">
                <DateRangePicker
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onChange={({ startDate, endDate }) => {
                    setDateRange({ startDate, endDate });
                  }}
                  onClear={() => {
                    setDateRange({ startDate: null, endDate: null });
                  }}
                  placeholder="Filter by Date Range"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="status-select-wrapper">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="status-dropdown"
                >
                  <option value="all">All Statuses</option>
                  <option value="Passed">Passed (≥70%)</option>
                  <option value="Needs Review">Needs Review (&lt;70%)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={handleResetFilters}
                  title="Reset all filters"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Chips */}
          <div className="control-row-bottom">
            <div className="category-chips-scroll">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Active Range Notice */}
            {(dateRange.startDate || dateRange.endDate) && (
              <div className="active-date-badge">
                <CalendarIcon size={13} />
                <span>
                  Filtered: {formatDisplayDate(dateRange.startDate)} – {formatDisplayDate(dateRange.endDate || dateRange.startDate)}
                </span>
                <button
                  type="button"
                  onClick={() => setDateRange({ startDate: null, endDate: null })}
                  className="badge-remove-btn"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Results Table / Cards */}
        <div className="assessments-table-card">
          <div className="table-header-info">
            <h3 className="table-title">
              Evaluated Assessments ({filteredAssessments.length})
            </h3>
            <span className="table-subtitle">
              Displaying official test records with automated score grading
            </span>
          </div>

          {loading ? (
            <div className="assessments-loading-state">
              <div className="loading-spinner"></div>
              <span>Fetching assessment history from server...</span>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="assessments-empty-state">
              <div className="empty-state-icon">📅</div>
              <h4>No Assessments Match Your Filter</h4>
              <p>
                {dateRange.startDate || dateRange.endDate
                  ? `No assessments were found between ${formatDisplayDate(dateRange.startDate)} and ${formatDisplayDate(dateRange.endDate || dateRange.startDate)}.`
                  : 'No assessment records found matching your selected criteria.'}
              </p>
              <div className="empty-actions">
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn-clear-empty"
                    onClick={handleResetFilters}
                  >
                    Clear All Filters
                  </button>
                )}
                <button
                  type="button"
                  className="btn-start-new-empty"
                  onClick={() => navigate('/aptitude?mode=mock')}
                >
                  Take a Practice Assessment
                </button>
              </div>
            </div>
          ) : (
            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Assessment & Category</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((test) => {
                    const scoreNum = test.score_num !== undefined ? test.score_num : (parseInt(test.score) || 0);
                    const pillClass =
                      scoreNum >= 85
                        ? 'score-pill-excellent'
                        : scoreNum >= 75
                        ? 'score-pill-good'
                        : 'score-pill-average';

                    const isPassed = test.status === 'Passed' || scoreNum >= 70;

                    return (
                      <tr key={test.id} className="assessment-row">
                        {/* Title & Category */}
                        <td>
                          <div className="test-name-cell">
                            <span className="test-icon-badge">{test.icon || '📝'}</span>
                            <div className="test-name-info">
                              <span className="test-title-text">{test.title}</span>
                              <div className="test-meta-row">
                                <span className="category-tag">{test.category || 'Mock Exam'}</span>
                                {test.total_questions && (
                                  <span className="meta-dot-text">• {test.total_questions} Questions</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td>
                          <span className={`score-badge ${pillClass}`}>
                            {test.score}
                          </span>
                        </td>

                        {/* Accuracy */}
                        <td>
                          <div className="accuracy-cell">
                            <span className="accuracy-text">{test.accuracy || '90%'}</span>
                            <div className="accuracy-mini-bar">
                              <div
                                className="accuracy-mini-fill"
                                style={{ width: `${test.accuracy_num || parseInt(test.accuracy) || 85}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td>
                          <span className="date-cell-text">{test.date || test.raw_date || 'Oct 24, 2026'}</span>
                        </td>

                        {/* Duration */}
                        <td>
                          <span className="duration-cell-text">
                            <Clock size={13} /> {test.duration || '30 mins'}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`status-badge-table ${isPassed ? 'status-passed' : 'status-review'}`}>
                            {isPassed ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                            {test.status || (isPassed ? 'Passed' : 'Needs Review')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="action-buttons-cell">
                            <button
                              type="button"
                              className="btn-view-details"
                              onClick={() => setSelectedAssessment(test)}
                            >
                              Detailed Report
                            </button>
                            <button
                              type="button"
                              className="btn-retake-action"
                              title="Retake or practice similar questions"
                              onClick={() => {
                                if (test.category === 'Coding' || test.category === 'Technical') {
                                  navigate('/technical');
                                } else {
                                  navigate('/aptitude?mode=mock');
                                }
                              }}
                            >
                              Practice
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          DETAILED ASSESSMENT REPORT MODAL
          ============================================================== */}
      {selectedAssessment && (
        <div className="modal-backdrop" onClick={() => setSelectedAssessment(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-badge">{selectedAssessment.category || 'Mock Exam'}</span>
                <h2 className="modal-title">{selectedAssessment.title}</h2>
                <span className="modal-date">
                  <CalendarIcon size={14} /> Completed on {selectedAssessment.date || selectedAssessment.raw_date}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedAssessment(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Score Summary Metrics */}
              <div className="modal-metrics-grid">
                <div className="metric-box">
                  <span className="metric-box-label">Final Score</span>
                  <span className="metric-box-value primary">{selectedAssessment.score}</span>
                  <span className="metric-box-sub">
                    {selectedAssessment.status || 'Passed'}
                  </span>
                </div>
                <div className="metric-box">
                  <span className="metric-box-label">Accuracy</span>
                  <span className="metric-box-value green">{selectedAssessment.accuracy || '90%'}</span>
                  <span className="metric-box-sub">Precision Rate</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box-label">Questions</span>
                  <span className="metric-box-value purple">
                    {selectedAssessment.correct_count ?? 26} / {selectedAssessment.total_questions ?? 30}
                  </span>
                  <span className="metric-box-sub">Correct Answers</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box-label">Duration</span>
                  <span className="metric-box-value">{selectedAssessment.duration || '35 mins'}</span>
                  <span className="metric-box-sub">Time Elapsed</span>
                </div>
              </div>

              {/* Sectional Breakdown */}
              {selectedAssessment.breakdown && selectedAssessment.breakdown.length > 0 && (
                <div className="modal-section-breakdown">
                  <h4 className="section-breakdown-title">
                    <BarChart2 size={16} /> Section-Wise Performance Breakdown
                  </h4>
                  <div className="breakdown-list">
                    {selectedAssessment.breakdown.map((sec, idx) => (
                      <div key={idx} className="breakdown-item">
                        <div className="breakdown-info-row">
                          <span className="breakdown-sec-name">{sec.section}</span>
                          <span className="breakdown-sec-score">{sec.score}% Score ({sec.correct} / {sec.total} Qs)</span>
                        </div>
                        <div className="breakdown-progress-track">
                          <div
                            className="breakdown-progress-fill"
                            style={{
                              width: `${sec.score}%`,
                              backgroundColor: sec.score >= 85 ? '#059669' : sec.score >= 70 ? '#2563eb' : '#d97706'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback & Recommendations */}
              <div className="modal-feedback-box">
                <h4 className="feedback-title">
                  <Brain size={16} /> Diagnostic Performance Insights
                </h4>
                <p className="feedback-text">
                  {selectedAssessment.feedback ||
                    'Strong conceptual mastery demonstrated with excellent pacing and high precision. Continue practicing higher-difficulty problem variations to enhance time complexity analysis.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => setSelectedAssessment(null)}
              >
                Close Report
              </button>
              <button
                type="button"
                className="btn-modal-primary"
                onClick={() => {
                  setSelectedAssessment(null);
                  if (selectedAssessment.category === 'Coding' || selectedAssessment.category === 'Technical') {
                    navigate('/technical');
                  } else {
                    navigate('/aptitude?mode=mock');
                  }
                }}
              >
                Retake Similar Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
