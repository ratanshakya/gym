import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Tag, Plus, Trash2, Users, Edit2, Check, X } from 'lucide-react';

export default function GymFeesTab() {
  const { data, showToast, addPlan, updatePlan, deletePlan, addTrainer, updateTrainer, deleteTrainer } = useGym();

  const DURATION_OPTIONS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Custom'];

  // Trainer Add Form State
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerSpec, setNewTrainerSpec] = useState('');
  const [newTrainerFee, setNewTrainerFee] = useState('');
  const [newTrainerDurationSelect, setNewTrainerDurationSelect] = useState('1 Month');
  const [newTrainerCustomDuration, setNewTrainerCustomDuration] = useState('');

  // Trainer Edit Form State
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [editTrainerName, setEditTrainerName] = useState('');
  const [editTrainerSpec, setEditTrainerSpec] = useState('');
  const [editTrainerFee, setEditTrainerFee] = useState('');
  const [editTrainerDurationSelect, setEditTrainerDurationSelect] = useState('1 Month');
  const [editTrainerCustomDuration, setEditTrainerCustomDuration] = useState('');

  // Custom Plan Add Form State
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [newPlanDurationSelect, setNewPlanDurationSelect] = useState('1 Month');
  const [newPlanCustomDuration, setNewPlanCustomDuration] = useState('');

  // Custom Plan Edit Form State
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanPrice, setEditPlanPrice] = useState('');
  const [editPlanDurationSelect, setEditPlanDurationSelect] = useState('1 Month');
  const [editPlanCustomDuration, setEditPlanCustomDuration] = useState('');

  // Plan Handlers
  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newPlanName || !newPlanPrice) {
      showToast('Please enter Plan Name and Fees Amount', 'danger');
      return;
    }
    const duration = newPlanDurationSelect === 'Custom' 
      ? (newPlanCustomDuration.trim() || '1 Month') 
      : newPlanDurationSelect;

    addPlan({
      name: newPlanName,
      price: parseFloat(newPlanPrice) || 0,
      duration,
      access: 'Gym + Cardio',
      popular: false,
      features: ['Full Gym Access', 'Free Locker']
    });

    setNewPlanName('');
    setNewPlanPrice('');
    setNewPlanDurationSelect('1 Month');
    setNewPlanCustomDuration('');
  };

  const startEditPlan = (plan) => {
    setEditingPlanId(plan.id || plan._id);
    setEditPlanName(plan.name || '');
    setEditPlanPrice(plan.price || '');
    if (['1 Month', '3 Months', '6 Months', '1 Year'].includes(plan.duration)) {
      setEditPlanDurationSelect(plan.duration);
      setEditPlanCustomDuration('');
    } else {
      setEditPlanDurationSelect('Custom');
      setEditPlanCustomDuration(plan.duration || '');
    }
  };

  const handleUpdatePlanSubmit = (e) => {
    e.preventDefault();
    if (!editPlanName || !editPlanPrice) {
      showToast('Plan name and price are required', 'warning');
      return;
    }
    const duration = editPlanDurationSelect === 'Custom' 
      ? (editPlanCustomDuration.trim() || '1 Month') 
      : editPlanDurationSelect;

    updatePlan(editingPlanId, {
      name: editPlanName,
      price: parseFloat(editPlanPrice) || 0,
      duration
    });

    setEditingPlanId(null);
  };

  // Trainer Handlers
  const handleCreateTrainer = (e) => {
    e.preventDefault();
    if (!newTrainerName) {
      showToast('Please enter Trainer Name', 'warning');
      return;
    }
    const duration = newTrainerDurationSelect === 'Custom' 
      ? (newTrainerCustomDuration.trim() || '1 Month') 
      : newTrainerDurationSelect;

    addTrainer({
      name: newTrainerName,
      specialization: newTrainerSpec || 'General Fitness',
      fee: parseFloat(newTrainerFee) || 0,
      duration
    });

    setNewTrainerName('');
    setNewTrainerSpec('');
    setNewTrainerFee('');
    setNewTrainerDurationSelect('1 Month');
    setNewTrainerCustomDuration('');
  };

  const startEditTrainer = (trainer) => {
    setEditingTrainerId(trainer.id || trainer._id);
    setEditTrainerName(trainer.name || '');
    setEditTrainerSpec(trainer.specialization || '');
    setEditTrainerFee(trainer.fee || '');
    if (['1 Month', '3 Months', '6 Months', '1 Year'].includes(trainer.duration)) {
      setEditTrainerDurationSelect(trainer.duration);
      setEditTrainerCustomDuration('');
    } else {
      setEditTrainerDurationSelect('Custom');
      setEditTrainerCustomDuration(trainer.duration || '');
    }
  };

  const handleUpdateTrainerSubmit = (e) => {
    e.preventDefault();
    if (!editTrainerName) {
      showToast('Trainer name is required', 'warning');
      return;
    }
    const duration = editTrainerDurationSelect === 'Custom' 
      ? (editTrainerCustomDuration.trim() || '1 Month') 
      : editTrainerDurationSelect;

    updateTrainer(editingTrainerId, {
      name: editTrainerName,
      specialization: editTrainerSpec || 'General Fitness',
      fee: parseFloat(editTrainerFee) || 0,
      duration
    });

    setEditingTrainerId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Gym Fees & Membership Plans Manager</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Configure membership plan fees, duration, and personal trainers list synced live to Database</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        
        {/* Custom Gym Membership Plans & Fees Configurator */}
        <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="#38bdf8" /> Custom Gym Plans & Fees Manager
          </h3>
          <p style={{ fontSize: '0.83rem', color: '#9ca3af', marginBottom: '20px' }}>
            Add, edit or set your gym's custom membership plans & fees. Saved permanently to Database & synced on refresh.
          </p>

          {/* Create New Plan Form */}
          <form onSubmit={handleCreatePlan} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>+ Add New Custom Gym Plan</strong>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <input
                type="text"
                placeholder="Plan Name (e.g. Student Pass)"
                value={newPlanName}
                onChange={e => setNewPlanName(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
                required
              />
              <input
                type="number"
                placeholder="Fees Amount (₹)"
                value={newPlanPrice}
                onChange={e => setNewPlanPrice(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={newPlanDurationSelect}
                onChange={e => setNewPlanDurationSelect(e.target.value)}
                className="search-input"
                style={{ flex: 1, minWidth: '130px', background: '#111827', color: '#f9fafb' }}
              >
                {DURATION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {newPlanDurationSelect === 'Custom' && (
                <input
                  type="text"
                  placeholder="Custom Duration (e.g. 45 Days)"
                  value={newPlanCustomDuration}
                  onChange={e => setNewPlanCustomDuration(e.target.value)}
                  className="search-input"
                  style={{ flex: 1, minWidth: '150px' }}
                  required
                />
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Plan
              </button>
            </div>
          </form>

          {/* List of Active Plans with Edit & Delete */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
            {(data.plans || []).map(plan => {
              const planId = plan.id || plan._id;
              const isEditing = editingPlanId === planId;

              if (isEditing) {
                return (
                  <form key={planId} onSubmit={handleUpdatePlanSubmit} style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#38bdf8' }}>✏️ Edit Gym Membership Plan</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Plan Name"
                        value={editPlanName}
                        onChange={e => setEditPlanName(e.target.value)}
                        className="search-input"
                        style={{ width: '100%' }}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Fees Amount (₹)"
                        value={editPlanPrice}
                        onChange={e => setEditPlanPrice(e.target.value)}
                        className="search-input"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <select
                        value={editPlanDurationSelect}
                        onChange={e => setEditPlanDurationSelect(e.target.value)}
                        className="search-input"
                        style={{ flex: 1, minWidth: '130px', background: '#111827', color: '#f9fafb' }}
                      >
                        {DURATION_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {editPlanDurationSelect === 'Custom' && (
                        <input
                          type="text"
                          placeholder="Custom Duration"
                          value={editPlanCustomDuration}
                          onChange={e => setEditPlanCustomDuration(e.target.value)}
                          className="search-input"
                          style={{ flex: 1, minWidth: '140px' }}
                          required
                        />
                      )}
                      <button type="submit" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        <Check size={14} /> Update
                      </button>
                      <button type="button" onClick={() => setEditingPlanId(null)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div key={planId} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-dark)' }}>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#f9fafb', display: 'block' }}>{plan.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Duration: <strong style={{ color: '#38bdf8' }}>{plan.duration}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>₹{Number(plan.price).toLocaleString('en-IN')}</strong>
                    <button
                      onClick={() => startEditPlan(plan)}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}
                      title="Edit Plan"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deletePlan(planId)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete Plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trainer Manager */}
        <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#10b981" /> Gym Trainers Manager
          </h3>
          <p style={{ fontSize: '0.83rem', color: '#9ca3af', marginBottom: '20px' }}>
            Add, edit or manage your personal fitness trainers, PT fees & duration. Saved permanently to Database & synced on refresh.
          </p>
          
          {/* Create New Trainer Form */}
          <form onSubmit={handleCreateTrainer} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>+ Add New Gym Trainer</strong>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Trainer Name"
                value={newTrainerName}
                onChange={e => setNewTrainerName(e.target.value)}
                className="search-input"
                style={{ flex: 1 }}
                required
              />
              <input
                type="text"
                placeholder="Specialization (e.g. Yoga)"
                value={newTrainerSpec}
                onChange={e => setNewTrainerSpec(e.target.value)}
                className="search-input"
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="PT Fees (₹)"
                value={newTrainerFee}
                onChange={e => setNewTrainerFee(e.target.value)}
                className="search-input"
                style={{ flex: 1, minWidth: '120px' }}
                required
              />

              <select
                value={newTrainerDurationSelect}
                onChange={e => setNewTrainerDurationSelect(e.target.value)}
                className="search-input"
                style={{ flex: 1, minWidth: '130px', background: '#111827', color: '#f9fafb' }}
              >
                {DURATION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {newTrainerDurationSelect === 'Custom' && (
                <input
                  type="text"
                  placeholder="Custom Duration (e.g. 45 Days)"
                  value={newTrainerCustomDuration}
                  onChange={e => setNewTrainerCustomDuration(e.target.value)}
                  className="search-input"
                  style={{ flex: 1, minWidth: '150px' }}
                  required
                />
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                <Plus size={16} /> Add Trainer
              </button>
            </div>
          </form>

          {/* List of Trainers with Edit & Delete */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
            {(data.trainers || []).map(trainer => {
              const trainerId = trainer.id || trainer._id;
              const isEditing = editingTrainerId === trainerId;

              if (isEditing) {
                return (
                  <form key={trainerId} onSubmit={handleUpdateTrainerSubmit} style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid #10b981', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#10b981' }}>✏️ Edit Gym Trainer Details</strong>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Trainer Name"
                        value={editTrainerName}
                        onChange={e => setEditTrainerName(e.target.value)}
                        className="search-input"
                        style={{ flex: 1 }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Specialization"
                        value={editTrainerSpec}
                        onChange={e => setEditTrainerSpec(e.target.value)}
                        className="search-input"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="PT Fees (₹)"
                        value={editTrainerFee}
                        onChange={e => setEditTrainerFee(e.target.value)}
                        className="search-input"
                        style={{ flex: 1, minWidth: '120px' }}
                        required
                      />
                      <select
                        value={editTrainerDurationSelect}
                        onChange={e => setEditTrainerDurationSelect(e.target.value)}
                        className="search-input"
                        style={{ flex: 1, minWidth: '130px', background: '#111827', color: '#f9fafb' }}
                      >
                        {DURATION_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>

                      {editTrainerDurationSelect === 'Custom' && (
                        <input
                          type="text"
                          placeholder="Custom Duration"
                          value={editTrainerCustomDuration}
                          onChange={e => setEditTrainerCustomDuration(e.target.value)}
                          className="search-input"
                          style={{ flex: 1, minWidth: '140px' }}
                          required
                        />
                      )}

                      <button type="submit" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        <Check size={14} /> Update
                      </button>
                      <button type="button" onClick={() => setEditingTrainerId(null)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div key={trainerId} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-dark)' }}>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#f9fafb', display: 'block' }}>{trainer.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{trainer.specialization}</span>
                    {(trainer.fee !== undefined || trainer.duration) && (
                      <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '4px' }}>
                        ₹{trainer.fee} / {trainer.duration || '1 Month'}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => startEditTrainer(trainer)}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}
                      title="Edit Trainer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTrainer(trainerId)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete Trainer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
