import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Brain,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Target,
  Search,
  Filter,
  Flame,
  ChevronRight,
  TrendingUp,
  FileText,
  Calculator,
  PenTool,
  Bookmark,
  Share2,
  Sparkles,
  BarChart2,
  Clock,
  Eye,
  AlertTriangle,
  Lightbulb,
  Building2,
  ChevronDown,
  Layers,
  Compass
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import KnowiixLogo from '../../../shared/components/KnowiixLogo';
import Navbar from '../../../shared/components/navbar';
import './Aptitude.css';

// Built-in comprehensive Aptitude Question Bank covering major placement topics
const INITIAL_APTITUDE_BANK = [
  {
    id: "apt_q_01",
    category: "Quantitative",
    topic: "Time & Distance",
    difficulty: "easy",
    title: "Train Speed & Distance",
    content: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
    options: ["120 metres", "150 metres", "180 metres", "324 metres"],
    correct_answer: "150 metres",
    explanation: "Speed in m/sec = 60 × (5/18) = 50/3 m/sec.\nLength of the train = Speed × Time = (50/3) × 9 = 150 metres.",
    formula_tip: "To convert km/hr to m/sec, multiply by 5/18. Distance = Speed × Time.",
    marks: 1,
    time_limit_sec: 60,
    tags: ["Trains", "Speed", "TCS NQT"]
  },
  {
    id: "apt_q_02",
    category: "Quantitative",
    topic: "Profit & Loss",
    difficulty: "easy",
    title: "Cost Price from Selling Price",
    content: "A shopkeeper sells an article for $240 and gains 20%. What was the cost price of the article?",
    options: ["$190", "$200", "$210", "$220"],
    correct_answer: "$200",
    explanation: "Gain% = 20%.\nSelling Price (SP) = CP × (100 + Gain%) / 100\n240 = CP × 120 / 100\nCP = (240 × 100) / 120 = $200.",
    formula_tip: "Cost Price = (Selling Price × 100) / (100 + Gain%).",
    marks: 1,
    time_limit_sec: 50,
    tags: ["Arithmetic", "Profit & Loss", "Infosys"]
  },
  {
    id: "apt_q_03",
    category: "Quantitative",
    topic: "Time & Work",
    difficulty: "medium",
    title: "Joint Work Fraction",
    content: "A can complete a piece of work in 12 days, and B can complete it in 15 days. If they work together for 3 days, what fraction of work is left?",
    options: ["9/20", "11/20", "7/20", "13/20"],
    correct_answer: "11/20",
    explanation: "A's 1-day work = 1/12.\nB's 1-day work = 1/15.\nTogether 1-day work = 1/12 + 1/15 = 9/60 = 3/20.\nWork done in 3 days = 3 × (3/20) = 9/20.\nWork remaining = 1 - 9/20 = 11/20.",
    formula_tip: "If X does work in 'a' days, X's 1-day rate is 1/a. Remaining work = 1 - (Total done).",
    marks: 2,
    time_limit_sec: 75,
    tags: ["Time & Work", "Accenture"]
  },
  {
    id: "apt_q_04",
    category: "Quantitative",
    topic: "Percentages",
    difficulty: "medium",
    title: "Successive Percentage Changes",
    content: "The price of petrol increased by 25%. By what percentage must a car owner reduce consumption so that expenditure remains unchanged?",
    options: ["20%", "25%", "16.66%", "30%"],
    correct_answer: "20%",
    explanation: "Let original price = 100, consumption = 100. Original Expenditure = 10,000.\nNew price = 125. To keep expenditure 10,000, new consumption = 10,000 / 125 = 80.\nReduction = 100 - 80 = 20%.",
    formula_tip: "Reduction % = [r / (100 + r)] × 100%, where r is the increase percentage.",
    marks: 1,
    time_limit_sec: 45,
    tags: ["Percentages", "Cognizant"]
  },
  {
    id: "apt_q_05",
    category: "Logical",
    topic: "Blood Relations",
    difficulty: "easy",
    title: "Pointing to a Photograph",
    content: "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is Rohit related to the girl?",
    options: ["Father", "Uncle", "Brother", "Cousin"],
    correct_answer: "Brother",
    explanation: "Grandfather's only son = Rohit's Father.\nThe daughter of Rohit's father = Rohit's sister.\nTherefore, Rohit is the brother of the girl in the photograph.",
    formula_tip: "Break down relationships step by step starting from the referenced person ('grandfather's only son').",
    marks: 1,
    time_limit_sec: 40,
    tags: ["Logical Reasoning", "Family Tree"]
  },
  {
    id: "apt_q_06",
    category: "Logical",
    topic: "Number Series",
    difficulty: "medium",
    title: "Next Term in Prime Difference Series",
    content: "Find the next number in the series: 3, 5, 9, 17, 33, ?",
    options: ["49", "65", "63", "67"],
    correct_answer: "65",
    explanation: "Difference pattern:\n5 - 3 = 2 (2¹)\n9 - 5 = 4 (2²)\n17 - 9 = 8 (2³)\n33 - 17 = 16 (2⁴)\nNext difference = 32 (2⁵).\nNext term = 33 + 32 = 65.",
    formula_tip: "Look for powers of 2, squares, cubes, or alternating differences.",
    marks: 1,
    time_limit_sec: 50,
    tags: ["Number Series", "Wipro"]
  },
  {
    id: "apt_q_07",
    category: "Logical",
    topic: "Syllogisms",
    difficulty: "medium",
    title: "Categorical Deduction",
    content: "Statements:\n1. All cats are animals.\n2. Some animals are wild.\nConclusions:\nI. Some cats are wild.\nII. Some animals are cats.",
    options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
    correct_answer: "Only II follows",
    explanation: "Since 'All cats are animals', the subset of cats is inside animals. Therefore, some animals must be cats (Conclusion II holds).\nWe cannot conclude that any cat is wild without a direct link between cats and wild animals (Conclusion I does not necessarily follow).",
    formula_tip: "Use Venn diagrams to test if a conclusion MUST follow in all scenarios.",
    marks: 2,
    time_limit_sec: 60,
    tags: ["Syllogisms", "TCS NQT"]
  },
  {
    id: "apt_q_08",
    category: "Verbal",
    topic: "Sentence Correction",
    difficulty: "easy",
    title: "Subject-Verb Agreement",
    content: "Select the grammatically correct sentence:",
    options: [
      "Neither the teacher nor the students was present in the auditorium.",
      "Neither the teacher nor the students were present in the auditorium.",
      "Neither the teacher or the students was present in the auditorium.",
      "Neither the teacher nor the students is present in the auditorium."
    ],
    correct_answer: "Neither the teacher nor the students were present in the auditorium.",
    explanation: "When subjects are joined by 'neither... nor', the verb agrees with the closer subject. 'Students' is plural, so the plural verb 'were' is correct.",
    formula_tip: "Proximity Rule: With 'either...or' / 'neither...nor', verb matches the closest subject.",
    marks: 1,
    time_limit_sec: 45,
    tags: ["Grammar", "Verbal"]
  },
  {
    id: "apt_q_09",
    category: "Verbal",
    topic: "Synonyms & Antonyms",
    difficulty: "medium",
    title: "Antonym Identification",
    content: "Choose the word most nearly OPPOSITE in meaning to 'METICULOUS':",
    options: ["Painstaking", "Careless", "Thorough", "Precise"],
    correct_answer: "Careless",
    explanation: "'Meticulous' means showing great attention to detail; very careful and precise. The opposite is 'Careless'.",
    formula_tip: "Eliminate synonyms first: Painstaking, Thorough, and Precise all mean meticulous.",
    marks: 1,
    time_limit_sec: 30,
    tags: ["Vocabulary", "Accenture"]
  },
  {
    id: "apt_q_10",
    category: "Data Interpretation",
    topic: "Pie Charts & Tables",
    difficulty: "hard",
    title: "Sector Angle Allocation",
    content: "In a company budget pie chart, 30% of funds are allocated to R&D, 25% to Marketing, 20% to Operations, and the rest to HR. What central angle represents the HR allocation?",
    options: ["72°", "90°", "80°", "108°"],
    correct_answer: "90°",
    explanation: "Total percentage = 100%.\nHR percentage = 100% - (30 + 25 + 20)% = 25%.\nCentral angle = 25% of 360° = (25 / 100) × 360° = 90°.",
    formula_tip: "Central Angle = (Percentage / 100) × 360°.",
    marks: 2,
    time_limit_sec: 60,
    tags: ["Data Interpretation", "Charts"]
  }
];

// Topic Quick Cards
const TOPIC_CARDS = [
  { id: 'all', name: 'All Aptitude', icon: '🧠', count: 45, level: 'Placement Ready' },
  { id: 'quant', name: 'Quantitative', icon: '📐', count: 20, level: 'High Weightage' },
  { id: 'logical', name: 'Logical Reasoning', icon: '🧩', count: 14, level: 'Critical' },
  { id: 'verbal', name: 'Verbal Ability', icon: '📖', count: 12, level: 'Speed Focus' },
  { id: 'di', name: 'Data Interpretation', icon: '📊', count: 8, level: 'Analytical' },
  { id: 'company', name: 'Company Drives', icon: '🏢', count: 15, level: 'TCS / Infy / Acc' }
];

// Placement Company Packs
const COMPANY_PACKS = [
  { name: 'TCS NQT Grand Sprint', company: 'TCS', questions: 20, duration: '25 mins', badge: 'High Priority', color: '#3B82F6' },
  { name: 'Infosys Pseudo & Logic', company: 'Infosys', questions: 15, duration: '20 mins', badge: 'Popular', color: '#8B5CF6' },
  { name: 'Accenture Critical Reasoning', company: 'Accenture', questions: 15, duration: '18 mins', badge: 'Fast Track', color: '#06B6D4' },
  { name: 'Cognizant GenC Quantitative', company: 'Cognizant', questions: 20, duration: '22 mins', badge: 'Verified', color: '#10B981' }
];

export default function Aptitude() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // App View Modes: 'hub' (topic listing), 'quiz' (active test), 'result' (scorecard)
  const [viewMode, setViewMode] = useState('hub');
  const [quizMode, setQuizMode] = useState('practice'); // 'practice' (instant feedback) or 'mock' (timed exam)

  // Question Repository State
  const [questions, setQuestions] = useState(INITIAL_APTITUDE_BANK);
  const [activeTopic, setActiveTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Test State
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionText }
  const [flaggedForReview, setFlaggedForReview] = useState({}); // { [qId]: boolean }
  const [instantChecked, setInstantChecked] = useState({}); // { [qId]: boolean } (practice mode)
  const [testTitle, setTestTitle] = useState('Aptitude Practice Drill');

  // Exam Timer
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 mins default
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Tools in Quiz
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [scratchNotes, setScratchNotes] = useState('');
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Results State
  const [quizResult, setQuizResult] = useState(null);

  // Live Aptitude Progress Tracking State (Persisted in DB per user)
  const [aptitudeProgress, setAptitudeProgress] = useState({
    total_problems: 100,
    problems_solved: 35,
    problems_remaining: 65,
    progress_percentage: 35.0,
    solved_question_ids: []
  });

  const fetchAptitudeProgress = async () => {
    try {
      const res = await axios.get('/api/v1/questions/aptitude/progress');
      if (res.data) {
        setAptitudeProgress(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch aptitude progress:', err);
    }
  };

  const recordProblemSolved = async (qId) => {
    try {
      const res = await axios.post('/api/v1/questions/aptitude/solve', { question_id: qId });
      if (res.data && res.data.success) {
        setAptitudeProgress(prev => ({
          ...prev,
          total_problems: res.data.total_problems || prev.total_problems,
          problems_solved: res.data.problems_solved,
          problems_remaining: res.data.problems_remaining,
          progress_percentage: res.data.progress_percentage,
          solved_question_ids: Array.from(new Set([...(prev.solved_question_ids || []), qId]))
        }));
      }
    } catch (err) {
      console.warn('Error saving question solve:', err);
    }
  };

  const recordBatchSolved = async (qIds) => {
    try {
      const res = await axios.post('/api/v1/questions/aptitude/batch-solve', { question_ids: qIds });
      if (res.data && res.data.success) {
        setAptitudeProgress(prev => ({
          ...prev,
          total_problems: res.data.total_problems || prev.total_problems,
          problems_solved: res.data.problems_solved,
          problems_remaining: res.data.problems_remaining,
          progress_percentage: res.data.progress_percentage,
          solved_question_ids: Array.from(new Set([...(prev.solved_question_ids || []), ...qIds]))
        }));
      }
    } catch (err) {
      console.warn('Error saving batch solve:', err);
    }
  };

  // Load questions and user progress from backend on mount
  useEffect(() => {
    fetchAptitudeProgress();

    const fetchBackendQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/questions?category=aptitude');
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Merge backend questions with initial bank, avoiding duplicates by id or title
          const existingTitles = new Set(INITIAL_APTITUDE_BANK.map(q => q.title.toLowerCase()));
          const formattedBackend = res.data
            .filter(bq => !existingTitles.has(bq.title.toLowerCase()))
            .map(bq => ({
              id: bq.id || `bq_${Math.random()}`,
              category: "Quantitative",
              topic: bq.topic || "Aptitude General",
              difficulty: bq.difficulty || "medium",
              title: bq.title,
              content: bq.content || bq.title,
              options: Array.isArray(bq.options) && bq.options.length ? bq.options : ["Option A", "Option B", "Option C", "Option D"],
              correct_answer: bq.correct_answer || (bq.options ? bq.options[0] : "Option A"),
              explanation: bq.explanation || "No explanation provided for this question.",
              formula_tip: "Focus on standard arithmetic and logical rules.",
              marks: bq.marks || 1,
              time_limit_sec: 60,
              tags: bq.tags || ["Aptitude"]
            }));
          setQuestions([...INITIAL_APTITUDE_BANK, ...formattedBackend]);
        }
      } catch (err) {
        console.warn('Backend questions request error, using preloaded bank:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendQuestions();

    // Auto-launch if routed with specific query param
    const categoryParam = searchParams.get('category');
    const modeParam = searchParams.get('mode');
    if (categoryParam) {
      const match = TOPIC_CARDS.find(t => t.name.toLowerCase().includes(categoryParam.toLowerCase()));
      if (match) setActiveTopic(match.id);
    }
    if (modeParam === 'mock') {
      startQuiz('mock', 'Aptitude Timed Mock Examination', INITIAL_APTITUDE_BANK);
    }
  }, [searchParams]);

  // Timer Countdown Effect
  useEffect(() => {
    if (timerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeRemaining]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtered Questions on Hub
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTopic === 'all') return true;
      if (activeTopic === 'quant') return q.category.toLowerCase().includes('quant') || q.category.toLowerCase().includes('aptitude');
      if (activeTopic === 'logical') return q.category.toLowerCase().includes('logic');
      if (activeTopic === 'verbal') return q.category.toLowerCase().includes('verbal');
      if (activeTopic === 'di') return q.category.toLowerCase().includes('data') || q.topic.toLowerCase().includes('chart');
      if (activeTopic === 'company') return q.tags.some(t => ['TCS NQT', 'Infosys', 'Accenture', 'Cognizant', 'Wipro'].includes(t));
      return true;
    });
  }, [questions, activeTopic, searchQuery]);

  // Start a Quiz
  const startQuiz = (mode, title, pool = null) => {
    const list = pool && pool.length > 0 ? pool : (filteredQuestions.length > 0 ? filteredQuestions : questions);
    // Shuffle or pick questions
    const selected = [...list].slice(0, 10);
    setActiveQuestions(selected);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setFlaggedForReview({});
    setInstantChecked({});
    setTestTitle(title);
    setQuizMode(mode);
    setViewMode('quiz');
    setScratchNotes('');
    setScratchpadOpen(false);

    if (mode === 'mock') {
      const totalSeconds = selected.length * 60; // 1 min per question
      setTimeRemaining(totalSeconds);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Option Select
  const handleSelectOption = (qId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  // Toggle Mark For Review
  const toggleReviewFlag = (qId) => {
    setFlaggedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Calculate & Finish Quiz
  const finishQuiz = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let score = 0;

    activeQuestions.forEach(q => {
      const studentAns = selectedAnswers[q.id];
      if (!studentAns) {
        skippedCount++;
      } else if (studentAns === q.correct_answer) {
        correctCount++;
        score += q.marks || 1;
      } else {
        wrongCount++;
      }
    });

    const totalQuestions = activeQuestions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const timeSpent = quizMode === 'mock' ? (activeQuestions.length * 60 - timeRemaining) : 180;

    setQuizResult({
      title: testTitle,
      mode: quizMode,
      totalQuestions,
      correctCount,
      wrongCount,
      skippedCount,
      score,
      accuracy,
      timeSpentSec: Math.max(timeSpent, 10),
      questions: activeQuestions,
      answers: selectedAnswers
    });

    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track newly solved questions in database
    const correctQuestionIds = activeQuestions
      .filter(q => selectedAnswers[q.id] === q.correct_answer)
      .map(q => q.id);
    if (correctQuestionIds.length > 0) {
      recordBatchSolved(correctQuestionIds);
    }
  };

  const currentQ = activeQuestions[currentIdx];

  return (
    <div className="aptitude-page-container">
      {/* 1. BOLTSHIFT UNIFIED NAVBAR */}
      {viewMode === 'hub' ? (
        <Navbar variant="user" />
      ) : (
        <header className="aptitude-navbar">
          <div className="aptitude-nav-left">
            <button
              className="btn-back-nav"
              onClick={() => {
                if (window.confirm('Do you want to leave the active screen and return to the Aptitude Hub?')) {
                  clearInterval(timerRef.current);
                  setViewMode('hub');
                }
              }}
            >
              <ArrowLeft size={18} />
              <span>Aptitude Hub</span>
            </button>
            <div className="aptitude-brand-pill" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KnowiixLogo size="sm" />
              <span className="brand-title" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '8px' }}>Aptitude Arena</span>
            </div>
          </div>

          <div className="aptitude-nav-right">
            {viewMode === 'quiz' && (
              <div className="quiz-status-pill">
                <span className={`quiz-mode-tag ${quizMode}`}>
                  {quizMode === 'mock' ? 'Timed Exam Mode' : 'Practice & Solutions'}
                </span>
                {quizMode === 'mock' && (
                  <div className={`timer-display ${timeRemaining < 120 ? 'timer-danger' : ''}`}>
                    <Timer size={16} />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="student-profile-chip" onClick={() => navigate('/profile')}>
              <span className="streak-badge">
                <Flame size={14} className="streak-icon" /> 12 Days
              </span>
              <span className="user-initials">
                {admin?.name?.substring(0, 2).toUpperCase() || 'AK'}
              </span>
            </div>
          </div>
        </header>
      )}

      {/* =========================================================
          VIEW 1: APTITUDE HUB & TOPIC CATALOG
          ========================================================= */}
      {viewMode === 'hub' && (
        <main className="aptitude-hub-content">
          {/* Hero Banner */}
          <section className="aptitude-hero-card">
            <div className="hero-decor-orb orb-1"></div>
            <div className="hero-decor-orb orb-2"></div>
            <div className="hero-text-side">
              <div className="hero-badge">
                <Sparkles size={14} /> Comprehensive Placement Prep
              </div>
              <h1 className="hero-title">
                Master Quantitative, Logical & Verbal Aptitude
              </h1>
              <p className="hero-subtitle">
                Target high-impact placement patterns for TCS, Infosys, Accenture, Wipro, and Cognizant with timed mocks and instant step-by-step shortcuts.
              </p>
              <div className="hero-action-row">
                <button
                  className="btn-hero-primary"
                  onClick={() => startQuiz('mock', 'Placement Readiness Mock 01', questions)}
                >
                  <Timer size={18} />
                  <span>Launch 15-Min Mock Exam</span>
                </button>
                <button
                  className="btn-hero-secondary"
                  onClick={() => startQuiz('practice', 'Daily Speed Drill', questions)}
                >
                  <Zap size={18} />
                  <span>Quick 10-Q Practice Drill</span>
                </button>
              </div>
            </div>

            <div className="hero-stats-panel">
              <div className="hero-stat-box">
                <div className="stat-icon-wrapper quant">
                  <Target size={20} />
                </div>
                <div className="stat-meta">
                  <span className="stat-val">84.2%</span>
                  <span className="stat-lbl">Average Accuracy</span>
                </div>
              </div>
              <div className="hero-stat-box">
                <div className="stat-icon-wrapper speed">
                  <Clock size={20} />
                </div>
                <div className="stat-meta">
                  <span className="stat-val">42s</span>
                  <span className="stat-lbl">Avg Solving Speed</span>
                </div>
              </div>
              <div className="hero-stat-box">
                <div className="stat-icon-wrapper streak">
                  <Award size={20} />
                </div>
                <div className="stat-meta">
                  <span className="stat-val">120+</span>
                  <span className="stat-lbl">Solved Questions</span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              APTITUDE PROGRESS TRACKING SYSTEM (DATABASE PERSISTED)
              ========================================================= */}
          <section className="aptitude-progress-tracking-banner">
            <div className="progress-banner-inner">
              <div className="progress-banner-top">
                <div className="progress-banner-heading-group">
                  <span className="progress-live-pill">
                    <span className="live-dot" /> Database Synchronized
                  </span>
                  <h2 className="progress-banner-title">Aptitude &amp; Problem Solving Progress</h2>
                  <p className="progress-banner-sub">
                    Track your total problems, completed solutions, and placement readiness automatically saved per user.
                  </p>
                </div>

                <div className="progress-banner-pct-box">
                  <span className="banner-pct-num">{aptitudeProgress.progress_percentage}%</span>
                  <span className="banner-pct-sub">Completed</span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="progress-banner-track">
                <div
                  className="progress-banner-fill"
                  style={{ width: `${Math.min(100, Math.max(0, aptitudeProgress.progress_percentage))}%` }}
                />
              </div>

              {/* 4 Core Statistics matching requirements */}
              <div className="progress-banner-stats-grid">
                <div className="progress-banner-stat-card">
                  <span className="stat-card-title">Total Problems</span>
                  <span className="stat-card-number">{aptitudeProgress.total_problems}</span>
                  <span className="stat-card-sub">Available in Question Bank</span>
                </div>

                <div className="progress-banner-stat-card highlight-solved">
                  <span className="stat-card-title">Problems Solved</span>
                  <span className="stat-card-number">{aptitudeProgress.problems_solved}</span>
                  <span className="stat-card-sub">Completed by You</span>
                </div>

                <div className="progress-banner-stat-card highlight-remaining">
                  <span className="stat-card-title">Problems Remaining</span>
                  <span className="stat-card-number">{aptitudeProgress.problems_remaining}</span>
                  <span className="stat-card-sub">To Reach 100% Mastery</span>
                </div>

                <div className="progress-banner-stat-card highlight-progress">
                  <span className="stat-card-title">Overall Progress</span>
                  <span className="stat-card-number">{aptitudeProgress.progress_percentage}%</span>
                  <span className="stat-card-sub">Calculated for Your Account</span>
                </div>
              </div>
            </div>
          </section>

          {/* Placement Company Sprint Tracks */}
          <section className="company-packs-section">
            <div className="section-head-row">
              <div>
                <h2 className="section-heading">Company Placement Drives</h2>
                <p className="section-subtext">Curated problem sets matching latest recruit test patterns</p>
              </div>
              <span className="section-badge-chip">Updated for 2026 Season</span>
            </div>

            <div className="company-cards-grid">
              {COMPANY_PACKS.map((pack, idx) => (
                <div key={idx} className="company-pack-card">
                  <div className="pack-top-row">
                    <span className="pack-company-tag" style={{ borderColor: pack.color, color: pack.color }}>
                      <Building2 size={13} /> {pack.company}
                    </span>
                    <span className="pack-badge-pill">{pack.badge}</span>
                  </div>
                  <h3 className="pack-name">{pack.name}</h3>
                  <div className="pack-meta-row">
                    <span><FileText size={14} /> {pack.questions} Questions</span>
                    <span><Clock size={14} /> {pack.duration}</span>
                  </div>
                  <button
                    className="btn-start-pack"
                    onClick={() => startQuiz('mock', `${pack.company} Special Sprint`, questions.filter(q => q.tags.some(t => t.includes(pack.company))))}
                  >
                    <span>Start Test</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Topic Categories Navigation Tabs */}
          <section className="catalog-section">
            <div className="catalog-toolbar">
              <div className="topic-tabs-scroll">
                {TOPIC_CARDS.map(t => (
                  <button
                    key={t.id}
                    className={`topic-tab-btn ${activeTopic === t.id ? 'active' : ''}`}
                    onClick={() => setActiveTopic(t.id)}
                  >
                    <span className="tab-icon">{t.icon}</span>
                    <span className="tab-name">{t.name}</span>
                    <span className="tab-count">{t.count}</span>
                  </button>
                ))}
              </div>

              <div className="search-input-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search topic (e.g. Time & Work, Profit, Syllogisms)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Questions Bank Grid */}
            <div className="questions-catalog-grid">
              {filteredQuestions.map((q, idx) => (
                <div key={q.id || idx} className="question-preview-card">
                  <div className="q-card-header">
                    <div className="q-tags-group">
                      <span className={`difficulty-pill ${q.difficulty}`}>
                        {q.difficulty?.toUpperCase()}
                      </span>
                      <span className="topic-pill">{q.topic}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {aptitudeProgress.solved_question_ids?.includes(q.id) && (
                        <span className="q-solved-badge">✓ Solved</span>
                      )}
                      <span className="marks-badge">+{q.marks || 1} Mark</span>
                    </div>
                  </div>

                  <h3 className="q-card-title">{q.title}</h3>
                  <p className="q-card-snippet">{q.content}</p>

                  <div className="q-card-footer">
                    <div className="q-tags-mini">
                      {q.tags?.slice(0, 2).map((tag, tIdx) => (
                        <span key={tIdx} className="mini-tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="q-actions-mini">
                      <button
                        className="btn-mini-practice"
                        onClick={() => startQuiz('practice', `${q.topic} Practice`, [q])}
                      >
                        <Zap size={14} /> Practice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* =========================================================
          VIEW 2: ACTIVE QUIZ / EXAM SCREEN
          ========================================================= */}
      {viewMode === 'quiz' && currentQ && (
        <main className="aptitude-quiz-layout">
          {/* Main Question Arena */}
          <div className="quiz-center-arena">
            {/* Question Header & Meta */}
            <div className="quiz-q-header-card">
              <div className="q-nav-tracker">
                <span className="q-tracker-badge">
                  Question {currentIdx + 1} of {activeQuestions.length}
                </span>
                <span className="q-topic-badge">
                  <Layers size={14} /> {currentQ.topic}
                </span>
                <span className={`q-diff-badge ${currentQ.difficulty}`}>
                  {currentQ.difficulty?.toUpperCase()}
                </span>
              </div>

              {/* Utility Tools */}
              <div className="quiz-tools-row">
                <button
                  className={`btn-tool-pill ${flaggedForReview[currentQ.id] ? 'flagged' : ''}`}
                  onClick={() => toggleReviewFlag(currentQ.id)}
                  title="Mark this question to review later"
                >
                  <Bookmark size={15} />
                  <span>{flaggedForReview[currentQ.id] ? 'Flagged' : 'Mark Review'}</span>
                </button>

                <button
                  className={`btn-tool-pill ${scratchpadOpen ? 'active' : ''}`}
                  onClick={() => setScratchpadOpen(!scratchpadOpen)}
                  title="Open digital scratchpad for calculation notes"
                >
                  <PenTool size={15} />
                  <span>Scratchpad</span>
                </button>

                {currentQ.formula_tip && (
                  <button
                    className="btn-tool-pill formula"
                    onClick={() => setFormulaModalOpen(true)}
                    title="View formula reference"
                  >
                    <Lightbulb size={15} />
                    <span>Formula Tip</span>
                  </button>
                )}

                <button
                  className="btn-tool-pill mobile-palette-toggle"
                  onClick={() => setPaletteOpen(!paletteOpen)}
                >
                  <Compass size={15} />
                  <span>Palette</span>
                </button>
              </div>
            </div>

            {/* Question Statement */}
            <div className="quiz-question-box">
              <h2 className="quiz-question-title">{currentQ.title}</h2>
              <div className="quiz-question-content">{currentQ.content}</div>
            </div>

            {/* Options List */}
            <div className="quiz-options-grid">
              {currentQ.options?.map((opt, optIdx) => {
                const optLetter = String.fromCharCode(65 + optIdx);
                const isSelected = selectedAnswers[currentQ.id] === opt;
                const isPracticeChecked = quizMode === 'practice' && instantChecked[currentQ.id];
                const isCorrect = opt === currentQ.correct_answer;

                let optionStateClass = '';
                if (isSelected) optionStateClass = 'selected';
                if (isPracticeChecked) {
                  if (isCorrect) optionStateClass = 'correct-opt';
                  else if (isSelected && !isCorrect) optionStateClass = 'wrong-opt';
                }

                return (
                  <button
                    key={optIdx}
                    className={`option-choice-card ${optionStateClass}`}
                    onClick={() => {
                      handleSelectOption(currentQ.id, opt);
                      if (quizMode === 'practice') {
                        setInstantChecked(prev => ({ ...prev, [currentQ.id]: true }));
                        if (opt === currentQ.correct_answer) {
                          recordProblemSolved(currentQ.id);
                        }
                      }
                    }}
                  >
                    <div className="option-letter-badge">{optLetter}</div>
                    <div className="option-text-body">{opt}</div>
                    {isPracticeChecked && isCorrect && (
                      <CheckCircle2 size={18} className="option-check-icon success" />
                    )}
                    {isPracticeChecked && isSelected && !isCorrect && (
                      <XCircle size={18} className="option-check-icon danger" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Solution Explainer in Practice Mode */}
            {quizMode === 'practice' && instantChecked[currentQ.id] && (
              <div className="practice-explanation-card">
                <div className="explanation-head">
                  <div className="head-left">
                    {selectedAnswers[currentQ.id] === currentQ.correct_answer ? (
                      <span className="ans-status correct"><CheckCircle2 size={16} /> Correct Answer!</span>
                    ) : (
                      <span className="ans-status wrong"><XCircle size={16} /> Incorrect Answer</span>
                    )}
                  </div>
                  <span className="correct-ans-label">
                    Correct: <strong>{currentQ.correct_answer}</strong>
                  </span>
                </div>
                <div className="explanation-body">
                  <p>{currentQ.explanation}</p>
                  {currentQ.formula_tip && (
                    <div className="shortcut-tip-box">
                      <strong>💡 Quick Trick / Formula:</strong> {currentQ.formula_tip}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Embedded Scratchpad Drawer */}
            {scratchpadOpen && (
              <div className="digital-scratchpad-card">
                <div className="scratchpad-header">
                  <div className="sp-title">
                    <PenTool size={15} />
                    <span>Rough Work & Calculation Scratchpad</span>
                  </div>
                  <button
                    className="btn-clear-scratch"
                    onClick={() => setScratchNotes('')}
                  >
                    Clear Notes
                  </button>
                </div>
                <textarea
                  className="scratchpad-textarea"
                  placeholder="Type rough equations, ratios, formulas, or calculations here..."
                  value={scratchNotes}
                  onChange={(e) => setScratchNotes(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {/* Bottom Quiz Navigation Bar */}
            <div className="quiz-bottom-nav">
              <button
                className="btn-quiz-nav btn-prev"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="nav-center-status">
                <span>{Object.keys(selectedAnswers).length} of {activeQuestions.length} Answered</span>
              </div>

              {currentIdx < activeQuestions.length - 1 ? (
                <button
                  className="btn-quiz-nav btn-next"
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="btn-quiz-nav btn-submit-test"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to submit your aptitude assessment?')) {
                      finishQuiz();
                    }
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Question Palette Sidebar */}
          <aside className={`quiz-palette-sidebar ${paletteOpen ? 'open' : ''}`}>
            <div className="palette-header">
              <h3>Question Palette</h3>
              <span className="total-q-pill">{activeQuestions.length} Items</span>
            </div>

            <div className="palette-legend">
              <div className="legend-item"><span className="legend-dot answered"></span> Answered</div>
              <div className="legend-item"><span className="legend-dot unvisited"></span> Unanswered</div>
              <div className="legend-item"><span className="legend-dot review"></span> Marked Review</div>
            </div>

            <div className="palette-grid">
              {activeQuestions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isFlagged = flaggedForReview[q.id];

                let stateClass = 'unvisited';
                if (isFlagged) stateClass = 'flagged';
                else if (isAnswered) stateClass = 'answered';

                return (
                  <button
                    key={q.id || idx}
                    className={`palette-num-btn ${stateClass} ${isCurrent ? 'current' : ''}`}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setPaletteOpen(false);
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="palette-footer-actions">
              <button
                className="btn-finish-sidebar"
                onClick={() => {
                  if (window.confirm('Ready to submit your aptitude test?')) {
                    finishQuiz();
                  }
                }}
              >
                Submit Test
              </button>
            </div>
          </aside>

          {/* Formula Reference Modal */}
          {formulaModalOpen && (
            <div className="aptitude-modal-backdrop" onClick={() => setFormulaModalOpen(false)}>
              <div className="aptitude-modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                  <div className="modal-title">
                    <Lightbulb size={18} className="modal-icon" />
                    <h3>{currentQ.topic} Formula Cheat Sheet</h3>
                  </div>
                  <button className="btn-close-modal" onClick={() => setFormulaModalOpen(false)}>✕</button>
                </div>
                <div className="modal-content-body">
                  <div className="formula-highlight-card">
                    <h4>Key Working Formula</h4>
                    <p className="formula-equation">{currentQ.formula_tip}</p>
                  </div>
                  <div className="explanation-preview">
                    <h4>Methodology</h4>
                    <p>{currentQ.explanation}</p>
                  </div>
                </div>
                <div className="modal-foot">
                  <button className="btn-modal-done" onClick={() => setFormulaModalOpen(false)}>
                    Got it, back to quiz
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* =========================================================
          VIEW 3: SCORECARD & PERFORMANCE ANALYTICS
          ========================================================= */}
      {viewMode === 'result' && quizResult && (
        <main className="aptitude-result-layout">
          {/* Result Hero Header */}
          <section className="result-hero-card">
            <div className="result-badge-row">
              <span className="result-mode-tag">
                <Award size={14} /> Completed Assessment
              </span>
              <span className="result-date-tag">Today</span>
            </div>

            <div className="result-main-grid">
              <div className="score-dial-box">
                <div className="score-percentage-circle">
                  <span className="percentage-number">{quizResult.accuracy}%</span>
                  <span className="percentage-caption">Accuracy Rate</span>
                </div>
                <div className="score-subtext">
                  Score: <strong>{quizResult.score}</strong> / {quizResult.totalQuestions} Marks
                </div>
              </div>

              <div className="result-metrics-grid">
                <div className="metric-cell correct">
                  <div className="metric-val">{quizResult.correctCount}</div>
                  <div className="metric-lbl">Correct Answers</div>
                </div>
                <div className="metric-cell wrong">
                  <div className="metric-val">{quizResult.wrongCount}</div>
                  <div className="metric-lbl">Incorrect Answers</div>
                </div>
                <div className="metric-cell skipped">
                  <div className="metric-val">{quizResult.skippedCount}</div>
                  <div className="metric-lbl">Skipped Questions</div>
                </div>
                <div className="metric-cell speed">
                  <div className="metric-val">{Math.round(quizResult.timeSpentSec / quizResult.totalQuestions)}s</div>
                  <div className="metric-lbl">Avg Time / Q</div>
                </div>
              </div>
            </div>

            <div className="result-action-bar">
              <button
                className="btn-result-action primary"
                onClick={() => startQuiz('mock', 'Retake Aptitude Assessment', quizResult.questions)}
              >
                <RotateCcw size={16} /> Retake Test
              </button>
              <button
                className="btn-result-action secondary"
                onClick={() => setViewMode('hub')}
              >
                <Compass size={16} /> Return to Aptitude Hub
              </button>
            </div>
          </section>

          {/* Question-by-Question Solution Breakdown */}
          <section className="solutions-review-section">
            <h2 className="solutions-heading">Detailed Solutions & Step-by-Step Explanations</h2>
            <div className="solutions-list">
              {quizResult.questions.map((q, idx) => {
                const userChoice = quizResult.answers[q.id];
                const isCorrect = userChoice === q.correct_answer;
                const isSkipped = !userChoice;

                return (
                  <div key={q.id || idx} className={`solution-item-card ${isCorrect ? 'pass' : isSkipped ? 'skip' : 'fail'}`}>
                    <div className="solution-head">
                      <div className="q-index-tag">
                        <span>Q{idx + 1}.</span> {q.title}
                      </div>
                      <div className="verdict-tag">
                        {isCorrect && <span className="verdict-pill pass"><CheckCircle2 size={14} /> Correct</span>}
                        {!isCorrect && !isSkipped && <span className="verdict-pill fail"><XCircle size={14} /> Incorrect</span>}
                        {isSkipped && <span className="verdict-pill skip"><AlertTriangle size={14} /> Skipped</span>}
                      </div>
                    </div>

                    <div className="solution-question-text">{q.content}</div>

                    <div className="solution-choices-row">
                      <div className="choice-chip user">
                        <span className="lbl">Your Answer:</span>
                        <span className="val">{userChoice || 'None (Skipped)'}</span>
                      </div>
                      <div className="choice-chip correct">
                        <span className="lbl">Correct Answer:</span>
                        <span className="val">{q.correct_answer}</span>
                      </div>
                    </div>

                    <div className="solution-explanation-box">
                      <div className="explanation-title">
                        <Lightbulb size={14} /> Detailed Calculation & Logic
                      </div>
                      <p>{q.explanation}</p>
                      {q.formula_tip && (
                        <div className="formula-tip-footer">
                          <strong>Formula / Trick:</strong> {q.formula_tip}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
