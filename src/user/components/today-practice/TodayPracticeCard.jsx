import React from 'react';
import { ArrowRight, Flame, CheckCircle2 } from 'lucide-react';
import PracticeIllustration from './PracticeIllustration';
import './TodayPracticeCard.css';

/**
 * TodayPracticeCard Component
 * Implements the exact aesthetic from the user's reference design:
 * - Ice-blue rounded container (#EBF3FE / #EDF5FD) with 24px border radius
 * - "Welcome back [Name]" with the soft blue highlighted rectangular name badge
 * - Muted subtitle typography
 * - Student with laptop and analytics illustration on right
 * - Interactive quick-action buttons and daily practice stats
 */
export default function TodayPracticeCard({
  userName = 'Student',
  greeting = 'Welcome back',
  subtitle = 'Complete your daily curated drills in Aptitude, Technical and Coding to maintain your placement readiness.',
  streakDays = 0,
  completedCount = 0,
  totalCount = 0,
  onStartPractice,
  actionText = 'Start Today\'s Practice',
  showActions = true,
  children,
  className = '',
  id
}) {
  return (
    <div className={`today-practice-card-wrapper ${className}`} id={id}>
      <div className="today-practice-card">
        {/* Left Section: Welcome Text & Actions */}
        <div className="today-card-content">
          <h1 className="today-card-title">
            <span className="today-card-greeting">{greeting}</span>{' '}
            <span className="today-name-badge">{userName}</span>
          </h1>

          <p className="today-card-subtitle">{subtitle}</p>

          {showActions && (
            <div className="today-card-actions">
              {onStartPractice ? (
                <button
                  type="button"
                  className="today-primary-btn"
                  onClick={onStartPractice}
                >
                  <span>{actionText}</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <a href="#daily-practice-focus" className="today-primary-btn">
                  <span>{actionText}</span>
                  <ArrowRight size={18} />
                </a>
              )}

              {streakDays > 0 && (
                <div className="today-streak-badge" title="Daily practice streak">
                  <span>🔥</span>
                  <span>{streakDays} Day Streak</span>
                </div>
              )}

              {totalCount > 0 && (
                <div className="today-goal-pill" title="Daily goal completion">
                  <CheckCircle2 size={17} />
                  <span>
                    {completedCount} / {totalCount} Completed
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Optional Child Elements (e.g., Progress or Category Filters) */}
          {children && <div className="today-card-children">{children}</div>}
        </div>

        {/* Right Section: Vector Student Illustration */}
        <div className="today-card-illustration">
          <PracticeIllustration />
        </div>
      </div>
    </div>
  );
}
