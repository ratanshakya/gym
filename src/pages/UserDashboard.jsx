import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { useNavigate } from 'react-router-dom';
import { User, Dumbbell, ShieldCheck, QrCode, Calendar, Clock, CreditCard, Award, CheckCircle2, AlertCircle, LogOut, Sparkles, ChevronRight, Activity, Phone, Mail, MapPin, Zap, Fingerprint } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function UserDashboard() {
  const { user, logout, data, processBiometricPunch } = useGym();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showPhoneScanner, setShowPhoneScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle');
  const [logTypeFilter, setLogTypeFilter] = useState('all');

  // Member subtab pagination states
  const [pageLogs, setPageLogs] = useState(1);
  const [perPageLogs, setPerPageLogs] = useState(5);
  const [pageInvoices, setPageInvoices] = useState(1);
  const [perPageInvoices, setPerPageInvoices] = useState(5);

  // Fallback member data if logged in user detail matches or demo fallback
  const currentMember = data.members.find(m => m.email === user?.email || m.phone === user?.phone) || {
    id: 'MEM-1001',
    name: user?.name || 'Rahul Sharma',
    phone: user?.phone || '+91 98765 43210',
    email: user?.email || 'rahul.sharma@example.com',
    plan: 'Gold Annual Pass (12 Months)',
    joinDate: '2025-09-15',
    expiryDate: '2026-09-15',
    status: 'Active',
    dueAmount: 0,
    biometricStatus: 'Registered (Facial + Fingerprint)',
    attendanceToday: true,
    lastCheckIn: '07:45 AM Today'
  };

  const memberInvoices = data.invoices.filter(inv => inv.member === currentMember.name || inv.member === 'Walk-in Customer') || [];
  const memberLogs = data.biometricLogs.filter(log => log.memberId === currentMember.id || log.memberName === currentMember.name);

  const filteredMemberLogs = memberLogs.filter(log => {
    if (logTypeFilter === 'mobile') return log.method.includes('Mobile');
    if (logTypeFilter === 'hardware') return !log.method.includes('Mobile');
    return true;
  });

  const totalLogPages = Math.ceil(filteredMemberLogs.length / perPageLogs) || 1;
  const paginatedLogs = filteredMemberLogs.slice((pageLogs - 1) * perPageLogs, pageLogs * perPageLogs);

  const totalInvoicePages = Math.ceil(memberInvoices.length / perPageInvoices) || 1;
  const paginatedInvoices = memberInvoices.slice((pageInvoices - 1) * perPageInvoices, pageInvoices * perPageInvoices);

  return (
    <div style={{ minHeight: '100vh', background: '#050811', color: '#f9fafb', paddingBottom: '60px' }}>
      
      {/* Top Member Header */}
      <header style={{ background: 'rgba(17, 24, 39, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', sticky: 'top', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>EasyGym Member Portal</h2>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700' }}>● Active Member Session</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#000', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                {currentMember.name.substring(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{currentMember.name}</span>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="container" style={{ marginTop: '32px' }}>
        
        {/* Welcome Banner */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 60%), #111827', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-active" style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={12} /> EasyGym Verified Pass
              </span>
              <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Welcome, {currentMember.name}!</h1>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
                Branch: <strong style={{ color: '#f9fafb' }}>Central Hub - Sector 18</strong> | Locker Assigned: <strong style={{ color: '#34d399' }}>#L-42</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowPhoneScanner(true)}
                className="btn btn-primary"
                style={{ padding: '14px 24px', fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Fingerprint size={18} /> Tap to Unlock Gate
              </button>
              <button
                onClick={() => processBiometricPunch(currentMember.id, 'Mobile QR Scan')}
                className="btn btn-secondary"
                style={{ padding: '14px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <QrCode size={18} /> QR Pass
              </button>
            </div>
          </div>
        </div>

        {/* Member Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '28px' }}>
          
          {/* Left Column: Digital Membership Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(145deg, #131c2e 0%, #0d1322 100%)', border: '1px solid rgba(56, 189, 248, 0.3)', position: 'relative', overflow: 'hidden' }}>
              
              {/* Decorative accent glow */}
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', filter: 'blur(30px)' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#38bdf8" />
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', letterSpacing: '1px', color: '#38bdf8' }}>DIGITAL GYM PASS</span>
                </div>
                <span className="badge badge-active">{currentMember.status}</span>
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#000', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)' }}>
                  {currentMember.name.substring(0, 2).toUpperCase()}
                </div>
                <h3 style={{ fontSize: '1.3rem' }}>{currentMember.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>ID: <strong style={{ color: '#f9fafb' }}>{currentMember.id}</strong></p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Current Membership:</span>
                  <strong style={{ color: '#34d399' }}>{currentMember.plan}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Valid Until:</span>
                  <strong>{currentMember.expiryDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Biometric Hardware:</span>
                  <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: '600' }}>✓ Face & Fingerprint</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Account Dues:</span>
                  <strong style={{ color: currentMember.dueAmount > 0 ? '#ef4444' : '#34d399' }}>
                    {currentMember.dueAmount > 0 ? `₹${currentMember.dueAmount} Pending` : '₹0 (Clear)'}
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                <QrCode size={80} style={{ margin: '0 auto', opacity: '0.85' }} />
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginTop: '6px' }}>Scan code at turnstile gate reader</span>
              </div>
            </div>

            {/* Assigned Trainer Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#f59e0b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} /> Assigned Personal Trainer:
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100" alt="Trainer" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ fontSize: '0.95rem', display: 'block' }}>Vikram Singh</strong>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Senior Fitness & CrossFit Coach</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Member Details & History Tabs */}
          <div>
            
            {/* Tabs Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`btn btn-sm ${activeSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Activity size={14} /> My Overview
              </button>
              <button
                onClick={() => setActiveSubTab('schedule')}
                className={`btn btn-sm ${activeSubTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Calendar size={14} /> Class Timetable
              </button>
              <button
                onClick={() => setActiveSubTab('logs')}
                className={`btn btn-sm ${activeSubTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Clock size={14} /> Biometric Check-ins
              </button>
              <button
                onClick={() => setActiveSubTab('invoices')}
                className={`btn btn-sm ${activeSubTab === 'invoices' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <CreditCard size={14} /> Receipts & Bills
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeSubTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Stats row */}
                <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="stat-card">
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Total Workouts</span>
                    <h3 style={{ fontSize: '1.6rem', color: '#10b981', margin: '4px 0' }}>18 Sessions</h3>
                    <span style={{ fontSize: '0.75rem', color: '#34d399' }}>This Month</span>
                  </div>
                  <div className="stat-card">
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pass Days Left</span>
                    <h3 style={{ fontSize: '1.6rem', color: '#38bdf8', margin: '4px 0' }}>207 Days</h3>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Auto-Renewal On</span>
                  </div>
                  <div className="stat-card">
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Today's Check-in</span>
                    <h3 style={{ fontSize: '1.6rem', color: '#f59e0b', margin: '4px 0' }}>{currentMember.lastCheckIn}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Gate #1 Verified</span>
                  </div>
                </div>

                {/* Workout Routine Card */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="#10b981" /> Assigned Daily Fitness Roster
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', display: 'block' }}>Chest & Triceps Hypertrophy</strong>
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>4 Sets Bench Press, Incline Dumbbell Press, Cable Flyes</span>
                      </div>
                      <span className="badge badge-active">Today's Target</span>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', display: 'block' }}>Evening HIIT Conditioning Class</strong>
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>06:30 PM - 07:15 PM | Studio A</span>
                      </div>
                      <span className="badge badge-expiring">Booked</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Class Timetable */}
            {activeSubTab === 'schedule' && (
              <div className="glass-card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Gym Class Schedule & Booking</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.classes.map(c => (
                    <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dark)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '1rem', color: '#f9fafb', display: 'block' }}>{c.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Time: {c.time} | Trainer: {c.trainer}</span>
                      </div>
                      <button onClick={() => processBiometricPunch(currentMember.id, 'Class Slot Reserved')} className="btn btn-sm btn-primary">
                        Reserve Spot ({c.availableSlots} left)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Biometric Gate Logs */}
            {activeSubTab === 'logs' && (
              <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} color="#38bdf8" /> Entry Logs & Attendance
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button onClick={() => { setLogTypeFilter('all'); setPageLogs(1); }} className={`btn btn-sm ${logTypeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}>All Entries</button>
                    <button onClick={() => { setLogTypeFilter('hardware'); setPageLogs(1); }} className={`btn btn-sm ${logTypeFilter === 'hardware' ? 'btn-primary' : 'btn-secondary'}`}><Fingerprint size={14} /> Physical Gate</button>
                    <button onClick={() => { setLogTypeFilter('mobile'); setPageLogs(1); }} className={`btn btn-sm ${logTypeFilter === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}><Phone size={14} /> Mobile App</button>
                  </div>
                </div>
                
                <div style={{ padding: '24px' }}>
                  {filteredMemberLogs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {paginatedLogs.map(log => (
                        <div key={log.id} style={{ 
                          background: 'rgba(255,255,255,0.02)', 
                          border: '1px solid rgba(255,255,255,0.05)', 
                          padding: '16px', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          transition: 'transform 0.2s, background 0.2s'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ 
                              width: '44px', height: '44px', 
                              borderRadius: '10px', 
                              background: log.accessCode === 'OK' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                              color: log.accessCode === 'OK' ? '#10b981' : '#ef4444', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                              {log.method.includes('Mobile') ? <Phone size={20} /> : <Fingerprint size={20} />}
                            </div>
                            <div>
                              <strong style={{ fontSize: '1rem', display: 'block', color: '#f9fafb' }}>
                                {log.method.includes('Mobile') ? 'Mobile Keyless Entry' : log.device}
                              </strong>
                              <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <Calendar size={12} /> {log.date} at {log.time} • {log.method}
                              </span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`badge ${log.accessCode === 'OK' ? 'badge-active' : 'badge-expired'}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                              {log.status}
                            </span>
                            <span style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280', marginTop: '6px' }}>ID: {log.id}</span>
                          </div>
                        </div>
                      ))}

                      <div style={{ marginTop: '10px' }}>
                        <Pagination
                          currentPage={pageLogs}
                          totalPages={totalLogPages}
                          onPageChange={setPageLogs}
                          totalItems={filteredMemberLogs.length}
                          itemsPerPage={perPageLogs}
                          onItemsPerPageChange={(num) => {
                            setPerPageLogs(num);
                            setPageLogs(1);
                          }}
                          itemLabel="logs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <Fingerprint size={40} color="#4b5563" style={{ margin: '0 auto 12px', display: 'block' }} />
                      <h5 style={{ fontSize: '1rem', color: '#d1d5db', marginBottom: '8px' }}>No Entry Logs Found</h5>
                      <p style={{ fontSize: '0.85rem' }}>You haven't checked into the gym yet. Use your mobile app or scan at the turnstile gate to log your first entry!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Invoices & Bills */}
            {activeSubTab === 'invoices' && (
              <div className="glass-card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Billing & Invoices</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {memberInvoices.length > 0 ? (
                    <>
                      {paginatedInvoices.map(inv => (
                        <div key={inv.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dark)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>Invoice #{inv.id}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'block' }}>Date: {inv.date} | Payment Method: {inv.method}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>₹{inv.total}</strong>
                            <span className="badge badge-active" style={{ display: 'block', marginTop: '2px' }}>{inv.status}</span>
                          </div>
                        </div>
                      ))}

                      <Pagination
                        currentPage={pageInvoices}
                        totalPages={totalInvoicePages}
                        onPageChange={setPageInvoices}
                        totalItems={memberInvoices.length}
                        itemsPerPage={perPageInvoices}
                        onItemsPerPageChange={(num) => {
                          setPerPageInvoices(num);
                          setPageInvoices(1);
                        }}
                        itemLabel="invoices"
                      />
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
                      No invoices recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Mobile Biometric Scanner Simulation Modal */}
      {showPhoneScanner && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '340px', padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#f9fafb' }}>Verify Identity</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '30px' }}>Use your phone's fingerprint to unlock the gym turnstile gate.</p>
            
            <div 
              onClick={() => {
                if (scanStatus !== 'idle') return;
                setScanStatus('scanning');
                setTimeout(() => {
                  setScanStatus('success');
                  processBiometricPunch(currentMember.id, 'Mobile Biometric App');
                  setTimeout(() => {
                    setShowPhoneScanner(false);
                    setScanStatus('idle');
                  }, 1200);
                }, 1500);
              }}
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: scanStatus === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.1)', 
                border: `2px solid ${scanStatus === 'success' ? '#10b981' : '#38bdf8'}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                cursor: scanStatus === 'idle' ? 'pointer' : 'default', 
                transition: 'all 0.3s', 
                boxShadow: scanStatus === 'success' ? '0 0 20px rgba(16, 185, 129, 0.5)' : (scanStatus === 'scanning' ? '0 0 20px rgba(56, 189, 248, 0.8)' : '0 0 20px rgba(56, 189, 248, 0.3)'),
                transform: scanStatus === 'scanning' ? 'scale(0.95)' : 'scale(1)'
              }}
            >
              {scanStatus === 'success' ? (
                <CheckCircle2 size={40} color="#10b981" />
              ) : (
                <Fingerprint size={40} color="#38bdf8" style={{ opacity: scanStatus === 'scanning' ? 0.5 : 1 }} />
              )}
            </div>
            
            <p style={{ marginTop: '20px', color: scanStatus === 'success' ? '#10b981' : '#38bdf8', fontSize: '0.9rem', fontWeight: '600', height: '20px' }}>
              {scanStatus === 'idle' ? 'Tap sensor to verify' : (scanStatus === 'scanning' ? 'Verifying...' : 'Gate Unlocked!')}
            </p>
            
            <button onClick={() => { setShowPhoneScanner(false); setScanStatus('idle'); }} className="btn btn-sm btn-secondary" style={{ marginTop: '30px' }} disabled={scanStatus === 'scanning'}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

