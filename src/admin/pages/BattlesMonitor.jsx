import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swords, Radio, Users, Trophy, Play } from 'lucide-react';
import Header from '../components/Header';

export default function BattlesMonitor() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/battle/rooms');
      if (Array.isArray(res.data)) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error('Error fetching battle rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="admin-main">
      <Header
        title="Live 1v1 Battle Rooms Monitor"
        subtitle="Inspect active multiplayer rooms, WebSocket synchronization states, and match outcomes"
      />

      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Arena Rooms ({rooms.length})
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Real-time WebSocket socket streaming
            </p>
          </div>

          <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--error)' }}>
            <Radio size={14} className="animate-pulse" />
            LIVE MULTIPLAYER FEED
          </span>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading live battle rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--error)'
            }}>
              <Swords size={28} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Active Battle Rooms
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
              There are currently no active 1v1 multiplayer matches in progress.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {rooms.map((r) => {
              const code = r.room_code || r.code || 'CA-0000';
              const name = r.name || `Battle Room #${code}`;
              const hostName = r.host_name || (r.participants && r.participants[0]?.name) || 'Host';
              const rivalName = (r.participants && r.participants[1]?.name) || 'Waiting for player...';
              const status = r.status || 'WAITING';

              return (
                <div key={code} className="card" style={{
                  backgroundColor: status === 'IN_PROGRESS' ? 'rgba(30, 27, 75, 0.6)' : 'var(--surface)',
                  borderColor: status === 'IN_PROGRESS' ? 'rgba(139, 92, 246, 0.4)' : 'var(--border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-light)' }}>
                      ROOM #{code}
                    </span>
                    <span className={`badge ${status === 'IN_PROGRESS' ? 'badge-easy' : 'badge-medium'}`}>
                      {status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {name}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Category: {r.category || 'General'}
                  </p>

                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--surface-elevated)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span>Host: <strong>{hostName}</strong></span>
                    <span>Rival: <strong>{rivalName}</strong></span>
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
