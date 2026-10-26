import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Code2, Plus, Terminal, CheckCircle2, Clock, Cpu, Trash2 } from 'lucide-react';
import Header from '../components/Header';

export default function TechnicalManagement() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProb, setNewProb] = useState({
    title: '',
    difficulty: 'Medium',
    topic: 'Algorithms',
    description: '',
    timeLimit: '1.0s',
    memoryLimit: '256MB'
  });

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/coding/problems');
      if (Array.isArray(res.data)) {
        setProblems(res.data);
      }
    } catch (err) {
      console.error('Error fetching coding problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProb.title) return;

    const payload = {
      title: newProb.title,
      difficulty: newProb.difficulty,
      topic: newProb.topic,
      description: newProb.description || newProb.title,
      time_limit_seconds: parseFloat(newProb.timeLimit) || 1.0,
      memory_limit_mb: parseInt(newProb.memoryLimit) || 256,
      sample_test_cases: [],
      hidden_test_cases: []
    };

    try {
      await axios.post('/api/v1/admin/coding', payload);
      await fetchProblems();
      setIsModalOpen(false);
      setNewProb({
        title: '',
        difficulty: 'Medium',
        topic: 'Algorithms',
        description: '',
        timeLimit: '1.0s',
        memoryLimit: '256MB'
      });
    } catch (err) {
      console.error('Failed to create coding problem:', err);
      alert('Failed to save coding problem to database.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/admin/coding/${id}`);
      setProblems(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete coding problem:', err);
    }
  };

  return (
    <div className="admin-main">
      <Header
        title="Technical Arena Problem Manager"
        subtitle="Configure technical coding challenges, test cases, and memory/time sandbox constraints"
      />

      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            <span>Add New Problem</span>
          </button>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading technical problems from database...
          </div>
        ) : problems.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)'
            }}>
              <Code2 size={28} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Technical Problems in Database
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              There are currently no technical challenges in the database. Click <strong>"Add New Problem"</strong> above to publish your first challenge.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {problems.map((p) => {
              const diff = p.difficulty || 'Medium';
              const timeLim = p.time_limit_seconds ? `${p.time_limit_seconds}s` : (p.timeLimit || '1.0s');
              const memLim = p.memory_limit_mb ? `${p.memory_limit_mb}MB` : (p.memoryLimit || '256MB');

              return (
                <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span className={`badge badge-${diff.toLowerCase()}`}>
                        {diff}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {timeLim}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Cpu size={12} /> {memLim}
                        </span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {p.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Topic: {p.topic}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ height: '34px', fontSize: '12px', color: 'var(--error)' }}
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--divider)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Create Technical Arena Challenge
              </h3>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">Problem Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Valid Parentheses Matching"
                  value={newProb.title}
                  onChange={(e) => setNewProb({ ...newProb, title: e.target.value })}
                  required
                />
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={newProb.difficulty}
                    onChange={(e) => setNewProb({ ...newProb, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Stack & Queues"
                    value={newProb.topic}
                    onChange={(e) => setNewProb({ ...newProb, topic: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="form-group">
                  <label className="form-label">Time Limit</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newProb.timeLimit}
                    onChange={(e) => setNewProb({ ...newProb, timeLimit: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Memory Limit</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newProb.memoryLimit}
                    onChange={(e) => setNewProb({ ...newProb, memoryLimit: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Deploy Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
