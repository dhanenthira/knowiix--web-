import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import Students from './pages/Students';
import Questions from './pages/Questions';
import CodingManagement from './pages/CodingManagement';
import Assessments from './pages/Assessments';
import BattlesMonitor from './pages/BattlesMonitor';
import Analytics from './pages/Analytics';

function ProtectedLayout() {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <UIProvider>
      <div className="admin-layout">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student" element={<UserDashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/coding" element={<CodingManagement />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/battles" element={<BattlesMonitor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </UIProvider>
  );
}

function MainRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      {/* Public Landing, Login & Student Dashboard */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<UserDashboard />} />
      <Route path="/student/dashboard" element={<UserDashboard />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />

      {/* If admin logged in, root goes to Dashboard; otherwise shows SkillPrep Landing */}
      <Route path="/" element={admin ? <ProtectedLayout /> : <Landing />} />

      {/* Protected routes */}
      <Route path="/*" element={<ProtectedLayout />} />
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
