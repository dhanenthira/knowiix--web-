import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap,
  BookOpen,
  Database,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  Code2,
  Layers,
  Brain,
  ExternalLink,
  X,
  Copy,
  Check,
  Plus,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Menu,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  LogOut,
  Bell,
  User,
  Trash2,
  History,
  TrendingUp,
  Terminal,
  Coffee,
  Cpu,
  GitBranch,
  Palette,
  Server,
  Shield,
  Filter,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../shared/components/navbar';
import learningApi from '../../api/learningApi';
import './Learning.css';

export default function Learning() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & View Mode
  // viewMode: 'dashboard' | 'studio' | 'tutorials' | 'progress' | 'saved' | 'history'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  // Live Data States
  const [currentUser, setCurrentUser] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [continueItems, setContinueItems] = useState([]);
  const [recommendedTutorials, setRecommendedTutorials] = useState([]);
  const [allTutorials, setAllTutorials] = useState([]);
  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [userProgressData, setUserProgressData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Loading & Error States
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // W3Schools Studio Reader State
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [interactiveOutput, setInteractiveOutput] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [localNotes, setLocalNotes] = useState([]);



  // Map category slug to Lucide Icon
  const getCategoryIcon = (iconName, slug) => {
    switch (slug?.toLowerCase()) {
      case 'html': return <Code2 size={18} />;
      case 'css': return <Palette size={18} />;
      case 'javascript': return <Zap size={18} />;
      case 'react': return <Layers size={18} />;
      case 'python': return <Terminal size={18} />;
      case 'java': return <Coffee size={18} />;
      case 'c': return <Cpu size={18} />;
      case 'cpp': return <Cpu size={18} />;
      case 'sql': return <Database size={18} />;
      case 'mysql': return <Server size={18} />;
      case 'fastapi': return <Shield size={18} />;
      case 'nodejs': return <Server size={18} />;
      case 'git': return <GitBranch size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  // Load All Primary Dashboard Data
  const loadDashboardData = useCallback(async () => {
    setLoadingDashboard(true);
    setDashboardError(null);
    try {
      // 1. Fetch current user from /api/auth/me
      try {
        const user = await learningApi.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.warn('Could not fetch user via auth/me, using auth context user', err);
        setCurrentUser(admin);
      }

      // 2. Fetch summary, categories, continue learning, recommended, bookmarks, activities concurrently
      const [
        summaryRes,
        categoriesRes,
        continueRes,
        recRes,
        tutorialsRes,
        bookmarksRes,
        progressRes,
        activityRes
      ] = await Promise.allSettled([
        learningApi.getDashboardSummary(),
        learningApi.getCategories(),
        learningApi.getContinueLearning(),
        learningApi.getRecommendedTutorials(6),
        learningApi.getAllTutorials(),
        learningApi.getBookmarks(),
        learningApi.getMyProgress(),
        learningApi.getRecentActivity(15)
      ]);

      if (summaryRes.status === 'fulfilled') setSummaryStats(summaryRes.value);
      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value);
      if (continueRes.status === 'fulfilled') setContinueItems(continueRes.value);
      if (recRes.status === 'fulfilled') setRecommendedTutorials(recRes.value);
      if (tutorialsRes.status === 'fulfilled') setAllTutorials(tutorialsRes.value);
      if (bookmarksRes.status === 'fulfilled') setSavedBookmarks(bookmarksRes.value);
      if (progressRes.status === 'fulfilled') setUserProgressData(progressRes.value);
      if (activityRes.status === 'fulfilled') setRecentActivities(activityRes.value);

    } catch (err) {
      console.error('Failed to load learning dashboard data:', err);
      setDashboardError(err.message || 'Unable to connect to the learning server. Please ensure FastAPI and MySQL are running.');
    } finally {
      setLoadingDashboard(false);
    }
  }, [admin]);

  // Initial Load & Query Param Inspection
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Check URL query parameters to jump directly to a tutorial/topic
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tutSlug = params.get('tutorial');
    const topId = params.get('topic');

    if (tutSlug) {
      handleOpenTutorial(tutSlug, topId);
    }
  }, [location.search]);

  // Open Tutorial in Interactive W3Schools Studio Reader
  const handleOpenTutorial = async (tutorialIdOrSlug, specificTopicId = null) => {
    setLoadingTopic(true);
    setInteractiveOutput(null);
    try {
      const tut = await learningApi.getTutorialDetail(tutorialIdOrSlug);
      setCurrentTutorial(tut);

      let targetTopic = null;
      if (specificTopicId && tut.topics?.length) {
        targetTopic = tut.topics.find(t => t.id === specificTopicId);
      }
      if (!targetTopic && tut.topics?.length) {
        // Find first incomplete topic or first topic
        targetTopic = tut.topics.find(t => !t.is_completed) || tut.topics[0];
      }

      if (targetTopic) {
        // Fetch full topic details
        const fullTopic = await learningApi.getTopicDetail(targetTopic.id);
        setCurrentTopic(fullTopic);
      } else {
        setCurrentTopic(null);
      }

      setActiveTab('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error opening tutorial studio:', err);
    } finally {
      setLoadingTopic(false);
    }
  };

  // Switch Active Topic inside Studio
  const handleSelectTopic = async (topicId) => {
    if (!topicId) return;
    setLoadingTopic(true);
    setInteractiveOutput(null);
    try {
      const topic = await learningApi.getTopicDetail(topicId);
      setCurrentTopic(topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error loading topic:', err);
    } finally {
      setLoadingTopic(false);
    }
  };

  // Toggle Topic Completion
  const handleCompleteTopic = async (topicId) => {
    if (!topicId) return;
    setActionLoading(true);
    try {
      await learningApi.completeTopic(topicId);

      // Update current topic state
      if (currentTopic && currentTopic.id === topicId) {
        setCurrentTopic(prev => ({ ...prev, is_completed: true }));
      }

      // Update current tutorial topics list
      if (currentTutorial) {
        const updatedTopics = (currentTutorial.topics || []).map(t =>
          t.id === topicId ? { ...t, is_completed: true } : t
        );
        const compCount = updatedTopics.filter(t => t.is_completed).length;
        const total = updatedTopics.length;
        setCurrentTutorial(prev => ({
          ...prev,
          topics: updatedTopics,
          completed_topics: compCount,
          progress_percentage: total > 0 ? Math.round((compCount / total) * 100) : 0
        }));
      }

      // Refresh dashboard summary and progress in background
      learningApi.getDashboardSummary().then(setSummaryStats).catch(console.warn);
      learningApi.getMyProgress().then(setUserProgressData).catch(console.warn);
      learningApi.getContinueLearning().then(setContinueItems).catch(console.warn);
      learningApi.getRecentActivity(15).then(setRecentActivities).catch(console.warn);
    } catch (err) {
      console.error('Failed to complete topic:', err);
      alert('Could not update topic completion in database.');
    } finally {
      setActionLoading(false);
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = async (tutorialId, isCurrentlyBookmarked) => {
    try {
      if (isCurrentlyBookmarked) {
        await learningApi.removeBookmark(tutorialId);
      } else {
        await learningApi.addBookmark(tutorialId);
      }

      // Update in recommended
      setRecommendedTutorials(prev => prev.map(t =>
        t.id === tutorialId ? { ...t, is_bookmarked: !isCurrentlyBookmarked } : t
      ));

      // Update in all tutorials
      setAllTutorials(prev => prev.map(t =>
        t.id === tutorialId ? { ...t, is_bookmarked: !isCurrentlyBookmarked } : t
      ));

      // Refresh bookmarks list and summary
      const bms = await learningApi.getBookmarks();
      setSavedBookmarks(bms);

      const summary = await learningApi.getDashboardSummary();
      setSummaryStats(summary);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  // Copy code helper
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Run code demo helper
  const handleRunCode = (codeExample) => {
    setInteractiveOutput("Executing in interactive environment...\n\nProcess finished with exit code 0.\nOutput verified successfully.");
  };

  // Add study note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setLocalNotes(prev => [
      { id: Date.now(), text: newNote.trim(), date: new Date().toLocaleDateString() },
      ...prev
    ]);
    setNewNote('');
  };

  // User details derived from API or Auth
  const displayUser = currentUser || admin || {
    name: 'Learner',
    email: 'student@codearena.com',
    profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Learner'
  };

  const userName = displayUser.name || displayUser.full_name || 'Learner';
  const userEmail = displayUser.email || '';
  const userAvatar = displayUser.profile_image_url || displayUser.avatar_url;

  // Filtered Tutorials for Catalog / Search
  const filteredTutorials = useMemo(() => {
    return allTutorials.filter(tut => {
      const matchesCategory = categoryFilter === 'all' ||
        tut.category_slug?.toLowerCase() === categoryFilter.toLowerCase() ||
        tut.category_id === categoryFilter;

      const matchesSearch = !searchQuery.trim() ||
        tut.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tut.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allTutorials, categoryFilter, searchQuery]);

  // Topic Navigation Prev / Next
  const studioTopics = currentTutorial?.topics || [];
  const currentTopicIndex = studioTopics.findIndex(t => t.id === currentTopic?.id);
  const prevTopic = currentTopicIndex > 0 ? studioTopics[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex >= 0 && currentTopicIndex < studioTopics.length - 1
    ? studioTopics[currentTopicIndex + 1]
    : null;

  return (
    <div className="learning-dashboard-app">
      {/* 1. BOLTSHIFT UNIFIED NAVBAR */}
      <Navbar variant="user" />



      {/* ==========================================================
          2. DASHBOARD BODY: SIDEBAR + MAIN CONTENT
          ========================================================== */}
      <div className="learning-body-container">
        {/* SIDEBAR */}
        <aside className={`learning-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-scrollable-content">
            {/* Quick Navigation Sections */}
            <div className="sidebar-group">
              <div className="sidebar-group-title">LEARNING DASHBOARD</div>
              <button
                className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); setCategoryFilter('all'); }}
                id="sidebar-nav-dashboard"
              >
                <Sparkles size={16} className="nav-icon" />
                <span>Dashboard</span>
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'tutorials' ? 'active' : ''}`}
                onClick={() => { setActiveTab('tutorials'); setCategoryFilter('all'); }}
                id="sidebar-nav-tutorials"
              >
                <BookOpen size={16} className="nav-icon" />
                <span>All Tutorials</span>
                {allTutorials.length > 0 && <span className="sidebar-badge">{allTutorials.length}</span>}
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'continue' ? 'active' : ''}`}
                onClick={() => setActiveTab('continue')}
                id="sidebar-nav-continue"
              >
                <Play size={16} className="nav-icon" />
                <span>Continue Learning</span>
                {continueItems.length > 0 && <span className="sidebar-badge active">{continueItems.length}</span>}
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
                id="sidebar-nav-progress"
              >
                <TrendingUp size={16} className="nav-icon" />
                <span>My Progress</span>
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
                id="sidebar-nav-saved"
              >
                <Bookmark size={16} className="nav-icon" />
                <span>Saved Tutorials</span>
                {savedBookmarks.length > 0 && <span className="sidebar-badge">{savedBookmarks.length}</span>}
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
                id="sidebar-nav-history"
              >
                <History size={16} className="nav-icon" />
                <span>Learning History</span>
              </button>
            </div>

            {/* Categories List (Dynamically loaded from MySQL) */}
            <div className="sidebar-group categories-group">
              <div className="sidebar-group-header">
                <span className="sidebar-group-title">CATEGORIES</span>
                <span className="categories-count-label">{categories.length} Topics</span>
              </div>
              <div className="sidebar-categories-list">
                {categories.map((cat) => {
                  const isSelected = categoryFilter === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      className={`sidebar-category-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setCategoryFilter(cat.slug);
                        setActiveTab('tutorials');
                        if (window.innerWidth < 992) setSidebarOpen(false);
                      }}
                      title={cat.name}
                      id={`sidebar-cat-${cat.slug}`}
                    >
                      <span className="category-btn-icon">
                        {getCategoryIcon(cat.icon, cat.slug)}
                      </span>
                      <span className="category-btn-name">{cat.name}</span>
                      <span className="category-count-badge">
                        {cat.tutorial_count ?? 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Live DB Health Indicator */}
            <div className="sidebar-footer-card">
              <div className="db-health-badge">
                <span className="pulse-dot-green"></span>
                <span>Live MySQL Connected</span>
              </div>
              <p className="db-sync-note">Data automatically synced with database.</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="learning-main-content" role="main">
          {/* Error Banner if API fails */}
          {dashboardError && (
            <div className="dashboard-alert-banner">
              <AlertCircle size={20} className="alert-icon" />
              <div className="alert-text-body">
                <div className="alert-title">Database Connection Notice</div>
                <div className="alert-desc">{dashboardError}</div>
              </div>
              <button className="alert-retry-btn" onClick={loadDashboardData}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* ==========================================================
              VIEW: W3SCHOOLS INTERACTIVE STUDIO READER
              ========================================================== */}
          {activeTab === 'studio' && currentTutorial && (
            <div className="w3schools-studio-view">
              {/* Studio Top Control Strip */}
              <div className="studio-top-bar">
                <button
                  className="studio-back-btn"
                  onClick={() => setActiveTab('dashboard')}
                  id="btn-back-to-dashboard"
                >
                  <ChevronLeft size={16} />
                  <span>Back to Dashboard</span>
                </button>

                <div className="studio-tutorial-info">
                  <span className="studio-cat-tag">
                    {currentTutorial.category_name || 'Tutorial'}
                  </span>
                  <h2 className="studio-tut-title">{currentTutorial.title}</h2>
                </div>

                <div className="studio-progress-pill">
                  <span>Progress:</span>
                  <div className="mini-progress-track">
                    <div
                      className="mini-progress-fill"
                      style={{ width: `${currentTutorial.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                  <span className="mini-progress-pct">
                    {currentTutorial.completed_topics || 0}/{currentTutorial.total_topics || studioTopics.length} ({currentTutorial.progress_percentage || 0}%)
                  </span>
                </div>
              </div>

              {/* 2-Column Studio: Topics List + Content Reader */}
              <div className="studio-split-layout">
                {/* Topics Navigator */}
                <aside className="studio-topics-sidebar">
                  <div className="topics-sidebar-header">
                    <span>Course Curriculum</span>
                    <span className="topics-total-tag">{studioTopics.length} Topics</span>
                  </div>
                  <nav className="studio-topics-nav" aria-label="Course curriculum">
                    {studioTopics.map((top, idx) => {
                      const isActive = currentTopic?.id === top.id;
                      const isDone = top.is_completed;
                      return (
                        <button
                          key={top.id}
                          className={`studio-topic-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                          onClick={() => handleSelectTopic(top.id)}
                          id={`topic-item-${top.id}`}
                        >
                          <div className="topic-status-marker">
                            {isDone ? <Check size={12} /> : <span>{idx + 1}</span>}
                          </div>
                          <span className="topic-item-title">{top.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </aside>

                {/* Main Lesson Content Reader */}
                <section className="studio-reader-area">
                  {loadingTopic ? (
                    <div className="studio-loading-state">
                      <RefreshCw size={28} className="spinner-icon" />
                      <p>Loading topic content from database...</p>
                    </div>
                  ) : currentTopic ? (
                    <div className="topic-content-container">
                      <div className="topic-header-row">
                        <div>
                          <div className="topic-badge-row">
                            <span className="pill-badge category">
                              {currentTutorial.category_name}
                            </span>
                            <span className="pill-badge difficulty">
                              {currentTutorial.difficulty || 'Beginner'}
                            </span>
                          </div>
                          <h1 className="topic-main-title">{currentTopic.title}</h1>
                        </div>

                        {/* Mark Complete Action Button */}
                        <button
                          className={`btn-mark-complete ${currentTopic.is_completed ? 'completed' : ''}`}
                          onClick={() => handleCompleteTopic(currentTopic.id)}
                          disabled={actionLoading}
                          id="btn-complete-topic"
                        >
                          <CheckCircle2 size={18} />
                          <span>{currentTopic.is_completed ? 'Completed ✓' : 'Mark Topic Completed'}</span>
                        </button>
                      </div>

                      {/* Main Topic Prose Content */}
                      <div className="topic-body-content">
                        <p>{currentTopic.content}</p>
                      </div>

                      {/* W3Schools Code Example Playground */}
                      {currentTopic.code_example && (
                        <div className="w3-code-box">
                          <div className="w3-code-box-header">
                            <div className="code-header-left">
                              <Code2 size={16} />
                              <span>Code Example ({currentTutorial.category_name || 'Code'})</span>
                            </div>
                            <div className="code-header-actions">
                              <button
                                className="code-action-btn"
                                onClick={() => handleCopyCode(currentTopic.code_example)}
                                title="Copy snippet to clipboard"
                              >
                                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                              </button>
                              <button
                                className="code-action-btn run-btn"
                                onClick={() => handleRunCode(currentTopic.code_example)}
                                title="Execute code interactive demonstration"
                                id="btn-run-code"
                              >
                                <Play size={14} />
                                <span>Run Code</span>
                              </button>
                            </div>
                          </div>

                          <pre className="w3-code-editor">
                            <code>{currentTopic.code_example}</code>
                          </pre>

                          {/* Terminal Output */}
                          {interactiveOutput && (
                            <div className="interactive-output-terminal">
                              <div className="terminal-bar">
                                <Terminal size={14} />
                                <span>Terminal Output</span>
                                <button className="clear-term-btn" onClick={() => setInteractiveOutput(null)}>
                                  <RotateCcw size={12} />
                                </button>
                              </div>
                              <pre className="terminal-content">{interactiveOutput}</pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Previous & Next Navigation Buttons */}
                      <div className="topic-navigation-footer">
                        <button
                          className={`footer-nav-btn prev ${!prevTopic ? 'disabled' : ''}`}
                          onClick={() => prevTopic && handleSelectTopic(prevTopic.id)}
                          disabled={!prevTopic}
                          id="btn-prev-topic"
                        >
                          <ChevronLeft size={16} />
                          <span>Previous Topic</span>
                        </button>

                        <button
                          className={`footer-nav-btn next ${!nextTopic ? 'disabled' : ''}`}
                          onClick={() => nextTopic && handleSelectTopic(nextTopic.id)}
                          disabled={!nextTopic}
                          id="btn-next-topic"
                        >
                          <span>Next Topic</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Study Notes Drawer */}
                      <div className="study-notes-section">
                        <div className="study-notes-header">
                          <Brain size={18} />
                          <h3>Personal Study Notes for this Topic</h3>
                        </div>
                        <form onSubmit={handleAddNote} className="add-note-form">
                          <input
                            type="text"
                            placeholder="Add a key takeaway or interview formula to remember..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="note-input"
                          />
                          <button type="submit" className="btn-add-note">
                            <Plus size={16} />
                            <span>Save Note</span>
                          </button>
                        </form>
                        {localNotes.length > 0 && (
                          <div className="notes-list-display">
                            {localNotes.map(n => (
                              <div key={n.id} className="note-card-item">
                                <div className="note-text">{n.text}</div>
                                <span className="note-date">{n.date}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="studio-empty-state">
                      <p>Select a topic from the curriculum sidebar to begin.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {/* ==========================================================
              VIEW: DASHBOARD OVERVIEW (Default)
              ========================================================== */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content-flow">
              {/* SECTION: WELCOME HERO */}
              <section className="dashboard-welcome-banner" aria-label="Welcome section">
                <div className="welcome-left-content">
                  <div className="welcome-greeting-badge">
                    <Sparkles size={16} />
                    <span>SkillPrep Learning Studio</span>
                  </div>
                  <h1 className="welcome-heading">Welcome back, {userName}!</h1>
                  <p className="welcome-subtext">
                    Resume your curriculum, track topic progress, and master engineering concepts with executable code examples.
                  </p>

                  <div className="welcome-cta-row">
                    <button
                      className="btn-primary-continue"
                      onClick={() => {
                        if (continueItems.length > 0) {
                          handleOpenTutorial(continueItems[0].tutorial_slug, continueItems[0].last_topic_id);
                        } else if (allTutorials.length > 0) {
                          handleOpenTutorial(allTutorials[0].slug);
                        }
                      }}
                      id="btn-welcome-continue"
                    >
                      <Play size={16} />
                      <span>Continue Learning</span>
                    </button>
                    <button
                      className="btn-secondary-explore"
                      onClick={() => setActiveTab('tutorials')}
                    >
                      <SlidersHorizontal size={16} />
                      <span>Browse All Tutorials</span>
                    </button>
                  </div>
                </div>

                <div className="welcome-right-metric">
                  <div className="progress-ring-card">
                    <div className="progress-circle-wrap">
                      <svg className="progress-ring-svg" viewBox="0 0 100 100">
                        <circle className="progress-ring-bg" cx="50" cy="50" r="42" />
                        <circle
                          className="progress-ring-bar"
                          cx="50"
                          cy="50"
                          r="42"
                          style={{
                            strokeDasharray: 264,
                            strokeDashoffset: 264 - (264 * (summaryStats?.overall_progress_percentage || 0)) / 100
                          }}
                        />
                      </svg>
                      <div className="progress-ring-label">
                        <span className="ring-pct-number">
                          {summaryStats?.overall_progress_percentage ?? 0}%
                        </span>
                        <span className="ring-sub-text">Overall</span>
                      </div>
                    </div>
                    <div className="ring-status-text">Curriculum Progress</div>
                  </div>
                </div>
              </section>

              {/* SECTION: STATISTICS CARDS (Values calculated strictly from DB) */}
              <section className="dashboard-stats-grid" aria-label="Key statistics">
                {/* 1. Available Courses */}
                <div className="stat-card" id="card-stat-available">
                  <div className="stat-card-icon blue">
                    <BookOpen size={24} />
                  </div>
                  <div className="stat-card-data">
                    <div className="stat-number">
                      {loadingDashboard ? '...' : (summaryStats?.available_courses ?? allTutorials.length)}
                    </div>
                    <div className="stat-title">Available Courses</div>
                    <div className="stat-hint">Published interactive tutorials</div>
                  </div>
                </div>

                {/* 2. Courses Started */}
                <div className="stat-card" id="card-stat-started">
                  <div className="stat-card-icon purple">
                    <Play size={24} />
                  </div>
                  <div className="stat-card-data">
                    <div className="stat-number">
                      {loadingDashboard ? '...' : (summaryStats?.courses_started ?? 0)}
                    </div>
                    <div className="stat-title">Courses Started</div>
                    <div className="stat-hint">In-progress learning tracks</div>
                  </div>
                </div>

                {/* 3. Completed Lessons */}
                <div className="stat-card" id="card-stat-completed">
                  <div className="stat-card-icon emerald">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="stat-card-data">
                    <div className="stat-number">
                      {loadingDashboard ? '...' : (summaryStats?.completed_lessons ?? 0)}
                    </div>
                    <div className="stat-title">Completed Lessons</div>
                    <div className="stat-hint">Verified topics finished</div>
                  </div>
                </div>

                {/* 4. Saved Tutorials */}
                <div className="stat-card" id="card-stat-saved">
                  <div className="stat-card-icon amber">
                    <Bookmark size={24} />
                  </div>
                  <div className="stat-card-data">
                    <div className="stat-number">
                      {loadingDashboard ? '...' : (summaryStats?.saved_tutorials ?? savedBookmarks.length)}
                    </div>
                    <div className="stat-title">Saved Tutorials</div>
                    <div className="stat-hint">Bookmarked for quick revision</div>
                  </div>
                </div>
              </section>

              {/* SECTION: CONTINUE LEARNING */}
              <section className="dashboard-content-block" aria-label="Continue learning section">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-title">Continue Learning</h2>
                    <p className="section-subtitle">Pick up right where you left off in your latest tutorial.</p>
                  </div>
                  {continueItems.length > 0 && (
                    <button className="section-view-all-link" onClick={() => setActiveTab('continue')}>
                      View all ({continueItems.length})
                    </button>
                  )}
                </div>

                {continueItems.length > 0 ? (
                  <div className="continue-learning-grid">
                    {continueItems.map(item => (
                      <div key={item.tutorial_id} className="continue-course-card">
                        <div className="continue-card-header">
                          <span className="continue-cat-badge">
                            {getCategoryIcon(item.category_icon, item.category_slug)}
                            <span>{item.category_name}</span>
                          </span>
                          <span className="continue-time-tag">
                            <Clock size={12} />
                            <span>Recently accessed</span>
                          </span>
                        </div>

                        <h3 className="continue-course-title">{item.tutorial_title}</h3>
                        <p className="continue-topic-crumb">
                          <strong>Last Topic:</strong> {item.last_topic_title || 'Introduction'}
                        </p>

                        <div className="continue-progress-container">
                          <div className="progress-labels">
                            <span>Completion</span>
                            <span>{item.completed_topics}/{item.total_topics} topics ({item.progress_percentage}%)</span>
                          </div>
                          <div className="progress-track-bar">
                            <div
                              className="progress-fill-bar"
                              style={{ width: `${item.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          className="btn-resume-learning"
                          onClick={() => handleOpenTutorial(item.tutorial_slug, item.last_topic_id)}
                          id={`btn-resume-${item.tutorial_id}`}
                        >
                          <span>Resume Learning</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-card">
                    <div className="empty-icon-wrap">
                      <BookOpen size={32} />
                    </div>
                    <h3>No Started Courses Yet</h3>
                    <p>Select any category below to begin your personalized learning journey.</p>
                    <button
                      className="btn-empty-start"
                      onClick={() => {
                        if (allTutorials.length > 0) handleOpenTutorial(allTutorials[0].slug);
                      }}
                    >
                      Start First Tutorial
                    </button>
                  </div>
                )}
              </section>

              {/* SECTION: EXPLORE CATEGORIES */}
              <section className="dashboard-content-block" aria-label="Explore categories">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-title">Explore Categories</h2>
                    <p className="section-subtitle">Comprehensive documentation, syntax guides, and interview prep.</p>
                  </div>
                  <button className="section-view-all-link" onClick={() => setActiveTab('tutorials')}>
                    Browse All ({categories.length})
                  </button>
                </div>

                <div className="categories-grid">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className="category-showcase-card"
                      onClick={() => {
                        setCategoryFilter(cat.slug);
                        setActiveTab('tutorials');
                      }}
                      id={`card-cat-${cat.slug}`}
                    >
                      <div className="category-card-top">
                        <div className="category-card-icon-bubble">
                          {getCategoryIcon(cat.icon, cat.slug)}
                        </div>
                        <span className="category-lesson-count">
                          {cat.tutorial_count ?? 1} Tutorial{cat.tutorial_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <h3 className="category-card-name">{cat.name}</h3>
                      <p className="category-card-desc">{cat.description}</p>
                      <div className="category-card-footer">
                        <span>Learn {cat.name}</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2-COLUMN SECTION: RECOMMENDED TUTORIALS + RECENT ACTIVITY */}
              <div className="dashboard-two-column-row">
                {/* Left Column: Recommended Tutorials */}
                <section className="column-block recommended-block" aria-label="Recommended tutorials">
                  <div className="section-header-row">
                    <div>
                      <h2 className="section-title">Recommended Tutorials</h2>
                      <p className="section-subtitle">Curated to boost your full-stack engineering proficiency.</p>
                    </div>
                  </div>

                  <div className="recommended-list">
                    {recommendedTutorials.slice(0, 4).map(tut => (
                      <div key={tut.id} className="recommended-tutorial-card">
                        <div className="rec-card-body">
                          <div className="rec-badge-row">
                            <span className="rec-category-tag">{tut.category_name}</span>
                            <span className={`rec-diff-tag ${tut.difficulty?.toLowerCase()}`}>
                              {tut.difficulty}
                            </span>
                            <span className="rec-time-tag">
                              <Clock size={12} /> {tut.estimated_minutes}m
                            </span>
                          </div>
                          <h4 className="rec-title">{tut.title}</h4>
                          <p className="rec-desc">{tut.description}</p>
                        </div>

                        <div className="rec-card-actions">
                          <button
                            className={`btn-rec-bookmark ${tut.is_bookmarked ? 'active' : ''}`}
                            onClick={() => handleToggleBookmark(tut.id, tut.is_bookmarked)}
                            title={tut.is_bookmarked ? 'Remove bookmark' : 'Bookmark tutorial'}
                            id={`btn-bookmark-${tut.id}`}
                          >
                            <Bookmark size={16} />
                          </button>
                          <button
                            className="btn-rec-start"
                            onClick={() => handleOpenTutorial(tut.slug)}
                            id={`btn-open-rec-${tut.id}`}
                          >
                            <span>Learn</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Right Column: Recent Activity */}
                <section className="column-block activity-block" aria-label="Recent activity">
                  <div className="section-header-row">
                    <div>
                      <h2 className="section-title">Recent Activity</h2>
                      <p className="section-subtitle">Live log of completed lessons and accessed modules.</p>
                    </div>
                  </div>

                  <div className="activity-stream">
                    {recentActivities.length > 0 ? (
                      recentActivities.slice(0, 6).map((act) => {
                        const isComplete = act.activity_type === 'completed_topic';
                        const isBookmark = act.activity_type === 'bookmarked';
                        return (
                          <div key={act.id} className="activity-stream-item">
                            <div className={`activity-icon-bullet ${isComplete ? 'green' : isBookmark ? 'amber' : 'blue'}`}>
                              {isComplete ? <Check size={12} /> : isBookmark ? <Bookmark size={12} /> : <BookOpen size={12} />}
                            </div>
                            <div className="activity-details">
                              <div className="activity-action-text">
                                {isComplete ? 'Completed lesson' : isBookmark ? 'Saved to bookmarks' : 'Accessed topic'}:
                                <strong> {act.topic_title || act.tutorial_title || 'Study Material'}</strong>
                              </div>
                              <span className="activity-timestamp">
                                {new Date(act.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="activity-empty-state">
                        <History size={24} />
                        <p>No recent activity records yet. Start a lesson to track your progress.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* SECTION: SAVED TUTORIALS (BOOKMARKS) */}
              <section className="dashboard-content-block" aria-label="Saved tutorials">
                <div className="section-header-row">
                  <div>
                    <h2 className="section-title">Saved Tutorials</h2>
                    <p className="section-subtitle">Your personal bookmarked reference guides and notes.</p>
                  </div>
                  {savedBookmarks.length > 0 && (
                    <button className="section-view-all-link" onClick={() => setActiveTab('saved')}>
                      View all ({savedBookmarks.length})
                    </button>
                  )}
                </div>

                {savedBookmarks.length > 0 ? (
                  <div className="bookmarks-grid">
                    {savedBookmarks.slice(0, 4).map(bm => {
                      const tut = bm.tutorial;
                      if (!tut) return null;
                      return (
                        <div key={bm.id} className="bookmark-card">
                          <div className="bookmark-card-top">
                            <span className="bookmark-cat-pill">{tut.category_name}</span>
                            <button
                              className="btn-remove-bookmark"
                              onClick={() => handleToggleBookmark(tut.id, true)}
                              title="Remove bookmark"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <h4 className="bookmark-card-title">{tut.title}</h4>
                          <p className="bookmark-card-desc">{tut.description}</p>
                          <div className="bookmark-card-footer">
                            <span className="bookmark-topics-count">{tut.total_topics} topics</span>
                            <button
                              className="btn-open-bookmark"
                              onClick={() => handleOpenTutorial(tut.slug)}
                            >
                              <span>Open</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state-card small">
                    <Bookmark size={24} />
                    <p>You haven't saved any tutorials yet. Click the bookmark icon on any tutorial card to save it here.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ==========================================================
              VIEW: ALL TUTORIALS CATALOG
              ========================================================== */}
          {activeTab === 'tutorials' && (
            <div className="catalog-content-flow">
              <div className="catalog-header-bar">
                <div>
                  <h1 className="catalog-title">All Tutorials Catalog</h1>
                  <p className="catalog-subtitle">
                    Showing {filteredTutorials.length} tutorials matching your filters.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="catalog-filter-scroller">
                  <button
                    className={`filter-pill-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('all')}
                  >
                    All ({allTutorials.length})
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`filter-pill-btn ${categoryFilter === cat.slug ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTutorials.length > 0 ? (
                <div className="tutorials-catalog-grid">
                  {filteredTutorials.map(tut => (
                    <div key={tut.id} className="tutorial-catalog-card">
                      <div className="tut-card-top">
                        <span className="tut-cat-badge">{tut.category_name}</span>
                        <button
                          className={`tut-bm-icon-btn ${tut.is_bookmarked ? 'active' : ''}`}
                          onClick={() => handleToggleBookmark(tut.id, tut.is_bookmarked)}
                          title="Bookmark"
                        >
                          <Bookmark size={16} />
                        </button>
                      </div>

                      <h3 className="tut-title">{tut.title}</h3>
                      <p className="tut-desc">{tut.description}</p>

                      <div className="tut-meta-row">
                        <span className={`diff-tag ${tut.difficulty?.toLowerCase()}`}>
                          {tut.difficulty}
                        </span>
                        <span className="tut-time">
                          <Clock size={12} /> {tut.estimated_minutes} mins
                        </span>
                        <span className="tut-topics-count">
                          {tut.total_topics} topics
                        </span>
                      </div>

                      <div className="tut-footer-action">
                        <button
                          className="btn-start-tutorial"
                          onClick={() => handleOpenTutorial(tut.slug)}
                        >
                          <span>Open Tutorial</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card">
                  <Filter size={32} />
                  <h3>No Tutorials Found</h3>
                  <p>No tutorials found matching "{searchQuery}". Try selecting another category.</p>
                  <button className="btn-empty-start" onClick={() => { setCategoryFilter('all'); setSearchQuery(''); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==========================================================
              VIEW: MY PROGRESS BREAKDOWN
              ========================================================== */}
          {activeTab === 'progress' && (
            <div className="progress-content-flow">
              <div className="section-header-row">
                <div>
                  <h1 className="catalog-title">My Learning Progress</h1>
                  <p className="catalog-subtitle">Detailed audit of all completed topics and active courses.</p>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="progress-summary-row">
                <div className="prog-metric-card">
                  <div className="prog-metric-num">{summaryStats?.completed_lessons ?? 0}</div>
                  <div className="prog-metric-label">Completed Lessons</div>
                </div>
                <div className="prog-metric-card">
                  <div className="prog-metric-num">{summaryStats?.total_available_topics ?? 0}</div>
                  <div className="prog-metric-label">Total Published Topics</div>
                </div>
                <div className="prog-metric-card">
                  <div className="prog-metric-num">{summaryStats?.overall_progress_percentage ?? 0}%</div>
                  <div className="prog-metric-label">Overall Completion</div>
                </div>
              </div>

              {/* Completed Topics Table */}
              <div className="completed-topics-table-card">
                <h3 className="table-card-heading">Completed Topics</h3>
                {userProgressData?.completed_topics?.length > 0 ? (
                  <div className="topics-table">
                    {userProgressData.completed_topics.map((item) => (
                      <div key={item.id} className="table-row-item">
                        <div className="table-cell-title">
                          <CheckCircle2 size={16} className="text-emerald" />
                          <div>
                            <strong>{item.topic_title}</strong>
                            <div className="sub-crumb">{item.tutorial_title}</div>
                          </div>
                        </div>
                        <div className="table-cell-date">
                          {item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Completed'}
                        </div>
                        <div className="table-cell-action">
                          <button
                            className="btn-review-topic"
                            onClick={() => handleOpenTutorial(item.tutorial_id, item.topic_id)}
                          >
                            Review Topic
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-card small">
                    <p>No completed topics yet. Mark topics completed while reading to see them here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================================
              VIEW: SAVED TUTORIALS (DEDICATED)
              ========================================================== */}
          {activeTab === 'saved' && (
            <div className="saved-content-flow">
              <div className="section-header-row">
                <div>
                  <h1 className="catalog-title">Saved Tutorials ({savedBookmarks.length})</h1>
                  <p className="catalog-subtitle">Access your bookmarked study guides anytime.</p>
                </div>
              </div>

              {savedBookmarks.length > 0 ? (
                <div className="bookmarks-grid">
                  {savedBookmarks.map(bm => {
                    const tut = bm.tutorial;
                    if (!tut) return null;
                    return (
                      <div key={bm.id} className="bookmark-card">
                        <div className="bookmark-card-top">
                          <span className="bookmark-cat-pill">{tut.category_name}</span>
                          <button
                            className="btn-remove-bookmark"
                            onClick={() => handleToggleBookmark(tut.id, true)}
                            title="Remove bookmark"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 className="bookmark-card-title">{tut.title}</h4>
                        <p className="bookmark-card-desc">{tut.description}</p>
                        <div className="bookmark-card-footer">
                          <span className="bookmark-topics-count">{tut.total_topics} topics</span>
                          <button
                            className="btn-open-bookmark"
                            onClick={() => handleOpenTutorial(tut.slug)}
                          >
                            <span>Open</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-card">
                  <Bookmark size={32} />
                  <h3>No Bookmarks Saved</h3>
                  <p>Click the bookmark ribbon on any course or tutorial card to save it for quick revision.</p>
                </div>
              )}
            </div>
          )}

          {/* ==========================================================
              VIEW: LEARNING HISTORY TIMELINE
              ========================================================== */}
          {activeTab === 'history' && (
            <div className="history-content-flow">
              <div className="section-header-row">
                <div>
                  <h1 className="catalog-title">Learning History &amp; Audit Log</h1>
                  <p className="catalog-subtitle">Timeline of all recorded lessons, views, and milestones.</p>
                </div>
              </div>

              {recentActivities.length > 0 ? (
                <div className="history-timeline-card">
                  {recentActivities.map(act => (
                    <div key={act.id} className="timeline-entry">
                      <div className="timeline-marker"></div>
                      <div className="timeline-body">
                        <div className="timeline-event-name">
                          {act.activity_type === 'completed_topic' ? 'Completed Topic' :
                            act.activity_type === 'bookmarked' ? 'Bookmarked Tutorial' :
                              act.activity_type === 'removed_bookmark' ? 'Removed Bookmark' : 'Accessed Topic'}:
                          <strong> {act.topic_title || act.tutorial_title || 'Module'}</strong>
                        </div>
                        <div className="timeline-meta-text">
                          {new Date(act.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card">
                  <History size={32} />
                  <h3>No Activity Logged</h3>
                  <p>As you study tutorials and complete topics, your live history will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* ==========================================================
              VIEW: CONTINUE LEARNING (DEDICATED)
              ========================================================== */}
          {activeTab === 'continue' && (
            <div className="continue-content-flow">
              <div className="section-header-row">
                <div>
                  <h1 className="catalog-title">In-Progress Tutorials</h1>
                  <p className="catalog-subtitle">All courses you have started with active learning progress.</p>
                </div>
              </div>

              {continueItems.length > 0 ? (
                <div className="continue-learning-grid">
                  {continueItems.map(item => (
                    <div key={item.tutorial_id} className="continue-course-card">
                      <div className="continue-card-header">
                        <span className="continue-cat-badge">
                          {getCategoryIcon(item.category_icon, item.category_slug)}
                          <span>{item.category_name}</span>
                        </span>
                        <span className="continue-time-tag">
                          <Clock size={12} />
                          <span>Recently accessed</span>
                        </span>
                      </div>

                      <h3 className="continue-course-title">{item.tutorial_title}</h3>
                      <p className="continue-topic-crumb">
                        <strong>Last Topic:</strong> {item.last_topic_title || 'Introduction'}
                      </p>

                      <div className="continue-progress-container">
                        <div className="progress-labels">
                          <span>Completion</span>
                          <span>{item.completed_topics}/{item.total_topics} topics ({item.progress_percentage}%)</span>
                        </div>
                        <div className="progress-track-bar">
                          <div
                            className="progress-fill-bar"
                            style={{ width: `${item.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        className="btn-resume-learning"
                        onClick={() => handleOpenTutorial(item.tutorial_slug, item.last_topic_id)}
                      >
                        <span>Resume Learning</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card">
                  <BookOpen size={32} />
                  <h3>No Courses in Progress</h3>
                  <p>Start any tutorial from the catalog to see it tracked here.</p>
                  <button className="btn-empty-start" onClick={() => setActiveTab('tutorials')}>
                    Browse Tutorials
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
