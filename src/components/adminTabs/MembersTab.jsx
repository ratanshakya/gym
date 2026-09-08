import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { UserPlus, Calendar, MessageSquare, Users, Trash2, Edit3, X, Save } from 'lucide-react';
import Pagination from '../Pagination';

export default function MembersTab() {
  const { data, user, setShowAddMemberModal, updateMemberFull, deleteMember, sendWhatsAppMessage } = useGym();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editMemberData, setEditMemberData] = useState(null); // Member object currently being edited

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const gymName = user?.gymName || data.gymInfo?.name || "Gym";

  const filteredMembers = (data.members || []).filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (m.phone || '').includes(searchTerm) ||
                          (m.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editMemberData) return;
    updateMemberFull(editMemberData.id, editMemberData);
    setEditMemberData(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>{gymName} Members Directory</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Manage memberships, check-in access, edit details, and dues for your gym</p>
        </div>
        <button onClick={() => setShowAddMemberModal(true)} className="btn btn-primary">
          <UserPlus size={16} /> Add New Member
        </button>
      </div>

      <div className="data-table-container">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <input
                type="text"
                placeholder="Search member by name, phone or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="search-input"
              style={{ width: '160px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expiring">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Frozen">Frozen</option>
            </select>
          </div>

          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            Total <strong style={{ color: '#f9fafb' }}>{filteredMembers.length}</strong> members
          </span>
        </div>

        {/* Table or Empty State */}
        {filteredMembers.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Users size={40} color="#4b5563" style={{ marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', color: '#f9fafb' }}>No Members Registered Yet for {gymName}</h4>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>Click &quot;Add New Member&quot; to add your gym&apos;s first member record to MongoDB database.</p>
            <button onClick={() => setShowAddMemberModal(true)} className="btn btn-primary">
              <UserPlus size={16} /> Add First Member
            </button>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Member Details</th>
                  <th>Membership Plan</th>
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>Trainer</th>
                  <th>Dues</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#000', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                          {(member.name || 'M')[0].toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ color: '#f9fafb', fontSize: '0.95rem' }}>{member.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'flex', gap: '8px' }}>
                            <span>ID: {member.id}</span>
                            {member.phone && <span>• {member.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{member.plan || 'Standard Gym'}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Paid: ₹{(member.paidAmount || 0).toLocaleString()}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                        <span className={`badge ${
                          member.status === 'Active' ? 'badge-active' :
                          member.status === 'Expiring' ? 'badge-expiring' :
                          member.status === 'Frozen' ? 'badge-frozen' : 'badge-expired'
                        }`}>
                          {member.status || 'Active'}
                        </span>
                        {member.isRenewed && (
                          <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            RENEWED
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} color="#9ca3af" />
                        <span>{member.expiryDate || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{member.assignedTrainer || 'General'}</td>
                    <td>
                      {(member.dueAmount || 0) > 0 ? (
                        <span style={{ color: '#fca5a5', fontWeight: '700', fontSize: '0.85rem' }}>
                          ₹{member.dueAmount} Pending
                        </span>
                      ) : (
                        <span style={{ color: '#34d399', fontSize: '0.8rem' }}>Clear</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => sendWhatsAppMessage(member.name, member.phone, `Hi ${member.name}, renewal reminder from ${gymName}.`)}
                          className="btn btn-sm btn-secondary"
                          title="Send WhatsApp Message"
                          style={{ padding: '6px 8px', color: '#25D366' }}
                        >
                          <MessageSquare size={14} />
                        </button>

                        <button
                          onClick={() => setEditMemberData({ ...member, originalExpiryDate: member.expiryDate })}
                          className="btn btn-sm btn-secondary"
                          title="Edit Member Details"
                          style={{ padding: '6px 8px', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            const targetId = member.id || member._id;
                            if (window.confirm(`Are you sure you want to delete member "${member.name}" (${targetId}) from MongoDB database?`)) {
                              deleteMember(targetId);
                            }
                          }}
                          className="btn btn-sm btn-secondary"
                          title="Delete Member"
                          style={{ padding: '6px 8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredMembers.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(num) => {
                setItemsPerPage(num);
                setCurrentPage(1);
              }}
              itemLabel="members"
            />
          </>
        )}

      </div>

      {/* Edit Member Modal */}
      {editMemberData && (
        <div className="modal-overlay" onClick={() => setEditMemberData(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#f9fafb' }}>Update Member Details</h3>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Member ID: {editMemberData.id}</p>
              </div>
              <button onClick={() => setEditMemberData(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={editMemberData.name || ''}
                  onChange={e => setEditMemberData({ ...editMemberData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ width: '100%' }}
                    value={editMemberData.phone || ''}
                    onChange={e => setEditMemberData({ ...editMemberData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Membership Status</label>
                  <select
                    className="search-input"
                    style={{ width: '100%' }}
                    value={editMemberData.status || 'Active'}
                    onChange={e => setEditMemberData({ ...editMemberData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Membership Plan</label>
                  <select
                    className="search-input"
                    style={{ width: '100%' }}
                    value={editMemberData.plan || ''}
                    onChange={e => {
                      const newPlanName = e.target.value;
                      const selectedPlan = data.plans.find(p => p.name === newPlanName);
                      let newExpiryDate = editMemberData.expiryDate;
                      let newPaidAmount = editMemberData.paidAmount;
                      
                      if (selectedPlan) {
                        newPaidAmount = selectedPlan.price;
                        let monthsToAdd = 1;
                        if (selectedPlan.duration) {
                          if (selectedPlan.duration.includes('Year') || selectedPlan.duration.includes('12 Month')) monthsToAdd = 12;
                          else if (selectedPlan.duration.includes('6 Month')) monthsToAdd = 6;
                          else if (selectedPlan.duration.includes('3 Month')) monthsToAdd = 3;
                          else monthsToAdd = parseInt(selectedPlan.duration) || 1;
                        }
                        
                        let baseDate = new Date();
                        if (editMemberData.originalExpiryDate) {
                          const currentExpiry = new Date(editMemberData.originalExpiryDate);
                          if (currentExpiry > baseDate) {
                            baseDate = currentExpiry; // Extend from current active expiry
                          }
                        }
                        baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
                        newExpiryDate = baseDate.toISOString().split('T')[0];
                      }

                      setEditMemberData({ 
                        ...editMemberData, 
                        plan: newPlanName,
                        expiryDate: newExpiryDate,
                        paidAmount: newPaidAmount
                      });
                    }}
                  >
                    {data.plans.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} (₹{p.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Is this a Renewal?</label>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                    <label style={{ color: '#f9fafb', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={editMemberData.isRenewed || false} 
                        onChange={e => {
                          const isChecked = e.target.checked;
                          let newExpiryDate = editMemberData.expiryDate;
                          
                          // If checking renewal without changing plan, extend the date based on current plan
                          if (isChecked && editMemberData.plan && editMemberData.expiryDate === editMemberData.originalExpiryDate) {
                            const selectedPlan = data.plans.find(p => p.name === editMemberData.plan);
                            if (selectedPlan) {
                              let monthsToAdd = 1;
                              if (selectedPlan.duration) {
                                if (selectedPlan.duration.includes('Year') || selectedPlan.duration.includes('12 Month')) monthsToAdd = 12;
                                else if (selectedPlan.duration.includes('6 Month')) monthsToAdd = 6;
                                else if (selectedPlan.duration.includes('3 Month')) monthsToAdd = 3;
                                else monthsToAdd = parseInt(selectedPlan.duration) || 1;
                              }
                              let baseDate = new Date();
                              if (editMemberData.originalExpiryDate) {
                                const currentExpiry = new Date(editMemberData.originalExpiryDate);
                                if (currentExpiry > baseDate) {
                                  baseDate = currentExpiry;
                                }
                              }
                              baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
                              newExpiryDate = baseDate.toISOString().split('T')[0];
                            }
                          }
                          
                          setEditMemberData({ 
                            ...editMemberData, 
                            isRenewed: isChecked, 
                            lastRenewedDate: isChecked ? new Date().toISOString().split('T')[0] : null,
                            expiryDate: isChecked ? newExpiryDate : editMemberData.expiryDate
                          });
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Yes, mark as Renewed
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Amount Paid (₹)</label>
                  <input
                    type="number"
                    className="search-input"
                    style={{ width: '100%' }}
                    value={editMemberData.paidAmount ?? 0}
                    onChange={e => setEditMemberData({ ...editMemberData, paidAmount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Pending Due Amount (₹)</label>
                  <input
                    type="number"
                    className="search-input"
                    style={{ width: '100%' }}
                    value={editMemberData.dueAmount ?? 0}
                    onChange={e => setEditMemberData({ ...editMemberData, dueAmount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Plan Expiry Date</label>
                <input
                  type="date"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={editMemberData.expiryDate || ''}
                  onChange={e => setEditMemberData({ ...editMemberData, expiryDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditMemberData(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
