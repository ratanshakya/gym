import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Fingerprint, Camera, ShieldCheck, Cpu, Settings, Save, Download, HelpCircle, Trash2 } from 'lucide-react';
import Pagination from '../Pagination';

export default function BiometricTab() {
  const { data, user, setShowBiometricModal, showToast, deleteBiometricLog } = useGym();
  const [filter, setFilter] = useState('All');
  const [configMode, setConfigMode] = useState('cloud');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const gymName = user?.gymName || data.gymInfo?.name || "Gym";

  const filteredLogs = (data.biometricLogs || []).filter(log => {
    if (filter === 'Granted') return log.status.includes('Access Granted');
    if (filter === 'Denied') return log.status.includes('Access Denied');
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Biometric Access Control ({gymName})</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Real-time facial recognition & fingerprint gate turnstile logs</p>
        </div>

        <button onClick={() => setShowBiometricModal(true)} className="btn btn-primary">
          <Fingerprint size={16} /> Simulate Gate Check-in
        </button>
      </div>

      {/* Hardware Status Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem' }}>Biometric Gate #1 (Turnstile)</h4>
            <p style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700' }}>● ONLINE (IP: 192.168.1.102)</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem' }}>3D AI Face Recognition Cam</h4>
            <p style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700' }}>● ONLINE (IP: 192.168.1.105)</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem' }}>Anti-Proxy Security</h4>
            <p style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700' }}>Active (Buddy Punch Blocked)</p>
          </div>
        </div>
      </div>

      {/* Biometric Hardware Configuration Steps & Options */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={20} color="#10b981" /> Biometric Hardware Configuration Setup
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '20px' }}>
          Choose how your gym's fingerprint/face machine connects to the EasyGym Cloud Server.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Integration Mode (Connection Option):</label>
            <select className="search-input" style={{ width: '100%' }} value={configMode} onChange={e => setConfigMode(e.target.value)}>
              <option value="cloud">Cloud-Push (ADMS) - Direct to Server</option>
              <option value="local">Local Desktop Agent (Sync Bridge)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>
              {configMode === 'cloud' ? 'Device Serial Number:' : 'Local LAN IP Address:'}
            </label>
            <input 
              type="text" 
              className="search-input" 
              style={{ width: '100%' }} 
              defaultValue={configMode === 'cloud' ? 'EZG-77489230' : '192.168.1.102'} 
              placeholder={configMode === 'cloud' ? 'e.g. EZG-1234' : 'e.g. 192.168.1.100'} 
            />
          </div>
          <div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} 
              onClick={() => showToast && showToast('Hardware Configuration saved successfully!', 'success')}
            >
               <Save size={16} /> Save Setup & Restart Sync
            </button>
          </div>
        </div>
        
        {/* Detailed Setup Guide */}
        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} /> How to Setup Biometric Connection
          </h4>
          
          {configMode === 'cloud' ? (
            <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
              <li><strong>Step 1:</strong> Connect your Biometric Machine to the Gym's Wi-Fi or LAN network.</li>
              <li><strong>Step 2:</strong> Open Machine Menu &gt; Network (or Comm.) &gt; Cloud Server Settings (ADMS).</li>
              <li><strong>Step 3:</strong> Enter our Cloud Server IP (or Domain) and Port (usually 80).</li>
              <li><strong>Step 4:</strong> Enter the Machine's Serial Number in the box above and click Save. The machine will automatically push live logs to the software.</li>
            </ol>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
              <p style={{ marginBottom: '12px', color: '#10b981' }}><strong>Concept:</strong> Your Gym PC and Biometric Machine must be connected to the <strong>Same Wi-Fi Network</strong>. The Sync Agent acts as a bridge between them.</p>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, marginBottom: '16px' }}>
                <li><strong>Step 1:</strong> Ensure the Biometric Machine is connected to your Gym's Router (via LAN or Wi-Fi). Check its IP Address (e.g., 192.168.1.102).</li>
                <li><strong>Step 2:</strong> Download the EasyGym Sync Agent using the button below onto your Gym's Reception PC (Windows).</li>
                <li><strong>Step 3:</strong> Open the Agent on your PC, enter the Machine's Local IP Address and your Gym's API Secret Key.</li>
                <li><strong>Step 4:</strong> Click "Start Sync" on the Agent. It will fetch logs via your local Wi-Fi and send them to the EasyGym Cloud!</li>
              </ol>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className="btn btn-sm btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => showToast && showToast('Downloading EasyGym-Sync-Agent.zip...', 'success')}
                >
                  <Download size={14} /> Download EasyGym Sync Agent (Windows)
                </button>
                <a href="#" style={{ color: '#38bdf8', textDecoration: 'underline', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); showToast('Opening video tutorial...', 'success') }}>View Video Tutorial</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="data-table-container">
        <div className="table-toolbar">
          <h3 style={{ fontSize: '1.1rem' }}>Live Gate Access Log Stream</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="search-input" style={{ width: '150px' }}>
              <option value="All">All Logs</option>
              <option value="Granted">Access Granted</option>
              <option value="Denied">Access Denied</option>
            </select>
          </div>
        </div>

        {filteredLogs.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Member Name & ID</th>
                  <th>Scanner Hardware Device</th>
                  <th>Verification Method</th>
                  <th>Gate Action</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: '#38bdf8', fontWeight: '600', fontSize: '0.85rem' }}>
                      {log.time} <span style={{ color: '#6b7280', fontWeight: '400' }}>({log.date})</span>
                    </td>
                    <td>
                      <strong>{log.memberName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {log.memberId}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{log.device}</td>
                    <td style={{ fontSize: '0.85rem' }}>{log.method}</td>
                    <td>
                      <span className={`badge ${log.accessCode === 'OK' ? 'badge-active' : log.accessCode === 'WARN' ? 'badge-expiring' : 'badge-expired'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => deleteBiometricLog(log.id)} className="btn-icon" style={{ color: '#ef4444', padding: '4px' }} title="Delete Log">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(num) => {
                setItemsPerPage(num);
                setCurrentPage(1);
              }}
              itemLabel="logs"
            />
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
            <Fingerprint size={36} color="#4b5563" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
            No biometric gate access logs recorded yet for {gymName}.
            <div style={{ marginTop: '12px' }}>
              <button onClick={() => setShowBiometricModal(true)} className="btn btn-sm btn-primary">
                Simulate Gate Check-in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

