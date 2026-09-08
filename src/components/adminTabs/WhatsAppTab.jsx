import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { MessageSquare, Send, CheckCircle2, Bot, BellRing, Sparkles } from 'lucide-react';

export default function WhatsAppTab() {
  const { data, sendWhatsAppMessage } = useGym();
  const [customMsg, setCustomMsg] = useState('');
  const [targetPhone, setTargetPhone] = useState('+91 98123 45678');

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customMsg) return;
    sendWhatsAppMessage("Gym Member", targetPhone, customMsg);
    setCustomMsg('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>WhatsApp & SMS Marketing Automation</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Send automated renewal alerts, birthday offers, and payment reminders</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        {/* Automated Triggers */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color="#25D366" /> Active AI Trigger Workflows
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.whatsappCampaigns.map(camp => (
              <div key={camp.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#f9fafb' }}>{camp.title}</h4>
                  <span className="badge badge-active">Active</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '10px' }}>Target: {camp.targetGroup}</p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #25D366', fontSize: '0.82rem', color: '#9ca3af' }}>
                  "{camp.template}"
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.78rem', color: '#6b7280' }}>
                  <span>Total Messages Sent: <strong>{camp.sentCount}</strong></span>
                  <span style={{ color: '#34d399', fontWeight: '700' }}>WhatsApp Web API Synced</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instant WhatsApp Sender Box */}
        <div className="glass-card" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={20} color="#25D366" /> Broadcast Instant WhatsApp Message
          </h3>

          <form onSubmit={handleSendCustom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Recipient Member Phone:</label>
              <input
                type="text"
                value={targetPhone}
                onChange={e => setTargetPhone(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Message Body:</label>
              <textarea
                rows={4}
                placeholder="Type your message here... e.g. Special offer for gym members today!"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                className="search-input"
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ background: '#25D366', color: '#000' }}>
              <Send size={16} /> Send via WhatsApp API
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-dark)', fontSize: '0.8rem', color: '#9ca3af' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#fbbf24" /> Instant WhatsApp green-badge Business API connection active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
