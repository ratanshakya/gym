import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { X, Fingerprint, Camera, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Phone } from 'lucide-react';

export default function BiometricModal() {
  const { showBiometricModal, setShowBiometricModal, data, processBiometricPunch } = useGym();
  const [selectedMemberId, setSelectedMemberId] = useState(data.members[0]?.id || '');
  const [punchMethod, setPunchMethod] = useState('Fingerprint');
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  if (!showBiometricModal) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setLastResult(null);

    setTimeout(() => {
      setScanning(false);
      const isSuccess = processBiometricPunch(selectedMemberId, punchMethod);
      const member = data.members.find(m => m.id === selectedMemberId);
      setLastResult({
        success: isSuccess,
        member: member,
        reason: isSuccess ? '' : (!member ? 'Member Not Found' : (member.dueAmount > 0 ? `Pending Dues: ₹${member.dueAmount}` : 'Membership Expired'))
      });
    }, 1200);
  };

  const selectedMember = data.members.find(m => m.id === selectedMemberId);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px', color: '#10b981' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Biometric Gate Simulation</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Test live fingerprint & 3D facial attendance check-in</p>
            </div>
          </div>
          <button onClick={() => setShowBiometricModal(false)} style={{ color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Select Member to Punch In:</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="search-input"
              style={{ width: '100%', padding: '10px' }}
            >
              {data.members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id}) - Status: {m.status} {m.dueAmount > 0 ? `| Due: ₹${m.dueAmount}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Select Scan Method:</label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>HARDWARE MACHINE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '4px' }}>
                <button
                  onClick={() => setPunchMethod('Fingerprint')}
                  className={`btn ${punchMethod === 'Fingerprint' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  <Fingerprint size={16} color={punchMethod === 'Fingerprint' ? '#ffffff' : '#38bdf8'} /> Fingerprint Sensor
                </button>
                <button
                  onClick={() => setPunchMethod('Face AI 3D')}
                  className={`btn ${punchMethod === 'Face AI 3D' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  <Camera size={16} color={punchMethod === 'Face AI 3D' ? '#ffffff' : '#f472b6'} /> 3D Face Cam
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600', marginTop: '6px' }}>MOBILE APP (KEYLESS)</div>
              <button
                onClick={() => setPunchMethod('Mobile Biometric App')}
                className={`btn ${punchMethod === 'Mobile Biometric App' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', width: '100%', borderColor: punchMethod === 'Mobile Biometric App' ? '#10b981' : '' }}
              >
                <Phone size={16} color={punchMethod === 'Mobile Biometric App' ? '#ffffff' : '#10b981'} /> Mobile App Entry
              </button>
            </div>
          </div>

          {/* Scanner Simulation Area */}
          <div className="biometric-scanner-box">
            {scanning ? (
              <div style={{ padding: '20px 0' }}>
                <div className="animate-pulse" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                  {punchMethod === 'Fingerprint' ? '☝️' : (punchMethod.includes('Mobile') ? '📱' : '📸')}
                </div>
                <p style={{ color: '#10b981', fontWeight: '700' }}>Scanning {punchMethod}...</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Matching biometric hash against encrypted database...</p>
              </div>
            ) : lastResult ? (
              <div style={{ padding: '10px 0' }}>
                {lastResult.success ? (
                  <div>
                    <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ color: '#34d399', fontSize: '1.3rem' }}>ACCESS GRANTED</h4>
                    <p style={{ fontSize: '0.9rem', color: '#f9fafb', marginTop: '4px' }}>Welcome, {lastResult.member?.name}!</p>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Plan: {lastResult.member?.plan} | Gate Turnstile Unlocked</p>
                  </div>
                ) : (
                  <div>
                    <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ color: '#fca5a5', fontSize: '1.3rem' }}>ACCESS DENIED</h4>
                    <p style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: '600' }}>Reason: {lastResult.reason}</p>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>Gate locked. Please renew membership at front desk.</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '16px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {punchMethod === 'Fingerprint' ? <Fingerprint size={56} color="#38bdf8" /> : (punchMethod.includes('Mobile') ? <Phone size={56} color="#10b981" /> : <Camera size={56} color="#f472b6" />)}
                </div>
                <p style={{ color: '#f9fafb', fontWeight: '600' }}>Ready for Check-In</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Click button below to trigger automated access door turnstile</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowBiometricModal(false)} className="btn btn-secondary">
            Close
          </button>
          <button onClick={handleSimulateScan} disabled={scanning} className="btn btn-primary">
            {scanning ? 'Processing Scan...' : 'Trigger Punch-In'}
          </button>
        </div>
      </div>
    </div>
  );
}
