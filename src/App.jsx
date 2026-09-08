import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GymProvider, useGym } from './context/GymContext';
import BiometricModal from './components/BiometricModal';
import AddMemberModal from './components/AddMemberModal';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import './index.css';

function MainAppContent() {
  const { user, toast } = useGym();

  const isAuthenticated = Boolean(user);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050811', color: '#f9fafb' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Gym Owner Admin Routes */}
          <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <LoginPage />} />
          <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />} />

          {/* User / Member routes redirect to admin for now as requested */}
          <Route path="/user" element={<Navigate to="/admin" replace />} />
          <Route path="/user/login" element={<Navigate to="/admin" replace />} />

          {/* Generic Login Route */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Modals */}
      <BiometricModal />
      <AddMemberModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="toast-notification">
          {toast.type === 'success' && <CheckCircle2 color="#10b981" size={20} />}
          {toast.type === 'danger' && <AlertCircle color="#ef4444" size={20} />}
          {toast.type === 'info' && <Info color="#0ea5e9" size={20} />}
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <MainAppContent />
    </GymProvider>
  );
}
