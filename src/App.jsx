import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
// Admin Components & Pages
import Sidebar from './admin/components/Sidebar';
import Dashboard from './admin/pages/Dashboard';
import Students from './admin/pages/Students';
import Questions from './admin/pages/Questions';
import CodingManagement from './admin/pages/CodingManagement';
import Assessments from './admin/pages/Assessments';
import BattlesMonitor from './admin/pages/BattlesMonitor';
import Analytics from './admin/pages/Analytics';

// User Pages
import UserDashboard from './user/pages/dashboard/UserDashboard';
import Learning from './user/pages/learning/Learning';
import Profile from './user/pages/profile/Profile';
import Aptitude from './user/pages/aptitude/Aptitude';
import CodingPractice from './user/pages/coding/CodingPractice';
import CodingWorkspace from './user/pages/coding/CodingWorkspace';

// Shared Components & Pages
import Navbar from './shared/components/navbar';
import Landing from './shared/pages/Landing';
import Login from './shared/pages/Login';
import Register from './shared/pages/Register';

function ProtectedLayout() {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (admin.role !== 'admin') {
    return <Navigate to="/student" replace />;
  }

  return (
    <UIProvider>
      <div className="admin-app-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg, #f8fafc)' }}>
        <Navbar variant="admin" />
        <div className="admin-layout" style={{ flex: 1, display: 'flex' }}>
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </UIProvider>
  );
}

function MainRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      {/* Public Landing, Login, Register & Student Dashboard */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
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
      <Route path="/aptitude" element={<Aptitude />} />
      <Route path="/student/aptitude" element={<Aptitude />} />
      <Route path="/aptitude/test" element={<Aptitude />} />

      {/* Student Coding Practice & Two-Panel Workspace */}
      <Route path="/coding/practice" element={<CodingPractice />} />
      <Route path="/coding/problem/:id" element={<CodingWorkspace />} />
      <Route path="/student/coding" element={<CodingPractice />} />
      <Route path="/student/coding/:id" element={<CodingWorkspace />} />
      <Route path="/practice/coding" element={<CodingPractice />} />
      <Route path="/practice/coding/:id" element={<CodingWorkspace />} />
      {(!admin || admin?.role !== 'admin') && (
        <Route path="/coding" element={<CodingPractice />} />
      )}

      {/* Protected Routes with Unified Layout (Uses Outlet, eliminating descendant Routes warning) */}
      <Route element={<ProtectedLayout />}>
        {admin && <Route path="/" element={<Dashboard />} />}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/coding" element={<CodingManagement />} />
        <Route path="/assessments" element={<Assessments />} />
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
    <AuthProvider>
      <MainRoutes />
    </AuthProvider>
  );
}
