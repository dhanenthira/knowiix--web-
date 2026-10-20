import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './SkillProgress.css';

/**
 * SkillProgressCard Component
 * - People images removed from all cards per user instructions
 * - Clean progress tracking:
 *   1. Total Problems
 *   2. Problems Solved
 *   3. Problems Remaining
 *   4. Progress % with styled progress bar
 * - Retains existing card styling, typography, and theme accents
 */
export default function SkillProgressCard({
  date = 'Updated Today',
  tag = 'Working',
  tagColor = 'purple',
  title = 'Aptitude & Problem Solving',
  subtitle = 'Quantitative & Logical Reasoning',
  progress = 35,
  totalProblems = 100,
  solvedProblems = 35,
  remainingProblems = 65,
  deadlineBadge = '65 Remaining',
  theme = 'purple',
  onClick,
  className = ''
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  const calculatedPct = totalProblems > 0
    ? Math.round((solvedProblems / totalProblems) * 100)
    : progress;

  const actualRemaining = remainingProblems !== undefined
    ? remainingProblems
    : Math.max(0, totalProblems - solvedProblems);

  return (
    <div
      className={`skill-card theme-${theme} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) onClick();
      }}
    >
      {/* Top Row: Date & 3 Dots */}
      <div className="skill-card-top-row">
        <span className="skill-card-date">{date}</span>
        <button
          type="button"
          className="skill-card-more-btn"
          onClick={handleMoreClick}
          aria-label="More options"
          title="More options"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Tag Badge */}
      <div className={`skill-card-tag tag-${tagColor}`}>
        {tag}
      </div>

      {/* Main Body: Title & Subtitle */}
      <div className="skill-card-body">
        <h4 className="skill-card-title">{title}</h4>
        <p className="skill-card-subtitle">{subtitle}</p>
      </div>

      {/* Progress Section */}
      <div className="skill-card-progress-section">
        <div className="skill-card-progress-labels">
          <span className="skill-card-progress-title">Progress</span>
          <span className="skill-card-progress-pct">{calculatedPct}%</span>
        </div>
        <div className="skill-card-progress-bar-track">
          <div
            className="skill-card-progress-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, calculatedPct))}%` }}
          />
        </div>
      </div>

      {/* 3-Stat Metrics Strip: Total, Solved, Remaining */}
      <div className="skill-card-stats-strip">
        <div className="skill-card-stat-col">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalProblems}</span>
        </div>
        <div className="skill-card-stat-divider" />
        <div className="skill-card-stat-col">
          <span className="stat-label">Solved</span>
          <span className="stat-value text-solved">{solvedProblems}</span>
        </div>
        <div className="skill-card-stat-divider" />
        <div className="skill-card-stat-col">
          <span className="stat-label">Remaining</span>
          <span className="stat-value text-remaining">{actualRemaining}</span>
        </div>
      </div>

      {/* Footer Row: Progress summary + Remaining Badge */}
      <div className="skill-card-footer">
        <div className="skill-card-progress-count">
          <span className="count-highlight">{solvedProblems}</span>
          <span className="count-muted"> / {totalProblems} Solved</span>
        </div>

        <div className="skill-card-deadline-badge">
          {deadlineBadge || `${actualRemaining} Remaining`}
        </div>
      </div>
    </div>
  );
}
