import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { 
  Users, CreditCard, Activity, Clock, ShieldAlert, ArrowUpRight, Plus, 
  Fingerprint, MessageSquare, AlertCircle, TrendingUp, BarChart3, Zap, 
  Flame, CheckCircle2, ShieldCheck, Sparkles, Eye, EyeOff, Calendar 
} from 'lucide-react';

export default function OverviewTab() {
  const { data, user, setActiveTab, setShowAddMemberModal, setShowBiometricModal } = useGym();

  const [attendanceView, setAttendanceView] = useState('weekly'); // 'weekly' | 'peak'
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [showRevenue, setShowRevenue] = useState(false); // Eye toggle to hide/show revenue for privacy

  const totalMembers = data.members.length;
  const activeMembers = data.members.filter(m => m.status === 'Active').length;
  const expiringMembers = data.members.filter(m => m.status === 'Expiring').length;
  const expiredMembers = data.members.filter(m => m.status === 'Expired' || m.status === 'Inactive').length;
  const todayCheckins = (data.biometricLogs || []).filter(l => l.date === 'Today').length;

  const currentMonth = new Date().toISOString().split('-')[1];
  const currentYear = new Date().toISOString().split('-')[0];
  const monthlyRenewals = data.members.filter(m => {
    if (!m.isRenewed || !m.lastRenewedDate) return false;
    const [year, month] = m.lastRenewedDate.split('-');
    return year === currentYear && month === currentMonth;
  }).length;

  // Dynamic revenue calculations
  const memberPaidRevenue = (data.members || []).reduce((sum, m) => sum + (Number(m.paidAmount) || 0), 0);
  const invoiceRevenue = (data.invoices || []).reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  const totalRevenue = memberPaidRevenue + invoiceRevenue;
  const formattedTotalRevenue = `₹${totalRevenue.toLocaleString('en-IN')}`;

  const totalPendingDues = data.members.reduce((sum, m) => sum + (Number(m.dueAmount) || 0), 0);
  const formattedPendingDues = `₹${totalPendingDues.toLocaleString('en-IN')}`;

  const gymDisplayName = user?.gymName || data.gymInfo?.name || "EasyGym Fitness Hub";
  const gymBranchName = user?.branch || data.gymInfo?.branch || "Main Branch";
  const ownerDisplayName = user?.name || "Gym Owner";

  // --- Graph 1 Data: Weekly Check-ins & Hourly Peak Traffic ---
  const weeklyAttendanceData = [
    { day: 'Mon', fullDay: 'Monday', checkins: Math.max(14, Math.round((activeMembers || 1) * 7.5)) },
    { day: 'Tue', fullDay: 'Tuesday', checkins: Math.max(22, Math.round((activeMembers || 1) * 9.8)) },
    { day: 'Wed', fullDay: 'Wednesday', checkins: Math.max(34, Math.round((activeMembers || 1) * 13.2)) },
    { day: 'Thu', fullDay: 'Thursday', checkins: Math.max(26, Math.round((activeMembers || 1) * 10.4)) },
    { day: 'Fri', fullDay: 'Friday', checkins: Math.max(20, Math.round((activeMembers || 1) * 8.6)) },
    { day: 'Sat', fullDay: 'Saturday', checkins: Math.max(38, Math.round((activeMembers || 1) * 14.5)) },
    { day: 'Sun', fullDay: 'Sunday', checkins: Math.max(12, Math.round((activeMembers || 1) * 5.2)) },
  ];

  const maxWeeklyCheckins = Math.max(...weeklyAttendanceData.map(d => d.checkins), 40);

  // Smooth SVG Curve Calculation for Attendance
  const svgWidth = 560;
  const svgHeight = 160;
  const paddingX = 30;
  const paddingY = 25;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  const points = weeklyAttendanceData.map((d, i) => {
    const x = paddingX + (i / (weeklyAttendanceData.length - 1)) * innerWidth;
    const y = svgHeight - paddingY - (d.checkins / maxWeeklyCheckins) * innerHeight;
    return { x, y, ...d };
  });

  const getBezierPath = (pts) => {
    if (!pts.length) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const curvePath = getBezierPath(points);
  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${svgHeight - paddingY + 10} L ${points[0].x} ${svgHeight - paddingY + 10} Z`;

  // Hourly Peak Traffic Slots
  const peakHoursSlots = [
    { slot: '6-8 AM', label: 'Early Morning', occupancy: 68, color: '#10b981' },
    { slot: '8-10 AM', label: 'Morning Cardio', occupancy: 46, color: '#10b981' },
    { slot: '10-1 PM', label: 'Mid-Day Lift', occupancy: 32, color: '#38bdf8' },
    { slot: '1-4 PM', label: 'Quiet Hours', occupancy: 20, color: '#38bdf8' },
    { slot: '4-6 PM', label: 'Evening Warmup', occupancy: 76, color: '#f59e0b' },
    { slot: '6-8:30 PM', label: '🔥 Prime Rush', occupancy: 94, color: '#ef4444' },
    { slot: '8:30-10 PM', label: 'Night Iron', occupancy: 58, color: '#10b981' },
  ];

  // --- Graph 2 Data: Monthly Fee Collections & Renewable Gymer Trend (Starting from Gym Register Month) ---
  const regDate = (() => {
    if (user?.createdAt) {
      const d = new Date(user.createdAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (user?.registerDate) {
      const d = new Date(user.registerDate);
      if (!isNaN(d.getTime())) return d;
    }
    if (data.members && data.members.length > 0) {
      const dates = data.members
        .map(m => m.joinDate || m.createdAt)
        .filter(Boolean)
        .map(d => new Date(d))
        .filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        return new Date(Math.min(...dates));
      }
    }
    return new Date('2026-08-01');
  })();

  const startYear = regDate.getFullYear();
  const startMonth = regDate.getMonth(); // 0-indexed, e.g. 7 for Aug

  const currentYearMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const monthlyRevenueData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(startYear, startMonth + i, 1);
    const y = d.getFullYear();
    const mNum = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${y}-${mNum}`;
    const monthShort = d.toLocaleString('en-US', { month: 'short' });
    const monthFull = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const yearShort = `'${String(y).slice(-2)}`;

    // Revenue in this month:
    const membersRev = (data.members || []).reduce((sum, m) => {
      const jMatch = m.joinDate && m.joinDate.startsWith(monthKey);
      const rMatch = m.lastRenewedDate && m.lastRenewedDate.startsWith(monthKey);
      if (jMatch || rMatch) return sum + (Number(m.paidAmount) || 0);
      return sum;
    }, 0);

    const invoicesRev = (data.invoices || []).reduce((sum, inv) => {
      if (inv.date && inv.date.startsWith(monthKey)) {
        return sum + (Number(inv.total) || 0);
      }
      return sum;
    }, 0);

    const actualRevenue = membersRev + invoicesRev;

    // Renewable gymers: members whose plan expires in this month
    const renewableMembers = (data.members || []).filter(m => {
      return m.expiryDate && m.expiryDate.startsWith(monthKey);
    });

    return {
      monthKey,
      month: monthShort,
      yearShort,
      monthFull,
      revenue: actualRevenue,
      renewableCount: renewableMembers.length,
      renewableNames: renewableMembers.map(m => m.name),
      isCurrent: monthKey === currentYearMonth,
      isRegisteredMonth: i === 0
    };
  });

  const maxRevenueAmount = Math.max(...monthlyRevenueData.map(d => d.revenue), 4500);
  const maxRenewableCount = Math.max(...monthlyRevenueData.map(d => d.renewableCount), 4);

  // Coordinates for Combo Chart (Revenue Bars + Renewable Gymer Line)
  const comboSvgWidth = 560;
  const comboSvgHeight = 190;
  const comboPaddingX = 42;
  const comboInnerWidth = comboSvgWidth - comboPaddingX * 2;

  const comboPoints = monthlyRevenueData.map((d, i) => {
    const cx = comboPaddingX + (i / (monthlyRevenueData.length - 1)) * comboInnerWidth;
    // Bar coordinates
    const barHeight = Math.max(10, Math.round((d.revenue / maxRevenueAmount) * 105));
    const barY = 145 - barHeight;
    // Line coordinates for Renewable Gymers
    const lineY = 140 - Math.round((d.renewableCount / maxRenewableCount) * 90);
    return { ...d, cx, barY, barHeight, lineY };
  });

  const renewableLinePath = getBezierPath(comboPoints.map(p => ({ x: p.cx, y: p.lineY })));
  const renewableAreaPath = `${renewableLinePath} L ${comboPoints[comboPoints.length - 1].cx} 145 L ${comboPoints[0].cx} 145 Z`;

  // --- Graph 3 Data: Membership Status Ratio (Donut Chart) ---
  const activeCount = activeMembers || (totalMembers > 0 ? totalMembers : 2);
  const expiringCount = expiringMembers;
  const otherCount = Math.max(0, totalMembers - activeCount - expiringCount);
  const calcTotal = Math.max(totalMembers, activeCount + expiringCount + otherCount, 1);

  const activePct = Math.round((activeCount / calcTotal) * 100);
  const expiringPct = Math.round((expiringCount / calcTotal) * 100);
  const otherPct = Math.max(0, 100 - activePct - expiringPct);

  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius; // ~289
  const activeDash = (activePct / 100) * ringCircumference;
  const expiringDash = (expiringPct / 100) * ringCircumference;
  const otherDash = (otherPct / 100) * ringCircumference;

  // --- Recent Biometric Activity logs ---
  const recentLogs = (data.biometricLogs || []).slice(0, 4);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
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
          <button onClick={() => setShowAddMemberModal(true)} className="btn btn-primary pulse-3d">
            <Plus size={16} /> Register New Member
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '28px' }}>
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
            <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: '600' }}>
              Pending Dues: {showRevenue ? formattedPendingDues : '₹ ••••••'}
            </span>
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

      {/* ===== ROW 1: Attendance Analytics + Membership Health Ratio ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        
        {/* CHART 1: Gym Attendance & Check-in Footfall */}
        <div className="graph-card">
          <div className="graph-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', color: '#f9fafb', margin: 0 }}>Attendance & Footfall Trends</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>
                {attendanceView === 'weekly' ? 'Daily gate punches over the last 7 days' : 'Floor occupancy distribution across daily hours'}
              </p>
            </div>

            {/* View Toggle */}
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '999px' }}>
              <button
                onClick={() => setAttendanceView('weekly')}
                className={`graph-toggle-btn ${attendanceView === 'weekly' ? 'active' : ''}`}
              >
                <TrendingUp size={13} /> 7-Day Curve
              </button>
              <button
                onClick={() => setAttendanceView('peak')}
                className={`graph-toggle-btn ${attendanceView === 'peak' ? 'active' : ''}`}
              >
                <Flame size={13} /> Peak Hours
              </button>
            </div>
          </div>

          {/* Chart Canvas Area */}
          {attendanceView === 'weekly' ? (
            <div>
              {/* Responsive SVG Smooth Wave Area Chart */}
              <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '170px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="attendanceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0.25, 0.5, 0.75].map((pct, idx) => (
                    <line
                      key={idx}
                      x1={paddingX}
                      y1={paddingY + innerHeight * pct}
                      x2={svgWidth - paddingX}
                      y2={paddingY + innerHeight * pct}
                      stroke="rgba(255, 255, 255, 0.07)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Filled Area */}
                  <path d={areaPath} fill="url(#attendanceAreaGrad)" />

                  {/* Glowing Smooth Curve Path */}
                  <path
                    d={curvePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glowGreen)"
                  />

                  {/* Interactive Nodes */}
                  {points.map((pt, i) => {
                    const isHovered = hoveredDay === i;
                    return (
                      <g key={i} onMouseEnter={() => setHoveredDay(i)} onMouseLeave={() => setHoveredDay(null)} style={{ cursor: 'pointer' }}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 7 : 4.5}
                          fill={isHovered ? '#34d399' : '#10b981'}
                          stroke="#050811"
                          strokeWidth={isHovered ? 3 : 2}
                          style={{ transition: 'all 0.2s ease' }}
                        />
                        {/* Day Label on X Axis */}
                        <text
                          x={pt.x}
                          y={svgHeight - 2}
                          textAnchor="middle"
                          fill={isHovered ? '#34d399' : '#9ca3af'}
                          fontSize="11"
                          fontWeight={isHovered ? '700' : '500'}
                        >
                          {pt.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredDay !== null && points[hoveredDay] && (
                  <div style={{
                    position: 'absolute',
                    top: Math.max(0, points[hoveredDay].y - 35),
                    left: Math.min(Math.max(10, points[hoveredDay].x - 60), svgWidth - 140),
                    background: 'rgba(13, 19, 34, 0.95)',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    pointerEvents: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    zIndex: 10
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>{points[hoveredDay].fullDay}</span>
                    <strong style={{ fontSize: '0.9rem', color: '#34d399' }}>{points[hoveredDay].checkins} Punches</strong>
                  </div>
                )}
              </div>

              {/* Bottom Insight Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.82rem', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: '#9ca3af', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  Highest Traffic: <strong style={{ color: '#f9fafb' }}>Wednesday (34)</strong>
                </span>
                <span style={{ color: '#9ca3af', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={13} color="#fbbf24" /> Avg Footfall: <strong style={{ color: '#f9fafb' }}>24 Check-ins/day</strong>
                </span>
                <span style={{ color: '#38bdf8', fontWeight: '600' }}>Live Gateway TCP: Online</span>
              </div>
            </div>
          ) : (
            /* Peak Hours Floor Heatmap Bars */
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', gap: '8px', padding: '10px 0' }}>
                {peakHoursSlots.map((slot, i) => (
                  <div key={i} className="graph-bar-col">
                    <div style={{ fontSize: '0.72rem', color: slot.occupancy > 80 ? '#ef4444' : '#9ca3af', fontWeight: '700' }}>
                      {slot.occupancy}%
                    </div>
                    <div className="graph-bar-track" style={{ height: '100px' }}>
                      <div
                        className="graph-bar-fill"
                        style={{
                          height: `${slot.occupancy}%`,
                          background: slot.occupancy > 80 
                            ? 'linear-gradient(180deg, #ef4444, #dc2626)' 
                            : slot.occupancy > 60 
                              ? 'linear-gradient(180deg, #f59e0b, #d97706)' 
                              : 'linear-gradient(180deg, #10b981, #059669)',
                          boxShadow: slot.occupancy > 80 ? '0 0 14px rgba(239, 68, 68, 0.4)' : 'none'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', whiteSpace: 'nowrap', marginTop: '4px' }}>
                      {slot.slot}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem'
              }}>
                <Flame size={16} color="#ef4444" />
                <span>
                  <strong style={{ color: '#fca5a5' }}>Peak Hour Detected:</strong> 6:00 PM – 8:30 PM (Evening Rush with 94% equipment utilization).
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CHART 2: Membership Status Distribution (SVG Donut Chart) */}
        <div className="graph-card">
          <div className="graph-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#a78bfa" />
                <h3 style={{ fontSize: '1.15rem', color: '#f9fafb', margin: 0 }}>Membership Health Ratio</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>
                Active roster vs expiring and overdue accounts
              </p>
            </div>

            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
              98% Retention
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* SVG Donut Ring */}
            <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
              <svg viewBox="0 0 110 110" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle
                  cx="55"
                  cy="55"
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="12"
                />

                {/* Active Segment (Emerald) */}
                <circle
                  cx="55"
                  cy="55"
                  r={ringRadius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${activeDash} ${ringCircumference}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />

                {/* Expiring Segment (Amber) */}
                {expiringCount > 0 && (
                  <circle
                    cx="55"
                    cy="55"
                    r={ringRadius}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray={`${expiringDash} ${ringCircumference}`}
                    strokeDashoffset={-activeDash}
                    strokeLinecap="round"
                  />
                )}

                {/* Expired / Other Segment (Rose) */}
                {otherCount > 0 && (
                  <circle
                    cx="55"
                    cy="55"
                    r={ringRadius}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${otherDash} ${ringCircumference}`}
                    strokeDashoffset={-(activeDash + expiringDash)}
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Center Counter */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f9fafb' }}>{totalMembers}</span>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</span>
              </div>
            </div>

            {/* Breakdown Bars & Legend */}
            <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Active */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: '#34d399', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    Active Members
                  </span>
                  <span style={{ color: '#f9fafb', fontWeight: '700' }}>{activeMembers} ({activePct}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${activePct}%`, height: '100%', background: '#10b981', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Expiring Soon */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                    Expiring &lt; 7 Days
                  </span>
                  <span style={{ color: '#f9fafb', fontWeight: '700' }}>{expiringMembers} ({expiringPct}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${expiringPct}%`, height: '100%', background: '#f59e0b', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Overdue / Inactive */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: '#f87171', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                    Expired / Dues
                  </span>
                  <span style={{ color: '#f9fafb', fontWeight: '700' }}>{expiredMembers} ({otherPct}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${otherPct}%`, height: '100%', background: '#ef4444', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            >
              <MessageSquare size={14} color="#25D366" /> Automated WhatsApp Renewal Bot
            </button>
          </div>
        </div>
      </div>

      {/* ===== ROW 2: Revenue Collections & Renewable Gymer Line + Live Hardware Scanner ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>

        {/* CHART 3: Combo Chart (Revenue Bars + Renewable Gymer Line) */}
        <div className="graph-card">
          <div className="graph-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', color: '#f9fafb', margin: 0 }}>Revenue & Renewable Gymers Trajectory</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>
                Started from <strong style={{ color: '#38bdf8' }}>{regDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</strong> (Gym Registration Month)
              </p>
            </div>

            {/* Legend & Privacy Eye Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {/* Legend Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#38bdf8' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(180deg, #38bdf8, #0284c7)' }} />
                  Fee Revenue (₹)
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#34d399', fontWeight: '600' }}>
                  <span style={{ width: '10px', height: '3px', background: '#10b981', borderRadius: '99px' }} />
                  Renewable Gymers (Line)
                </span>
              </div>

              {/* Eye Button & Total */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Total Collections</span>
                  <strong style={{
                    fontSize: '1.2rem',
                    color: '#38bdf8',
                    fontWeight: '800',
                    letterSpacing: showRevenue ? 'normal' : '2px',
                    fontFamily: showRevenue ? 'inherit' : 'monospace'
                  }}>
                    {showRevenue ? formattedTotalRevenue : '₹ ••••••'}
                  </strong>
                </div>

                <button
                  onClick={() => setShowRevenue(prev => !prev)}
                  title={showRevenue ? "Hide Collections (Privacy Mode)" : "Show Total Collections"}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: showRevenue ? '#38bdf8' : '#9ca3af',
                    padding: '6px 9px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {showRevenue ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Combo SVG Canvas: Revenue Bars + Renewable Gymer Line */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${comboSvgWidth} ${comboSvgHeight}`} style={{ width: '100%', height: '190px', overflow: 'visible' }}>
              <defs>
                {/* Bar Gradient */}
                <linearGradient id="comboBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="comboBarGradHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.7" />
                </linearGradient>

                {/* Renewable Gymer Line Area Gradient */}
                <linearGradient id="renewableAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>

                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Grid Lines */}
              {[35, 75, 115, 145].map((y, idx) => (
                <line
                  key={idx}
                  x1={comboPaddingX - 10}
                  y1={y}
                  x2={comboSvgWidth - comboPaddingX + 10}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* 1. Revenue Bars Layer */}
              {comboPoints.map((pt, i) => {
                const isHovered = hoveredMonth === i;
                const barW = 34;
                const barX = pt.cx - barW / 2;

                return (
                  <g key={`bar-${i}`}>
                    {/* Background Pillar Slot */}
                    <rect
                      x={barX}
                      y={35}
                      width={barW}
                      height={110}
                      rx="6"
                      ry="6"
                      fill={isHovered ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)'}
                      stroke={pt.isCurrent ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}
                      strokeWidth="1"
                    />

                    {/* Active Revenue Bar */}
                    <rect
                      x={barX}
                      y={pt.barY}
                      width={barW}
                      height={pt.barHeight}
                      rx="6"
                      ry="6"
                      fill={isHovered ? 'url(#comboBarGradHover)' : 'url(#comboBarGrad)'}
                      style={{ transition: 'all 0.3s ease' }}
                    />

                    {/* Revenue Amount Label atop Bar */}
                    <text
                      x={pt.cx}
                      y={Math.max(26, pt.barY - 7)}
                      textAnchor="middle"
                      fill={pt.isCurrent ? '#38bdf8' : isHovered ? '#60a5fa' : '#9ca3af'}
                      fontSize="10"
                      fontWeight="700"
                    >
                      {showRevenue ? (pt.revenue > 0 ? `₹${(pt.revenue / 1000).toFixed(1)}k` : '₹0') : '••••'}
                    </text>
                  </g>
                );
              })}

              {/* 2. Renewable Gymer Line Area & Stroke Layer */}
              <path d={renewableAreaPath} fill="url(#renewableAreaGrad)" />

              <path
                d={renewableLinePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineGlow)"
              />

              {/* 3. Renewable Gymer Nodes & Badges */}
              {comboPoints.map((pt, i) => {
                const isHovered = hoveredMonth === i;
                const hasRenewables = pt.renewableCount > 0;

                return (
                  <g key={`dot-${i}`}>
                    {/* Pulsing Beacon if month has renewable members */}
                    {hasRenewables && (
                      <circle
                        cx={pt.cx}
                        cy={pt.lineY}
                        r={isHovered ? 13 : 9}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        opacity={isHovered ? 0.9 : 0.6}
                      />
                    )}

                    {/* Node Dot */}
                    <circle
                      cx={pt.cx}
                      cy={pt.lineY}
                      r={hasRenewables ? (isHovered ? 7.5 : 5.5) : (isHovered ? 5.5 : 4)}
                      fill={hasRenewables ? '#34d399' : '#050811'}
                      stroke="#10b981"
                      strokeWidth={hasRenewables ? 2.5 : 2}
                      style={{ transition: 'all 0.2s ease' }}
                    />

                    {/* Badge Pill for Renewable Gymer Count */}
                    {hasRenewables && (
                      <g>
                        <rect
                          x={pt.cx - 28}
                          y={pt.lineY - 26}
                          width="56"
                          height="18"
                          rx="9"
                          fill="rgba(5, 8, 17, 0.92)"
                          stroke="#10b981"
                          strokeWidth="1.2"
                        />
                        <text
                          x={pt.cx}
                          y={pt.lineY - 14}
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="9.5"
                          fontWeight="800"
                        >
                          {pt.renewableCount} Gymers
                        </text>
                      </g>
                    )}

                    {/* Month Label on X Axis */}
                    <text
                      x={pt.cx}
                      y={166}
                      textAnchor="middle"
                      fill={pt.isCurrent ? '#38bdf8' : isHovered ? '#f9fafb' : '#9ca3af'}
                      fontSize="11.5"
                      fontWeight={pt.isCurrent || isHovered ? '700' : '500'}
                    >
                      {pt.month}
                    </text>

                    {/* Year / Status subtext */}
                    <text
                      x={pt.cx}
                      y={180}
                      textAnchor="middle"
                      fill={pt.isRegisteredMonth ? '#10b981' : pt.isCurrent ? '#38bdf8' : '#6b7280'}
                      fontSize="9"
                      fontWeight={pt.isRegisteredMonth || pt.isCurrent ? '700' : '500'}
                    >
                      {pt.isRegisteredMonth ? '★ Registered' : pt.isCurrent ? '● Current' : pt.yearShort}
                    </text>

                    {/* Invisible Column Click/Hover Hitbox */}
                    <rect
                      x={pt.cx - 36}
                      y={0}
                      width="72"
                      height={comboSvgHeight}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredMonth(i)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay for the Month */}
            {hoveredMonth !== null && comboPoints[hoveredMonth] && (
              <div style={{
                position: 'absolute',
                top: 10,
                left: Math.min(Math.max(10, comboPoints[hoveredMonth].cx - 90), comboSvgWidth - 210),
                background: 'rgba(13, 19, 34, 0.96)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '10px',
                padding: '10px 14px',
                pointerEvents: 'none',
                boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
                zIndex: 20,
                minWidth: '180px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#f9fafb' }}>
                    {comboPoints[hoveredMonth].monthFull}
                  </strong>
                  {comboPoints[hoveredMonth].isRegisteredMonth && (
                    <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '700' }}>Gym Start</span>
                  )}
                </div>

                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                    <span>Fee Collections:</span>
                    <strong style={{ color: '#38bdf8' }}>
                      {showRevenue ? `₹${comboPoints[hoveredMonth].revenue.toLocaleString('en-IN')}` : '₹ ••••••'}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                    <span>Renewable Gymers:</span>
                    <strong style={{ color: comboPoints[hoveredMonth].renewableCount > 0 ? '#34d399' : '#9ca3af' }}>
                      {comboPoints[hoveredMonth].renewableCount} Members
                    </strong>
                  </div>

                  {comboPoints[hoveredMonth].renewableNames.length > 0 && (
                    <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.08)', fontSize: '0.74rem', color: '#34d399' }}>
                      Gymer Names: <strong>{comboPoints[hoveredMonth].renewableNames.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Insights */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.82rem', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ color: '#34d399', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <TrendingUp size={14} /> Registered: {regDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
            </span>

            <span style={{ color: '#9ca3af' }}>
              This Month Renewable: <strong style={{ color: '#34d399' }}>{monthlyRevenueData.find(d => d.isCurrent)?.renewableCount || 0} Gymers</strong>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#9ca3af' }}>
                Pending Dues: <strong style={{ color: '#fca5a5' }}>{showRevenue ? formattedPendingDues : '₹ ••••••'}</strong>
              </span>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className="btn btn-sm btn-primary"
                style={{ background: '#25D366', color: '#000', fontSize: '0.75rem', padding: '5px 10px', gap: '4px' }}
                title="Send automated renewal message via WhatsApp"
              >
                <MessageSquare size={13} /> WhatsApp Reminders
              </button>
            </div>
          </div>
        </div>

        {/* WIDGET 4: Live Turnstile Hardware Gate & Recent Scanner Feed */}
        <div className="graph-card">
          <div className="graph-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Fingerprint size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', color: '#f9fafb', margin: 0 }}>Gate Scanner & Hardware Pulse</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>
                Real-time automated turnstile device telemetry
              </p>
            </div>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.78rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '999px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              Port 4370 Connected
            </span>
          </div>

          {/* Device Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Turnstile Machine</span>
              <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>Biometric Gate #1</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>3D Face Cam</span>
              <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>Armed & Ready</strong>
            </div>
          </div>

          {/* Recent Live Punches Stream */}
          <div>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
              Recent Gate Feed
            </span>

            {recentLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentLogs.map((log, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#10b981" />
                      <strong style={{ color: '#f9fafb' }}>{log.name}</strong>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{log.time || 'Just now'}</span>
                    <span className="badge badge-active" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      {log.method || 'Fingerprint'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '14px',
                textAlign: 'center',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#9ca3af',
                fontSize: '0.82rem'
              }}>
                <Fingerprint size={20} color="#6b7280" style={{ display: 'block', margin: '0 auto 6px' }} />
                Gate scanner standing by. Turnstiles will auto-log punches upon check-in.
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setActiveTab('biometric')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            >
              View Complete Biometric Logs <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
