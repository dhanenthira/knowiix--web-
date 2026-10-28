import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ResponsiveAppShell } from './theme';
// Admin Components & Pages
import Sidebar from './admin/components/Sidebar';
import Dashboard from './admin/pages/Dashboard';
import Students from './admin/pages/Students';
import Questions from './admin/pages/Questions';
import AptitudeManagement from './admin/pages/AptitudeManagement';
import TechnicalManagement from './admin/pages/TechnicalManagement';
import Assessments from './admin/pages/Assessments';
import BattlesMonitor from './admin/pages/BattlesMonitor';
import Analytics from './admin/pages/Analytics';

// User Pages
import UserDashboard from './user/pages/dashboard/UserDashboard';
import Learning from './user/pages/learning/Learning';
import Profile from './user/pages/profile/Profile';
import Aptitude from './user/pages/aptitude/Aptitude';
import TechnicalPractice from './user/pages/technical/TechnicalPractice';
import TechnicalWorkspace from './user/pages/technical/TechnicalWorkspace';
import AssessmentResults from './user/pages/assessments/AssessmentResults';
import DailyPractice from './user/pages/daily-practice/DailyPractice';

// Shared Components & Pages
import Navbar from './shared/components/navbar';
import Landing from './shared/pages/Landing';
import Login from './shared/pages/Login';
import Register from './shared/pages/Register';
import ForgotPassword from './shared/pages/ForgotPassword';

function ProtectedLayout() {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (admin.role !== 'admin') {
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="admin-app-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color, var(--color-bg, #f8fafc))' }}>
      <Navbar variant="admin" />
      <div className="admin-layout" style={{ flex: 1, display: 'flex' }}>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

function MainRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      {/* Public Landing, Login, Register, Forgot Password & Student Dashboard */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/student" element={<UserDashboard />} />
      <Route path="/student/dashboard" element={<UserDashboard />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/learning" element={<Learning />} />
      <Route path="/notes" element={<Learning />} />
      <Route path="/student/learning" element={<Learning />} />
      <Route path="/learning-notes" element={<Learning />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/student/profile" element={<Profile />} />
      {(!admin || admin?.role !== 'admin') && (
        <>
          <Route path="/aptitude" element={<Aptitude />} />
          <Route path="/aptitude/test" element={<Aptitude />} />
        </>
      )}
      <Route path="/student/aptitude" element={<Aptitude />} />
      <Route path="/student/aptitude/test" element={<Aptitude />} />
      <Route path="/student/aptitude/practice" element={<Aptitude />} />

      {/* Assessments & Results Page */}
      <Route path="/assessments" element={<AssessmentResults />} />
      <Route path="/student/assessments" element={<AssessmentResults />} />
      <Route path="/assessments/results" element={<AssessmentResults />} />

      {/* Daily Practice (5 Aptitude + 1 Technical Problem) */}
      <Route path="/daily-practice" element={<DailyPractice />} />
      <Route path="/student/daily-practice" element={<DailyPractice />} />

      {/* Student Technical Practice & Multi-Language Workspace (Java, Python, C, C++) */}
      <Route path="/technical" element={<TechnicalPractice />} />
      <Route path="/technical/practice" element={<TechnicalPractice />} />
      <Route path="/technical/problem/:id" element={<TechnicalWorkspace />} />
      <Route path="/student/technical" element={<TechnicalPractice />} />
      <Route path="/student/technical/:id" element={<TechnicalWorkspace />} />
      <Route path="/practice/technical" element={<TechnicalPractice />} />
      <Route path="/practice/technical/:id" element={<TechnicalWorkspace />} />

      {/* Aliases for backwards compatibility */}
      <Route path="/coding/practice" element={<TechnicalPractice />} />
      <Route path="/coding/problem/:id" element={<TechnicalWorkspace />} />
      <Route path="/student/coding" element={<TechnicalPractice />} />
      <Route path="/student/coding/:id" element={<TechnicalWorkspace />} />
      <Route path="/practice/coding" element={<TechnicalPractice />} />
      <Route path="/practice/coding/:id" element={<TechnicalWorkspace />} />
      {(!admin || admin?.role !== 'admin') && (
        <Route path="/coding" element={<TechnicalPractice />} />
      )}

      {/* Protected Routes with Unified Layout */}
      <Route element={<ProtectedLayout />}>
        {admin && <Route path="/" element={<Dashboard />} />}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/aptitude" element={<AptitudeManagement />} />
        <Route path="/admin/aptitude" element={<AptitudeManagement />} />
        <Route path="/aptitude-admin" element={<AptitudeManagement />} />
        <Route path="/coding" element={<TechnicalManagement />} />
        <Route path="/technical-admin" element={<TechnicalManagement />} />
        <Route path="/admin/assessments" element={<Assessments />} />
        <Route path="/battles" element={<BattlesMonitor />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>

      {/* Unauthenticated Home / Landing */}
      {!admin && <Route path="/" element={<Landing />} />}

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <ResponsiveAppShell>
          <MainRoutes />
        </ResponsiveAppShell>
      </AuthProvider>
    </UIProvider>
  );
}
