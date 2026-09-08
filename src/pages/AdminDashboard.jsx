import React from 'react';
import { useGym } from '../context/GymContext';
import OverviewTab from '../components/adminTabs/OverviewTab';
import MembersTab from '../components/adminTabs/MembersTab';
import BiometricTab from '../components/adminTabs/BiometricTab';
import POSTab from '../components/adminTabs/POSTab';
import SchedulerTab from '../components/adminTabs/SchedulerTab';
import WhatsAppTab from '../components/adminTabs/WhatsAppTab';
import FinancialsTab from '../components/adminTabs/FinancialsTab';
import SettingsTab from '../components/adminTabs/SettingsTab';
import GymFeesTab from '../components/adminTabs/GymFeesTab';
import { LayoutDashboard, Users, Fingerprint, ShoppingBag, Calendar, MessageSquare, DollarSign, Settings, Tag, Dumbbell, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { activeTab, setActiveTab, logout, data, user } = useGym();

  const ownerName = user?.name || "Gym Owner";
  const initials = ownerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "GO";
  const gymName = user?.gymName || data.gymInfo?.name || "EasyGym Hub";
  const branchName = user?.branch || data.gymInfo?.branch || "Main Branch";

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, color: '#38bdf8' }, // Cyan
    { id: 'members', label: 'Members Directory', icon: Users, color: '#f59e0b' }, // Amber
    { id: 'biometric', label: 'Biometric Gate Logs', icon: Fingerprint, color: '#10b981' }, // Emerald
    { id: 'pos', label: 'POS & Store Billing', icon: ShoppingBag, color: '#a855f7' }, // Purple
    { id: 'scheduler', label: 'Trainer Timetable', icon: Calendar, color: '#f43f5e' }, // Rose
    { id: 'whatsapp', label: 'WhatsApp Automation', icon: MessageSquare, color: '#22c55e' }, // Green
    { id: 'financials', label: 'Revenue & Reports', icon: DollarSign, color: '#eab308' }, // Yellow
    { id: 'gymfees', label: 'Gym Fees & Plans', icon: Tag, color: '#0ea5e9' }, // Light Blue
    { id: 'settings', label: 'Gym Settings', icon: Settings, color: '#9ca3af' }, // Gray
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#10b981', color: '#000', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ fontSize: '0.85rem', color: '#f9fafb', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{ownerName}</strong>
              <span style={{ fontSize: '0.73rem', color: '#34d399', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Gym Owner (Admin)</span>
            </div>
          </div>

          <div className="sidebar-menu">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} color={item.color} style={{ filter: isActive ? `drop-shadow(0 0 6px ${item.color}80)` : 'none' }} />
                  <span style={{ color: isActive ? '#f9fafb' : '#9ca3af', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s ease'
            }}
            title="Click to manage Gym Logo & Settings"
          >
            {data.gymInfo?.logo ? (
              <img
                src={data.gymInfo.logo}
                alt="Gym Logo"
                style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(16, 185, 129, 0.4)', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flexShrink: 0 }}>
                <Dumbbell size={20} />
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#f9fafb', lineHeight: '1.2', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{gymName}</h3>
              <p style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{branchName.toUpperCase()}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="sidebar-link"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={16} /> Admin Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'biometric' && <BiometricTab />}
        {activeTab === 'pos' && <POSTab />}
        {activeTab === 'scheduler' && <SchedulerTab />}
        {activeTab === 'whatsapp' && <WhatsAppTab />}
        {activeTab === 'financials' && <FinancialsTab />}
        {activeTab === 'gymfees' && <GymFeesTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}
