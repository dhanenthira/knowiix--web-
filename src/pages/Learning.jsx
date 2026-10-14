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
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Menu,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  FileCode,
  SlidersHorizontal,
  ArrowRight,
  LogOut,
  Bell
} from 'lucide-react';
import './Learning.css';
import './UserDashboard.css';

// Interactive exercises tailored to database topics
const LESSON_EXERCISES = {
  py_intro: {
    question: "Which built-in function is used in Python to display output on the screen?",
    options: ["echo()", "console.log()", "print()", "System.out.println()"],
    correct: 2,
    explanation: "In Python, print() is the standard built-in function to display text or values to the console."
  },
  py_syntax: {
    question: "Which of the following data types in Python is IMMUTABLE (cannot be modified after creation)?",
    options: ["list", "tuple", "dict", "set"],
    correct: 1,
    explanation: "Tuples are immutable in Python. Once initialized, their elements cannot be changed or reassigned."
  },
  py_control: {
    question: "Which keyword immediately skips the rest of the current loop iteration and moves to the next iteration?",
    options: ["break", "pass", "continue", "return"],
    correct: 2,
    explanation: "The continue statement rejects all remaining statements in the current iteration of the loop and moves the control back to the top."
  },
  py_functions: {
    question: "Which keyword is used to create a small, anonymous inline one-line function in Python?",
    options: ["def", "func", "inline", "lambda"],
    correct: 3,
    explanation: "lambda creates anonymous functions: e.g., square = lambda x: x * x."
  },
  py_oop: {
    question: "What is the name of the constructor method in Python classes that initializes new object instances?",
    options: ["__init__", "__construct__", "__new__", "__main__"],
    correct: 0,
    explanation: "__init__ is the initializer method automatically called when a new instance of a class is created."
  },
  dsa_arrays: {
    question: "What is the optimal time complexity to find a target sum pair in a sorted array using two pointers?",
    options: ["O(N^2)", "O(N log N)", "O(N)", "O(1)"],
    correct: 2,
    explanation: "With two pointers starting at both ends of a sorted array, each step moves one pointer inward, taking O(N) linear time."
  },
  dsa_linkedlist: {
    question: "What is the time complexity to insert a new node at the HEAD of a Singly Linked List?",
    options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
    correct: 0,
    explanation: "Inserting at the head only requires updating the new node's next pointer and head reference, taking O(1) constant time."
  },
  dsa_stack_queue: {
    question: "Which data structure follows the First-In, First-Out (FIFO) ordering principle?",
    options: ["Stack", "Queue", "Binary Search Tree", "Max Heap"],
    correct: 1,
    explanation: "A Queue processes elements in First-In, First-Out (FIFO) order (e.g. printer spooling, CPU task queues, BFS)."
  },
  dsa_trees: {
    question: "Which tree traversal of a Binary Search Tree (BST) visits nodes in strictly ascending sorted order?",
    options: ["Pre-order (Root-Left-Right)", "In-order (Left-Root-Right)", "Post-order (Left-Right-Root)", "Level-order (BFS)"],
    correct: 1,
    explanation: "In-order traversal of a BST always yields keys in ascending non-decreasing order."
  },
  sql_basics: {
    question: "Which SQL clause is used to filter aggregated group results produced by GROUP BY?",
    options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
    correct: 1,
    explanation: "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY."
  },
  sql_joins: {
    question: "Which JOIN returns ALL rows from the left table, along with matched rows from the right table?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
    correct: 1,
    explanation: "LEFT JOIN (or LEFT OUTER JOIN) preserves every record from the left table and matches records from the right table."
  },
  sql_indexes: {
    question: "Which self-balancing search tree data structure is most widely used by relational database engines for primary key indexes?",
    options: ["B+ Tree", "AVL Tree", "Red-Black Tree", "Trie"],
    correct: 0,
    explanation: "B+ Trees store all records in sorted leaf nodes linked as a list, making range queries and disk block reads extremely fast."
  },
  apt_time_work: {
    question: "If Worker A completes a job in 10 days and Worker B in 15 days, in how many days can they complete it working together?",
    options: ["5 days", "6 days", "7.5 days", "8 days"],
    correct: 1,
    explanation: "Combined rate = 1/10 + 1/15 = 5/30 = 1/6 job/day. Days required = 1 / (1/6) = 6 days."
  },
  apt_speed_dist: {
    question: "What conversion factor should you multiply with to convert a speed from km/h into m/s?",
    options: ["18 / 5", "5 / 18", "1000 / 60", "36 / 5"],
    correct: 1,
    explanation: "1 km/h = 1000m / 3600s = 5/18 m/s. Multiply km/h by 5/18 to get m/s."
  },
  apt_profit_loss: {
    question: "An article bought for ₹80 is sold for ₹100. What is the profit percentage?",
    options: ["20%", "25%", "15%", "12.5%"],
    correct: 1,
    explanation: "Profit = ₹100 - ₹80 = ₹20. Profit % = (Profit / Cost Price) * 100 = (20 / 80) * 100 = 25%."
  }
};

export default function Learning() {
  const { admin, logout } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ connected: false, database: 'loading...' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = admin?.role === 'admin' 
    ? 'Administrator' 
    : (admin?.name || 'Administrator');
  
  // W3Schools Learning Studio State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [interactiveOutput, setInteractiveOutput] = useState(null);
  
  // Interactive Exercise State
  const [userAnswers, setUserAnswers] = useState({});
  const [exerciseResult, setExerciseResult] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

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

  // Enter W3Schools Learning Studio for a chosen course
  const handleOpenCourse = async (courseModule, initialTopicId = null) => {
    setSelectedCourse(courseModule);
    setLoadingLesson(true);
    setInteractiveOutput(null);
    setTopicSearch('');
    try {
      // Fetch all full lessons for this course module from MySQL
      const res = await axios.get(`/api/lessons/module/${courseModule.id}/lessons`);
      const lessons = res.data || [];
      setCourseLessons(lessons);

      let targetLesson = null;
      if (initialTopicId) {
        targetLesson = lessons.find(l => l.id === initialTopicId || l.topic_id === initialTopicId);
      }
      if (!targetLesson && lessons.length > 0) {
        targetLesson = lessons[0];
      }
      setActiveLesson(targetLesson);
    } catch (err) {
      console.error('Error fetching course lessons from DB:', err);
    } finally {
      setLoadingLesson(false);
    }
  };

  // Switch active topic in W3Schools sidebar without page navigation
  const handleSelectTopic = (lessonId) => {
    setInteractiveOutput(null);
    const existing = courseLessons.find(l => l.id === lessonId);
    if (existing) {
      setActiveLesson(existing);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoadingLesson(true);
    axios.get(`/api/lessons/${lessonId}`)
      .then(res => {
        setActiveLesson(res.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => console.error('Error fetching lesson:', err))
      .finally(() => setLoadingLesson(false));
  };

  // Close W3Schools view and return to course selection screen
  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setActiveLesson(null);
    setCourseLessons([]);
    setInteractiveOutput(null);
    loadDatabaseData();
  };

  // Previous & Next navigation
  const currentTopicIndex = courseLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentTopicIndex > 0 ? courseLessons[currentTopicIndex - 1] : null;
  const nextLesson = currentTopicIndex >= 0 && currentTopicIndex < courseLessons.length - 1 
    ? courseLessons[currentTopicIndex + 1] 
    : null;

  const handlePrev = () => {
    if (prevLesson) handleSelectTopic(prevLesson.id);
  };

  const handleNext = () => {
    if (nextLesson) handleSelectTopic(nextLesson.id);
  };

  // Toggle lesson completed status in MySQL & update local state
  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    const newStatus = !activeLesson.is_completed;
    try {
      await axios.post('/api/lessons/progress', {
        lesson_id: activeLesson.id,
        completed: newStatus
      });
      setActiveLesson(prev => ({ ...prev, is_completed: newStatus }));
      setCourseLessons(prev => prev.map(l => l.id === activeLesson.id ? { ...l, is_completed: newStatus } : l));
      setModules(prev => prev.map(m => {
        if (m.id === selectedCourse?.id) {
          const updatedTopics = (m.topics || []).map(t => t.id === activeLesson.id ? { ...t, is_completed: newStatus } : t);
          const doneCount = updatedTopics.filter(t => t.is_completed).length;
          return {
            ...m,
            completed_lessons: doneCount,
            progress_percentage: m.total_lessons ? (doneCount / m.total_lessons) * 100 : 0,
            topics: updatedTopics
          };
        }
        return m;
      }));
    } catch (err) {
      console.error('Failed to update progress in DB:', err);
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
        setCourseLessons(prev => prev.map(l => l.id === activeLesson.id ? { ...l, notes: res.data.notes } : l));
        setNewNoteText('');
      }
    } catch (err) {
      console.error('Failed to save note to MySQL:', err);
      alert('Could not save note to database. Please check connection.');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleCopyCode = (code, index = null) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    if (index !== null) {
      setCopiedSnippetIndex(index);
      setTimeout(() => setCopiedSnippetIndex(null), 2000);
    } else {
      setCopiedSyntax(true);
      setTimeout(() => setCopiedSyntax(false), 2000);
    }
  };

  const handleRunExample = (output) => {
    setInteractiveOutput(output || "Program finished successfully with exit code 0.");
  };

  // Exercise answer handler
  const handleSelectAnswer = (lessonId, optIndex) => {
    setUserAnswers(prev => ({ ...prev, [lessonId]: optIndex }));
    const exercise = LESSON_EXERCISES[lessonId];
    if (exercise) {
      const isCorrect = optIndex === exercise.correct;
      setExerciseResult(prev => ({ ...prev, [lessonId]: isCorrect }));
      if (isCorrect && activeLesson && !activeLesson.is_completed) {
        handleToggleComplete();
      }
    }
  };

  // Filtering modules on Course Selection Screen
  const filteredModules = modules.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.topics && m.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Calculate totals for course screen
  const totalLessonsInDb = modules.reduce((acc, m) => acc + (m.total_lessons || 0), 0);

  // Filter topics for the W3Schools left sidebar
  const filteredSidebarTopics = courseLessons.filter(topic => 
    !topicSearch || topic.title.toLowerCase().includes(topicSearch.toLowerCase())
  );

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

  // Calculate course progress percentage
  const completedLessonsCount = courseLessons.filter(l => l.is_completed).length;
  const courseProgressPct = courseLessons.length > 0 
    ? Math.round((completedLessonsCount / courseLessons.length) * 100) 
    : 0;

  const currentExercise = activeLesson ? LESSON_EXERCISES[activeLesson.id] : null;

  return (
    <div className="learning-page-wrapper">
      {/* ==========================================================
          1. EXACT UNIFIED TOP NAVIGATION BAR
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
            <Link to="/profile" className="user-profile-pill" title="View Profile" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="user-avatar-img" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                {admin?.name ? admin.name.substring(0, 2).toUpperCase() : 'AK'}
              </div>
              <div className="user-info-text">
                <div className="user-display-name">{admin?.name || 'Ananya Kumar'}</div>
                <div className="user-level-badge">Level 5 Achiever</div>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="navbar-logout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Sub-navbar greeting bar (Course Catalog view) */}
      {!selectedCourse && (
        <div className="subnav-greeting-bar">
          <div className="subnav-greeting-left">
            <h2 className="subnav-greeting-title">
              {getGreeting()}, {displayName} ! 👋
            </h2>
            <p className="subnav-greeting-subtitle">
              Ready to improve your placement skills today?
            </p>
          </div>

          <div className="subnav-greeting-right">
            <button
              type="button"
              className="subnav-greeting-notif-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="subnav-greeting-notif-dot"></span>
            </button>

            {notificationOpen && (
              <div className="subnav-greeting-notif-dropdown">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Notifications</span>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>2 New</span>
                </div>
                <div className="subnav-greeting-notif-item">
                  <strong>📚 New W3Schools Learning Notes</strong>
                  Python, SQL, Java and Aptitude revision sheets are up to date.
                </div>
                <div className="subnav-greeting-notif-item">
                  <strong>⚡ Daily Goal Reminder</strong>
                  Complete at least 1 study module today to maintain streak.
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ==========================================================
          3. CONDITIONAL RENDER: 
             A) W3SCHOOLS LEARNING STUDIO INTERFACE (When course selected)
             B) EXISTING COURSE SELECTION SCREEN (Default)
          ========================================================== */}
      {selectedCourse ? (
        /* ==========================================================
           W3SCHOOLS-STYLE LEARNING STUDIO VIEW
           ========================================================== */
        <div className="w3-learning-studio">
          {/* Studio Top Control Strip */}
          <div className="w3-top-strip">
            <div className="w3-strip-left">
              <button 
                className="w3-back-btn" 
                onClick={handleBackToCourses}
                title="Return to all available courses"
              >
                <ChevronLeft size={17} />
                <span>All Courses</span>
              </button>

              <div className="w3-course-badge-pill">
                <span className="w3-course-icon-mini">{getModuleIcon(selectedCourse.icon)}</span>
                <span className="w3-course-title-text">{selectedCourse.title}</span>
              </div>
            </div>

            <div className="w3-strip-right">
              {/* Overall Course Progress */}
              <div className="w3-progress-metric">
                <span className="w3-progress-label">Course Progress:</span>
                <div className="w3-progress-bar-wrap">
                  <div className="w3-progress-bar-fill" style={{ width: `${courseProgressPct}%` }}></div>
                </div>
                <span className="w3-progress-text">{completedLessonsCount}/{courseLessons.length} ({courseProgressPct}%)</span>
              </div>

              {/* Mobile Sidebar Toggle Button */}
              <button 
                className="w3-sidebar-toggle-btn"
                onClick={() => setSidebarOpen(prev => !prev)}
                title="Toggle Topics Menu"
              >
                <Menu size={16} />
                <span>{sidebarOpen ? 'Hide Menu' : 'Topics Menu'}</span>
              </button>
            </div>
          </div>

          {/* W3Schools Main 2-Column Layout */}
          <div className="w3-layout-body">
            {/* LEFT SIDEBAR: W3Schools Course Topic Navigator */}
            <aside className={`w3-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
              <div className="w3-sidebar-header">
                <div className="w3-sidebar-course-title">
                  {selectedCourse.category?.toUpperCase()} TUTORIAL
                </div>
                <div className="w3-sidebar-search">
                  <Search size={14} className="w3-sidebar-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Filter topics..."
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    className="w3-sidebar-search-input"
                  />
                  {topicSearch && (
                    <button className="w3-clear-search" onClick={() => setTopicSearch('')}>
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Topics Nav List */}
              <nav className="w3-topics-menu" aria-label="Course Topics">
                <div className="w3-topic-group-header">Core Topics &amp; Lessons</div>
                {filteredSidebarTopics.map((topic, idx) => {
                  const isActive = activeLesson?.id === topic.id;
                  const isDone = topic.is_completed;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        handleSelectTopic(topic.id);
                        if (window.innerWidth < 900) setSidebarOpen(false);
                      }}
                      className={`w3-topic-link ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                    >
                      <div className="w3-topic-left">
                        <span className={`w3-topic-bullet ${isDone ? 'done' : ''}`}>
                          {isDone ? '✓' : String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="w3-topic-name">{topic.title}</span>
                      </div>
                      {isDone && <span className="w3-done-badge" title="Completed">✓</span>}
                    </button>
                  );
                })}

                {filteredSidebarTopics.length === 0 && (
                  <div className="w3-no-topics">No topics match "{topicSearch}"</div>
                )}
              </nav>

              <div className="w3-sidebar-footer">
                <button 
                  className="w3-sidebar-footer-btn" 
                  onClick={handleBackToCourses}
                >
                  <ChevronLeft size={14} />
                  <span>Choose Another Course</span>
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT AREA: W3Schools Interactive Topic Viewer */}
            <main className="w3-main-content">
              {loadingLesson ? (
                <div className="w3-loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading topic notes and code samples from MySQL database...</p>
                </div>
              ) : activeLesson ? (
                <div className="w3-article-container">
                  {/* Top Navigation Row (W3Schools Style) */}
                  <div className="w3-nav-row top">
                    <button 
                      className={`w3-nav-btn ${!prevLesson ? 'disabled' : ''}`}
                      onClick={handlePrev}
                      disabled={!prevLesson}
                    >
                      ❮ Previous
                    </button>

                    <div className="w3-topic-counter">
                      <span>Topic {currentTopicIndex + 1} of {courseLessons.length}</span>
                    </div>

                    <button 
                      className={`w3-nav-btn next ${!nextLesson ? 'disabled' : ''}`}
                      onClick={handleNext}
                      disabled={!nextLesson}
                    >
                      Next ❯
                    </button>
                  </div>

                  {/* Topic Title & Meta */}
                  <div className="w3-topic-heading-section">
                    <div className="w3-breadcrumb-strip">
                      <span>Courses</span>
                      <span className="w3-bc-sep">/</span>
                      <span>{selectedCourse.title}</span>
                      <span className="w3-bc-sep">/</span>
                      <span className="w3-bc-current">{activeLesson.title}</span>
                    </div>

                    <h1 className="w3-topic-h1">{activeLesson.title}</h1>

                    <div className="w3-topic-meta-bar">
                      <span className="w3-meta-tag category">{activeLesson.category?.toUpperCase()}</span>
                      <span className="w3-meta-tag lesson-num">LESSON #{activeLesson.order || (currentTopicIndex + 1)}</span>
                      <span className="w3-meta-tag read-time">
                        <Clock size={13} />
                        <span>5 min read</span>
                      </span>

                      <button 
                        className={`w3-complete-toggle-btn ${activeLesson.is_completed ? 'completed' : 'pending'}`}
                        onClick={handleToggleComplete}
                        title="Click to toggle lesson completion in database"
                      >
                        <CheckCircle size={15} />
                        <span>{activeLesson.is_completed ? 'Topic Completed ✓' : 'Mark as Completed (+15 XP)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Overview & Context */}
                  <div className="w3-card-block">
                    <h2 className="w3-card-h2">
                      <Sparkles size={18} color="#4f46e5" />
                      <span>Overview &amp; Context</span>
                    </h2>
                    <p className="w3-paragraph">{activeLesson.intro}</p>
                  </div>

                  {/* 2. Definition & Core Concepts */}
                  <div className="w3-card-block">
                    <h2 className="w3-card-h2">
                      <BookOpen size={18} color="#059669" />
                      <span>Core Definitions &amp; Concepts</span>
                    </h2>
                    <div className="w3-definition-box">
                      <p className="w3-definition-text">{activeLesson.definition}</p>
                    </div>
                    {activeLesson.explanation && (
                      <p className="w3-paragraph" style={{ marginTop: '12px' }}>
                        {activeLesson.explanation}
                      </p>
                    )}
                  </div>

                  {/* 3. Syntax & Formula Pattern */}
                  {activeLesson.syntax && (
                    <div className="w3-card-block">
                      <div className="w3-syntax-header">
                        <h2 className="w3-card-h2" style={{ marginBottom: 0 }}>
                          <Code2 size={18} color="#0284c7" />
                          <span>Syntax &amp; Formulation</span>
                        </h2>
                        <button 
                          className="w3-copy-btn"
                          onClick={() => handleCopyCode(activeLesson.syntax)}
                        >
                          {copiedSyntax ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                          <span>{copiedSyntax ? 'Copied!' : 'Copy Syntax'}</span>
                        </button>
                      </div>
                      <pre className="w3-syntax-pre">{activeLesson.syntax}</pre>
                    </div>
                  )}

                  {/* 4. Signature W3Schools Code Example Box */}
                  {activeLesson.code_snippets && activeLesson.code_snippets.length > 0 && (
                    <div className="w3-example-section">
                      <h2 className="w3-card-h2">
                        <FileCode size={18} color="#04AA6D" />
                        <span>Code Examples</span>
                      </h2>

                      {activeLesson.code_snippets.map((snip, sIdx) => (
                        <div key={sIdx} className="w3-example-box">
                          <div className="w3-example-top-bar">
                            <span className="w3-example-tag">
                              Example ({snip.language?.toUpperCase() || 'CODE'})
                            </span>
                            <div className="w3-example-actions">
                              <button 
                                className="w3-code-action-btn"
                                onClick={() => handleCopyCode(snip.code, sIdx)}
                              >
                                {copiedSnippetIndex === sIdx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                                <span>{copiedSnippetIndex === sIdx ? 'Copied' : 'Copy'}</span>
                              </button>
                              <button 
                                className="w3-code-run-btn"
                                onClick={() => handleRunExample(snip.output)}
                              >
                                <Play size={12} fill="#ffffff" />
                                <span>Run Code ❯</span>
                              </button>
                            </div>
                          </div>

                          <pre className="w3-code-pre">{snip.code}</pre>

                          {/* Output Preview */}
                          {(snip.output || interactiveOutput) && (
                            <div className="w3-result-box">
                              <div className="w3-result-header">
                                <span>Result / Output:</span>
                              </div>
                              <pre className="w3-result-pre">{interactiveOutput || snip.output}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 5. Key Placement Notes & Interview Tips (From DB) */}
                  <div className="w3-card-block">
                    <h2 className="w3-card-h2">
                      <Bookmark size={18} color="#d97706" />
                      <span>Interview Notes &amp; Placement Tips (From Database)</span>
                    </h2>
                    <div className="w3-notes-list">
                      {activeLesson.notes && activeLesson.notes.length > 0 ? (
                        activeLesson.notes.map((note, nIdx) => (
                          <div key={nIdx} className="w3-note-item">
                            <span className="w3-note-pin">📌</span>
                            <span className="w3-note-text">{note}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No study notes recorded yet for this topic.</p>
                      )}
                    </div>

                    {/* Add Custom Note to MySQL */}
                    <div className="w3-add-note-container">
                      <div className="w3-add-note-label">
                        <Plus size={14} />
                        <span>Add Your Custom Study Note (Saves directly to MySQL)</span>
                      </div>
                      <form onSubmit={handleAddNote} className="w3-add-note-form">
                        <input 
                          type="text" 
                          placeholder="Type an important formula, exception, or interview note..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          className="w3-note-input"
                          disabled={submittingNote}
                        />
                        <button 
                          type="submit" 
                          className="w3-note-submit-btn"
                          disabled={submittingNote || !newNoteText.trim()}
                        >
                          {submittingNote ? 'Saving...' : 'Save Note'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* 6. W3Schools-Style Interactive Practice / Exercise Box */}
                  <div className="w3-exercise-wrapper">
                    <div className="w3-exercise-header">
                      <div className="w3-exercise-title-group">
                        <Award size={20} color="#ffffff" />
                        <span>Test Yourself With Exercises</span>
                      </div>
                      <span className="w3-exercise-badge">Topic Challenge</span>
                    </div>

                    <div className="w3-exercise-body">
                      {currentExercise ? (
                        <>
                          <p className="w3-exercise-question">
                            <strong>Exercise:</strong> {currentExercise.question}
                          </p>

                          <div className="w3-exercise-options">
                            {currentExercise.options.map((option, oIdx) => {
                              const isSelected = userAnswers[activeLesson.id] === oIdx;
                              const hasAnswered = userAnswers[activeLesson.id] !== undefined;
                              const isCorrectOpt = oIdx === currentExercise.correct;
                              let optClass = '';
                              if (hasAnswered) {
                                if (isSelected) {
                                  optClass = isCorrectOpt ? 'correct' : 'wrong';
                                } else if (isCorrectOpt) {
                                  optClass = 'correct-reveal';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  className={`w3-exercise-opt-btn ${optClass}`}
                                  onClick={() => handleSelectAnswer(activeLesson.id, oIdx)}
                                >
                                  <span className="w3-opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                                  <span className="w3-opt-text">{option}</span>
                                  {hasAnswered && isSelected && (
                                    <span className="w3-feedback-mark">{isCorrectOpt ? '✓ Correct' : '✕ Incorrect'}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Exercise Feedback */}
                          {userAnswers[activeLesson.id] !== undefined && (
                            <div className={`w3-exercise-feedback ${exerciseResult[activeLesson.id] ? 'success' : 'retry'}`}>
                              {exerciseResult[activeLesson.id] ? (
                                <div className="w3-feedback-text">
                                  <span>🎉 <strong>Correct!</strong> Well done. {currentExercise.explanation}</span>
                                </div>
                              ) : (
                                <div className="w3-feedback-text">
                                  <span>💡 <strong>Not quite!</strong> {currentExercise.explanation}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w3-general-practice-box">
                          <p className="w3-exercise-question">
                            Reinforce what you learned in <strong>{activeLesson.title}</strong> by solving real interview practice problems.
                          </p>
                        </div>
                      )}

                      {/* Direct links to CodeArena Practice & Questions */}
                      <div className="w3-practice-links-row">
                        <Link 
                          to="/questions?category=Technical" 
                          className="w3-practice-link-action"
                        >
                          <Brain size={15} />
                          <span>Solve MCQ Practice Drills</span>
                          <ArrowRight size={14} />
                        </Link>
                        <Link 
                          to="/coding" 
                          className="w3-practice-link-action secondary"
                        >
                          <Code2 size={15} />
                          <span>CodeArena IDE Sandbox</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Row (W3Schools Style) */}
                  <div className="w3-nav-row bottom">
                    <button 
                      className={`w3-nav-btn ${!prevLesson ? 'disabled' : ''}`}
                      onClick={handlePrev}
                      disabled={!prevLesson}
                    >
                      ❮ Previous
                    </button>

                    <button 
                      className={`w3-complete-btn-bottom ${activeLesson.is_completed ? 'completed' : ''}`}
                      onClick={handleToggleComplete}
                    >
                      <CheckCircle2 size={16} />
                      <span>{activeLesson.is_completed ? 'Completed ✓' : 'Mark Lesson Completed'}</span>
                    </button>

                    <button 
                      className={`w3-nav-btn next ${!nextLesson ? 'disabled' : ''}`}
                      onClick={handleNext}
                      disabled={!nextLesson}
                    >
                      Next ❯
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w3-loading-state">
                  <p>Select a topic from the left sidebar to start learning.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* ==========================================================
           EXISTING COURSE SELECTION SCREEN (UNCHANGED BEHAVIOR)
           ========================================================== */
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
                          onClick={() => handleOpenCourse(module, topic.id)}
                          title="Click to view full notes, syntax, and examples in W3Schools Studio"
                        >
                          <span>{topic.title}</span>
                          <span className={`topic-status-badge ${topic.is_completed ? 'done' : 'pending'}`}>
                            {topic.is_completed ? 'Completed' : 'Study'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Open Study Notes & Lessons Button - Enters W3Schools Studio */}
                  <button 
                    className="module-action-btn"
                    onClick={() => handleOpenCourse(module)}
                  >
                    <span>Open Study Notes &amp; Lessons</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
