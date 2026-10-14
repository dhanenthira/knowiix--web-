import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Search, Trash2, Edit3, Filter, HelpCircle, Check, X, AlertCircle } from 'lucide-react';
import Header from '../components/Header';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New question form state
  const [newQ, setNewQ] = useState({
    title: '',
    category: 'Aptitude',
    topic: 'Time & Work',
    difficulty: 'Easy',
    statement: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    answer: '',
    explanation: ''
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/questions');
      if (Array.isArray(res.data)) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newQ.title) return;

    const options = [newQ.optA, newQ.optB, newQ.optC, newQ.optD].filter(Boolean);
    const payload = {
      title: newQ.title,
      content: newQ.statement || newQ.title,
      category: newQ.category.toLowerCase(),
      topic: newQ.topic,
      difficulty: newQ.difficulty.toLowerCase(),
      question_type: 'mcq',
      options: options,
      correct_answer: newQ.answer || options[0] || '',
      explanation: newQ.explanation || '',
      marks: 1,
      tags: [newQ.topic]
    };

    try {
      await axios.post('/api/v1/questions', payload);
      await fetchQuestions();
      setIsModalOpen(false);
      setNewQ({
        title: '',
        category: 'Aptitude',
        topic: 'Time & Work',
        difficulty: 'Easy',
        statement: '',
        optA: '',
        optB: '',
        optC: '',
        optD: '',
        answer: '',
        explanation: ''
      });
    } catch (err) {
      console.error('Failed to create question:', err);
      alert('Failed to save question to database. Please check your network or inputs.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/questions/${id}`);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const filtered = questions.filter(q => {
    const titleMatch = (q.title || '').toLowerCase().includes(search.toLowerCase());
    const topicMatch = (q.topic || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || topicMatch;
    const catFormatted = (q.category || '').toLowerCase();
    const filterFormatted = catFilter.toLowerCase();
    const matchesCat = catFilter === 'All' || catFormatted === filterFormatted;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-main">
      <Header
        title="Question Bank & Curriculum Editor"
        subtitle="Manage aptitude and technical multiple-choice questions with server-side validation keys"
      />

      <div className="admin-content">
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '40px', height: '44px' }}
                placeholder="Search questions by topic or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={17} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>

            <select
              className="form-select"
              style={{ height: '44px' }}
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Technical">Technical</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={16} />
            <span>Create New Question</span>
          </button>
        </div>

        {/* Question Grid / List */}
        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading questions from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <HelpCircle size={28} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Questions in Database
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              There are currently no questions stored in the database. Click <strong>"Create New Question"</strong> above to publish your first real question.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((q) => {
              const catName = q.category ? q.category.charAt(0).toUpperCase() + q.category.slice(1) : 'General';
              const diffName = q.difficulty ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1) : 'Medium';
              const isApt = catName.toLowerCase() === 'aptitude';
              const correctAns = q.correct_answer || q.answer || (q.options && q.options[0]) || 'N/A';

              return (
                <div key={q.id} className="card" style={{ padding: '18px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: isApt ? 'rgba(59, 130, 246, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isApt ? 'var(--primary)' : 'var(--secondary)'
                      }}>
                        <HelpCircle size={22} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {q.title}
                          </h4>
                          <span className={`badge badge-${diffName.toLowerCase()}`}>
                            {diffName}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>Category: <strong style={{ color: 'var(--text-secondary)' }}>{catName}</strong></span>
                          <span>•</span>
                          <span>Topic: <strong style={{ color: 'var(--text-secondary)' }}>{q.topic}</strong></span>
                          <span>•</span>
                          <span>Correct Answer: <strong style={{ color: 'var(--success)' }}>{correctAns}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ height: '34px', padding: '0 10px', color: 'var(--error)' }}
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Add New Question to Bank
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ padding: '28px' }}>
              <div className="form-group">
                <label className="form-label">Question Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Work and Time Rates Calculation"
                  value={newQ.title}
                  onChange={(e) => setNewQ({ ...newQ, title: e.target.value })}
                  required
                />
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newQ.category}
                    onChange={(e) => setNewQ({ ...newQ, category: e.target.value })}
                  >
                    <option value="Aptitude">Aptitude</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={newQ.difficulty}
                    onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Topic / Tag</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Data Structures, Profit & Loss"
                  value={newQ.topic}
                  onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })}
                  required
                />
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Option A</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Option A"
                    value={newQ.optA}
                    onChange={(e) => setNewQ({ ...newQ, optA: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option B</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Option B"
                    value={newQ.optB}
                    onChange={(e) => setNewQ({ ...newQ, optB: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option C</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Option C"
                    value={newQ.optC}
                    onChange={(e) => setNewQ({ ...newQ, optC: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option D</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Option D"
                    value={newQ.optD}
                    onChange={(e) => setNewQ({ ...newQ, optD: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correct Answer (Exact Match with Option)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Option A value"
                  value={newQ.answer}
                  onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
