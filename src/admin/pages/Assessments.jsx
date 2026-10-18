import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCheck, Plus, Calendar, Clock, Award, Users } from 'lucide-react';
import Header from '../components/Header';

export default function Assessments() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/tests/available');
      if (Array.isArray(res.data)) {
        setTests(res.data);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="admin-main">
      <Header
        title="Assessment & Examination Controller"
        subtitle="Schedule formal timed assessments, randomize question distribution, and configure automated grading"
      />

      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Scheduled Assessment Drives ({tests.length})
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Server-enforced timers and anti-tamper submission safeguards
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading assessments from database...
          </div>
        ) : tests.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)'
            }}>
              <ClipboardCheck size={28} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Assessments in Database
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              There are currently no scheduled examination drives in the database.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tests.map((t) => {
              const statusStr = t.status || 'Active';
              const durationStr = t.duration_minutes ? `${t.duration_minutes} mins` : (t.duration || '60 mins');
              const qCount = t.total_questions || (t.questions ? t.questions.length : 0);
              const marks = t.total_marks || (qCount * 2);

              return (
                <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--success)'
                    }}>
                      <ClipboardCheck size={24} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {t.title}
                        </h4>
                        <span className={`badge ${statusStr === 'active' || statusStr === 'Active Live' ? 'badge-easy' : (statusStr === 'upcoming' ? 'badge-medium' : 'badge-hard')}`}>
                          {statusStr}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {durationStr}
                        </span>
                        <span>•</span>
                        <span>{qCount} Questions ({marks} Marks)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" style={{ height: '36px', fontSize: '13px' }}>
                      Inspect Results
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
