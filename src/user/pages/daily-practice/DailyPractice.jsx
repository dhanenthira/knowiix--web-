import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Brain,
  Code2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Target,
  Clock,
  Flame,
  RotateCcw,
  Shuffle,
  Play,
  Trophy,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../shared/components/navbar';
import './DailyPractice.css';

// ─── Shuffle helper ───────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DiffBadge({ level }) {
  const map = {
    easy:   { label: 'Easy',   cls: 'dp-badge-easy'   },
    medium: { label: 'Medium', cls: 'dp-badge-medium' },
    hard:   { label: 'Hard',   cls: 'dp-badge-hard'   },
  };
  const { label, cls } = map[level?.toLowerCase()] || map.medium;
  return <span className={`dp-diff-badge ${cls}`}>{label}</span>;
}

export default function DailyPractice() {
  const { admin } = useAuth();
  const navigate = useNavigate();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [loading, setLoading]           = useState(true);
  const [aptitudeQs, setAptitudeQs]     = useState([]);   // 5 aptitude Qs
  const [codingProblem, setCodingProblem]= useState(null); // 1 coding problem
  const [error, setError]               = useState(null);

  // Quiz flow state
  const [phase, setPhase]               = useState('browse'); // browse | quiz | result
  const [quizIndex, setQuizIndex]       = useState(0);
  const [answers, setAnswers]           = useState({});       // { qId: optionStr }
  const [submitted, setSubmitted]       = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [secondsLeft, setSecondsLeft]   = useState(300);      // 5 min for 5 Qs
  const [timerActive, setTimerActive]   = useState(false);

  // ─── Load random set ────────────────────────────────────────────────────────
  const loadSet = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPhase('browse');
    setAnswers({});
    setSubmitted(false);
    setQuizIndex(0);
    setShowExplanation({});
    setSecondsLeft(300);
    setTimerActive(false);

    try {
      // Fetch aptitude questions from backend
      let aptPool = [];
      try {
        const res = await axios.get('/api/v1/questions?category=aptitude&limit=50');
        if (Array.isArray(res.data) && res.data.length > 0) aptPool = res.data;
      } catch (_) {}

      // Fallback built-in pool if backend empty
      if (aptPool.length === 0) {
        aptPool = FALLBACK_APTITUDE;
      }

      const picked = shuffleArray(aptPool).slice(0, 5).map(q => ({
        id:             q.id || `apt_${Math.random()}`,
        title:          q.title || 'Aptitude Question',
        content:        q.content || q.title || '',
        options:        Array.isArray(q.options) && q.options.length ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: q.correct_answer || (q.options ? q.options[0] : 'Option A'),
        explanation:    q.explanation || '',
        difficulty:     q.difficulty || 'medium',
        topic:          q.topic || 'General',
      }));
      setAptitudeQs(picked);

      // Fetch coding problems
      let codingPool = [];
      try {
        const cRes = await axios.get('/api/v1/coding/problems?limit=30');
        const data = cRes.data?.problems || cRes.data;
        if (Array.isArray(data) && data.length > 0) codingPool = data;
      } catch (_) {}

      if (codingPool.length > 0) {
        const rndCoding = shuffleArray(codingPool)[0];
        setCodingProblem(rndCoding);
      } else {
        setCodingProblem(FALLBACK_CODING);
      }
    } catch (err) {
      setError('Failed to load daily problems. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSet(); }, [loadSet]);

  // ─── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive) return;
    if (secondsLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, secondsLeft]);

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  // ─── Quiz handlers ───────────────────────────────────────────────────────────
  const startQuiz = () => {
    setPhase('quiz');
    setQuizIndex(0);
    setTimerActive(true);
  };

  const selectAnswer = (qId, opt) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = () => {
    setTimerActive(false);
    setSubmitted(true);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleExplanation = (qId) =>
    setShowExplanation(prev => ({ ...prev, [qId]: !prev[qId] }));

  // ─── Result calculation ──────────────────────────────────────────────────────
  const correct = aptitudeQs.filter(q => answers[q.id] === q.correct_answer).length;
  const accuracy = aptitudeQs.length ? Math.round((correct / aptitudeQs.length) * 100) : 0;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="dp-page">
      <Navbar variant="user" />

      {/* ── Header ── */}
      <div className="dp-top-bar">
        <div className="dp-top-left">
          <div className="dp-top-icon"><Flame size={20} /></div>
          <div>
            <h1 className="dp-page-title">Daily Practice</h1>
            <p className="dp-page-sub">5 Aptitude + 1 Technical Problem — Refreshes every session</p>
          </div>
        </div>
        <button className="dp-refresh-btn" onClick={loadSet} disabled={loading} title="Generate new set">
          <RefreshCw size={16} className={loading ? 'dp-spin' : ''} />
          <span>New Set</span>
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="dp-loading">
          <div className="dp-loading-spinner" />
          <p>Generating your daily problem set…</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="dp-error">
          <p>{error}</p>
          <button className="dp-btn-primary" onClick={loadSet}>Retry</button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          PHASE: BROWSE — overview of today's set
          ════════════════════════════════════════════════════════ */}
      {!loading && !error && phase === 'browse' && (
        <div className="dp-content">

          {/* ── Aptitude section ── */}
          <section className="dp-section">
            <div className="dp-section-header">
              <div className="dp-section-icon apt"><Brain size={18} /></div>
              <div>
                <h2 className="dp-section-title">Aptitude Questions <span className="dp-count-pill">5</span></h2>
                <p className="dp-section-sub">Quantitative, Logical &amp; Verbal</p>
              </div>
            </div>

            <div className="dp-apt-list">
              {aptitudeQs.map((q, idx) => (
                <div key={q.id} className="dp-apt-card">
                  <span className="dp-apt-num">Q{idx + 1}</span>
                  <div className="dp-apt-info">
                    <span className="dp-apt-title">{q.title}</span>
                    <span className="dp-apt-topic">{q.topic}</span>
                  </div>
                  <DiffBadge level={q.difficulty} />
                </div>
              ))}
            </div>

            <button className="dp-start-btn" onClick={startQuiz}>
              <Play size={16} />
              Start Aptitude Quiz
              <span className="dp-timer-hint"><Clock size={13} /> 5 min</span>
            </button>
          </section>

          {/* ── Technical section ── */}
          {codingProblem && (
            <section className="dp-section">
              <div className="dp-section-header">
                <div className="dp-section-icon code"><Code2 size={18} /></div>
                <div>
                  <h2 className="dp-section-title">Technical Problem <span className="dp-count-pill">1</span></h2>
                  <p className="dp-section-sub">Solve in Java, Python, C, or C++ in Technical Workspace</p>
                </div>
              </div>

              <div className="dp-coding-card">
                <div className="dp-coding-info">
                  <h3 className="dp-coding-title">{codingProblem.title || codingProblem.name}</h3>
                  <p className="dp-coding-desc">
                    {codingProblem.description?.slice(0, 150) || 'Open the workspace to read the full problem statement.'}
                    {codingProblem.description?.length > 150 ? '…' : ''}
                  </p>
                  <div className="dp-coding-meta">
                    <DiffBadge level={codingProblem.difficulty} />
                    {codingProblem.topic && <span className="dp-coding-topic"><Target size={12}/> {codingProblem.topic}</span>}
                  </div>
                </div>
                <button
                  className="dp-open-coding-btn"
                  onClick={() => navigate(`/technical/problem/${codingProblem.slug || codingProblem.id}`)}
                >
                  Open Technical Workspace <ArrowRight size={15} />
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          PHASE: QUIZ — one question at a time
          ════════════════════════════════════════════════════════ */}
      {!loading && !error && phase === 'quiz' && aptitudeQs.length > 0 && (
        <div className="dp-content dp-quiz-wrap">

          {/* Quiz header */}
          <div className="dp-quiz-topbar">
            <span className="dp-quiz-prog">Question {quizIndex + 1} / {aptitudeQs.length}</span>
            <div className={`dp-quiz-timer ${secondsLeft < 60 ? 'dp-timer-red' : ''}`}>
              <Clock size={14} /> {fmtTime(secondsLeft)}
            </div>
          </div>

          {/* Progress dots */}
          <div className="dp-dots">
            {aptitudeQs.map((_, i) => (
              <button
                key={i}
                className={`dp-dot ${i === quizIndex ? 'active' : ''} ${answers[aptitudeQs[i].id] ? 'answered' : ''}`}
                onClick={() => setQuizIndex(i)}
              />
            ))}
          </div>

          {/* Current question */}
          {(() => {
            const q = aptitudeQs[quizIndex];
            return (
              <div className="dp-question-card">
                <div className="dp-q-meta">
                  <span className="dp-q-topic">{q.topic}</span>
                  <DiffBadge level={q.difficulty} />
                </div>
                <h2 className="dp-q-title">{q.title}</h2>
                {q.content && q.content !== q.title && (
                  <p className="dp-q-content">{q.content}</p>
                )}

                <div className="dp-options">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <button
                        key={oi}
                        className={`dp-option ${selected ? 'selected' : ''}`}
                        onClick={() => selectAnswer(q.id, opt)}
                      >
                        <span className="dp-opt-letter">{String.fromCharCode(65 + oi)}</span>
                        <span className="dp-opt-text">{opt}</span>
                        {selected && <CheckCircle2 size={16} className="dp-opt-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Navigation */}
          <div className="dp-quiz-nav">
            <button
              className="dp-btn-secondary"
              onClick={() => setQuizIndex(i => i - 1)}
              disabled={quizIndex === 0}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {quizIndex < aptitudeQs.length - 1 ? (
              <button className="dp-btn-primary" onClick={() => setQuizIndex(i => i + 1)}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button className="dp-btn-submit" onClick={handleSubmit}>
                <Trophy size={16} /> Submit &amp; See Results
              </button>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          PHASE: RESULT
          ════════════════════════════════════════════════════════ */}
      {!loading && !error && phase === 'result' && (
        <div className="dp-content dp-result-wrap">

          {/* Score card */}
          <div className={`dp-score-card ${accuracy >= 80 ? 'score-great' : accuracy >= 50 ? 'score-ok' : 'score-low'}`}>
            <Trophy size={36} className="dp-score-trophy" />
            <div className="dp-score-num">{correct} / {aptitudeQs.length}</div>
            <div className="dp-score-label">Correct Answers</div>
            <div className="dp-score-accuracy">{accuracy}% accuracy</div>
          </div>

          {/* Review each question */}
          <h2 className="dp-review-heading">Review Answers</h2>
          {aptitudeQs.map((q, idx) => {
            const userAns  = answers[q.id];
            const isCorrect = userAns === q.correct_answer;
            return (
              <div key={q.id} className={`dp-review-card ${isCorrect ? 'rc-correct' : 'rc-wrong'}`}>
                <div className="dp-review-top">
                  <span className="dp-review-qnum">Q{idx + 1}</span>
                  {isCorrect
                    ? <CheckCircle2 size={18} className="dp-review-icon correct" />
                    : <XCircle     size={18} className="dp-review-icon wrong"    />}
                  <span className="dp-review-title">{q.title}</span>
                </div>

                <div className="dp-review-answers">
                  <div className={`dp-review-ans ${isCorrect ? 'ans-correct' : 'ans-wrong'}`}>
                    <strong>Your answer:</strong> {userAns || <em>Skipped</em>}
                  </div>
                  {!isCorrect && (
                    <div className="dp-review-ans ans-correct">
                      <strong>Correct answer:</strong> {q.correct_answer}
                    </div>
                  )}
                </div>

                {q.explanation && (
                  <>
                    <button className="dp-explain-toggle" onClick={() => toggleExplanation(q.id)}>
                      <Lightbulb size={14} />
                      {showExplanation[q.id] ? 'Hide' : 'Show'} Explanation
                    </button>
                    {showExplanation[q.id] && (
                      <div className="dp-explanation">{q.explanation}</div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Technical problem reminder */}
          {codingProblem && (
            <div className="dp-coding-reminder">
              <Code2 size={20} />
              <div>
                <p className="dp-reminder-title">Don't forget your technical challenge!</p>
                <p className="dp-reminder-sub">{codingProblem.title || codingProblem.name}</p>
              </div>
              <button
                className="dp-open-coding-btn"
                onClick={() => navigate(`/technical/problem/${codingProblem.slug || codingProblem.id}`)}
              >
                Open <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="dp-result-actions">
            <button className="dp-btn-secondary" onClick={loadSet}>
              <Shuffle size={15} /> New Set
            </button>
            <button className="dp-btn-primary" onClick={() => { setPhase('browse'); setAnswers({}); setSubmitted(false); setQuizIndex(0); setSecondsLeft(300); }}>
              <RotateCcw size={15} /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fallback built-in aptitude pool ────────────────────────────────────────
const FALLBACK_APTITUDE = [
  { id:'fb1', title:'Train Speed & Distance', content:'A train at 60 km/hr crosses a pole in 9 seconds. Length of train?', options:['120m','150m','180m','324m'], correct_answer:'150m', explanation:'Speed = 60×5/18 = 50/3 m/s. Length = 50/3 × 9 = 150m.', difficulty:'easy', topic:'Time & Distance' },
  { id:'fb2', title:'Cost Price from Selling Price', content:'A shopkeeper sells for $240 at 20% gain. Find cost price.', options:['$190','$200','$210','$220'], correct_answer:'$200', explanation:'CP = SP×100/(100+Gain%) = 240×100/120 = $200.', difficulty:'easy', topic:'Profit & Loss' },
  { id:'fb3', title:'Pipe Fill Problem', content:'Pipe A fills tank in 12h, B in 15h. Together, how many hours?', options:['6.67h','7.5h','6h','9h'], correct_answer:'6.67h', explanation:'Combined = 1/12+1/15 = 9/60 = 3/20. Time = 20/3 ≈ 6.67h.', difficulty:'medium', topic:'Time & Work' },
  { id:'fb4', title:'Successive Percentage', content:'Price up 25%. Reduce consumption by what % to keep spend same?', options:['20%','25%','16.66%','30%'], correct_answer:'20%', explanation:'New consumption = 10000/125 = 80. Reduction = 20%.', difficulty:'medium', topic:'Percentages' },
  { id:'fb5', title:'Compound Interest', content:'CI on ₹10,000 at 10% p.a. for 2 years?', options:['₹2000','₹2100','₹1000','₹2200'], correct_answer:'₹2100', explanation:'CI = 10000×(1.1²−1) = 10000×0.21 = ₹2100.', difficulty:'medium', topic:'Simple & Compound Interest' },
  { id:'fb6', title:'Missing Number Series', content:'2, 6, 12, 20, 30, ?', options:['40','42','44','46'], correct_answer:'42', explanation:'Differences: 4,6,8,10,12 → next = 30+12 = 42.', difficulty:'easy', topic:'Number Series' },
  { id:'fb7', title:'Average Age', content:'Average age of 5 persons is 30. A 6th joins; average becomes 31. Age of 6th?', options:['36','35','37','38'], correct_answer:'36', explanation:'Total before = 150. Total after = 186. 6th = 186−150 = 36.', difficulty:'easy', topic:'Averages' },
  { id:'fb8', title:'Boats & Streams', content:'Boat speed 15 km/h still water, stream 3 km/h. Speed downstream?', options:['12','18','15','21'], correct_answer:'18', explanation:'Downstream = 15+3 = 18 km/h.', difficulty:'easy', topic:'Boats & Streams' },
];

const FALLBACK_CODING = {
  id: 'tech-two-sum',
  slug: 'two-sum',
  title: 'Two Sum Target Indices',
  difficulty: 'easy',
  topic: 'Arrays & Hash Maps',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
};
