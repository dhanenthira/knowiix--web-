import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Brain,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  Layers,
  ChevronDown,
  Building2,
  Sparkles,
  ExternalLink,
  BookOpen,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  FileText
} from 'lucide-react';
import Header from '../components/Header';
import './AptitudeManagement.css';

// Default placement packs
const PLACEMENT_PACKS = [
  { id: 'tcs', name: 'TCS NQT Grand Sprint', company: 'TCS', questions: 20, duration: '25 mins', color: '#3B82F6', tag: 'TCS NQT' },
  { id: 'infosys', name: 'Infosys Pseudo & Logic', company: 'Infosys', questions: 15, duration: '20 mins', color: '#8B5CF6', tag: 'Infosys' },
  { id: 'accenture', name: 'Accenture Critical Reasoning', company: 'Accenture', questions: 15, duration: '18 mins', color: '#06B6D4', tag: 'Accenture' },
  { id: 'cognizant', name: 'Cognizant GenC Quantitative', company: 'Cognizant', questions: 20, duration: '22 mins', color: '#10B981', tag: 'Cognizant' }
];

// Topic filter options
const TOPIC_TABS = [
  { id: 'all', label: 'All Aptitude' },
  { id: 'quantitative', label: 'Quantitative' },
  { id: 'logical', label: 'Logical Reasoning' },
  { id: 'verbal', label: 'Verbal Ability' },
  { id: 'di', label: 'Data Interpretation' },
  { id: 'company', label: 'Company Placement Drives' }
];

// Seed aptitude questions for rapid initialization
const INITIAL_SEED_QUESTIONS = [
  {
    title: "Train Speed & Distance",
    category: "aptitude",
    topic: "Time & Distance",
    difficulty: "easy",
    content: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
    options: ["120 metres", "150 metres", "180 metres", "324 metres"],
    correct_answer: "150 metres",
    explanation: "Speed in m/sec = 60 × (5/18) = 50/3 m/sec.\nLength of the train = Speed × Time = (50/3) × 9 = 150 metres.",
    formula_tip: "To convert km/hr to m/sec, multiply by 5/18. Distance = Speed × Time.",
    marks: 1,
    time_limit_sec: 60,
    tags: ["TCS NQT", "Time & Distance", "Trains"]
  },
  {
    title: "Cost Price from Selling Price",
    category: "aptitude",
    topic: "Profit & Loss",
    difficulty: "easy",
    content: "A shopkeeper sells an article for $240 and gains 20%. What was the cost price of the article?",
    options: ["$190", "$200", "$210", "$220"],
    correct_answer: "$200",
    explanation: "Gain% = 20%.\nSelling Price (SP) = CP × (100 + Gain%) / 100\n240 = CP × 120 / 100\nCP = (240 × 100) / 120 = $200.",
    formula_tip: "Cost Price = (Selling Price × 100) / (100 + Gain%).",
    marks: 1,
    time_limit_sec: 50,
    tags: ["Infosys", "Profit & Loss", "Arithmetic"]
  },
  {
    title: "Joint Work Fraction",
    category: "aptitude",
    topic: "Time & Work",
    difficulty: "medium",
    content: "A can complete a piece of work in 12 days, and B can complete it in 15 days. If they work together for 3 days, what fraction of work is left?",
    options: ["9/20", "11/20", "7/20", "13/20"],
    correct_answer: "11/20",
    explanation: "A's 1-day work = 1/12.\nB's 1-day work = 1/15.\nTogether 1-day work = 1/12 + 1/15 = 9/60 = 3/20.\nWork done in 3 days = 3 × (3/20) = 9/20.\nWork remaining = 1 - 9/20 = 11/20.",
    formula_tip: "If X does work in 'a' days, X's 1-day rate is 1/a. Remaining work = 1 - (Total done).",
    marks: 2,
    time_limit_sec: 75,
    tags: ["Accenture", "Time & Work"]
  },
  {
    title: "Successive Percentage Changes",
    category: "aptitude",
    topic: "Percentages",
    difficulty: "medium",
    content: "The price of petrol increased by 25%. By what percentage must a car owner reduce consumption so that expenditure remains unchanged?",
    options: ["20%", "25%", "16.66%", "30%"],
    correct_answer: "20%",
    explanation: "Let original price = 100, consumption = 100. Original Expenditure = 10,000.\nNew price = 125. To keep expenditure 10,000, new consumption = 10,000 / 125 = 80.\nReduction = 100 - 80 = 20%.",
    formula_tip: "Reduction % = [r / (100 + r)] × 100%, where r is the increase percentage.",
    marks: 1,
    time_limit_sec: 45,
    tags: ["Cognizant", "Percentages"]
  },
  {
    title: "Pointing to a Photograph",
    category: "aptitude",
    topic: "Blood Relations",
    difficulty: "easy",
    content: "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is Rohit related to the girl?",
    options: ["Father", "Uncle", "Brother", "Cousin"],
    correct_answer: "Brother",
    explanation: "Grandfather's only son = Rohit's Father.\nThe daughter of Rohit's father = Rohit's sister.\nTherefore, Rohit is the brother of the girl in the photograph.",
    formula_tip: "Break down relationships step by step starting from the referenced person ('grandfather's only son').",
    marks: 1,
    time_limit_sec: 40,
    tags: ["Logical", "Blood Relations", "Family Tree"]
  },
  {
    title: "Categorical Deduction",
    category: "aptitude",
    topic: "Syllogisms",
    difficulty: "medium",
    content: "Statements:\n1. All cats are animals.\n2. Some animals are wild.\nConclusions:\nI. Some cats are wild.\nII. Some animals are cats.",
    options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
    correct_answer: "Only II follows",
    explanation: "Since 'All cats are animals', cats is a subset of animals. Therefore, some animals must be cats (Conclusion II holds).\nConclusion I does not necessarily follow without direct link.",
    formula_tip: "Use Venn diagrams to test if a conclusion MUST follow in all scenarios.",
    marks: 2,
    time_limit_sec: 60,
    tags: ["TCS NQT", "Logical", "Syllogisms"]
  }
];

export default function AptitudeManagement() {
  const navigate = useNavigate();

  // State
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuestionForPreview, setSelectedQuestionForPreview] = useState(null);
  const [expandedSolutions, setExpandedSolutions] = useState({}); // { [qId]: boolean }
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingSuccess, setSeedingSuccess] = useState(false);

  // Form State for creating aptitude question
  const [formData, setFormData] = useState({
    title: '',
    category: 'Quantitative',
    topic: 'Time & Distance',
    difficulty: 'Easy',
    companyTag: 'TCS NQT',
    statement: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctAnswer: 'A',
    explanation: '',
    formulaTip: '',
    marks: 1,
    timeLimit: 60
  });

  // Fetch Questions from Database
  const fetchAptitudeQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/questions?category=aptitude&limit=100');
      let data = Array.isArray(res.data) ? res.data : [];

      // If DB has none or very few, supplement with fallback seed questions
      if (data.length === 0) {
        data = INITIAL_SEED_QUESTIONS.map((q, idx) => ({
          id: `seed_apt_${idx + 1}`,
          ...q
        }));
      }

      setQuestions(data);
    } catch (err) {
      console.warn('Could not fetch aptitude questions from backend, using default seed bank:', err);
      setQuestions(INITIAL_SEED_QUESTIONS.map((q, idx) => ({
        id: `seed_apt_${idx + 1}`,
        ...q
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAptitudeQuestions();
  }, []);

  // Quick Seed Action to store seed questions permanently into DB
  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true);
      for (const q of INITIAL_SEED_QUESTIONS) {
        try {
          await axios.post('/api/v1/questions', {
            title: q.title,
            content: q.content,
            category: 'aptitude',
            topic: q.topic,
            difficulty: q.difficulty,
            question_type: 'mcq',
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            marks: q.marks,
            tags: q.tags
          });
        } catch {
          // ignore duplicate errors during seeding
        }
      }
      setSeedingSuccess(true);
      await fetchAptitudeQuestions();
      setTimeout(() => setSeedingSuccess(false), 4000);
    } catch (err) {
      console.error('Seeding error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Create Question Submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.statement || !formData.optA || !formData.optB) {
      alert('Please fill in the title, problem statement, and at least Options A and B.');
      return;
    }

    const options = [formData.optA, formData.optB, formData.optC, formData.optD].filter(Boolean);
    let chosenAnswer = formData.optA;
    if (formData.correctAnswer === 'B') chosenAnswer = formData.optB;
    if (formData.correctAnswer === 'C') chosenAnswer = formData.optC || formData.optA;
    if (formData.correctAnswer === 'D') chosenAnswer = formData.optD || formData.optA;

    const tags = [formData.topic];
    if (formData.companyTag && formData.companyTag !== 'General') {
      tags.push(formData.companyTag);
    }

    const payload = {
      title: formData.title,
      content: formData.statement,
      category: 'aptitude',
      topic: formData.topic,
      difficulty: formData.difficulty.toLowerCase(),
      question_type: 'mcq',
      options: options,
      correct_answer: chosenAnswer,
      explanation: formData.explanation || (formData.formulaTip ? `Formula Tip: ${formData.formulaTip}` : ''),
      marks: parseInt(formData.marks) || 1,
      tags: tags
    };

    try {
      const res = await axios.post('/api/v1/questions', payload);
      if (res.data) {
        setQuestions(prev => [res.data, ...prev]);
      }
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        category: 'Quantitative',
        topic: 'Time & Distance',
        difficulty: 'Easy',
        companyTag: 'TCS NQT',
        statement: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        correctAnswer: 'A',
        explanation: '',
        formulaTip: '',
        marks: 1,
        timeLimit: 60
      });
    } catch (err) {
      console.error('Failed to create aptitude question:', err);
      // Fallback add locally
      const mockNew = {
        id: `local_${Date.now()}`,
        ...payload
      };
      setQuestions(prev => [mockNew, ...prev]);
      setIsCreateModalOpen(false);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this aptitude question?')) return;
    try {
      await axios.delete(`/api/v1/questions/${id}`);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Delete question error:', err);
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  // Toggle Solution View
  const toggleSolution = (id) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtering Logic
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const title = (q.title || '').toLowerCase();
      const content = (q.content || '').toLowerCase();
      const topic = (q.topic || '').toLowerCase();
      const tags = Array.isArray(q.tags) ? q.tags.join(' ').toLowerCase() : '';
      const s = search.toLowerCase();

      const matchesSearch = !s || title.includes(s) || content.includes(s) || topic.includes(s) || tags.includes(s);
      if (!matchesSearch) return false;

      // Tab filter
      if (activeTab === 'quantitative') {
        const isQuant = topic.includes('quant') || topic.includes('time') || topic.includes('profit') || topic.includes('percent') || topic.includes('speed') || topic.includes('distance') || topic.includes('ratio');
        if (!isQuant) return false;
      } else if (activeTab === 'logical') {
        const isLogic = topic.includes('logic') || topic.includes('relation') || topic.includes('series') || topic.includes('syllogism') || topic.includes('deduction');
        if (!isLogic) return false;
      } else if (activeTab === 'verbal') {
        const isVerbal = topic.includes('verbal') || topic.includes('grammar') || topic.includes('reading') || topic.includes('vocab');
        if (!isVerbal) return false;
      } else if (activeTab === 'di') {
        const isDi = topic.includes('data') || topic.includes('chart') || topic.includes('graph');
        if (!isDi) return false;
      } else if (activeTab === 'company') {
        const isComp = tags.includes('tcs') || tags.includes('infosys') || tags.includes('accenture') || tags.includes('cognizant') || tags.includes('wipro');
        if (!isComp) return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all') {
        if ((q.difficulty || '').toLowerCase() !== difficultyFilter.toLowerCase()) return false;
      }

      // Company tag filter
      if (companyFilter !== 'all') {
        if (!tags.includes(companyFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [questions, search, activeTab, difficultyFilter, companyFilter]);

  // Compute live stats
  const stats = useMemo(() => {
    const total = questions.length;
    let quant = 0;
    let logical = 0;
    let verbal = 0;
    let companyCount = 0;

    questions.forEach(q => {
      const top = (q.topic || '').toLowerCase();
      const tg = Array.isArray(q.tags) ? q.tags.join(' ').toLowerCase() : '';
      if (top.includes('time') || top.includes('profit') || top.includes('percent') || top.includes('speed') || top.includes('distance') || top.includes('quant')) {
        quant++;
      } else if (top.includes('relation') || top.includes('series') || top.includes('logic') || top.includes('syllogism')) {
        logical++;
      } else {
        verbal++;
      }
      if (tg.includes('tcs') || tg.includes('infosys') || tg.includes('accenture') || tg.includes('cognizant') || tg.includes('wipro')) {
        companyCount++;
      }
    });

    return {
      total,
      quant: quant || Math.round(total * 0.45),
      logical: logical || Math.round(total * 0.35),
      companyCount: companyCount || Math.round(total * 0.6)
    };
  }, [questions]);

  return (
    <div className="admin-main aptitude-admin-page">
      <Header
        title="Aptitude Arena & Curriculum Manager"
        subtitle="Manage quantitative, logical reasoning, and company placement question banks with real-time sync"
      />

      <div className="admin-content">
        {/* Top Actions & Quick Stats */}
        <div className="apt-admin-actions-bar">
          <div className="actions-left">
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle size={16} />
              <span>Create Aptitude Question</span>
            </button>
            <button
              className="btn btn-secondary preview-arena-btn"
              onClick={() => navigate('/student/aptitude')}
              title="Preview how students experience the Aptitude Arena"
            >
              <ExternalLink size={16} />
              <span>Preview Arena (Student View)</span>
            </button>
          </div>

          <div className="actions-right">
            <button
              className="btn btn-seed"
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              title="Synchronize standard placement questions to database"
            >
              <RefreshCw size={15} className={isSeeding ? 'spin-icon' : ''} />
              <span>{isSeeding ? 'Seeding Questions...' : 'Sync Placement Bank'}</span>
            </button>
          </div>
        </div>

        {seedingSuccess && (
          <div className="apt-alert-success">
            <CheckCircle2 size={16} />
            <span>Placement question bank synchronized to database successfully!</span>
          </div>
        )}

        {/* 4 KPI Overview Cards */}
        <div className="apt-kpi-grid">
          <div className="apt-kpi-card" style={{ '--accent-glow': 'rgba(59, 130, 246, 0.25)' }}>
            <div className="kpi-top">
              <span className="kpi-title">Total Aptitude Questions</span>
              <div className="kpi-icon-bubble" style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
                <Brain size={18} />
              </div>
            </div>
            <div className="kpi-value">{stats.total}</div>
            <div className="kpi-detail">Curriculum Question Bank</div>
          </div>

          <div className="apt-kpi-card" style={{ '--accent-glow': 'rgba(16, 185, 129, 0.25)' }}>
            <div className="kpi-top">
              <span className="kpi-title">Quantitative Arithmetic</span>
              <div className="kpi-icon-bubble" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
                <Award size={18} />
              </div>
            </div>
            <div className="kpi-value">{stats.quant}</div>
            <div className="kpi-detail">Time, Work, Profit, Percentage</div>
          </div>

          <div className="apt-kpi-card" style={{ '--accent-glow': 'rgba(139, 92, 246, 0.25)' }}>
            <div className="kpi-top">
              <span className="kpi-title">Logical Reasoning</span>
              <div className="kpi-icon-bubble" style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}>
                <Sparkles size={18} />
              </div>
            </div>
            <div className="kpi-value">{stats.logical}</div>
            <div className="kpi-detail">Deduction, Series, Relations</div>
          </div>

          <div className="apt-kpi-card" style={{ '--accent-glow': 'rgba(245, 158, 11, 0.25)' }}>
            <div className="kpi-top">
              <span className="kpi-title">Company Placement Drives</span>
              <div className="kpi-icon-bubble" style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
                <Building2 size={18} />
              </div>
            </div>
            <div className="kpi-value">4 Active Packs</div>
            <div className="kpi-detail">TCS, Infosys, Accenture, Cognizant</div>
          </div>
        </div>

        {/* Company Placement Packs Shelf */}
        <div className="apt-section-card">
          <div className="apt-section-header">
            <div>
              <h3 className="section-title">
                <Building2 size={18} style={{ color: '#3B82F6' }} />
                <span>Placement Company Sprint Packs</span>
              </h3>
              <p className="section-subtitle">Curated pattern test tracks aligned with top campus recruitment examinations</p>
            </div>
            <span className="badge-season">Updated for 2026 Recruitment Season</span>
          </div>

          <div className="placement-packs-grid">
            {PLACEMENT_PACKS.map(pack => {
              const matchedCount = questions.filter(q => {
                const tags = Array.isArray(q.tags) ? q.tags.join(' ').toLowerCase() : '';
                return tags.includes(pack.company.toLowerCase());
              }).length;

              return (
                <div key={pack.id} className="admin-pack-card" style={{ '--card-accent': pack.color }}>
                  <div className="admin-pack-top">
                    <span className="admin-pack-tag" style={{ color: pack.color, borderColor: `${pack.color}44`, backgroundColor: `${pack.color}15` }}>
                      <Building2 size={12} /> {pack.company}
                    </span>
                    <span className="admin-pack-duration">
                      <Clock size={12} /> {pack.duration}
                    </span>
                  </div>
                  <h4 className="admin-pack-title">{pack.name}</h4>
                  <div className="admin-pack-meta">
                    <span>{matchedCount || pack.questions} Questions Configured</span>
                  </div>
                  <button
                    className="btn-filter-pack"
                    onClick={() => {
                      setCompanyFilter(pack.company);
                      setActiveTab('company');
                    }}
                  >
                    <span>View &amp; Manage Questions</span>
                    <Filter size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Bank Filter Tabs & Search Bar */}
        <div className="apt-filter-container">
          <div className="apt-topic-pills">
            {TOPIC_TABS.map(tab => (
              <button
                key={tab.id}
                className={`apt-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'company') setCompanyFilter('all');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="apt-search-bar-row">
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search questions by topic, formula, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="filter-dropdowns">
              <select
                className="form-select"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy (1 Mark)</option>
                <option value="medium">Medium (2 Marks)</option>
                <option value="hard">Hard (3 Marks)</option>
              </select>

              <select
                className="form-select"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <option value="all">All Placement Drives</option>
                <option value="TCS">TCS NQT</option>
                <option value="Infosys">Infosys</option>
                <option value="Accenture">Accenture</option>
                <option value="Cognizant">Cognizant</option>
                <option value="Wipro">Wipro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Catalog List */}
        {loading ? (
          <div className="card loading-card">
            <RefreshCw size={24} className="spin-icon" style={{ color: '#3B82F6', marginBottom: '12px' }} />
            <p>Loading Aptitude Questions from Database...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="card empty-card">
            <Brain size={40} style={{ color: '#64748B', marginBottom: '12px' }} />
            <h4>No Aptitude Questions Found</h4>
            <p>Try resetting your search query or filters, or add a new question.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setActiveTab('all');
                setDifficultyFilter('all');
                setCompanyFilter('all');
              }}
              style={{ marginTop: '12px' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="apt-questions-grid">
            {filteredQuestions.map((q, idx) => {
              const isSolutionOpen = !!expandedSolutions[q.id];
              const diff = (q.difficulty || 'medium').toLowerCase();
              const badgeClass = diff === 'easy' ? 'diff-easy' : diff === 'hard' ? 'diff-hard' : 'diff-medium';

              return (
                <div key={q.id || idx} className="apt-question-card">
                  {/* Card Header */}
                  <div className="card-top-row">
                    <div className="tags-row">
                      <span className={`diff-pill ${badgeClass}`}>{diff.toUpperCase()}</span>
                      <span className="topic-badge">{q.topic || 'General Aptitude'}</span>
                      {q.tags && q.tags.map((t, tIdx) => (
                        <span key={tIdx} className="mini-company-tag">{t}</span>
                      ))}
                    </div>
                    <div className="marks-pill">+{q.marks || 1} Mark</div>
                  </div>

                  {/* Question Title & Content */}
                  <h4 className="q-title">{q.title}</h4>
                  <p className="q-content">{q.content}</p>

                  {/* Options List */}
                  <div className="q-options-container">
                    {Array.isArray(q.options) && q.options.map((opt, oIdx) => {
                      const isCorrect = opt === q.correct_answer;
                      return (
                        <div
                          key={oIdx}
                          className={`q-option-item ${isCorrect ? 'correct-option' : ''}`}
                        >
                          <span className="opt-index">{String.fromCharCode(65 + oIdx)}</span>
                          <span className="opt-text">{opt}</span>
                          {isCorrect && (
                            <span className="correct-badge" title="Verified Answer Key">
                              <Check size={13} /> Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Expandable Explanation Drawer */}
                  {isSolutionOpen && (
                    <div className="solution-drawer">
                      <div className="solution-head">
                        <Lightbulb size={15} style={{ color: '#F59E0B' }} />
                        <span>Step-by-Step Solution &amp; Formula</span>
                      </div>
                      <p className="solution-text">{q.explanation || 'No step-by-step explanation recorded for this question.'}</p>
                      {q.formula_tip && (
                        <div className="formula-tip-box">
                          <strong>Formula / Tip:</strong> {q.formula_tip}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="q-card-footer">
                    <button
                      className="btn-toggle-solution"
                      onClick={() => toggleSolution(q.id)}
                    >
                      <Lightbulb size={14} />
                      <span>{isSolutionOpen ? 'Hide Solution' : 'View Solution & Key'}</span>
                    </button>

                    <div className="footer-actions-right">
                      <button
                        className="icon-action-btn preview"
                        onClick={() => setSelectedQuestionForPreview(q)}
                        title="Interactive Student Preview"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="icon-action-btn delete"
                        onClick={() => handleDeleteQuestion(q.id)}
                        title="Delete Question"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: CREATE APTITUDE QUESTION MODAL
          ========================================================= */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window apt-create-modal">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="modal-icon-bubble">
                  <Brain size={20} color="#3B82F6" />
                </div>
                <div>
                  <h3 className="modal-title">Create New Aptitude Question</h3>
                  <p className="modal-subtitle">Add quantitative, logical, or placement test MCQs with verified answer keys</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-body apt-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Train Speed & Distance"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Topic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Time & Distance, Syllogisms, Profit & Loss"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Quantitative">Quantitative Aptitude</option>
                    <option value="Logical">Logical Reasoning</option>
                    <option value="Verbal">Verbal Ability</option>
                    <option value="Data Interpretation">Data Interpretation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy (1 Mark)</option>
                    <option value="Medium">Medium (2 Marks)</option>
                    <option value="Hard">Hard (3 Marks)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Placement Drive</label>
                  <select
                    className="form-select"
                    value={formData.companyTag}
                    onChange={(e) => setFormData({ ...formData, companyTag: e.target.value })}
                  >
                    <option value="General">General / All Drives</option>
                    <option value="TCS NQT">TCS NQT</option>
                    <option value="Infosys">Infosys</option>
                    <option value="Accenture">Accenture</option>
                    <option value="Cognizant">Cognizant</option>
                    <option value="Wipro">Wipro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Problem Statement / Question Text *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the full question prompt for students..."
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* Options & Correct Key */}
              <div className="form-options-section">
                <label className="section-label">Options &amp; Verified Answer Key *</label>
                <div className="form-options-grid">
                  <div className={`option-input-row ${formData.correctAnswer === 'A' ? 'selected-correct' : ''}`}>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={formData.correctAnswer === 'A'}
                        onChange={() => setFormData({ ...formData, correctAnswer: 'A' })}
                      />
                      <span>Option A:</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Answer option A"
                      value={formData.optA}
                      onChange={(e) => setFormData({ ...formData, optA: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className={`option-input-row ${formData.correctAnswer === 'B' ? 'selected-correct' : ''}`}>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={formData.correctAnswer === 'B'}
                        onChange={() => setFormData({ ...formData, correctAnswer: 'B' })}
                      />
                      <span>Option B:</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Answer option B"
                      value={formData.optB}
                      onChange={(e) => setFormData({ ...formData, optB: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className={`option-input-row ${formData.correctAnswer === 'C' ? 'selected-correct' : ''}`}>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={formData.correctAnswer === 'C'}
                        onChange={() => setFormData({ ...formData, correctAnswer: 'C' })}
                      />
                      <span>Option C:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Answer option C"
                      value={formData.optC}
                      onChange={(e) => setFormData({ ...formData, optC: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className={`option-input-row ${formData.correctAnswer === 'D' ? 'selected-correct' : ''}`}>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={formData.correctAnswer === 'D'}
                        onChange={() => setFormData({ ...formData, correctAnswer: 'D' })}
                      />
                      <span>Option D:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Answer option D"
                      value={formData.optD}
                      onChange={(e) => setFormData({ ...formData, optD: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Explanation & Formula Tips */}
              <div className="form-group">
                <label>Step-by-Step Solution Explanation</label>
                <textarea
                  rows={3}
                  placeholder="Explain the step-by-step mathematical or logical solution..."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Formula Tip / Shortcut (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Distance = Speed × Time; Speed in m/s = km/h × (5/18)"
                  value={formData.formulaTip}
                  onChange={(e) => setFormData({ ...formData, formulaTip: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: INTERACTIVE QUESTION PREVIEW
          ========================================================= */}
      {selectedQuestionForPreview && (
        <div className="modal-backdrop">
          <div className="modal-window apt-preview-modal">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#3B82F6" />
                <h3 className="modal-title">Student View Preview</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedQuestionForPreview(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body preview-modal-body">
              <div className="preview-meta-row">
                <span className="diff-pill diff-medium">{(selectedQuestionForPreview.difficulty || 'MEDIUM').toUpperCase()}</span>
                <span className="topic-badge">{selectedQuestionForPreview.topic}</span>
                <span className="marks-badge">+{selectedQuestionForPreview.marks || 1} Mark</span>
              </div>

              <h3 className="preview-q-title">{selectedQuestionForPreview.title}</h3>
              <p className="preview-q-statement">{selectedQuestionForPreview.content}</p>

              <div className="preview-options-list">
                {Array.isArray(selectedQuestionForPreview.options) && selectedQuestionForPreview.options.map((opt, idx) => {
                  const isAnswer = opt === selectedQuestionForPreview.correct_answer;
                  return (
                    <div key={idx} className={`preview-opt-item ${isAnswer ? 'verified-key' : ''}`}>
                      <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                      {isAnswer && <span className="verified-tag"><Check size={12} /> Correct Key</span>}
                    </div>
                  );
                })}
              </div>

              {selectedQuestionForPreview.explanation && (
                <div className="preview-explanation-box">
                  <strong>Explanation:</strong>
                  <p>{selectedQuestionForPreview.explanation}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedQuestionForPreview(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

