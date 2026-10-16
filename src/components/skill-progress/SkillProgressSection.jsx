import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SkillProgressCard from './SkillProgressCard';
import './SkillProgress.css';

/**
 * SkillProgressSection Component
 * Displays the 3 focused skill tracks:
 * 1. Aptitude & Problem Solving (Connected to MySQL database progress per user)
 * 2. Technical (DSA & Core)
 * 3. Coding & Algorithms
 *
 * NOTE: Per requirements:
 * - People images removed from all three cards
 * - Communication card removed completely
 * - Displays Total Problems, Problems Solved, Problems Remaining, and Progress % with progress bar
 */
export default function SkillProgressSection({
  skillsData,
  title = 'Your Skill Progress',
  subtitle = 'Track your competencies, daily active drills, and placement milestones.',
  readinessText = 'Overall: 75% Ready',
  className = '',
  id,
  aptitudeProgress: propAptitudeProgress
}) {
  const navigate = useNavigate();

  // Aptitude live progress state from database
  const [aptitudeProgress, setAptitudeProgress] = useState(propAptitudeProgress || {
    total_problems: 100,
    problems_solved: 35,
    problems_remaining: 65,
    progress_percentage: 35.0
  });

  // Fetch real-time user progress from database
  useEffect(() => {
    let isMounted = true;
    axios.get('/api/v1/questions/aptitude/progress')
      .then(res => {
        if (isMounted && res.data) {
          setAptitudeProgress(res.data);
        }
      })
      .catch(err => {
        // Fallback to prop or initial 35/100
        if (propAptitudeProgress) {
          setAptitudeProgress(propAptitudeProgress);
        }
      });

    return () => { isMounted = false; };
  }, [propAptitudeProgress]);

  // Exactly 3 cards (Communication card removed)
  const defaultSkills = [
    {
      id: 'aptitude',
      date: 'Updated Today',
      tag: 'Working',
      tagColor: 'purple',
      title: 'Aptitude & Problem Solving',
      subtitle: 'Quantitative & Logical Reasoning',
      totalProblems: aptitudeProgress.total_problems || 100,
      solvedProblems: aptitudeProgress.problems_solved !== undefined ? aptitudeProgress.problems_solved : 35,
      remainingProblems: aptitudeProgress.problems_remaining !== undefined ? aptitudeProgress.problems_remaining : 65,
      progress: aptitudeProgress.progress_percentage !== undefined ? aptitudeProgress.progress_percentage : 35,
      theme: 'purple',
      deadlineBadge: `${aptitudeProgress.problems_remaining !== undefined ? aptitudeProgress.problems_remaining : 65} Remaining`,
      path: '/aptitude'
    },
    {
      id: 'technical',
      date: 'Active Session',
      tag: 'In Progress',
      tagColor: 'blue',
      title: 'Technical (DSA & Core)',
      subtitle: 'Data Structures, Algorithms & OS',
      totalProblems: 220,
      solvedProblems: 185,
      remainingProblems: 35,
      progress: 84,
      theme: 'blue',
      deadlineBadge: '35 Qs Left',
      path: '/questions?category=Technical'
    },
    {
      id: 'coding',
      date: 'Daily Target',
      tag: 'Working',
      tagColor: 'purple',
      title: 'Coding & Algorithms',
      subtitle: 'Competitive Programming Drills',
      totalProblems: 65,
      solvedProblems: 38,
      remainingProblems: 27,
      progress: 59,
      theme: 'purple',
      deadlineBadge: '27 Problems Left',
      path: '/coding/practice'
    }
  ];

  const cardsToRender = skillsData || defaultSkills;

  return (
    <section className={`skill-progress-section ${className}`} id={id || "daily-practice-focus"}>
      <div className="skill-progress-section-header">
        <div className="skill-progress-section-title-group">
          <div>
            <h3 className="skill-progress-section-title">{title}</h3>
            {subtitle && <p className="skill-progress-section-subtitle">{subtitle}</p>}
          </div>
        </div>
        {readinessText && (
          <div className="skill-progress-readiness-pill">
            <span>📈</span>
            <span>{readinessText}</span>
          </div>
        )}
      </div>

      <div className="skill-cards-grid">
        {cardsToRender.map((skill) => (
          <SkillProgressCard
            key={skill.id || skill.title}
            date={skill.date}
            tag={skill.tag}
            tagColor={skill.tagColor}
            title={skill.title}
            subtitle={skill.subtitle}
            progress={skill.progress}
            totalProblems={skill.totalProblems}
            solvedProblems={skill.solvedProblems}
            remainingProblems={skill.remainingProblems}
            theme={skill.theme}
            deadlineBadge={skill.deadlineBadge}
            onClick={() => skill.path && navigate(skill.path)}
          />
        ))}
      </div>
    </section>
  );
}
