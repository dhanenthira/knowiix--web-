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
  Sparkles,
  Shuffle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../shared/components/navbar';
import technicalApi from '../../api/technicalApi';
import {
  getStandardTechnicalProblemSet,
  generateRandomProblemSet,
  registerProblemInCache,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  LANGUAGE_ICONS
} from './technicalProblemsData';
import './TechnicalPractice.css';

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

export default function TechnicalPractice() {
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

  // Random problem mode state
  const [isRandomMode, setIsRandomMode] = useState(false);

  // Load Categories & User Progress
  useEffect(() => {
    technicalApi.getCategories()
      .then(data => setCategories(data))
      .catch(err => {
        // Fallback default categories
        setCategories([
          { id: 'cat_arrays', name: 'Arrays & Hashing', icon: 'layers', problem_count: 24, description: 'Array manipulation, hash maps, sliding window.' },
          { id: 'cat_strings', name: 'Strings', icon: 'file-code', problem_count: 18, description: 'Parsing, palindrome check, anagrams, substring.' },
          { id: 'cat_algorithms', name: 'Algorithms', icon: 'zap', problem_count: 20, description: 'Binary search, sorting, greedy algorithms.' },
          { id: 'cat_math', name: 'Math & Numbers', icon: 'cpu', problem_count: 15, description: 'Primes, Fibonacci, GCD, number theory.' },
          { id: 'cat_dp', name: 'Dynamic Programming', icon: 'terminal', problem_count: 12, description: 'Kadane, climbing stairs, memoization.' }
        ]);
      });

    technicalApi.getUserProgress()
      .then(data => setStats(data))
      .catch(() => {
        setStats({
          total_problems: 67,
          problems_solved: 12,
          attempted_problems: 18,
          current_streak: 3,
          easy_solved: 8,
          medium_solved: 4,
          hard_solved: 0,
          easy_total: 30,
          medium_total: 25,
          hard_total: 12
        });
      });
  }, []);

  // Fetch or generate problems
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

      let items = [];
      let total = 0;

      // Ensure standardized problem catalog is registered in cache so all users see identical challenges
      const standardSet = getStandardTechnicalProblemSet();
      standardSet.forEach(registerProblemInCache);

      // Try fetching from backend first if available
      try {
        const res = await technicalApi.getProblems(params);
        if (res && res.items && res.items.length > 0) {
          items = res.items;
          total = res.total || items.length;
          items.forEach(registerProblemInCache);
        }
      } catch (e) {
        // Backend offline -> fallback to standard problem catalog
      }

      // If no problems returned from backend, use standard set (same for all users)
      if (items.length === 0) {
        let filtered = [...standardSet];
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q));
        }
        if (difficulty !== 'all') {
          filtered = filtered.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase());
        }
        if (category !== 'all') {
          filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase() || p.topic?.toLowerCase().includes(category.toLowerCase()));
        }

        total = filtered.length;
        const start = (page - 1) * pageSize;
        items = filtered.slice(start, start + pageSize);
      }

      // Ensure all items have all 4 core languages explicitly supported
      const enhancedItems = items.map(p => ({
        ...p,
        supported_languages: p.supported_languages && p.supported_languages.length > 2
          ? p.supported_languages
          : ['java', 'python', 'c', 'cpp', 'javascript']
      }));

      setProblems(enhancedItems);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      setTotalProblemsCount(total);
    } catch (err) {
      console.error('Failed to fetch technical problems:', err);
      // Emergency fallback
      const fallback = generateRandomProblemSet(10);
      setProblems(fallback);
      setTotalPages(1);
      setTotalProblemsCount(fallback.length);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, difficulty, category, language, solvedStatus, sortBy, isRandomMode]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Handle Generate Random Problems
  const handleGenerateRandom = () => {
    setIsRandomMode(true);
    setPage(1);
    const newRandom = generateRandomProblemSet(20);
    newRandom.forEach(registerProblemInCache);
    setProblems(newRandom.slice(0, pageSize));
    setTotalPages(Math.max(1, Math.ceil(newRandom.length / pageSize)));
    setTotalProblemsCount(newRandom.length);
  };

  // Handle Quick Random Challenge - opens workspace directly
  const handleQuickRandomChallenge = () => {
    if (problems.length > 0) {
      const rnd = problems[Math.floor(Math.random() * problems.length)];
      navigate(`/technical/problem/${rnd.slug || rnd.id}`);
    } else {
      const generated = generateRandomProblemSet(1)[0];
      registerProblemInCache(generated);
      navigate(`/technical/problem/${generated.slug || generated.id}`);
    }
  };

  const handleCategoryClick = (catName) => {
    if (category === catName) {
      setCategory('all');
    } else {
      setCategory(catName);
    }
    setPage(1);
    document.getElementById('problems-list-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setDifficulty('all');
    setCategory('all');
    setLanguage('all');
    setSolvedStatus('all');
    setSortBy('created_at');
    setIsRandomMode(false);
    setPage(1);
  };

  return (
    <div className="coding-dashboard-container">
      {/* 1. TOP NAVBAR */}
      <Navbar />

      {/* 2. MAIN BODY */}
      <main className="coding-main-body">
        {/* Header Title Banner */}
        <section className="coding-header-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'var(--color-accent-light, #E8F0FE)', color: 'var(--color-accent, #4285F4)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '10px' }}>
                <Sparkles size={14} />
                <span>Multi-Language Technical Arena</span>
              </div>
              <h1 className="coding-header-title">
                <span>👨‍💻</span> Technical Practice Arena
              </h1>
              <p className="coding-header-subtitle">
                Solve standardized technical challenges in <strong>Java, Python, C, or C++</strong>. The problem statement is identical for all users regardless of the selected language.
              </p>

              {/* Supported Languages Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Solve any problem in:</span>
                {['Java', 'Python', 'C', 'C++', 'JavaScript'].map((lang) => (
                  <span
                    key={lang}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                    }}
                  >
                    <span>{lang === 'Java' ? '☕' : lang === 'Python' ? '🐍' : lang === 'C' ? '⚙️' : lang === 'C++' ? '⚡' : '🌐'}</span>
                    <span>{lang}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignSelf: 'center' }}>
              <button
                onClick={handleGenerateRandom}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-accent, #4285F4)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(66, 133, 244, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                title="Generate a fresh set of randomized technical challenges"
              >
                <Shuffle size={17} />
                <span>Generate Random Set</span>
              </button>

              <button
                onClick={handleQuickRandomChallenge}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-secondary, #ffffff)',
                  color: 'var(--color-text, #202124)',
                  border: '1px solid var(--color-border, #DADCE0)',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease'
                }}
                title="Directly launch a random challenge in workspace"
              >
                <Zap size={17} color="#f59e0b" />
                <span>Solve Random Problem</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. STATISTICS CARDS */}
        <section className="coding-stats-grid">
          {/* Card 1: Total Problems */}
          <div className="coding-stat-card">
            <div className="stat-card-header">
              <span>Total Technical Problems</span>
              <div className="stat-card-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <Code2 size={20} />
              </div>
            </div>
            <div className="stat-card-number">{stats.total_problems || totalProblemsCount || 67}</div>
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
                : 'Keep practicing in Java, Python, C, C++!'}
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
            <div className="stat-card-subtext">Solve 1 technical problem daily to sustain fire</div>
          </div>
        </section>


        {/* 5. SEARCH & FILTER BAR */}
        <section id="problems-list-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="coding-section-header">
            <h2 className="coding-section-title">
              <Terminal size={22} color="var(--color-accent, #4285F4)" />
              <span>Technical Challenges ({totalProblemsCount})</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleGenerateRandom}
                className="btn-reset-filters"
                style={{ borderColor: 'var(--color-accent, #4285F4)', color: 'var(--color-accent, #4285F4)' }}
              >
                <Shuffle size={14} />
                <span>Shuffle / Randomize</span>
              </button>
            </div>
          </div>

          <div className="coding-filter-bar">
            {/* Search */}
            <div className="search-input-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search technical problems by title, topic, or keyword..."
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
              <option value="java">Java (OpenJDK)</option>
              <option value="python">Python 3</option>
              <option value="c">C (GCC)</option>
              <option value="cpp">C++ (G++)</option>
              <option value="javascript">JavaScript</option>
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
            {(search || difficulty !== 'all' || category !== 'all' || language !== 'all' || solvedStatus !== 'all' || isRandomMode) && (
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
                  Loading technical challenges...
                </div>
                <div>Preparing multi-language test cases and sandbox execution tiers.</div>
              </div>
            ) : problems.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
                <Code2 size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No Technical Challenges Found</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem' }}>
                  No challenges matched your search and filter criteria. You can generate a fresh random set of problems.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={handleGenerateRandom}
                    style={{
                      background: 'var(--color-accent, #4285F4)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Generate Random Problems
                  </button>
                  <button
                    onClick={handleResetFilters}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <table className="problems-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Status</th>
                    <th>Technical Challenge</th>
                    <th>Category</th>
                    <th style={{ width: '110px' }}>Difficulty</th>
                    <th>Supported Languages</th>
                    <th style={{ width: '140px', textAlign: 'right' }}>Action</th>
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
                            to={`/technical/problem/${prob.slug || prob.id}`}
                            className="problem-title-link"
                          >
                            {prob.problem_number ? `${prob.problem_number}. ` : ''}{prob.title}
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
                          {['Java', 'Python', 'C', 'C++'].map((langName) => (
                            <span
                              key={langName}
                              style={{
                                fontSize: '0.72rem',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#334155',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}
                            >
                              {langName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`btn-solve-action ${prob.is_solved ? 'solved-action' : ''}`}
                          onClick={() => navigate(`/technical/problem/${prob.slug || prob.id}`)}
                          title="Solve in Java, Python, C, or C++"
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
