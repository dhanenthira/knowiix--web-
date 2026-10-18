import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCheck, UserX, Shield, Award, Filter, Mail, Users } from 'lucide-react';
import Header from '../components/Header';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const fetchStudents = () => {
    setLoading(true);
    axios.get('/api/v1/admin/students').then(res => {
      if (res.data && Array.isArray(res.data)) {
        setStudents(res.data);
      }
    }).catch(err => {
      console.error('Error fetching students:', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const sName = (s.name || '').toLowerCase();
    const sId = (s.student_id || '').toLowerCase();
    const sEmail = (s.email || '').toLowerCase();
    const sDept = (s.department || '').toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch = sName.includes(q) || sId.includes(q) || sEmail.includes(q);
    const matchesDept = deptFilter === 'All' || sDept.includes(deptFilter.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(`/api/v1/admin/students/${id}/status`);
      const newActive = res.data?.is_active;
      setStudents(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, is_active: newActive };
        }
        return s;
      }));
    } catch (err) {
      console.error('Failed to toggle student status:', err);
    }
  };

  return (
    <div className="admin-main">
      <Header
        title="Student Directory & Management"
        subtitle="Search, inspect, and manage enrolled learners, accuracy metrics, and permissions"
      />

      <div className="admin-content">
        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '40px', height: '46px' }}
              placeholder="Search by student name, Student ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ height: '46px' }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="AI">AI & Data Science</option>
              <option value="Software">Software Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading enrolled students from database...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '56px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
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
                  <Users size={28} />
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  No Students Registered
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
                  No student accounts exist in the database yet. When students register on CodeArena, their profile details and performance statistics will appear here in real time.
                </p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Info</th>
                    <th>Institution / Department</th>
                    <th>Accuracy</th>
                    <th>Questions Solved</th>
                    <th>Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const isActive = s.is_active !== undefined ? s.is_active : (s.status === 'Active');
                    const college = s.college_name || s.college || 'Not specified';
                    const department = s.department || 'General';
                    const accuracy = s.overall_accuracy !== undefined ? s.overall_accuracy : (s.accuracy || 0);
                    const solved = s.questions_solved !== undefined ? s.questions_solved : (s.solved || 0);
                    const points = s.total_points !== undefined ? s.total_points : (s.points || 0);

                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '13px',
                              color: '#ffffff'
                            }}>
                              {(s.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.student_id || s.id} • {s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{college}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{department}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                            {accuracy}%
                          </span>
                        </td>
                        <td>{solved}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                            {points} XP
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isActive ? 'badge-easy' : 'badge-hard'}`}>
                            {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            style={{ height: '32px', fontSize: '12px', padding: '0 10px' }}
                            onClick={() => toggleStatus(s.id)}
                          >
                            {isActive ? (
                              <>
                                <UserX size={13} color="var(--error)" />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} color="var(--success)" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
