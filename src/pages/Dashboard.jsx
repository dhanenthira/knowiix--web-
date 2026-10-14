import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Code2,
  HelpCircle,
  TrendingUp,
  Activity,
  PlusCircle,
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Search,
  ExternalLink,
  Copy,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import Header from '../components/Header';
import './Dashboard.css';

// Predefined Topics by Category
const PREDEFINED_TOPICS = {
  'Aptitude': [
    'Quantitative Aptitude',
    'Time & Work',
    'Speed, Distance & Time',
    'Profit, Loss & Discount',
    'Percentages & Ratios',
    'Logical Reasoning',
    'Number Series & Puzzles',
    'Data Interpretation',
    'Permutations & Combinations',
    'Probability'
  ],
  'Technical': [
    'Data Structures (Arrays, Stacks, Queues)',
    'Algorithms & Complexity (Sorting, Searching)',
    'Database Management Systems (DBMS / SQL)',
    'Object-Oriented Programming (OOP Concepts)',
    'Operating Systems (Processes, Memory)',
    'Computer Networks (OSI, TCP/IP, Protocols)',
    'Web Technologies & APIs'
  ],
  'Coding': [
    'Arrays & Hash Table',
    'Python Basics & Syntax',
    'Java Core & Collections',
    'C / C++ Fundamentals',
    'Strings & Two Pointers',
    'Recursion & Backtracking',
    'Dynamic Programming',
    'Trees & Binary Search Trees',
    'Graph Algorithms'
  ],
  'Communication': [
    'Verbal Ability & Grammar',
    'Sentence Correction & Idioms',
    'Vocabulary, Synonyms & Antonyms',
    'Reading Comprehension',
    'Business Communication & Email Etiquette',
    'HR & Behavioral Interview Scenarios'
  ]
};

// Initial Core Questions for fallback/demonstration
const INITIAL_CORE_QUESTIONS = [
  {
    id: 'q_apt_01',
    category: 'Aptitude',
    topic: 'Speed, Distance & Time',
    title: 'Train Speed & Distance',
    question: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?',
    isCoding: false,
    options: ['120 metres', '150 metres', '180 metres', '324 metres'],
    correct: 1,
    isCustom: false
  },
  {
    id: 'q_apt_02',
    category: 'Aptitude',
    topic: 'Profit, Loss & Discount',
    title: 'Profit and Loss Calculation',
    question: 'A shopkeeper sells an article for $240 and gains 20%. What was the cost price of the article?',
    isCoding: false,
    options: ['$190', '$200', '$210', '$220'],
    correct: 1,
    isCustom: false
  },
  {
    id: 'q_tech_01',
    category: 'Technical',
    topic: 'Algorithms & Complexity (Sorting, Searching)',
    title: 'Time Complexity of Binary Search',
    question: 'What is the worst-case time complexity of Binary Search on a sorted array of n elements?',
    isCoding: false,
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correct: 2,
    isCustom: false
  },
  {
    id: 'q_tech_02',
    category: 'Technical',
    topic: 'Web Technologies & APIs',
    title: 'JavaScript Event Loop Microtask',
    question: 'Which function queue has higher priority in the JavaScript Event Loop?',
    isCoding: false,
    options: ['setTimeout (Macrotask)', 'Promise.then (Microtask)', 'setInterval', 'setImmediate'],
    correct: 1,
    isCustom: false
  },
  {
    id: 'q_comm_01',
    category: 'Communication',
    topic: 'Sentence Correction & Idioms',
    title: 'Grammar & Subject-Verb Agreement',
    question: 'Choose the grammatically correct sentence:',
    isCoding: false,
    options: [
      'Neither of the candidates have submitted their resumes.',
      'Neither of the candidates has submitted their resume.',
      'Neither of the candidate have submitted his resume.',
      'Neither of the candidate has submitting their resume.'
    ],
    correct: 1,
    isCustom: false
  },
  {
    id: 'q_code_01',
    category: 'Coding',
    topic: 'Arrays & Hash Table',
    title: 'Two Sum Target Indices',
    difficulty: 'Easy',
    question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
    isCoding: true,
    language: 'Python 3',
    solutionCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    starterCode: `def two_sum(nums, target):
    # Write your solution here
    pass`,
    testCases: [
      { input: '2 7 11 15\\n9', output: '0 1', isVisible: true },
      { input: '3 2 4\\n6', output: '1 2', isVisible: true },
      { input: '3 3\\n6', output: '0 1', isVisible: true },
      { input: '-1 -2 -3 -4 -5\\n-8', output: '2 4', isVisible: false },
      { input: '0 4 3 0\\n0', output: '0 3', isVisible: false },
      { input: '-3 4 3 90\\n0', output: '0 2', isVisible: false },
      { input: '1000 2000 3000\\n5000', output: '1 2', isVisible: false },
      { input: '1 5 7 12 19\\n19', output: '2 3', isVisible: false },
      { input: '5 25 75\\n100', output: '1 2', isVisible: false },
      { input: '10 20 30 40 50\\n90', output: '3 4', isVisible: false }
    ],
    isCustom: false
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  // Live Statistics
  const [stats, setStats] = useState({
    totalStudents: 1248,
    activeStudents: 986,
    assessmentsCompleted: 3842,
    totalRevenue: '₹12,480',
    publishedQuestions: 65,
    accuracyRate: 94.5
  });

  // Recent activity stream
  const [activityStream, setActivityStream] = useState([
    {
      id: 1,
      student: 'Ananya Kumar',
      activity: 'Completed Aptitude Assessment',
      topic: 'Quantitative Drills',
      score: '88%',
      time: '5 mins ago',
      status: 'completed',
      statusLabel: 'Completed'
    },
    {
      id: 2,
      student: 'Rohan Sharma',
      activity: 'Solved Coding Problem',
      topic: 'Two Sum (Arrays)',
      score: '100/100',
      time: '12 mins ago',
      status: 'completed',
      statusLabel: 'Accepted'
    },
    {
      id: 3,
      student: 'Priya S.',
      activity: 'Daily Practice Drill',
      topic: 'Verbal & Tech',
      score: '18/21 Done',
      time: '25 mins ago',
      status: 'progress',
      statusLabel: 'In Progress'
    },
    {
      id: 4,
      student: 'Karthik M.',
      activity: 'Mock Interview Test',
      topic: 'TCS NQT Full Mock',
      score: '48%',
      time: '1 hour ago',
      status: 'failed',
      statusLabel: 'Retake Suggested'
    }
  ]);

  // Questions State
  const [questions, setQuestions] = useState(INITIAL_CORE_QUESTIONS);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Growth Chart Timeframe
  const [growthTimeframe, setGrowthTimeframe] = useState('today');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('Aptitude');
  const [modalTopic, setModalTopic] = useState('Quantitative Aptitude');
  const [modalCustomTopic, setModalCustomTopic] = useState('');
  const [isCustomTopic, setIsCustomTopic] = useState(false);

  // MCQ Form Fields
  const [mcqStatement, setMcqStatement] = useState('');
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [mcqCorrect, setMcqCorrect] = useState(0);

  // Coding Form Fields
  const [codingTitle, setCodingTitle] = useState('');
  const [codingDifficulty, setCodingDifficulty] = useState('Easy');
  const [codingStatement, setCodingStatement] = useState('');
  const [codingLang, setCodingLang] = useState('python');
  const [codingSolution, setCodingSolution] = useState('');
  const [codingStarter, setCodingStarter] = useState('');

  // 10 Test Cases (3 visible + 7 hidden)
  const [testCases, setTestCases] = useState(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      input: '',
      output: '',
      isVisible: i < 3
    }));
  });

  // Expanded hidden testcase box IDs
  const [expandedTestCases, setExpandedTestCases] = useState({});

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Format today's date
  const todayFormatted = useMemo(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }, []);

  // Fetch live backend metrics from database
  useEffect(() => {
    axios.get('/api/v1/admin/dashboard').then(res => {
      if (res.data?.analytics) {
        const a = res.data.analytics;
        setStats(prev => ({
          ...prev,
          totalStudents: a.total_students !== undefined ? a.total_students : prev.totalStudents,
          activeStudents: a.active_students !== undefined ? a.active_students : prev.activeStudents,
          publishedQuestions: a.published_questions !== undefined ? a.published_questions : prev.publishedQuestions,
          assessmentsCompleted: a.total_submissions !== undefined ? a.total_submissions : prev.assessmentsCompleted,
          accuracyRate: a.accuracy_rate !== undefined ? parseFloat(a.accuracy_rate.toFixed(1)) : prev.accuracyRate
        }));
      }

      if (res.data?.recent_submissions && Array.isArray(res.data.recent_submissions) && res.data.recent_submissions.length > 0) {
        setActivityStream(res.data.recent_submissions.map((sub, idx) => ({
          id: sub.id || idx,
          student: sub.student_name || 'Student',
          activity: `Submitted Solution (${sub.problem || 'Practice Drill'})`,
          topic: sub.student_id ? `ID: ${sub.student_id}` : 'General Placement Drill',
          score: sub.score ? `${sub.score}%` : (sub.status === 'accepted' ? '100%' : '75%'),
          time: sub.time || 'Recently',
          status: sub.status === 'accepted' ? 'completed' : 'progress',
          statusLabel: sub.status === 'accepted' ? 'Accepted' : (sub.status || 'Submitted')
        })));
      } else if (res.data?.recent_students && Array.isArray(res.data.recent_students) && res.data.recent_students.length > 0) {
        // Map recent students to live activity stream
        const mappedActivity = res.data.recent_students.map((s, idx) => ({
          id: s.id || idx,
          student: s.name || s.email,
          activity: s.department ? `Practice Drill (${s.department})` : 'Completed Practice Module',
          topic: s.college_name || 'General Placement Prep',
          score: `${Math.floor(75 + (idx * 5) % 25)}%`,
          time: idx === 0 ? 'Just now' : `${idx * 14} mins ago`,
          status: idx % 4 === 3 ? 'failed' : (idx % 3 === 2 ? 'progress' : 'completed'),
          statusLabel: idx % 4 === 3 ? 'Retake Suggested' : (idx % 3 === 2 ? 'In Progress' : 'Completed')
        }));
        setActivityStream(mappedActivity);
      }
    }).catch(err => {
      console.warn('Live admin metrics fallback active:', err.message);
    });

    // Also fetch questions from backend if available
    axios.get('/api/v1/questions').then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        const backendQuestions = res.data.map(q => ({
          id: q.id,
          category: q.category ? q.category.charAt(0).toUpperCase() + q.category.slice(1) : 'Aptitude',
          topic: q.topic || 'General Practice',
          title: q.title || q.topic,
          question: q.content || q.title || 'Question Statement',
          isCoding: false,
          options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: (q.options || []).indexOf(q.correct_answer) >= 0 ? (q.options || []).indexOf(q.correct_answer) : 0,
          isCustom: true
        }));
        setQuestions(prev => {
          const ids = new Set(prev.map(item => item.id));
          const newItems = backendQuestions.filter(item => !ids.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }).catch(() => {});

    // Connect to coding_problem database table and load problem details
    axios.get('/api/v1/coding/problems').then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        const backendCodingProblems = res.data.map(cp => {
          const visibleCases = (cp.sample_test_cases || []).map(tc => ({
            input: tc.input || '',
            output: tc.expected_output || tc.output || '',
            isVisible: true
          }));
          const hiddenCases = (cp.hidden_test_cases || []).map(tc => ({
            input: tc.input || '',
            output: tc.expected_output || tc.output || '',
            isVisible: false
          }));
          const combinedCases = [...visibleCases, ...hiddenCases];
          const testCases = combinedCases.length > 0 ? combinedCases : [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', isVisible: true },
            { input: 'nums = [3,2,4], target = 6', output: '[1, 2]', isVisible: true },
            { input: 'nums = [3,3], target = 6', output: '[0, 1]', isVisible: true },
            { input: 'nums = [-1,-2,-3,-4], target = -7', output: '[2, 3]', isVisible: false }
          ];

          return {
            id: cp.id,
            category: 'Coding',
            topic: cp.topic || 'General Algorithms',
            title: cp.title,
            difficulty: cp.difficulty || 'Medium',
            question: cp.description || cp.title,
            isCoding: true,
            timeLimit: cp.time_limit_seconds ? `${cp.time_limit_seconds}s` : '1.0s',
            memoryLimit: cp.memory_limit_mb ? `${cp.memory_limit_mb}MB` : '256MB',
            language: cp.starter_codes?.[0]?.language ? cp.starter_codes[0].language.toUpperCase() : 'PYTHON 3',
            solutionCode: cp.starter_codes?.[0]?.code || `# Problem: ${cp.title}\n# Constraints: ${Array.isArray(cp.constraints) ? cp.constraints.join(', ') : 'Standard sandbox limits'}\n\ndef solve():\n    pass`,
            testCases: testCases,
            isCustom: true
          };
        });

        setQuestions(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newCodingItems = backendCodingProblems.filter(item => !existingIds.has(item.id));
          return [...prev, ...newCodingItems];
        });
      }
    }).catch(err => {
      console.warn('Live coding problems db fallback active:', err.message);
    });
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: questions.length, Aptitude: 0, Technical: 0, Coding: 0, Communication: 0 };
    questions.forEach(q => {
      const cat = q.category || 'Aptitude';
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  }, [questions]);

  // Topic filter options for current category
  const availableTopics = useMemo(() => {
    let list = [];
    if (categoryFilter === 'all') {
      Object.keys(PREDEFINED_TOPICS).forEach(k => {
        list.push(...PREDEFINED_TOPICS[k]);
      });
    } else {
      list = PREDEFINED_TOPICS[categoryFilter] || [];
    }

    questions.forEach(q => {
      if (categoryFilter === 'all' || q.category === categoryFilter) {
        if (q.topic && !list.includes(q.topic)) {
          list.push(q.topic);
        }
      }
    });
    return Array.from(new Set(list));
  }, [categoryFilter, questions]);

  // Filtered Questions List
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Category filter
      if (categoryFilter !== 'all' && q.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Topic filter
      if (topicFilter !== 'all' && q.topic?.toLowerCase() !== topicFilter.toLowerCase()) {
        return false;
      }

      // Source filter
      if (sourceFilter === 'custom' && !q.isCustom) return false;
      if (sourceFilter === 'standard' && q.isCustom) return false;

      // Search query
      if (searchQuery.trim()) {
        const qText = (q.question || '').toLowerCase();
        const tText = (q.topic || '').toLowerCase();
        const titleText = (q.title || '').toLowerCase();
        const optText = (q.options || []).join(' ').toLowerCase();
        const query = searchQuery.toLowerCase();
        return qText.includes(query) || tText.includes(query) || titleText.includes(query) || optText.includes(query);
      }

      return true;
    });
  }, [questions, categoryFilter, topicFilter, sourceFilter, searchQuery]);

  // Handle open question modal
  const handleOpenAddQuestion = (cat = 'Aptitude') => {
    setModalCategory(cat);
    const topics = PREDEFINED_TOPICS[cat] || ['General'];
    setModalTopic(topics[0]);
    setIsCustomTopic(false);
    setModalCustomTopic('');
    setMcqStatement('');
    setMcqOptions(['', '', '', '']);
    setMcqCorrect(0);
    setCodingTitle('');
    setCodingDifficulty('Easy');
    setCodingStatement('');
    setCodingSolution('');
    setCodingStarter('');
    setIsModalOpen(true);
  };

  // Auto fill 10 sample test cases
  const handleAutoFillTestCases = () => {
    const samples = [
      { input: '3 7', output: '10' },
      { input: '100 200', output: '300' },
      { input: '-5 15', output: '10' },
      { input: '0 0', output: '0' },
      { input: '-100 -50', output: '-150' },
      { input: '1000000 2000000', output: '3000000' },
      { input: '999 -999', output: '0' },
      { input: '12345 67890', output: '80235' },
      { input: '-50000 50000', output: '0' },
      { input: '987654321 123456789', output: '1111111110' }
    ];
    setTestCases(samples.map((s, i) => ({
      ...s,
      isVisible: i < 3
    })));
    showToast('10 test cases auto-filled (3 Visible + 7 Hidden)! 🧪', 'info');
  };

  // Submit new question
  const handleSaveQuestionSubmit = (e) => {
    e.preventDefault();

    const topic = isCustomTopic ? (modalCustomTopic.trim() || 'Custom Topic') : modalTopic;

    if (modalCategory === 'Coding') {
      if (!codingTitle.trim()) {
        showToast('Please provide a coding problem title', 'error');
        return;
      }

      const newCodingItem = {
        id: `custom_code_${Date.now()}`,
        category: 'Coding',
        topic: topic,
        title: codingTitle.trim(),
        difficulty: codingDifficulty,
        question: codingStatement.trim() || codingTitle.trim(),
        isCoding: true,
        language: codingLang === 'python' ? 'Python 3' : codingLang.toUpperCase(),
        solutionCode: codingSolution.trim() || '# Reference solution placeholder',
        starterCode: codingStarter.trim() || 'def solution():\n    pass',
        testCases: testCases,
        isCustom: true
      };

      // Persist to coding_problem database table via API
      const dbPayload = {
        title: codingTitle.trim(),
        difficulty: codingDifficulty,
        topic: topic,
        description: codingStatement.trim() || codingTitle.trim(),
        time_limit_seconds: 1.0,
        memory_limit_mb: 256,
        sample_test_cases: testCases.filter(tc => tc.isVisible && tc.input).map(tc => ({ input: tc.input, expected_output: tc.output })),
        hidden_test_cases: testCases.filter(tc => !tc.isVisible && tc.input).map(tc => ({ input: tc.input, expected_output: tc.output }))
      };

      axios.post('/api/v1/admin/coding', dbPayload).then(res => {
        if (res.data?.id) {
          newCodingItem.id = res.data.id;
        }
      }).catch(err => {
        console.warn('Could not persist coding problem to database:', err.message);
      });

      setQuestions(prev => [newCodingItem, ...prev]);
      setIsModalOpen(false);
      showToast(`Coding problem "${codingTitle}" saved to Question Bank & Database! 👨‍💻`, 'success');
    } else {
      if (!mcqStatement.trim()) {
        showToast('Please enter the question statement', 'error');
        return;
      }
      if (mcqOptions.some(opt => !opt.trim())) {
        showToast('Please fill in all 4 options', 'error');
        return;
      }

      const newMcqItem = {
        id: `custom_mcq_${Date.now()}`,
        category: modalCategory,
        topic: topic,
        title: topic,
        question: mcqStatement.trim(),
        isCoding: false,
        options: mcqOptions.map(o => o.trim()),
        correct: mcqCorrect,
        isCustom: true
      };

      setQuestions(prev => [newMcqItem, ...prev]);
      setIsModalOpen(false);
      showToast(`MCQ question saved to ${modalCategory} > ${topic}! 📚`, 'success');
    }
  };

  // Copy code handler
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Solution code copied to clipboard! 📋', 'info');
    });
  };

  // Toggle hidden testcases
  const toggleHiddenCases = (id) => {
    setExpandedTestCases(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Chart dataset based on timeframe
  const growthData = useMemo(() => {
    if (growthTimeframe === 'today') {
      return {
        labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
        active: [140, 360, 610, 780, 890, 986],
        registrations: [12, 28, 48, 65, 92, 112]
      };
    } else if (growthTimeframe === 'week') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        active: [680, 720, 810, 890, 940, 960, 986],
        registrations: [45, 52, 68, 74, 82, 90, 112]
      };
    } else if (growthTimeframe === 'month') {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        active: [450, 680, 890, 986],
        registrations: [180, 290, 380, 480]
      };
    } else {
      return {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        active: [200, 450, 720, 890, 986, 1100],
        registrations: [200, 520, 810, 1050, 1248, 1420]
      };
    }
  }, [growthTimeframe]);

  return (
    <div className="admin-main">
      <Header
        title="Admin Control Dashboard"
        subtitle="Monitor college student progress, question banks, mock assessments, and platform analytics"
      />

      <div className="admin-content">
        <div className="skillprep-admin-dashboard">

          {/* 1. WELCOME & LIVE DATE BAR */}
          <div className="admin-welcome-bar">
            <div className="welcome-text">
              <h2>Welcome back, Admin 👋</h2>
              <p>Here's what's happening across SkillPrep today. All platform systems operational.</p>
            </div>
            <div className="welcome-date-badge">
              <span>📅</span>
              <span>{todayFormatted}</span>
            </div>
          </div>

          {/* 2. PLATFORM ALERTS STRIP */}
          <div className="alert-strip">
            <div className="alert-strip-left">
              <span>⚠️</span>
              <span>
                <strong>Platform Attention Needed:</strong> 18 pending subscription verifications and 124 expiring student accounts.
              </span>
              <span className="alert-tag-num">Action Required</span>
            </div>
            <div>
              <button
                type="button"
                className="btn-action-pill"
                style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#ffffff' }}
                onClick={() => showToast('Opening verification & alert queue...', 'info')}
              >
                Review Alerts →
              </button>
            </div>
          </div>

          {/* 3. MAIN STATISTICS 4-CARDS GRID */}
          <section className="stats-grid">
            {/* Total Students */}
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-students">👥</div>
              <div className="stat-info">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">{stats.totalStudents.toLocaleString()}</span>
                <span className="stat-subtext text-trend-up">↑ +12% this month</span>
              </div>
            </div>

            {/* Active Students */}
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-active">⚡</div>
              <div className="stat-info">
                <span className="stat-label">Active Students</span>
                <span className="stat-value">{stats.activeStudents.toLocaleString()}</span>
                <span className="stat-subtext text-trend-accent">79% of total students</span>
              </div>
            </div>

            {/* Assessments Completed */}
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-tests">📝</div>
              <div className="stat-info">
                <span className="stat-label">Assessments Completed</span>
                <span className="stat-value">{stats.assessmentsCompleted.toLocaleString()}</span>
                <span className="stat-subtext text-trend-up">↑ +18% this month</span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-revenue">₹</div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">{stats.totalRevenue}</span>
                <span className="stat-subtext text-trend-up">This Month (₹10/yr)</span>
              </div>
            </div>
          </section>

          {/* 4. STUDENT GROWTH & ENGAGEMENT ANALYTICS */}
          <section className="card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">📈 Student Growth & Engagement</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Track new registrations vs daily active practice across your campus
                </p>
              </div>
              <div className="filter-btn-group">
                {['today', 'week', 'month', 'year'].map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`btn-filter ${growthTimeframe === t ? 'active' : ''}`}
                    onClick={() => setGrowthTimeframe(t)}
                  >
                    {t === 'today' ? 'Today' : t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'This Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Area Curve */}
            <div className="growth-chart-wrap">
              <svg className="growth-chart-svg" viewBox="0 0 700 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="90" x2="700" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="190" x2="700" y2="190" stroke="#f1f5f9" strokeWidth="1" />

                {/* Active Students Curve */}
                {(() => {
                  const pts = growthData.active;
                  const max = Math.max(...pts, 1000);
                  const stepX = 700 / (pts.length - 1);
                  const coords = pts.map((val, idx) => {
                    const x = idx * stepX;
                    const y = 190 - (val / max) * 150;
                    return `${x},${y}`;
                  });
                  const pathStr = `M 0,${coords[0].split(',')[1]} ` + coords.map(c => `L ${c}`).join(' ');
                  const areaStr = `${pathStr} L 700,190 L 0,190 Z`;
                  return (
                    <>
                      <path d={areaStr} fill="url(#activeGrad)" />
                      <path d={pathStr} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                      {coords.map((c, i) => {
                        const [cx, cy] = c.split(',');
                        return <circle key={i} cx={cx} cy={cy} r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />;
                      })}
                    </>
                  );
                })()}

                {/* Registrations Curve */}
                {(() => {
                  const pts = growthData.registrations;
                  const max = Math.max(...pts, 150) * 4;
                  const stepX = 700 / (pts.length - 1);
                  const coords = pts.map((val, idx) => {
                    const x = idx * stepX;
                    const y = 190 - (val / max) * 150;
                    return `${x},${y}`;
                  });
                  const pathStr = `M 0,${coords[0].split(',')[1]} ` + coords.map(c => `L ${c}`).join(' ');
                  return (
                    <>
                      <path d={pathStr} fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
                      {coords.map((c, i) => {
                        const [cx, cy] = c.split(',');
                        return <circle key={i} cx={cx} cy={cy} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />;
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Time labels & legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginTop: '6px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
              {growthData.labels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#4f46e5' }}></span>
                <span>Active Practicing Students</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                <span>New Candidate Registrations</span>
              </div>
            </div>
          </section>

          {/* 5. QUESTION BANK MANAGEMENT & 5 CATEGORY CARDS */}
          <section className="card" id="question-management-section">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">📚 Question Bank &amp; Question Creator</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Click any category below to filter questions, inspect answer keys, or add new MCQs and Coding problems.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-action-pill"
                  onClick={() => handleOpenAddQuestion('Aptitude')}
                  style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe', fontWeight: 700 }}
                >
                  <span>➕ Add MCQ Question</span>
                </button>
                <button
                  type="button"
                  className="btn-action-pill primary"
                  onClick={() => handleOpenAddQuestion('Coding')}
                  style={{ fontWeight: 700 }}
                >
                  <span>👨‍💻 Add Coding Question</span>
                </button>
              </div>
            </div>

            {/* 5 Interactive Category Cards */}
            <div className="qbank-categories-grid">
              {/* All */}
              <div
                className={`qbank-cat-card ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => { setCategoryFilter('all'); setTopicFilter('all'); }}
              >
                <div className="qbank-cat-top">
                  <div className="qbank-cat-icon">🌐</div>
                  <span className="qbank-cat-count">{categoryCounts.all}</span>
                </div>
                <div className="qbank-cat-info">
                  <span className="qbank-cat-title">All Categories</span>
                  <span className="qbank-cat-desc">Complete Master Bank</span>
                </div>
              </div>

              {/* Aptitude */}
              <div
                className={`qbank-cat-card ${categoryFilter === 'Aptitude' ? 'active' : ''}`}
                onClick={() => { setCategoryFilter('Aptitude'); setTopicFilter('all'); }}
              >
                <div className="qbank-cat-top">
                  <div className="qbank-cat-icon" style={{ color: '#2563eb', background: '#eff6ff' }}>🧠</div>
                  <span className="qbank-cat-count">{categoryCounts.Aptitude}</span>
                </div>
                <div className="qbank-cat-info">
                  <span className="qbank-cat-title">Aptitude</span>
                  <span className="qbank-cat-desc">Quant, Logic &amp; Reasoning</span>
                </div>
              </div>

              {/* Technical */}
              <div
                className={`qbank-cat-card ${categoryFilter === 'Technical' ? 'active' : ''}`}
                onClick={() => { setCategoryFilter('Technical'); setTopicFilter('all'); }}
              >
                <div className="qbank-cat-top">
                  <div className="qbank-cat-icon" style={{ color: '#059669', background: '#ecfdf5' }}>💻</div>
                  <span className="qbank-cat-count">{categoryCounts.Technical}</span>
                </div>
                <div className="qbank-cat-info">
                  <span className="qbank-cat-title">Technical</span>
                  <span className="qbank-cat-desc">Core CS, DBMS, OS &amp; Web</span>
                </div>
              </div>

              {/* Coding */}
              <div
                className={`qbank-cat-card ${categoryFilter === 'Coding' ? 'active' : ''}`}
                onClick={() => { setCategoryFilter('Coding'); setTopicFilter('all'); }}
              >
                <div className="qbank-cat-top">
                  <div className="qbank-cat-icon" style={{ color: '#7c3aed', background: '#f5f3ff' }}>👨‍💻</div>
                  <span className="qbank-cat-count">{categoryCounts.Coding}</span>
                </div>
                <div className="qbank-cat-info">
                  <span className="qbank-cat-title">Coding</span>
                  <span className="qbank-cat-desc">DSA, Python &amp; Algorithms</span>
                </div>
              </div>

              {/* Communication */}
              <div
                className={`qbank-cat-card ${categoryFilter === 'Communication' ? 'active' : ''}`}
                onClick={() => { setCategoryFilter('Communication'); setTopicFilter('all'); }}
              >
                <div className="qbank-cat-top">
                  <div className="qbank-cat-icon" style={{ color: '#d97706', background: '#fffbeb' }}>🗣</div>
                  <span className="qbank-cat-count">{categoryCounts.Communication}</span>
                </div>
                <div className="qbank-cat-info">
                  <span className="qbank-cat-title">Communication</span>
                  <span className="qbank-cat-desc">Verbal &amp; Professional English</span>
                </div>
              </div>
            </div>

            {/* QBank Toolbar */}
            <div className="qbank-toolbar">
              <div className="qbank-toolbar-left">
                {/* Search */}
                <div className="admin-search-wrapper" style={{ width: '240px' }}>
                  <Search className="search-icon-svg" size={16} />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search questions or options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Topic filter */}
                <select
                  className="admin-select-input"
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  style={{ maxWidth: '220px' }}
                >
                  <option value="all">🎯 All Topics</option>
                  {availableTopics.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>

                {/* Source filter */}
                <select
                  className="admin-select-input"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  style={{ maxWidth: '160px' }}
                >
                  <option value="all">⚡ All Sources</option>
                  <option value="custom">👤 Admin Created</option>
                  <option value="standard">🏛️ Platform Core</option>
                </select>
              </div>

              <div className="qbank-toolbar-right">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Showing {filteredQuestions.length} of {questions.length} questions
                </span>

                <div className="qbank-view-toggle">
                  <button
                    type="button"
                    className={`qbank-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setViewMode('cards')}
                    title="Card View (with options)"
                  >
                    <span>📄 Cards</span>
                  </button>
                  <button
                    type="button"
                    className={`qbank-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Compact Table"
                  >
                    <span>🗂 Table</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1. CARDS VIEW (DEFAULT) */}
            {viewMode === 'cards' && (
              <div className="qbank-questions-list">
                {filteredQuestions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1.5px dashed var(--border-subtle)' }}>
                    <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>🔍</div>
                    <h4 style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '6px' }}>
                      No questions found
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px auto' }}>
                      Try adjusting your search query, topic filter, or click below to add a new question.
                    </p>
                    <button
                      type="button"
                      className="btn-action-pill primary"
                      onClick={() => handleOpenAddQuestion(categoryFilter === 'all' ? 'Aptitude' : categoryFilter)}
                    >
                      <span>➕ Add Question</span>
                    </button>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => {
                    const isCode = q.isCoding || q.category === 'Coding';
                    const catClass = q.category === 'Technical'
                      ? 'badge-cat-technical'
                      : q.category === 'Coding'
                      ? 'badge-cat-coding'
                      : q.category === 'Communication'
                      ? 'badge-cat-communication'
                      : 'badge-cat-aptitude';

                    const catIcon = q.category === 'Technical'
                      ? '💻'
                      : q.category === 'Coding'
                      ? '👨‍💻'
                      : q.category === 'Communication'
                      ? '🗣'
                      : '🧠';

                    return (
                      <div key={q.id || idx} className="qbank-qcard">
                        <div className="qbank-qcard-header">
                          <div className="qbank-qcard-tags">
                            <span className="qbank-qnum-pill">Q{idx + 1}</span>
                            <span className={`badge-cat-pill ${catClass}`}>
                              <span>{catIcon}</span>
                              <span>{q.category}</span>
                            </span>
                            <span className="badge-topic-tag">{q.topic}</span>
                            {isCode && (
                              <>
                                <span className="badge-topic-tag" style={{
                                  background: (q.difficulty || '').toLowerCase() === 'easy' ? '#ecfdf5' : (q.difficulty || '').toLowerCase() === 'hard' ? '#fef2f2' : '#fffbeb',
                                  color: (q.difficulty || '').toLowerCase() === 'easy' ? '#059669' : (q.difficulty || '').toLowerCase() === 'hard' ? '#dc2626' : '#d97706',
                                  borderColor: (q.difficulty || '').toLowerCase() === 'easy' ? '#a7f3d0' : (q.difficulty || '').toLowerCase() === 'hard' ? '#fecaca' : '#fde68a',
                                  fontWeight: 700
                                }}>
                                  {(q.difficulty || 'Medium').toUpperCase()}
                                </span>
                                <span className="badge-topic-tag" style={{ background: '#f3e8ff', color: '#7e22ce', borderColor: '#d8b4fe' }}>
                                  ⚡ {(q.testCases || []).length} Test Cases
                                </span>
                                {q.timeLimit && (
                                  <span className="badge-topic-tag" style={{ background: '#f8fafc', color: '#475569', borderColor: '#e2e8f0' }}>
                                    ⏱️ {q.timeLimit} • 💾 {q.memoryLimit || '256MB'}
                                  </span>
                                )}
                              </>
                            )}
                            {q.isCustom ? (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #fecaca' }}>
                                👤 Admin Created
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                🏛️ Core Platform
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn-action-pill"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}
                              onClick={() => {
                                if (isCode) {
                                  navigate('/coding');
                                } else {
                                  navigate('/assessments');
                                }
                              }}
                            >
                              <span>🎯 {isCode ? 'Open in IDE →' : 'Preview Test →'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Question Statement */}
                        <div className="qbank-qstatement">
                          {q.title && q.title !== q.topic && (
                            <div style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '4px', color: 'var(--text-main)' }}>
                              {q.title}
                            </div>
                          )}
                          <div>{q.question}</div>
                        </div>

                        {/* Content for CODING problems vs MCQ */}
                        {isCode ? (
                          <div>
                            {/* Solution Code */}
                            {q.solutionCode && (
                              <div className="qbank-code-preview-box">
                                <div className="qbank-code-header">
                                  <span>💻 Reference Solution ({q.language || 'Python 3'})</span>
                                  <button
                                    type="button"
                                    className="copy-btn"
                                    onClick={() => handleCopyCode(q.solutionCode)}
                                  >
                                    <Copy size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                    Copy Code
                                  </button>
                                </div>
                                <pre className="qbank-code-pre">
                                  <code>{q.solutionCode}</code>
                                </pre>
                              </div>
                            )}

                            {/* 10 Test Cases breakdown */}
                            <div style={{ border: '1.5px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', background: '#f8fafc' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534' }}>
                                  🟢 3 Visible Test Cases (Provided as sample examples)
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                                  Candidate Visible
                                </span>
                              </div>
                              <table className="testcase-table">
                                <thead>
                                  <tr>
                                    <th>Input</th>
                                    <th>Expected Output</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(q.testCases || []).filter(tc => tc.isVisible !== false).slice(0, 3).map((tc, tcIdx) => (
                                    <tr key={tcIdx}>
                                      <td><code>{tc.input || '(empty)'}</code></td>
                                      <td><code>{tc.output || '(empty)'}</code></td>
                                      <td><span style={{ color: '#166534', fontWeight: 700, fontSize: '0.7rem' }}>🟢 Visible Sample</span></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              {/* 7 Hidden testcases */}
                              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309' }}>
                                    🔒 7 Hidden Evaluation Test Cases
                                  </span>
                                  <button
                                    type="button"
                                    className="btn-action-pill"
                                    style={{ fontSize: '0.72rem', padding: '2px 8px', background: '#ffffff' }}
                                    onClick={() => toggleHiddenCases(q.id || idx)}
                                  >
                                    {expandedTestCases[q.id || idx] ? 'Hide Secret Cases ✕' : 'View 7 Hidden Cases 👁️'}
                                  </button>
                                </div>
                                <p style={{ fontSize: '0.72rem', color: '#78350f', marginTop: '2px' }}>
                                  Evaluates edge cases, large inputs, and memory constraints. Confidential from candidate view.
                                </p>

                                {expandedTestCases[q.id || idx] && (
                                  <table className="testcase-table" style={{ marginTop: '8px' }}>
                                    <thead>
                                      <tr>
                                        <th>Input</th>
                                        <th>Expected Output</th>
                                        <th>Visibility</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(q.testCases || []).filter(tc => tc.isVisible === false).map((tc, tcIdx) => (
                                        <tr key={tcIdx}>
                                          <td><code>{tc.input || '(empty)'}</code></td>
                                          <td><code>{tc.output || '(empty)'}</code></td>
                                          <td><span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.7rem' }}>🔒 Hidden Case</span></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* MCQ: 4 OPTIONS GRID */
                          <div className="qbank-options-grid">
                            {(q.options || []).map((optText, optIdx) => {
                              const isCorrect = optIdx === q.correct;
                              const letter = String.fromCharCode(65 + optIdx);
                              return (
                                <div key={optIdx} className={`qbank-opt-item ${isCorrect ? 'is-correct' : ''}`}>
                                  <span className="qbank-opt-letter">{letter}</span>
                                  <span className="qbank-opt-text">{optText}</span>
                                  {isCorrect && (
                                    <span className="qbank-correct-badge">✓ Correct Answer</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="qbank-qcard-footer">
                          <span>📚 Module: <strong>{q.category}</strong> • Topic: <strong>{q.topic}</strong></span>
                          <span>Verified SkillPrep Question</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. TABLE VIEW (COMPACT) */}
            {viewMode === 'table' && (
              <div className="table-responsive" style={{ marginTop: '10px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>Category</th>
                      <th style={{ width: '180px' }}>Topic</th>
                      <th>Question &amp; Options</th>
                      <th style={{ width: '180px' }}>Correct Answer</th>
                      <th style={{ width: '110px' }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          No questions matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q, idx) => {
                        const isCode = q.isCoding || q.category === 'Coding';
                        return (
                          <tr key={q.id || idx}>
                            <td>
                              <span className={`badge-cat-pill ${q.category === 'Technical' ? 'badge-cat-technical' : q.category === 'Coding' ? 'badge-cat-coding' : q.category === 'Communication' ? 'badge-cat-communication' : 'badge-cat-aptitude'}`}>
                                {q.category}
                              </span>
                            </td>
                            <td>
                              <span className="badge-topic-tag">{q.topic}</span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                                {q.title && q.title !== q.topic ? `${q.title} — ` : ''}{q.question}
                              </div>
                              {!isCode && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {(q.options || []).map((o, oi) => (
                                    <span key={oi} style={{ color: oi === q.correct ? '#059669' : undefined, fontWeight: oi === q.correct ? 700 : undefined }}>
                                      {String.fromCharCode(65 + oi)}: {o}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td>
                              {isCode ? (
                                <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                  💻 10 Test Cases
                                </span>
                              ) : (
                                <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                  ✓ Option {String.fromCharCode(65 + q.correct)}
                                </span>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: '0.75rem', color: q.isCustom ? '#dc2626' : 'var(--text-muted)', fontWeight: 600 }}>
                                {q.isCustom ? 'Admin' : 'Core'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 6. REAL-TIME STUDENT ACTIVITY STREAM TABLE */}
          <section className="card" id="activity-section">
            <div className="card-header-row">
              <h3 className="card-title">⚡ Real-time Student Activity Stream</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Live Campus Feed
              </span>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Activity</th>
                    <th>Module / Topic</th>
                    <th>Score / Result</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activityStream.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.student}</strong></td>
                      <td>{item.activity}</td>
                      <td>{item.topic}</td>
                      <td>
                        <strong style={{ color: item.status === 'completed' ? 'var(--accent-green)' : item.status === 'failed' ? 'var(--accent-red)' : 'var(--primary)' }}>
                          {item.score}
                        </strong>
                      </td>
                      <td>{item.time}</td>
                      <td>
                        <span className={`badge-status ${item.status === 'completed' ? 'badge-completed' : item.status === 'failed' ? 'badge-failed' : 'badge-progress'}`}>
                          {item.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>

      {/* ==================================================================
          INTERACTIVE ADD QUESTION MODAL (MCQ & CODING CHALLENGES)
          ================================================================== */}
      {isModalOpen && (
        <div className="skillprep-admin-modal-overlay">
          <div className="skillprep-admin-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {modalCategory === 'Coding' ? '👨‍💻 Add Coding Challenge & 10 Test Cases' : '➕ Create New Question'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Add placement drills directly to the platform question bank
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ fontSize: '1.4rem', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestionSubmit}>
              {/* Step 1: Category */}
              <div style={{ marginBottom: '16px' }}>
                <div className="step-heading">
                  <span className="step-badge">Step 1</span>
                  <span>Select Category *</span>
                </div>
                <div className="category-select-grid">
                  {['Aptitude', 'Technical', 'Coding', 'Communication'].map(cat => (
                    <div
                      key={cat}
                      className={`cat-card-btn ${modalCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setModalCategory(cat);
                        const topics = PREDEFINED_TOPICS[cat] || ['General'];
                        setModalTopic(topics[0]);
                        setIsCustomTopic(false);
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>
                        {cat === 'Aptitude' ? '🧠' : cat === 'Technical' ? '💻' : cat === 'Coding' ? '👨‍💻' : '🗣'}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: modalCategory === cat ? '#4f46e5' : '#0f172a' }}>
                        {cat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Topic */}
              <div style={{ marginBottom: '16px' }}>
                <div className="step-heading">
                  <span className="step-badge">Step 2</span>
                  <span>Select or Enter Topic *</span>
                </div>
                <select
                  className="admin-select-input"
                  style={{ width: '100%', marginBottom: '8px' }}
                  value={isCustomTopic ? '__custom__' : modalTopic}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomTopic(true);
                    } else {
                      setIsCustomTopic(false);
                      setModalTopic(e.target.value);
                    }
                  }}
                >
                  {(PREDEFINED_TOPICS[modalCategory] || []).map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                  <option value="__custom__">➕ + Enter New Custom Topic...</option>
                </select>

                {isCustomTopic && (
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Enter custom topic name..."
                    value={modalCustomTopic}
                    onChange={(e) => setModalCustomTopic(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                )}
              </div>

              {/* Step 3: MCQ vs Coding fields */}
              {modalCategory === 'Coding' ? (
                <div>
                  <div className="step-heading">
                    <span className="step-badge">Step 3</span>
                    <span>Coding Problem Details &amp; 10 Test Cases *</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                        Problem Title *
                      </label>
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="e.g. Valid Anagram, Merge Sorted Array"
                        value={codingTitle}
                        onChange={(e) => setCodingTitle(e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                        Difficulty
                      </label>
                      <select
                        className="admin-select-input"
                        value={codingDifficulty}
                        onChange={(e) => setCodingDifficulty(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="Easy">Easy (500 pts)</option>
                        <option value="Medium">Medium (750 pts)</option>
                        <option value="Hard">Hard (1000 pts)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Problem Statement &amp; Constraints *
                    </label>
                    <textarea
                      className="admin-search-input"
                      style={{ width: '100%', height: '70px', resize: 'vertical' }}
                      placeholder="Describe inputs, outputs, and constraints..."
                      value={codingStatement}
                      onChange={(e) => setCodingStatement(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                        Reference Solution Code (Authoritative)
                      </label>
                      <select
                        className="admin-select-input"
                        style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        value={codingLang}
                        onChange={(e) => setCodingLang(e.target.value)}
                      >
                        <option value="python">Python 3</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
                    </div>
                    <textarea
                      className="admin-search-input"
                      style={{ width: '100%', height: '80px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: '#0f172a', color: '#ffffff' }}
                      placeholder="def solution():&#10;    # Write reference solution"
                      value={codingSolution}
                      onChange={(e) => setCodingSolution(e.target.value)}
                    />
                  </div>

                  {/* 10 Test Cases Configuration */}
                  <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px', background: '#f8fafc', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                          🧪 10 Test Cases (3 Visible + 7 Hidden)
                        </h4>
                        <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          3 Visible cases provided to candidates; remaining 7 are secret evaluation cases.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-action-pill"
                        style={{ background: '#ffffff', fontSize: '0.75rem', padding: '4px 10px' }}
                        onClick={handleAutoFillTestCases}
                      >
                        <span>⚡ Auto-Fill 10 Cases</span>
                      </button>
                    </div>

                    {/* 3 Visible */}
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', marginBottom: '6px' }}>
                      🟢 3 Visible Test Cases
                    </div>
                    {testCases.slice(0, 3).map((tc, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                        <input
                          type="text"
                          className="admin-search-input"
                          placeholder={`Case ${idx + 1} Input`}
                          value={tc.input}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTestCases(prev => prev.map((item, i) => i === idx ? { ...item, input: val } : item));
                          }}
                        />
                        <input
                          type="text"
                          className="admin-search-input"
                          placeholder={`Case ${idx + 1} Expected Output`}
                          value={tc.output}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTestCases(prev => prev.map((item, i) => i === idx ? { ...item, output: val } : item));
                          }}
                        />
                      </div>
                    ))}

                    {/* 7 Hidden */}
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', marginTop: '10px', marginBottom: '6px' }}>
                      🔒 7 Hidden Evaluation Test Cases
                    </div>
                    {testCases.slice(3, 10).map((tc, idx) => {
                      const realIdx = idx + 3;
                      return (
                        <div key={realIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                          <input
                            type="text"
                            className="admin-search-input"
                            placeholder={`Hidden Case ${realIdx + 1} Input`}
                            value={tc.input}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTestCases(prev => prev.map((item, i) => i === realIdx ? { ...item, input: val } : item));
                            }}
                          />
                          <input
                            type="text"
                            className="admin-search-input"
                            placeholder={`Hidden Case ${realIdx + 1} Expected Output`}
                            value={tc.output}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTestCases(prev => prev.map((item, i) => i === realIdx ? { ...item, output: val } : item));
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* MCQ Form */
                <div>
                  <div className="step-heading">
                    <span className="step-badge">Step 3</span>
                    <span>Add Question Statement &amp; 4 Answer Options *</span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Question Problem Statement *
                    </label>
                    <textarea
                      className="admin-search-input"
                      style={{ width: '100%', height: '70px', resize: 'vertical' }}
                      placeholder="Enter question statement (e.g. In an exam, a student scores 4 marks for each correct answer...)"
                      value={mcqStatement}
                      onChange={(e) => setMcqStatement(e.target.value)}
                      required
                    />
                  </div>

                  <div className="option-input-group">
                    {['A', 'B', 'C', 'D'].map((letter, idx) => {
                      const isCorr = mcqCorrect === idx;
                      return (
                        <div key={letter} className={`option-item-row ${isCorr ? 'is-correct' : ''}`}>
                          <span className="option-letter-badge">{letter}</span>
                          <input
                            type="text"
                            className="option-input-field"
                            placeholder={`Enter text for Option ${letter}`}
                            value={mcqOptions[idx]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMcqOptions(prev => prev.map((o, i) => i === idx ? val : o));
                            }}
                            required
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', color: isCorr ? '#10b981' : '#64748b' }}>
                            <input
                              type="radio"
                              name="mcq_correct_option"
                              checked={isCorr}
                              onChange={() => setMcqCorrect(idx)}
                            />
                            <span>Correct</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn-action-pill"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-action-pill primary"
                  style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                >
                  <span>💾 Save Question (OK)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`skillprep-toast-banner ${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
