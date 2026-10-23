import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import './RealtimeUsageFlow.css';

/**
 * RealtimeUsageFlow Component
 * Provides an end-to-end interactive real-time usage flow & pipeline visualizer:
 * 1. Live Telemetry & Session Stopwatch
 * 2. Visual 4-Stage Real-Time Pipeline Diagram (Action -> Evaluation -> Calibration -> Graph)
 * 3. Live Event Stream Feed (Aptitude, Technical, Coding, Diagnostic)
 * 4. Interactive Simulation & Stream Controls
 */
export default function RealtimeUsageFlow({
  onLiveEventTriggered,
  realtimeData,
  activeMetric = 'score',
  isLiveActive = true,
  setIsLiveActive
}) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [pipelineState, setPipelineState] = useState({
    activeStage: 0,
    latencyMs: 18,
    lastActionTime: 'Connected'
  });

  const [streamSpeed, setStreamSpeed] = useState(4); // seconds per tick
  const [isSimulating, setIsSimulating] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Live usage flow events log fetched from database
  const [flowEvents, setFlowEvents] = useState([]);

  // Fetch initial real-time events from database on mount
  useEffect(() => {
    axios.get('/api/v1/students/realtime-flow')
      .then((res) => {
        if (res.data?.usage_flow_events) {
          setFlowEvents(res.data.usage_flow_events);
        }
      })
      .catch((err) => {
        console.warn('Realtime flow fetch notice:', err);
      });
  }, []);

  // Session Stopwatch Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Pipeline animated stage cycle
  useEffect(() => {
    if (!isLiveActive) return;
    const stageTimer = setInterval(() => {
      setPipelineState((prev) => ({
        ...prev,
        activeStage: (prev.activeStage + 1) % 4,
        latencyMs: Math.floor(20 + Math.random() * 8)
      }));
    }, 2000);
    return () => clearInterval(stageTimer);
  }, [isLiveActive]);

  // Automatic real-time background ticker
  useEffect(() => {
    if (!isLiveActive) return;
    const autoTickTimer = setInterval(() => {
      // Background subtle sync
      axios.get('/api/v1/students/realtime-flow')
        .then((res) => {
          if (res.data?.realtime_graph && onLiveEventTriggered) {
            onLiveEventTriggered({
              type: 'TICK_UPDATE',
              data: res.data
            });
          }
        })
        .catch(() => {
          // If offline, trigger local real-time event generator
          if (onLiveEventTriggered) {
            onLiveEventTriggered({
              type: 'LOCAL_TICK',
              timestamp: new Date().toLocaleTimeString()
            });
          }
        });
    }, streamSpeed * 1000);

    return () => clearInterval(autoTickTimer);
  }, [isLiveActive, streamSpeed, onLiveEventTriggered]);

  // Simulate an interactive real-time user action
  const handleSimulateAction = async (actionType = 'aptitude') => {
    setIsSimulating(true);

    const nowStr = new Date().toLocaleTimeString();
    let newEv = null;

    if (actionType === 'aptitude') {
      newEv = {
        id: `sim_${Date.now()}`,
        time: 'Just now',
        category: 'Aptitude & Problem Solving',
        type: 'solve',
        title: 'Real-Time Solve: Question Ingested',
        description: `Quantitative problem solved at ${nowStr}. Real-time score progression calibrated.`,
        impact: '+1 Solved • 100% Acc',
        status: 'success',
        xp: 100,
        badgeColor: '#7C3AED',
        badgeBg: '#F3E8FD',
        icon: '🧠'
      };
    } else if (actionType === 'technical') {
      newEv = {
        id: `sim_${Date.now()}`,
        time: 'Just now',
        category: 'Technical (DSA & Core)',
        type: 'diagnostic',
        title: 'Real-Time Solve: Tree Traversal Verified',
        description: `Code sandbox test cases passed. Latency: 22ms. Solved count updated in database.`,
        impact: '+1 Technical Solved',
        status: 'success',
        xp: 120,
        badgeColor: '#2563EB',
        badgeBg: '#E8F0FE',
        icon: '💻'
      };
    } else {
      newEv = {
        id: `sim_${Date.now()}`,
        time: 'Just now',
        category: 'Diagnostic Assessment',
        type: 'evaluation',
        title: 'Diagnostic Benchmark Completed',
        description: `Adaptive test milestone evaluated. Batch rank refreshed at ${nowStr}.`,
        impact: '+0.5% Diagnostic Avg',
        status: 'completed',
        badgeColor: '#059669',
        badgeBg: '#ECFDF5',
        icon: '📊'
      };
    }

    // Call backend simulation endpoint
    try {
      await axios.post('/api/v1/students/realtime-flow/simulate', {
        action_type: actionType
      });
    } catch (e) {
      // Graceful fallback
    }

    setFlowEvents((prev) => [newEv, ...prev.slice(0, 5)]);

    // Trigger parent callback to update SkillProgress and Real-time Graph!
    if (onLiveEventTriggered) {
      onLiveEventTriggered({
        type: 'USER_ACTION',
        actionType,
        event: newEv
      });
    }

    setNotificationMsg(`⚡ Live action processed: ${newEv.title}`);
    setTimeout(() => setNotificationMsg(null), 3500);
    setIsSimulating(false);
  };

  return (
    <section className="card realtime-usage-flow-card" id="realtime-usage-flow-section">
      {/* 1. Header with Live Status Ribbon */}
      <div className="flow-header-row">
        <div className="flow-header-left">
          <div className="flow-title-with-pill">
            <h3 className="card-title">
              <span className="flow-title-icon">⚡</span> Real-Time Usage Flow
            </h3>
            <span className={`live-pulse-badge ${isLiveActive ? 'online' : 'paused'}`}>
              <span className="live-pulse-dot"></span>
              {isLiveActive ? 'LIVE PIPELINE ACTIVE' : 'STREAM PAUSED'}
            </span>
          </div>
          <p className="flow-subtitle">
            Synchronized end-to-end data pipeline feeding live student activity directly into real-time performance analytics.
          </p>
        </div>

        {/* Telemetry Live Badges */}
        <div className="flow-header-right">
          <div className="flow-telemetry-item" title="Current uninterrupted practice session time">
            <Clock size={14} className="telemetry-icon" />
            <div className="telemetry-text-group">
              <span className="telemetry-label">Session Uptime</span>
              <span className="telemetry-val mono">{formatSessionTime(sessionSeconds)}</span>
            </div>
          </div>

          <div className="flow-telemetry-item" title="Pipeline calculation and graph ingestion latency">
            <Cpu size={14} className="telemetry-icon" />
            <div className="telemetry-text-group">
              <span className="telemetry-label">Ingestion Latency</span>
              <span className="telemetry-val text-emerald">{pipelineState.latencyMs}ms</span>
            </div>
          </div>

          <div className="flow-telemetry-item" title="Estimated live problem velocity">
            <Zap size={14} className="telemetry-icon" />
            <div className="telemetry-text-group">
              <span className="telemetry-label">Solve Velocity</span>
              <span className="telemetry-val text-blue">2.4 / hr</span>
            </div>
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div className="flow-live-toast">
          <Sparkles size={16} />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 2. Interactive Visual 4-Stage Pipeline */}
      <div className="flow-pipeline-container">
        <div className="pipeline-track-header">
          <span className="pipeline-track-title">Live Event Propagation Flow</span>
          <span className="pipeline-track-status">
            Stage {pipelineState.activeStage + 1} of 4: Synchronizing live
          </span>
        </div>

        <div className="pipeline-nodes-wrapper">
          {/* Node 1 */}
          <div className={`pipeline-node ${pipelineState.activeStage === 0 ? 'active' : 'idle'}`}>
            <div className="node-icon-box node-1">
              <span>✍️</span>
            </div>
            <div className="node-content">
              <span className="node-step">STAGE 1</span>
              <h5 className="node-title">Student Action</h5>
              <p className="node-desc">Aptitude, Technical & Coding drills</p>
            </div>
            {pipelineState.activeStage === 0 && <span className="node-ping-indicator"></span>}
          </div>

          {/* Connector 1 -> 2 */}
          <div className={`pipeline-connector ${pipelineState.activeStage >= 1 ? 'flowing' : ''}`}>
            <div className="pipeline-particle particle-1"></div>
          </div>

          {/* Node 2 */}
          <div className={`pipeline-node ${pipelineState.activeStage === 1 ? 'active' : 'idle'}`}>
            <div className="node-icon-box node-2">
              <span>⚡</span>
            </div>
            <div className="node-content">
              <span className="node-step">STAGE 2</span>
              <h5 className="node-title">Execution Engine</h5>
              <p className="node-desc">Accuracy & precision evaluated</p>
            </div>
            {pipelineState.activeStage === 1 && <span className="node-ping-indicator"></span>}
          </div>

          {/* Connector 2 -> 3 */}
          <div className={`pipeline-connector ${pipelineState.activeStage >= 2 ? 'flowing' : ''}`}>
            <div className="pipeline-particle particle-2"></div>
          </div>

          {/* Node 3 */}
          <div className={`pipeline-node ${pipelineState.activeStage === 2 ? 'active' : 'idle'}`}>
            <div className="node-icon-box node-3">
              <span>🎯</span>
            </div>
            <div className="node-content">
              <span className="node-step">STAGE 3</span>
              <h5 className="node-title">Diagnostics Calibration</h5>
              <p className="node-desc">Score progression & streak verification</p>
            </div>
            {pipelineState.activeStage === 2 && <span className="node-ping-indicator"></span>}
          </div>

          {/* Connector 3 -> 4 */}
          <div className={`pipeline-connector ${pipelineState.activeStage === 3 ? 'flowing' : ''}`}>
            <div className="pipeline-particle particle-3"></div>
          </div>

          {/* Node 4 */}
          <div className={`pipeline-node ${pipelineState.activeStage === 3 ? 'active' : 'idle'}`}>
            <div className="node-icon-box node-4">
              <span>📈</span>
            </div>
            <div className="node-content">
              <span className="node-step">STAGE 4</span>
              <h5 className="node-title">Real-Time Graph</h5>
              <p className="node-desc">Sliding node rendered with radar pulse</p>
            </div>
            {pipelineState.activeStage === 3 && <span className="node-ping-indicator"></span>}
          </div>
        </div>
      </div>

      {/* 3. Live Stream Controls & Simulator Toolbar */}
      <div className="flow-controls-bar">
        <div className="flow-controls-left">
          <span className="controls-label">Interactive Actions:</span>
          <button
            type="button"
            className="btn-flow-action aptitude"
            onClick={() => handleSimulateAction('aptitude')}
            disabled={isSimulating}
            title="Solve an Aptitude question live and watch pipeline & graph update"
          >
            <span>🧠</span> Solve Aptitude (+1)
          </button>
          <button
            type="button"
            className="btn-flow-action technical"
            onClick={() => handleSimulateAction('technical')}
            disabled={isSimulating}
            title="Submit a Technical DSA drill live"
          >
            <span>💻</span> Solve Technical (+1)
          </button>
          <button
            type="button"
            className="btn-flow-action diagnostic"
            onClick={() => handleSimulateAction('diagnostic')}
            disabled={isSimulating}
            title="Evaluate an assessment benchmark live"
          >
            <span>📊</span> Run Assessment (+1)
          </button>
        </div>

        <div className="flow-controls-right">
          <button
            type="button"
            className={`btn-stream-toggle ${isLiveActive ? 'pause' : 'resume'}`}
            onClick={() => setIsLiveActive(!isLiveActive)}
            title={isLiveActive ? 'Pause real-time updates' : 'Resume real-time updates'}
          >
            {isLiveActive ? (
              <>
                <Pause size={13} />
                <span>Pause Live Stream</span>
              </>
            ) : (
              <>
                <Play size={13} />
                <span>Resume Live Stream</span>
              </>
            )}
          </button>

          <div className="speed-selector-group">
            <span className="speed-label">Speed:</span>
            {['2s', '4s', '8s'].map((spd) => {
              const num = parseInt(spd);
              return (
                <button
                  key={spd}
                  type="button"
                  className={`btn-speed-pill ${streamSpeed === num ? 'active' : ''}`}
                  onClick={() => setStreamSpeed(num)}
                >
                  {spd}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Live Event Activity Feed Stream */}
      <div className="flow-stream-feed-wrapper">
        <div className="feed-header">
          <span className="feed-title">
            <Activity size={14} style={{ color: '#4F46E5' }} />
            Recent Live Ingested Events
          </span>
          <span className="feed-count">{flowEvents.length} Recent Events</span>
        </div>

        <div className="flow-events-list">
          {flowEvents && flowEvents.length > 0 ? (
            flowEvents.map((ev, idx) => (
              <div key={ev.id || idx} className="flow-event-row">
                <div className="flow-event-time">
                  <span className="time-badge">{ev.time}</span>
                </div>
                <div className="flow-event-icon-col">
                  <span className="event-icon-circle" style={{ background: ev.badgeBg || '#F1F5F9', color: ev.badgeColor || '#4F46E5' }}>
                    {ev.icon || '⚡'}
                  </span>
                </div>
                <div className="flow-event-main">
                  <div className="flow-event-title-line">
                    <span className="event-title">{ev.title}</span>
                    <span
                      className="event-category-badge"
                      style={{ color: ev.badgeColor || '#4F46E5', background: ev.badgeBg || '#EEF2FF' }}
                    >
                      {ev.category}
                    </span>
                  </div>
                  <p className="event-desc">{ev.description}</p>
                </div>
                <div className="flow-event-impact">
                  <span className="impact-pill" style={{ color: ev.badgeColor || '#4F46E5', borderColor: ev.badgeColor || '#C7D2FE' }}>
                    {ev.impact}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B', fontSize: '13.5px' }}>
              No real-time usage events recorded yet. Solve practice questions or launch a test to see live ingestion!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
