import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  ChevronLeft,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Terminal,
  FileText,
  History,
  Maximize2,
  Minimize2,
  Check
} from 'lucide-react';
import codingApi from '../../api/codingApi';
import './CodingPractice.css';

// Default starter codes for popular languages
const DEFAULT_STARTER_CODES = {
  python: `# Write your Python solution here\nimport sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    # Process input\n    print("Hello, World!")\n\nif __name__ == '__main__':\n    solve()\n`,
  javascript: `// Write your JavaScript (Node.js) solution here\nconst fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    console.log("Hello, World!");\n}\n\nsolve();\n`,
  java: `// Write your Java solution here\nimport java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println("Hello, World!");\n    }\n}\n`,
  c: `// Write your C solution here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
  cpp: `// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`
};

export default function CodingWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Problem State
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Left panel active tab
  const [activeLeftTab, setActiveLeftTab] = useState('description'); // 'description' | 'submissions'
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Editor State
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [execResult, setExecResult] = useState(null);

  // Console Drawer State
  const [consoleTab, setConsoleTab] = useState('testcases'); // 'testcases' | 'custom' | 'output'
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);

  // Load problem details
  useEffect(() => {
    setLoading(true);
    codingApi.getProblemDetail(id)
      .then((data) => {
        setProblem(data);
        // Find starter code for default language (python)
        const starters = data.starter_codes || [];
        const match = starters.find(s => s.language?.toLowerCase() === 'python');
        if (match && match.code) {
          setCode(match.code);
        } else {
          setCode(DEFAULT_STARTER_CODES.python);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load challenge details.');
        setLoading(false);
      });
  }, [id]);

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (!problem) return;
    const starters = problem.starter_codes || [];
    const match = starters.find(s => s.language?.toLowerCase() === newLang.toLowerCase());
    if (match && match.code) {
      setCode(match.code);
    } else {
      setCode(DEFAULT_STARTER_CODES[newLang] || DEFAULT_STARTER_CODES.python);
    }
  };

  // Reset starter code
  const handleResetCode = () => {
    if (!window.confirm('Reset code to starter template? Your current edits in this language will be replaced.')) {
      return;
    }
    const starters = problem?.starter_codes || [];
    const match = starters.find(s => s.language?.toLowerCase() === language.toLowerCase());
    if (match && match.code) {
      setCode(match.code);
    } else {
      setCode(DEFAULT_STARTER_CODES[language] || DEFAULT_STARTER_CODES.python);
    }
  };

  // Load submissions history
  const loadSubmissions = () => {
    if (!problem) return;
    setLoadingSubmissions(true);
    codingApi.getUserSubmissions({ problem_id: problem.id })
      .then(data => setSubmissions(data))
      .catch(err => console.error('Failed to load submissions:', err))
      .finally(() => setLoadingSubmissions(false));
  };

  useEffect(() => {
    if (activeLeftTab === 'submissions') {
      loadSubmissions();
    }
  }, [activeLeftTab]);

  // RUN CODE (against sample or custom input)
  const handleRunCode = async () => {
    if (!problem || isRunning || isSubmitting) return;
    setIsRunning(true);
    setExecResult(null);
    setConsoleTab('testcases');

    try {
      const payload = {
        problem_id: problem.id,
        language,
        code,
        custom_input: useCustomInput ? customInput : null
      };
      const result = await codingApi.runCode(payload);
      setExecResult(result);
      setSelectedTestCaseIdx(0);
    } catch (err) {
      setExecResult({
        status: 'Runtime Error',
        total_test_cases: 1,
        passed_test_cases: 0,
        execution_time_ms: 0,
        memory_used_kb: 0,
        evaluations: [],
        stderr: err.message || 'Execution failed.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // SUBMIT CODE (evaluates hidden test cases)
  const handleSubmitCode = async () => {
    if (!problem || isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setExecResult(null);
    setConsoleTab('testcases');

    try {
      const payload = {
        problem_id: problem.id,
        language,
        code
      };
      const result = await codingApi.submitCode(payload);
      setExecResult(result);
      setSelectedTestCaseIdx(0);

      // Refresh problem solved status if Accepted
      if (result.status === 'Accepted') {
        setProblem(prev => prev ? { ...prev, is_solved: true } : null);
      }
    } catch (err) {
      setExecResult({
        status: 'Compilation Error',
        total_test_cases: 1,
        passed_test_cases: 0,
        execution_time_ms: 0,
        memory_used_kb: 0,
        evaluations: [],
        stderr: err.message || 'Submission evaluation failed.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#0b0f19', color: '#f8fafc', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            Loading Coding Workspace...
          </div>
          <div style={{ color: '#94a3b8' }}>Preparing editor sandbox and verified test cases.</div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div style={{ background: '#0b0f19', color: '#f8fafc', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ margin: '0 0 10px 0' }}>Challenge Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{error || 'Unable to find this coding challenge.'}</p>
          <Link to="/coding/practice" style={{ background: '#00a86b', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
            Back to Practice Arena
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* 1. TOP WORKSPACE TOOLBAR */}
      <header className="workspace-top-bar">
        <div className="workspace-bar-left">
          <Link to="/coding/practice" className="workspace-back-btn">
            <ChevronLeft size={16} />
            <span>Problem List</span>
          </Link>
          <h1 className="workspace-prob-title">
            <span>{problem.title}</span>
            <span className={`diff-pill ${problem.difficulty?.toLowerCase() || 'medium'}`} style={{ fontSize: '0.72rem' }}>
              {problem.difficulty?.toUpperCase()}
            </span>
            {problem.is_solved && (
              <span className="status-solved-badge" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                <Check size={12} />
                <span>Solved</span>
              </span>
            )}
          </h1>
        </div>

        <div className="workspace-bar-right">
          {/* Language selector */}
          <select
            className="lang-select-box"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node)</option>
            <option value="java">Java (OpenJDK)</option>
            <option value="c">C (GCC)</option>
            <option value="cpp">C++ (G++)</option>
          </select>

          {/* Reset Code */}
          <button
            className="btn-ws-action btn-ws-reset"
            onClick={handleResetCode}
            title="Reset to starter code"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          {/* Run Code */}
          <button
            className="btn-ws-action btn-ws-run"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Run against sample/custom input"
          >
            <Play size={15} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Code */}
          <button
            className="btn-ws-action btn-ws-submit"
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            title="Submit against all hidden test cases"
          >
            <Send size={15} />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Code'}</span>
          </button>
        </div>
      </header>

      {/* 2. DUAL-PANEL WORKSPACE BODY */}
      <div className="workspace-split-body">
        {/* ================= LEFT PANEL: STATEMENT & SUBMISSIONS ================= */}
        <section className="workspace-left-panel">
          {/* Tab nav */}
          <div className="workspace-tab-nav">
            <button
              className={`ws-tab-btn ${activeLeftTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveLeftTab('description')}
            >
              <FileText size={16} />
              <span>Problem Description</span>
            </button>
            <button
              className={`ws-tab-btn ${activeLeftTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveLeftTab('submissions')}
            >
              <History size={16} />
              <span>Submissions</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="workspace-tab-content">
            {activeLeftTab === 'description' ? (
              <div>
                {/* Topic tags */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {problem.category || 'Basic Programming'}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {problem.topic}
                  </span>
                </div>

                {/* Problem Statement */}
                <div className="problem-statement-text">
                  {problem.description}
                </div>

                {/* Input Format */}
                {problem.input_format && (
                  <div className="problem-spec-section">
                    <h4 className="problem-spec-title">Input Format</h4>
                    <div className="spec-code-block">{problem.input_format}</div>
                  </div>
                )}

                {/* Output Format */}
                {problem.output_format && (
                  <div className="problem-spec-section">
                    <h4 className="problem-spec-title">Output Format</h4>
                    <div className="spec-code-block">{problem.output_format}</div>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="problem-spec-section">
                    <h4 className="problem-spec-title">Constraints</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                      {problem.constraints.map((c, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Test Cases / Examples */}
                {problem.sample_test_cases && problem.sample_test_cases.length > 0 && (
                  <div className="problem-spec-section">
                    <h4 className="problem-spec-title">Sample Inputs &amp; Outputs</h4>
                    {problem.sample_test_cases.map((sample, idx) => (
                      <div key={idx} style={{ marginBottom: '16px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                          Sample Case {idx + 1}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Input:</span>
                          <pre style={{ margin: '4px 0 0 0', background: '#0b0f19', padding: '8px', borderRadius: '4px', color: '#e2e8f0', fontSize: '0.85rem' }}>
                            {sample.input || '(No input)'}
                          </pre>
                        </div>
                        <div style={{ marginBottom: sample.explanation ? '8px' : '0' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Output:</span>
                          <pre style={{ margin: '4px 0 0 0', background: '#0b0f19', padding: '8px', borderRadius: '4px', color: '#34d399', fontSize: '0.85rem' }}>
                            {sample.expected_output}
                          </pre>
                        </div>
                        {sample.explanation && (
                          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px' }}>
                            <strong>Explanation:</strong> {sample.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px 0' }}>
                  My Submissions History
                </h3>
                {loadingSubmissions ? (
                  <div style={{ color: '#94a3b8', padding: '20px 0' }}>Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div style={{ color: '#94a3b8', padding: '20px 0' }}>
                    No submissions recorded yet for this challenge. Click <strong>Submit Code</strong> to test your solution!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          background: '#0f172a',
                          border: '1px solid #1f2937',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                color: sub.status === 'Accepted' ? '#34d399' : '#f87171'
                              }}
                            >
                              {sub.status}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>
                              {sub.language}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Passed: {sub.passed_test_cases}/{sub.total_test_cases} • Time: {sub.execution_time_ms} ms
                          </div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'right' }}>
                          {new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ================= RIGHT PANEL: CODE EDITOR & CONSOLE ================= */}
        <section className="workspace-right-panel">
          {/* Monaco Editor Container */}
          <div className="editor-wrapper-area">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'c' || language === 'cpp' ? 'cpp' : (language === 'javascript' ? 'javascript' : (language === 'java' ? 'java' : 'python'))}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: false,
                cursorBlinking: 'smooth',
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* ================= CONSOLE DRAWER ================= */}
          <div
            className="workspace-console-drawer"
            style={{ height: isConsoleExpanded ? '60vh' : '260px' }}
          >
            {/* Drawer Header */}
            <div className="console-drawer-header">
              <div className="console-tabs-row">
                <button
                  className={`console-tab-item ${consoleTab === 'testcases' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('testcases')}
                >
                  <span>Test Results</span>
                </button>
                <button
                  className={`console-tab-item ${consoleTab === 'custom' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('custom')}
                >
                  <span>Custom Input</span>
                </button>
                <button
                  className={`console-tab-item ${consoleTab === 'output' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('output')}
                >
                  <span>Console Logs</span>
                </button>
              </div>

              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                title={isConsoleExpanded ? 'Minimize Console' : 'Expand Console'}
              >
                {isConsoleExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>

            {/* Drawer Content */}
            <div className="console-drawer-content">
              {/* Tab 1: Test Cases Evaluation */}
              {consoleTab === 'testcases' && (
                <div>
                  {execResult ? (
                    <div>
                      {/* Verdict Banner */}
                      <div
                        className={`verdict-banner ${
                          execResult.status === 'Accepted'
                            ? 'accepted'
                            : execResult.status === 'Wrong Answer'
                            ? 'wrong'
                            : 'error'
                        }`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {execResult.status === 'Accepted' ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <XCircle size={18} />
                          )}
                          <span>{execResult.status}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                          {execResult.passed_test_cases} / {execResult.total_test_cases} Test Cases Passed • {execResult.execution_time_ms} ms
                        </div>
                      </div>

                      {/* Test Case Selection Pills */}
                      {execResult.evaluations && execResult.evaluations.length > 0 && (
                        <div>
                          <div className="tc-pills-row">
                            {execResult.evaluations.map((tc, idx) => (
                              <button
                                key={idx}
                                className={`tc-pill-btn ${selectedTestCaseIdx === idx ? 'active' : ''}`}
                                onClick={() => setSelectedTestCaseIdx(idx)}
                              >
                                {tc.status === 'Passed' ? (
                                  <Check size={12} color="#34d399" />
                                ) : (
                                  <XCircle size={12} color="#f87171" />
                                )}
                                <span>{tc.is_hidden ? `Hidden #${idx + 1}` : `Case ${idx + 1}`}</span>
                              </button>
                            ))}
                          </div>

                          {/* Selected Test Case Detail */}
                          {execResult.evaluations[selectedTestCaseIdx] && (
                            <div className="tc-eval-box">
                              {execResult.evaluations[selectedTestCaseIdx].is_hidden ? (
                                <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '12px' }}>
                                  🔒 Hidden test case content is protected to prevent evaluation tampering.
                                  Status: <strong>{execResult.evaluations[selectedTestCaseIdx].status}</strong>
                                </div>
                              ) : (
                                <>
                                  <div className="tc-eval-field">
                                    <label>Input:</label>
                                    <pre>{execResult.evaluations[selectedTestCaseIdx].input || '(Empty Input)'}</pre>
                                  </div>
                                  <div className="tc-eval-field">
                                    <label>Expected Output:</label>
                                    <pre>{execResult.evaluations[selectedTestCaseIdx].expected_output}</pre>
                                  </div>
                                  <div className="tc-eval-field">
                                    <label>Your Actual Output:</label>
                                    <pre style={{
                                      color: execResult.evaluations[selectedTestCaseIdx].status === 'Passed' ? '#34d399' : '#f87171'
                                    }}>
                                      {execResult.evaluations[selectedTestCaseIdx].actual_output || '(No output produced)'}
                                    </pre>
                                  </div>
                                  {execResult.evaluations[selectedTestCaseIdx].error_message && (
                                    <div className="tc-eval-field">
                                      <label style={{ color: '#f87171' }}>Error Message:</label>
                                      <pre style={{ color: '#f87171' }}>
                                        {execResult.evaluations[selectedTestCaseIdx].error_message}
                                      </pre>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', textAlign: 'center', padding: '32px 0' }}>
                      Click <strong>Run Code</strong> to test against sample inputs, or <strong>Submit Code</strong> to evaluate all hidden verification cases.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Custom Input */}
              {consoleTab === 'custom' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      id="enable-custom-input"
                      checked={useCustomInput}
                      onChange={(e) => setUseCustomInput(e.target.checked)}
                    />
                    <label htmlFor="enable-custom-input" style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, cursor: 'pointer' }}>
                      Test with Custom Input when clicking "Run Code"
                    </label>
                  </div>
                  <textarea
                    className="custom-input-textarea"
                    placeholder="Enter custom standard input here..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                </div>
              )}

              {/* Tab 3: Console Logs */}
              {consoleTab === 'output' && (
                <div>
                  {execResult ? (
                    <div>
                      {execResult.stdout && (
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Standard Output:</span>
                          <pre style={{ margin: '4px 0 0 0', background: '#0b0f19', padding: '10px', borderRadius: '6px', color: '#e2e8f0' }}>
                            {execResult.stdout}
                          </pre>
                        </div>
                      )}
                      {execResult.stderr && (
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>Standard Error / Compiler Logs:</span>
                          <pre style={{ margin: '4px 0 0 0', background: '#0b0f19', padding: '10px', borderRadius: '6px', color: '#f87171' }}>
                            {execResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', textAlign: 'center', padding: '32px 0' }}>
                      No execution output yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
