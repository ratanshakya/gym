import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Save, Building, Upload, Image as ImageIcon } from 'lucide-react';

export default function SettingsTab() {
  const { data, user, showToast, updateGymInfo } = useGym();
  const [gymDetails, setGymDetails] = useState(data.gymInfo || {});

  // Local File Upload Handler for Gym Logo
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size should be less than 5MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGymDetails(prev => ({ ...prev, logo: reader.result }));
        showToast('Logo image uploaded! Click "Save Configuration" to apply.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Gym Branding Settings
  const handleSave = (e) => {
    e.preventDefault();
    updateGymInfo(gymDetails);
    showToast("Gym settings & branding logo saved successfully!", "success");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Gym Organization & System Settings</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Configure gym branding, upload custom logo, update branch details & manage DB backup</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px', maxWidth: '800px' }}>
        
        {/* Left Column: Organization Branding Config */}
        <form onSubmit={handleSave} className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="#10b981" /> Gym Organization Branding
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Gym Name:</label>
              <input
                type="text"
                value={gymDetails.name || ''}
                onChange={e => setGymDetails({ ...gymDetails, name: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Branch Location:</label>
              <input
                type="text"
                value={gymDetails.branch || ''}
                onChange={e => setGymDetails({ ...gymDetails, branch: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>GSTIN Registration No:</label>
              <input
                type="text"
                value={gymDetails.gstNo || ''}
                onChange={e => setGymDetails({ ...gymDetails, gstNo: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Official Support Phone:</label>
              <input
                type="text"
                value={gymDetails.phone || ''}
                onChange={e => setGymDetails({ ...gymDetails, phone: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Gym Logo Upload & URL Box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>
                Gym Logo / Banner Photo:
              </label>

              {/* Upload & Live Preview Card */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-dark)', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {gymDetails.logo ? (
                    <img src={gymDetails.logo} alt="Gym Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={26} color="#10b981" />
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label className="btn btn-sm btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                      <Upload size={14} /> Upload Image from Computer
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>

                    {gymDetails.logo && (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        onClick={() => setGymDetails(prev => ({ ...prev, logo: '' }))}
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Select photo (PNG, JPG, WEBP) from your local device
                  </span>
                </div>
              </div>

              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Or paste image URL:</span>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={gymDetails.logo || ''}
                onChange={e => setGymDetails({ ...gymDetails, logo: e.target.value })}
                className="search-input"
                style={{ width: '100%', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Authorized Gym Admin Email (Master Owner Login):</label>
              <input
                type="email"
                value={gymDetails.adminEmail || user?.email || ''}
                onChange={e => setGymDetails({ ...gymDetails, adminEmail: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              <Save size={16} /> Save Configuration
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
