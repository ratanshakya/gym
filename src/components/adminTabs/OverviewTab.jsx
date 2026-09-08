import React from 'react';
import { useGym } from '../../context/GymContext';
import { Users, CreditCard, Activity, Clock, ShieldAlert, ArrowUpRight, Plus, Fingerprint, MessageSquare, AlertCircle } from 'lucide-react';

export default function OverviewTab() {
  const { data, user, setActiveTab, setShowAddMemberModal, setShowBiometricModal } = useGym();

  const totalMembers = data.members.length;
  const activeMembers = data.members.filter(m => m.status === 'Active').length;
  const expiringMembers = data.members.filter(m => m.status === 'Expiring').length;
  const todayCheckins = (data.biometricLogs || []).filter(l => l.date === 'Today').length;

  const currentMonth = new Date().toISOString().split('-')[1];
  const currentYear = new Date().toISOString().split('-')[0];
  const monthlyRenewals = data.members.filter(m => {
    if (!m.isRenewed || !m.lastRenewedDate) return false;
    const [year, month] = m.lastRenewedDate.split('-');
    return year === currentYear && month === currentMonth;
  }).length;

  // Dynamic calculations based on actual gym database records

  const totalPendingDues = data.members.reduce((sum, m) => sum + (Number(m.dueAmount) || 0), 0);
  const formattedPendingDues = `₹${totalPendingDues.toLocaleString('en-IN')}`;

  const gymDisplayName = user?.gymName || data.gymInfo?.name || "EasyGym Fitness Hub";
  const gymBranchName = user?.branch || data.gymInfo?.branch || "Main Branch";
  const ownerDisplayName = user?.name || "Gym Owner";

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>
            <Activity size={14} /> EasyGym Automated Access Control Online
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#f9fafb' }}>Welcome back, {ownerDisplayName} 👋</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Here is your live gym operation summary for <strong style={{ color: '#f9fafb' }}>{gymDisplayName}</strong> ({gymBranchName}).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowAddMemberModal(true)} className="btn btn-primary">
            <Plus size={16} /> Register New Member
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Users />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Active Members</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{activeMembers} <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>/ {totalMembers}</span></h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>Live Gym Roster</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Today&apos;s Check-ins</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{todayCheckins}</h3>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '600' }}>Live Gate Scanner Feed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <ShieldAlert />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Expiring Members</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{expiringMembers}</h3>
            <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: '600' }}>Pending Dues: {formattedPendingDues}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Activity />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Monthly Renewals</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{monthlyRenewals}</h3>
            <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '600' }}>Renewed this month</span>
          </div>
        </div>
      </div>


    </div>
  );
}
