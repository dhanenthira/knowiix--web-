import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import Students from './pages/Students';
import Questions from './pages/Questions';
import CodingManagement from './pages/CodingManagement';
import Assessments from './pages/Assessments';
import BattlesMonitor from './pages/BattlesMonitor';
import Analytics from './pages/Analytics';
import Learning from './pages/Learning';
import Profile from './pages/Profile';
import Aptitude from './pages/Aptitude';
import CodingPractice from './pages/CodingPractice';
import CodingWorkspace from './pages/CodingWorkspace';
import Navbar from './components/navbar';

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
