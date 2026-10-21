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
  skillProgress,
  title = 'Your Skill Progress',
  subtitle = 'Track your competencies, daily active drills, and placement milestones.',
  readinessText,
  className = '',
  id,
  aptitudeProgress: propAptitudeProgress
}) {
  const navigate = useNavigate();

  // Aptitude live progress state from database
  const [aptitudeProgress, setAptitudeProgress] = useState(propAptitudeProgress || skillProgress?.aptitude || {
    total_problems: 100,
    problems_solved: 35,
    problems_remaining: 65,
    progress_percentage: 35.0
  });

  // Sync when prop updates
  useEffect(() => {
    if (skillProgress?.aptitude) {
      setAptitudeProgress(skillProgress.aptitude);
    } else if (propAptitudeProgress) {
      setAptitudeProgress(propAptitudeProgress);
    }
  }, [skillProgress, propAptitudeProgress]);

  // Fetch real-time user progress from database if not passed via props
  useEffect(() => {
    if (skillProgress?.aptitude || propAptitudeProgress) return;

    let isMounted = true;
    axios.get('/api/v1/questions/aptitude/progress')
      .then(res => {
        if (isMounted && res.data) {
          setAptitudeProgress(res.data);
        }
      })
      .catch(err => {
        if (propAptitudeProgress) {
          setAptitudeProgress(propAptitudeProgress);
        }
      });

    return () => { isMounted = false; };
  }, [propAptitudeProgress, skillProgress]);

  const activeAptitude = skillProgress?.aptitude || {
    total_problems: aptitudeProgress.total_problems || 100,
    problems_solved: aptitudeProgress.problems_solved !== undefined ? aptitudeProgress.problems_solved : 35,
    problems_remaining: aptitudeProgress.problems_remaining !== undefined ? aptitudeProgress.problems_remaining : 65,
    progress_percentage: aptitudeProgress.progress_percentage !== undefined ? aptitudeProgress.progress_percentage : 35
  };

  const activeTechnical = skillProgress?.technical || {
    total_problems: 220,
    problems_solved: 185,
    problems_remaining: 35,
    progress_percentage: 84
  };

  const activeCoding = skillProgress?.coding || {
    total_problems: 65,
    problems_solved: 38,
    problems_remaining: 27,
    progress_percentage: 59
  };

  // Exactly 3 cards (Communication card removed)
  const defaultSkills = [
    {
      id: 'aptitude',
      date: 'Updated Today',
      tag: 'Working',
      tagColor: 'purple',
      title: 'Aptitude & Problem Solving',
      subtitle: 'Quantitative & Logical Reasoning',
      totalProblems: activeAptitude.total_problems,
      solvedProblems: activeAptitude.problems_solved,
      remainingProblems: activeAptitude.problems_remaining,
      progress: activeAptitude.progress_percentage,
      theme: 'purple',
      deadlineBadge: `${activeAptitude.problems_remaining} Remaining`,
      path: '/aptitude'
    },
    {
      id: 'technical',
      date: 'Active Session',
      tag: 'In Progress',
      tagColor: 'blue',
      title: 'Technical (DSA & Core)',
      subtitle: 'Data Structures, Algorithms & OS',
      totalProblems: activeTechnical.total_problems,
      solvedProblems: activeTechnical.problems_solved,
      remainingProblems: activeTechnical.problems_remaining,
      progress: activeTechnical.progress_percentage,
      theme: 'blue',
      deadlineBadge: `${activeTechnical.problems_remaining} Qs Left`,
      path: '/questions?category=Technical'
    },
    {
      id: 'coding',
      date: 'Daily Target',
      tag: 'Working',
      tagColor: 'purple',
      title: 'Coding & Algorithms',
      subtitle: 'Competitive Programming Drills',
      totalProblems: activeCoding.total_problems,
      solvedProblems: activeCoding.problems_solved,
      remainingProblems: activeCoding.problems_remaining,
      progress: activeCoding.progress_percentage,
      theme: 'purple',
      deadlineBadge: `${activeCoding.problems_remaining} Problems Left`,
      path: '/coding/practice'
    }
  ];

  const cardsToRender = skillsData || defaultSkills;
  const currentReadiness = readinessText || skillProgress?.readiness_text || 'Overall: 75% Ready';

  return (
    <section className={`skill-progress-section ${className}`} id={id || "daily-practice-focus"}>
      <div className="skill-progress-section-header">
        <div className="skill-progress-section-title-group">
          <div>
            <h3 className="skill-progress-section-title">{title}</h3>
            {subtitle && <p className="skill-progress-section-subtitle">{subtitle}</p>}
          </div>
        </div>
        {currentReadiness && (
          <div className="skill-progress-readiness-pill">
            <span>📈</span>
            <span>{currentReadiness}</span>
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
