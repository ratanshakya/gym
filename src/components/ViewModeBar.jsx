import React from 'react';
import { useGym } from '../context/GymContext';
import { Shield, Fingerprint, LayoutDashboard, Globe, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ViewModeBar() {
  const { setViewMode, setShowBiometricModal, user, logout, data } = useGym();
  const navigate = useNavigate();

  return (
    <div className="view-mode-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '700' }}>
          <Shield size={16} />
          <span>EasyGym Software Pro</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
          Branch: <strong style={{ color: '#f9fafb' }}>{data.gymInfo?.branch || 'Central Hub'}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => setShowBiometricModal(true)}
          className="btn btn-sm"
          style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', cursor: 'pointer' }}
        >
          <Fingerprint size={14} />
          Simulate Biometric Gate Check-in
        </button>

        <div className="view-mode-pill">
          <button
            onClick={() => { setViewMode('landing'); navigate('/'); }}
          >
            <Globe size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Public SaaS Site
          </button>
          <button
            onClick={() => { setViewMode('admin'); navigate('/admin'); }}
          >
            <LayoutDashboard size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Owner Admin Portal
          </button>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem' }}>
            <span style={{ color: '#34d399', fontWeight: '700' }}>● {user.name} ({user.role})</span>
            <button onClick={logout} title="Logout" style={{ color: '#ef4444', padding: '2px', cursor: 'pointer', background: 'none', border: 'none' }}>
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button onClick={() => { setViewMode('login'); navigate('/login'); }} className="btn btn-sm btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem', cursor: 'pointer' }}>
            Owner Sign In
          </button>
        )}
      </div>
    </div>
  );
}
