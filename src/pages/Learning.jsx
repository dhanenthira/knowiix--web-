import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
  Sparkles,
  AlertCircle
} from 'lucide-react';
import './Learning.css';
import './UserDashboard.css';

export default function Learning() {
  const { admin } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ connected: false, database: 'loading...' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'all_notes'

  // Fetch Database Status and Learning Modules from DB
  const loadDatabaseData = async () => {
    setLoading(true);
    try {
      // 1. Check DB health
      const statusRes = await axios.get('/db-status').catch(() => ({ data: { connected: false } }));
      setDbStatus(statusRes.data || { connected: false });

      // 2. Fetch learning modules directly from MySQL
      const modulesRes = await axios.get('/api/lessons/modules');
      setModules(modulesRes.data || []);
    } catch (err) {
      console.error('Failed to load learning modules from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Fetch specific lesson details when clicked
  const handleOpenLesson = async (lessonId) => {
    setLoadingLesson(true);
    try {
      const res = await axios.get(`/api/lessons/${lessonId}`);
      setActiveLesson(res.data);
    } catch (err) {
      console.error('Error fetching lesson from DB:', err);
    } finally {
      setLoadingLesson(false);
    }
  };

  // Add a new study note directly to MySQL
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeLesson) return;

    setSubmittingNote(true);
    try {
      const res = await axios.post(`/api/lessons/${activeLesson.id}/add-note`, {
        note: newNoteText.trim()
      });
      if (res.data && res.data.notes) {
        setActiveLesson(prev => ({ ...prev, notes: res.data.notes }));
        setNewNoteText('');
      }
    } catch (err) {
      console.error('Failed to save note to MySQL:', err);
      alert('Could not save note to database. Please check connection.');
    } finally {
      setSubmittingNote(false);
    }
  };

  // Toggle lesson completed status in MySQL
  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    const newStatus = !activeLesson.is_completed;
    try {
      await axios.post('/api/lessons/progress', {
        lesson_id: activeLesson.id,
        completed: newStatus
      });
      setActiveLesson(prev => ({ ...prev, is_completed: newStatus }));
      // refresh module progress
      loadDatabaseData();
    } catch (err) {
      console.error('Failed to update progress in DB:', err);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSyntax(true);
    setTimeout(() => setCopiedSyntax(false), 2000);
  };

  // Filtering modules
  const filteredModules = modules.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.topics && m.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Calculate totals
  const totalLessonsInDb = modules.reduce((acc, m) => acc + (m.total_lessons || 0), 0);
  const totalCompletedInDb = modules.reduce((acc, m) => acc + (m.completed_lessons || 0), 0);

  // Icon helper
  const getModuleIcon = (iconName) => {
    switch (iconName) {
      case 'code-2': return <Code2 size={24} />;
      case 'layers': return <Layers size={24} />;
      case 'database': return <Database size={24} />;
      case 'brain': return <Brain size={24} />;
      default: return <BookOpen size={24} />;
    }
  };

  return (
    <div className="learning-page-wrapper">
      {/* ==========================================================
          1. EXACT UNIFIED HORIZONTAL TOP NAVIGATION BAR (Matching Image)
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

          {/* Desktop Horizontal Navigation Links */}
          <nav className="navbar-nav-links">
            <Link to="/student" className="nav-tab">
              <span className="nav-emoji">🏠</span>
              <span>DASHBOARD</span>
            </Link>

            {/* LEARNING & NOTES TAB - MARKED ACTIVE WITH BLUE/PURPLE UNDERLINE */}
            <Link to="/learning" className="nav-tab active">
              <span className="nav-emoji">📖</span>
              <span>LEARNING &amp; NOTES</span>
            </Link>

            <Link to="/student" className="nav-tab">
              <span className="nav-emoji">📅</span>
              <span>DAILY PRACTICE</span>
            </Link>

            <Link to="/questions?category=Aptitude" className="nav-tab">
              <span className="nav-emoji">🧠</span>
              <span>APTITUDE</span>
            </Link>

            <Link to="/questions?category=Technical" className="nav-tab">
              <span className="nav-emoji">💻</span>
              <span>TECHNICAL</span>
            </Link>
          </nav>

          {/* Right Navbar Actions */}
          <div className="navbar-actions">
          </div>
        </div>
      </header>

      {/* ==========================================================
          2. LIVE DATABASE CONNECTION STATUS BAR
          ========================================================== */}
      <div className="db-status-bar">
        <div className="db-status-info">
          <div className="db-live-indicator">
            <span className="pulse-dot"></span>
            <span>{dbStatus.connected ? 'DATABASE CONNECTED' : 'CONNECTING TO DB...'}</span>
          </div>
          <span className="db-meta-text">
            Engine: <strong>MySQL 8.0</strong> • Database: <strong>{dbStatus.database || 'demo'}</strong> • Host: <strong>{dbStatus.host || 'localhost:3306'}</strong>
          </span>
        </div>

        <button 
          className="db-sync-btn" 
          onClick={loadDatabaseData} 
          title="Refresh learning topics & notes directly from MySQL database"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Sync DB Data</span>
        </button>
      </div>

      {/* ==========================================================
          3. MAIN CONTENT CONTAINER
          ========================================================== */}
      <main className="learning-container">
        {/* Header Hero */}
        <section className="learning-header">
          <div className="learning-header-top">
            <div>
              <div className="header-badge-row">
                <span className="pill-badge primary">SkillPrep Study Center</span>
                <span className="pill-badge success">Live DB Sync Active</span>
              </div>
              <h1 className="learning-title">Learning Modules &amp; Placement Notes</h1>
              <p className="learning-subtitle">
                Access structured syntax guides, interview cheat sheets, code snippets, and placement formulas retrieved dynamically from your database.
              </p>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="learning-controls-bar">
            <div className="category-filter-group">
              <button 
                className={`category-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Modules ({modules.length})
              </button>
              <button 
                className={`category-pill-btn ${selectedCategory === 'python' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('python')}
              >
                Python &amp; OOP
              </button>
              <button 
                className={`category-pill-btn ${selectedCategory === 'dsa' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('dsa')}
              >
                DSA &amp; Algorithms
              </button>
              <button 
                className={`category-pill-btn ${selectedCategory === 'sql' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('sql')}
              >
                Database &amp; SQL
              </button>
              <button 
                className={`category-pill-btn ${selectedCategory === 'aptitude' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('aptitude')}
              >
                Placement Aptitude
              </button>
            </div>

            <div className="search-input-box">
              <Search size={16} className="search-icon-svg" />
              <input 
                type="text"
                placeholder="Search notes, syntax, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
          </div>
        </section>

        {/* Database Stats Counters */}
        <div className="learning-stats-row">
          <div className="stat-metric-card">
            <div className="stat-metric-icon indigo">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="stat-metric-val">{modules.length}</div>
              <div className="stat-metric-lbl">DB Modules Loaded</div>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-icon emerald">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="stat-metric-val">{totalLessonsInDb}</div>
              <div className="stat-metric-lbl">Total Lessons in DB</div>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-icon amber">
              <Bookmark size={20} />
            </div>
            <div>
              <div className="stat-metric-val">45+</div>
              <div className="stat-metric-lbl">Study Notes &amp; Formulas</div>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-metric-icon sky">
              <Database size={20} />
            </div>
            <div>
              <div className="stat-metric-val">{dbStatus.connected ? 'Active' : 'Offline'}</div>
              <div className="stat-metric-lbl">MySQL Status</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="empty-loading-state">
            <div className="loading-spinner"></div>
            <p>Connecting to MySQL database and retrieving learning modules...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="empty-loading-state">
            <AlertCircle size={32} color="#94a3b8" />
            <p>No learning modules found matching your query in the database.</p>
            <button className="category-pill-btn active" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="modules-grid">
            {filteredModules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="module-card-top">
                  <div className="module-icon-wrap">
                    {getModuleIcon(module.icon)}
                  </div>
                  <span className="module-badge">{module.category}</span>
                </div>

                <h3 className="module-title">{module.title}</h3>
                <p className="module-desc">{module.description}</p>

                {/* Progress Bar */}
                <div className="module-progress-wrap">
                  <div className="module-progress-head">
                    <span>Progress ({module.completed_lessons || 0}/{module.total_lessons || 0} Lessons)</span>
                    <span>{Math.round(module.progress_percentage || 0)}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.round(module.progress_percentage || 0)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Topics Preview List from DB */}
                {module.topics && module.topics.length > 0 && (
                  <div className="module-topics-list">
                    <div className="module-topics-title">Topics &amp; Notes in this Module:</div>
                    {module.topics.map((topic) => (
                      <div 
                        key={topic.id} 
                        className={`topic-item-preview ${topic.is_completed ? 'completed' : ''}`}
                        onClick={() => handleOpenLesson(topic.id)}
                        title="Click to view full notes, syntax, and examples from DB"
                      >
                        <span>{topic.title}</span>
                        <span className={`topic-status-badge ${topic.is_completed ? 'done' : 'pending'}`}>
                          {topic.is_completed ? 'Completed' : 'Study'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  className="module-action-btn"
                  onClick={() => {
                    const firstTopicId = module.topics?.[0]?.id;
                    if (firstTopicId) handleOpenLesson(firstTopicId);
                  }}
                >
                  <span>Open Study Notes &amp; Lessons</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ==========================================================
          4. INTERACTIVE LESSON & NOTES VIEWER MODAL
          ========================================================== */}
      {(activeLesson || loadingLesson) && (
        <div className="lesson-modal-overlay" onClick={() => !loadingLesson && setActiveLesson(null)}>
          <div className="lesson-modal-content" onClick={(e) => e.stopPropagation()}>
            {loadingLesson ? (
              <div className="empty-loading-state" style={{ minHeight: '300px' }}>
                <div className="loading-spinner"></div>
                <p>Loading lesson notes from database...</p>
              </div>
            ) : activeLesson ? (
              <>
                {/* Modal Header */}
                <div className="modal-header">
                  <div className="modal-header-info">
                    <span className="modal-module-tag">
                      {activeLesson.category?.toUpperCase()} • LESSON #{activeLesson.order}
                    </span>
                    <h2 className="modal-title">{activeLesson.title}</h2>
                  </div>
                  <button 
                    className="modal-close-btn" 
                    onClick={() => setActiveLesson(null)}
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Overview */}
                  <div className="lesson-section">
                    <div className="lesson-section-title">
                      <Sparkles size={16} color="#6366f1" />
                      <span>Overview &amp; Context</span>
                    </div>
                    <p className="lesson-section-text">{activeLesson.intro}</p>
                  </div>

                  {/* Definition */}
                  <div className="lesson-section">
                    <div className="lesson-section-title">
                      <BookOpen size={16} color="#059669" />
                      <span>Definition &amp; Core Concepts</span>
                    </div>
                    <p className="lesson-section-text">{activeLesson.definition}</p>
                    <div style={{ marginTop: '10px' }}>
                      <p className="lesson-section-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
                        {activeLesson.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Syntax & Formulas */}
                  {activeLesson.syntax && (
                    <div className="lesson-section">
                      <div className="lesson-section-title" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Code2 size={16} color="#38bdf8" />
                          <span>Syntax &amp; Formula Pattern</span>
                        </div>
                        <button 
                          className="db-sync-btn" 
                          onClick={() => handleCopyCode(activeLesson.syntax)}
                        >
                          {copiedSyntax ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                          <span>{copiedSyntax ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="syntax-block">{activeLesson.syntax}</pre>
                    </div>
                  )}

                  {/* Code Snippets & Execution Output */}
                  {activeLesson.code_snippets && activeLesson.code_snippets.length > 0 && (
                    <div className="lesson-section">
                      <div className="lesson-section-title">
                        <Code2 size={16} color="#6366f1" />
                        <span>Interactive Executable Code Example</span>
                      </div>
                      {activeLesson.code_snippets.map((snip, idx) => (
                        <div key={idx} className="code-box-container">
                          <div className="code-box-header">
                            <span>Language: {snip.language}</span>
                            <button 
                              className="db-sync-btn" 
                              onClick={() => handleCopyCode(snip.code)}
                            >
                              <Copy size={12} />
                              <span>Copy Code</span>
                            </button>
                          </div>
                          <pre className="code-content-pre">{snip.code}</pre>
                          {snip.output && (
                            <div className="code-output-box">
                              <div className="code-output-title">Verified Execution Output:</div>
                              <pre className="code-output-text">{snip.output}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Placement Study Notes from Database */}
                  <div className="lesson-section">
                    <div className="lesson-section-title">
                      <Bookmark size={16} color="#d97706" />
                      <span>Key Placement Notes &amp; Interview Tips (From DB)</span>
                    </div>
                    <div className="key-notes-list">
                      {activeLesson.notes && activeLesson.notes.length > 0 ? (
                        activeLesson.notes.map((note, nIdx) => (
                          <div key={nIdx} className="key-note-card">
                            <span className="note-bullet-icon">📌</span>
                            <span>{note}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No study notes recorded yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Add New Personal / Placement Note directly to DB */}
                  <div className="add-note-box">
                    <div className="add-note-title">
                      <Plus size={15} />
                      <span>Add a Custom Note to this Lesson (Saves to MySQL)</span>
                    </div>
                    <form onSubmit={handleAddNote} className="add-note-form">
                      <input 
                        type="text"
                        placeholder="Type an important formula, edge case, or interview note..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="add-note-input"
                        disabled={submittingNote}
                      />
                      <button 
                        type="submit" 
                        className="add-note-submit-btn"
                        disabled={submittingNote || !newNoteText.trim()}
                      >
                        {submittingNote ? 'Saving...' : 'Save to DB'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button 
                    className="mark-done-btn"
                    onClick={handleToggleComplete}
                    style={{ background: activeLesson.is_completed ? '#64748b' : '#10b981' }}
                  >
                    <CheckCircle size={16} />
                    <span>{activeLesson.is_completed ? 'Mark as Incomplete' : 'Mark as Completed (+15 pts)'}</span>
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link 
                      to="/questions?category=Aptitude" 
                      className="practice-btn-link"
                    >
                      <span>Practice Related Questions</span>
                      <ExternalLink size={14} />
                    </Link>

                    <button 
                      className="practice-btn-link"
                      onClick={() => setActiveLesson(null)}
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
