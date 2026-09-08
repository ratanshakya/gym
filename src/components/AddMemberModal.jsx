import React, { useState, useEffect } from 'react';
import { useGym } from '../context/GymContext';
import { X, UserPlus, ShieldAlert } from 'lucide-react';

export default function AddMemberModal() {
  const { showAddMemberModal, setShowAddMemberModal, data, addMember, showToast } = useGym();
  const today = new Date();
  const initialJoinDate = today.toISOString().split('T')[0];
  const initialPlan = data.plans && data.plans.length > 0 ? data.plans[0].name : 'Custom Plan';

  const calculateExpiryDate = (joinDateStr, planName) => {
    const selectedPlan = data.plans.find(p => p.name === planName);
    let monthsToAdd = 6;
    if (selectedPlan && selectedPlan.duration) {
      if (selectedPlan.duration.includes('Year') || selectedPlan.duration.includes('12 Month')) monthsToAdd = 12;
      else if (selectedPlan.duration.includes('6 Month')) monthsToAdd = 6;
      else if (selectedPlan.duration.includes('3 Month')) monthsToAdd = 3;
      else monthsToAdd = parseInt(selectedPlan.duration) || 1;
    }
    const joinD = joinDateStr ? new Date(joinDateStr) : new Date();
    joinD.setMonth(joinD.getMonth() + monthsToAdd);
    return joinD.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    plan: initialPlan,
    status: 'Active',
    assignedTrainer: 'Unassigned',
    dueAmount: 0,
    joinDate: initialJoinDate,
    expiryDate: calculateExpiryDate(initialJoinDate, initialPlan),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    paymentMethod: 'UPI',
    gender: 'Male'
  });

  useEffect(() => {
    if (showAddMemberModal) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        plan: initialPlan,
        status: 'Active',
        assignedTrainer: 'Unassigned',
        dueAmount: 0,
        joinDate: initialJoinDate,
        expiryDate: calculateExpiryDate(initialJoinDate, initialPlan),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        paymentMethod: 'UPI',
        gender: 'Male'
      });
    }
  }, [showAddMemberModal, data.plans]);

  if (!showAddMemberModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Check for duplicate member (same name or same phone)
    const isDuplicate = data.members.some(
      m => m.phone === formData.phone || m.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (isDuplicate) {
      showToast("Duplicate Entry! A member with the same Name or Phone Number already exists.", "danger");
      return;
    }

    const selectedPlanObj = data.plans.find(p => p.name === formData.plan);
    const planPrice = selectedPlanObj ? selectedPlanObj.price : 0;
    const paidAmount = planPrice - Number(formData.dueAmount);
    
    addMember({
      ...formData,
      paidAmount: Math.max(0, paidAmount),
      dueAmount: Number(formData.dueAmount)
    });

    setShowAddMemberModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px', color: '#10b981' }}>
              <UserPlus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Register New Member</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Add member, select membership tier, and assign trainer</p>
            </div>
          </div>
          <button onClick={() => setShowAddMemberModal(false)} style={{ color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Adani"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                placeholder="member@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Membership Plan</label>
              <select
                value={formData.plan}
                onChange={e => {
                  const newPlanName = e.target.value;
                  setFormData({ 
                    ...formData, 
                    plan: newPlanName,
                    expiryDate: calculateExpiryDate(formData.joinDate, newPlanName)
                  });
                }}
                className="search-input"
                style={{ width: '100%' }}
              >
                {data.plans && data.plans.length > 0 ? (
                  data.plans.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} (₹{p.price.toLocaleString()})
                    </option>
                  ))
                ) : (
                  <option value="Custom Plan">Custom Plan (Please create plans in Gym Fees tab)</option>
                )}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Assigned Personal Trainer</label>
              <select
                value={formData.assignedTrainer}
                onChange={e => setFormData({ ...formData, assignedTrainer: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              >
                <option value="Unassigned">Unassigned (General Gym)</option>
                {data.trainers.map(t => (
                  <option key={t.id} value={t.name}>{t.name} - {t.specialization}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Pending Dues (if any)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.dueAmount}
                onChange={e => setFormData({ ...formData, dueAmount: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Payment Method *</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Join Date *</label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={e => {
                  const newJoinDate = e.target.value;
                  setFormData({ 
                    ...formData, 
                    joinDate: newJoinDate, 
                    expiryDate: calculateExpiryDate(newJoinDate, formData.plan) 
                  });
                }}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Membership Expiry Date *</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" onClick={() => setShowAddMemberModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} /> Save & Register Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
