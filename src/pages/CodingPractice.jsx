import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Flame,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Award,
  Zap,
  Coffee,
  Cpu,
  Database,
  Globe,
  FolderTree,
  FileCode,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import codingApi from '../api/codingApi';
import './CodingPractice.css';

// Category icon mapper
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'terminal': return <Terminal size={20} />;
    case 'file-code': return <FileCode size={20} />;
    case 'coffee': return <Coffee size={20} />;
    case 'cpu': return <Cpu size={20} />;
    case 'layers': return <Layers size={20} />;
    case 'globe': return <Globe size={20} />;
    case 'database': return <Database size={20} />;
    case 'folder-tree': return <FolderTree size={20} />;
    case 'zap': return <Zap size={20} />;
    case 'award': return <Award size={20} />;
    default: return <Code2 size={20} />;
  }
};

export default function CodingPractice() {
  const { admin } = useAuth();
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total_problems: 0,
    problems_solved: 0,
    attempted_problems: 0,
    current_streak: 1,
    easy_solved: 0,
    medium_solved: 0,
    hard_solved: 0,
    easy_total: 0,
    medium_total: 0,
    hard_total: 0
  });

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblemsCount, setTotalProblemsCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');
  const [solvedStatus, setSolvedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Load Categories & User Progress
  useEffect(() => {
    codingApi.getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));

    codingApi.getUserProgress()
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load user progress:', err));
  }, []);

  // Fetch Problems
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_dir: 'asc'
      };
      if (search.trim()) params.search = search.trim();
      if (difficulty !== 'all') params.difficulty = difficulty;
      if (category !== 'all') params.category = category;
      if (language !== 'all') params.language = language;
      if (solvedStatus !== 'all') params.solved_status = solvedStatus;

      const res = await codingApi.getProblems(params);
      setProblems(res.items || []);
      setTotalPages(res.total_pages || 1);
      setTotalProblemsCount(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch coding problems:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, difficulty, category, language, solvedStatus, sortBy]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleCategoryClick = (catName) => {
    if (category === catName) {
      setCategory('all');
    } else {
      setCategory(catName);
    }
    setPage(1);
    // Smooth scroll to problem list
    document.getElementById('problems-list-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setDifficulty('all');
    setCategory('all');
    setLanguage('all');
    setSolvedStatus('all');
    setSortBy('created_at');
    setPage(1);
  };

  return (
    <div className="coding-dashboard-container">
      {/* 1. TOP NAVBAR */}
      <header className="coding-top-nav">
        <div className="coding-nav-left">
          <Link to="/coding/practice" className="coding-brand-badge">
            <div className="hr-icon-box">H</div>
            <span>Coding Practice</span>
          </Link>
          <nav className="coding-nav-links">
            <Link to="/student" className="coding-nav-link">Dashboard</Link>
            <Link to="/learning" className="coding-nav-link">Learning Notes</Link>
            <Link to="/aptitude" className="coding-nav-link">Aptitude</Link>
            <Link to="/coding/practice" className="coding-nav-link active">Practice Arena</Link>
          </nav>
        </div>

        <div className="coding-nav-right">
          <div className="user-streak-pill" title="Daily coding streak">
            <Flame size={16} color="#ea580c" />
            <span>{stats.current_streak || 1} Day Streak</span>
          </div>

          <Link to="/student" className="btn-back-dashboard">
            <LayoutDashboard size={15} />
            <span>My Dashboard</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="coding-main-body">
        {/* Header Title Banner */}
        <section className="coding-header-banner">
          <div>
            <h1 className="coding-header-title">
              <span>👨‍💻</span> Coding Practice Arena
            </h1>
            <p className="coding-header-subtitle">
              Prepare for technical interviews with curated coding challenges, automated test-case evaluation, and sandboxed code execution.
            </p>
          </div>
        </section>

        {/* 3. STATISTICS CARDS */}
        <section className="coding-stats-grid">
          {/* Card 1: Total Problems */}
          <div className="coding-stat-card">
            <div className="stat-card-header">
              <span>Total Problems</span>
              <div className="stat-card-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <Code2 size={20} />
              </div>
            </div>
            <div className="stat-card-number">{stats.total_problems || 67}</div>
            <div className="stat-card-subtext">Curated placement challenges</div>
          </div>

          {/* Card 2: Problems Solved */}
          <div className="coding-stat-card">
            <div className="stat-card-header">
              <span>Problems Solved</span>
              <div className="stat-card-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="stat-card-number">{stats.problems_solved || 0}</div>
            <div className="diff-breakdown-row">
              <span className="diff-pill easy" title="Easy Solved">
                Easy: {stats.easy_solved || 0}
              </span>
              <span className="diff-pill medium" title="Medium Solved">
                Med: {stats.medium_solved || 0}
              </span>
              <span className="diff-pill hard" title="Hard Solved">
                Hard: {stats.hard_solved || 0}
              </span>
            </div>
          </div>

          {/* Card 3: Attempted Problems */}
          <div className="coding-stat-card">
            <div className="stat-card-header">
              <span>Attempted Problems</span>
              <div className="stat-card-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-card-number">{stats.attempted_problems || 0}</div>
            <div className="stat-card-subtext">
              {stats.problems_solved > 0
                ? `${Math.round((stats.problems_solved / Math.max(1, stats.attempted_problems)) * 100)}% Success Rate`
                : 'Keep practicing to solve more!'}
            </div>
          </div>

          {/* Card 4: Current Streak */}
          <div className="coding-stat-card">
            <div className="stat-card-header">
              <span>Current Streak</span>
              <div className="stat-card-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                <Flame size={20} />
              </div>
            </div>
            <div className="stat-card-number">{stats.current_streak || 1} Days</div>
            <div className="stat-card-subtext">Solve 1 problem daily to sustain fire</div>
          </div>
        </section>

        {/* 4. PROBLEM CATEGORIES */}
        <section>
          <div className="coding-section-header">
            <h2 className="coding-section-title">
              <Layers size={22} color="#00a86b" />
              <span>Problem Categories</span>
            </h2>
            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
              Select a category to filter
            </span>
          </div>

          <div className="categories-carousel-grid">
            {categories.map((cat) => {
              const isSelected = category.toLowerCase() === cat.name.toLowerCase() || category.toLowerCase() === cat.slug;
              return (
                <button
                  key={cat.id}
                  className={`category-tile-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="category-tile-top">
                    <div className="category-tile-icon">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span className="category-count-badge">
                      {cat.problem_count} Problems
                    </span>
                  </div>
                  <h3 className="category-tile-name">{cat.name}</h3>
                  <p className="category-tile-desc">{cat.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. SEARCH & FILTER BAR */}
        <section id="problems-list-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="coding-section-header">
            <h2 className="coding-section-title">
              <Terminal size={22} color="#00a86b" />
              <span>Coding Challenges ({totalProblemsCount})</span>
            </h2>
          </div>

          <div className="coding-filter-bar">
            {/* Search */}
            <div className="search-input-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search problems by title, topic, or keyword..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Difficulty Filter */}
            <select
              className="filter-select"
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Category Filter */}
            <select
              className="filter-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              className="filter-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>

            {/* Solved Status Filter */}
            <select
              className="filter-select"
              value={solvedStatus}
              onChange={(e) => {
                setSolvedStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>

            {/* Reset */}
            {(search || difficulty !== 'all' || category !== 'all' || language !== 'all' || solvedStatus !== 'all') && (
              <button className="btn-reset-filters" onClick={handleResetFilters}>
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* 6. PROBLEMS TABLE */}
          <div className="problems-table-card">
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>
                  Loading problems from database...
                </div>
                <div>Please wait while test cases and difficulty tiers are verified.</div>
              </div>
            ) : problems.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
                <Code2 size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No Coding Challenges Found</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem' }}>
                  No challenges matched your search and filter criteria. Try clearing some filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: '#00a86b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <table className="problems-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Status</th>
                    <th>Challenge Title</th>
                    <th>Category</th>
                    <th style={{ width: '110px' }}>Difficulty</th>
                    <th>Languages</th>
                    <th style={{ width: '130px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((prob) => (
                    <tr key={prob.id}>
                      <td>
                        {prob.is_solved ? (
                          <span className="status-solved-badge" title="Solved by you">
                            <CheckCircle2 size={15} />
                            <span>Solved</span>
                          </span>
                        ) : (
                          <span className="status-unsolved-badge">Unsolved</span>
                        )}
                      </td>
                      <td>
                        <div className="problem-title-cell">
                          <Link
                            to={`/coding/problem/${prob.slug || prob.id}`}
                            className="problem-title-link"
                          >
                            {prob.title}
                          </Link>
                          <span className="problem-topic-tag">
                            Topic: {prob.topic}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          {prob.category || 'Basic Programming'}
                        </span>
                      </td>
                      <td>
                        <span className={`diff-pill ${prob.difficulty?.toLowerCase() || 'medium'}`}>
                          {prob.difficulty?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(prob.supported_languages || ['python', 'javascript', 'java', 'c', 'cpp']).map((lang) => (
                            <span
                              key={lang}
                              style={{
                                fontSize: '0.72rem',
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 600
                              }}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`btn-solve-action ${prob.is_solved ? 'solved-action' : ''}`}
                          onClick={() => navigate(`/coding/problem/${prob.slug || prob.id}`)}
                        >
                          <span>{prob.is_solved ? 'Practice Again' : 'Solve'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  Page {page} of {totalPages}
                </span>

                <button
                  className="pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
