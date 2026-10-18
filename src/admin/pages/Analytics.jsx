import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Award, Users, BookOpen, Code2, Download } from 'lucide-react';
import Header from '../components/Header';

export default function Analytics() {
  const [data, setData] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalSubmissions: 0,
    publishedQuestions: 0,
    accuracyRate: 0,
    categories: []
  });

  useEffect(() => {
    axios.get('/api/v1/admin/dashboard').then(res => {
      if (res.data) {
        const a = res.data.analytics || {};
        setData({
          totalStudents: a.total_students || 0,
          activeStudents: a.active_students || 0,
          totalSubmissions: a.total_submissions || 0,
          publishedQuestions: a.published_questions || 0,
          accuracyRate: a.accuracy_rate || 0,
          categories: res.data.category_performance || []
        });
      }
    }).catch(err => {
      console.error('Error fetching analytics:', err);
    });
  }, []);

  const categoryMastery = data.categories.map((c, idx) => {
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--success)', 'var(--accent)'];
    return {
      name: c.category,
      solved: c.count,
      accuracy: data.accuracyRate || 0,
      color: colors[idx % colors.length]
    };
  });

  return (
    <div className="admin-main">
      <Header
        title="Curriculum & Student Analytics"
        subtitle="Performance distribution, topic mastery rates, and engagement growth reports"
      />

      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Overall Platform Performance Metrics
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Calculated across {data.totalSubmissions.toLocaleString()} total problem attempts
            </p>
          </div>
        </div>

        {/* Category Mastery Progress Bars */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Domain-Wise Accuracy & Completion
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {categoryMastery.map((c) => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {c.solved.toLocaleString()} solved • <strong style={{ color: 'var(--success)' }}>{c.accuracy}% avg accuracy</strong>
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${c.accuracy}%`,
                    backgroundColor: c.color,
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Summary Insights Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
                <Users size={20} />
              </div>
              <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Total Enrolled Students</h5>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{data.totalStudents}</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered student profiles in database</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }} className="card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)' }}>
                  <Users size={20} />
                </div>
                <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Active Students</h5>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{data.activeStudents}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Currently active verified learners</p>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(251, 146, 60, 0.15)', color: 'var(--streak)' }}>
                <Award size={20} />
              </div>
              <h5 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Questions Published</h5>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{data.publishedQuestions}</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total verified curriculum items in database</p>
          </div>
        </div>
      </div>
    </div>
  );
}
