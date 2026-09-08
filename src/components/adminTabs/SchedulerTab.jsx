import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Calendar, Users, Award, Clock, Plus, CheckCircle } from 'lucide-react';
import Pagination from '../Pagination';

export default function SchedulerTab() {
  const { data, showToast, assignPT, removePTAssignment } = useGym();

  // Pagination for PT Assignments
  const [pagePT, setPagePT] = useState(1);
  const [perPagePT, setPerPagePT] = useState(5);

  const [ptForm, setPtForm] = useState({
    trainerId: '',
    memberId: '',
    date: '',
    time: '',
    fees: '',
    paidAmount: '',
    packageDetails: '1 Month Custom PT'
  });

  const allPT = data.ptAssignments || [];
  const totalPTPages = Math.ceil(allPT.length / perPagePT) || 1;
  const paginatedPT = allPT.slice((pagePT - 1) * perPagePT, pagePT * perPagePT);

  const handleTrainerChange = (e) => {
    const selectedId = e.target.value;
    const selectedTrainer = data.trainers.find(t => t.id === selectedId);
    
    setPtForm(prev => ({
      ...prev,
      trainerId: selectedId,
      fees: selectedTrainer?.fee || '',
      packageDetails: selectedTrainer?.duration ? `${selectedTrainer.duration} PT Plan` : '1 Month Custom PT'
    }));
  };

  const handleAssignPT = (e) => {
    e.preventDefault();
    if (!ptForm.trainerId || !ptForm.memberId || !ptForm.date || !ptForm.time || !ptForm.fees) {
      showToast('Please fill all required fields for PT assignment', 'warning');
      return;
    }
    assignPT(ptForm);
    setPtForm({ trainerId: '', memberId: '', date: '', time: '', fees: '', paidAmount: '', packageDetails: '1 Month Custom PT' });
  };

  const handleBookClass = (classTitle) => {
    showToast(`Slot booked in ${classTitle}! Member notified via WhatsApp.`, 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Trainer & Class Scheduler</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Organize group fitness sessions, personal trainers & studio slots</p>
        </div>
      </div>

      {/* PT Assignment Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#34d399" /> Assign Personal Training (PT)
        </h3>
        <form onSubmit={handleAssignPT} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Select Trainer *</label>
            <select
              value={ptForm.trainerId}
              onChange={handleTrainerChange}
              className="search-input"
              style={{ width: '100%', background: '#111827', color: '#f9fafb' }}
              required
            >
              <option value="">-- Choose Trainer --</option>
              {data.trainers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Select Member *</label>
            <select
              value={ptForm.memberId}
              onChange={e => setPtForm({ ...ptForm, memberId: e.target.value })}
              className="search-input"
              style={{ width: '100%', background: '#111827', color: '#f9fafb' }}
              required
            >
              <option value="">-- Choose Member --</option>
              {(data.members || []).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Date *</label>
            <input
              type="date"
              value={ptForm.date}
              onChange={e => setPtForm({ ...ptForm, date: e.target.value })}
              className="search-input"
              style={{ width: '100%', colorScheme: 'dark' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Time (AM/PM) *</label>
            <input
              type="text"
              placeholder="e.g. 06:00 AM"
              value={ptForm.time}
              onChange={e => setPtForm({ ...ptForm, time: e.target.value })}
              className="search-input"
              style={{ width: '100%' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Total PT Fees (₹) *</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={ptForm.fees}
              onChange={e => setPtForm({ ...ptForm, fees: e.target.value })}
              className="search-input"
              style={{ width: '100%' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Paid Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={ptForm.paidAmount}
              onChange={e => setPtForm({ ...ptForm, paidAmount: e.target.value })}
              className="search-input"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Package Details</label>
            <input
              type="text"
              placeholder="1 Month Custom PT"
              value={ptForm.packageDetails}
              onChange={e => setPtForm({ ...ptForm, packageDetails: e.target.value })}
              className="search-input"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
              <Plus size={16} /> Assign Trainer
            </button>
          </div>
        </form>
      </div>

      {/* List of Active PT Assignments */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Active Personal Training Sessions</h3>
      <div className="data-table-container" style={{ marginBottom: '32px' }}>
        {allPT.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Trainer</th>
                  <th>Date & Time</th>
                  <th>Fees (Paid)</th>
                  <th>Package</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPT.map(pt => {
                  const member = (data.members || []).find(m => m.id === pt.memberId);
                  const trainer = (data.trainers || []).find(t => t.id === pt.trainerId);
                  return (
                    <tr key={pt.id}>
                      <td>
                        <strong>{member?.name || 'Unknown Member'}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{pt.memberId}</div>
                      </td>
                      <td>{trainer?.name || 'Unknown Trainer'}</td>
                      <td>
                        <span style={{ color: '#38bdf8' }}>{pt.date}</span>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{pt.time}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#34d399' }}>₹{pt.fees}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Paid: ₹{pt.paidAmount || 0}</div>
                      </td>
                      <td>{pt.packageDetails}</td>
                      <td>
                        <button onClick={() => removePTAssignment(pt.id)} className="btn btn-sm btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Cancel</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              currentPage={pagePT}
              totalPages={totalPTPages}
              onPageChange={setPagePT}
              totalItems={allPT.length}
              itemsPerPage={perPagePT}
              onItemsPerPageChange={(num) => {
                setPerPagePT(num);
                setPagePT(1);
              }}
              itemLabel="sessions"
            />
          </>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
            No Active PT Assignments. Assign a trainer to a member above to see them here.
          </div>
        )}
      </div>


      {/* Roster of Certified Trainers */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Gym Personal Trainers</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
        {data.trainers.map(trainer => (
          <div key={trainer.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img src={trainer.avatar} alt={trainer.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', color: '#f9fafb' }}>{trainer.name}</h4>
              <p style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '600' }}>{trainer.specialization}</p>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px', display: 'flex', gap: '12px' }}>
                <span>Exp: {trainer.experience}</span>
                <span>★ {trainer.rating} Rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Schedule Grid */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Group Fitness Timetable</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {data.classes.map(cls => (
          <div key={cls.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-active">{cls.room}</span>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700' }}>{cls.days}</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#f9fafb', marginBottom: '6px' }}>{cls.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#10b981" /> {cls.time}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
                Trainer: <strong style={{ color: '#f9fafb' }}>{cls.trainer}</strong>
              </p>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px' }}>
                <span>Enrolled Capacity:</span>
                <strong style={{ color: cls.enrolled === cls.capacity ? '#ef4444' : '#34d399' }}>{cls.enrolled} / {cls.capacity}</strong>
              </div>
              <button
                onClick={() => handleBookClass(cls.title)}
                disabled={cls.enrolled >= cls.capacity}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                {cls.enrolled >= cls.capacity ? 'Housefull Slot' : 'Book Member Slot'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
