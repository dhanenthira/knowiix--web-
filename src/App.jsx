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

function ProtectedLayout() {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <UIProvider>
      <div className="admin-layout">
        <Sidebar />
        <Outlet />
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
