import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { TrendingUp, CreditCard, ArrowUpRight, CheckCircle2, ShieldAlert, DollarSign, Trash2 } from 'lucide-react';
import Pagination from '../Pagination';

export default function FinancialsTab() {
  const { data, user, setActiveTab, deleteInvoice } = useGym();

  const gymName = user?.gymName || data.gymInfo?.name || "Gym";

  // Pagination states for Member Payments
  const [pagePayments, setPagePayments] = useState(1);
  const [perPagePayments, setPerPagePayments] = useState(5);

  // Pagination states for Invoices
  const [pageInvoices, setPageInvoices] = useState(1);
  const [perPageInvoices, setPerPageInvoices] = useState(5);

  // Calculate dynamic stats from actual member payments & invoices
  const memberPaidRevenue = (data.members || []).reduce((sum, m) => sum + (Number(m.paidAmount) || 0), 0);
  const invoiceRevenue = (data.invoices || []).reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  const totalRevenue = memberPaidRevenue + invoiceRevenue;
  const formattedTotalRevenue = `₹${totalRevenue.toLocaleString('en-IN')}`;

  const currentMonth = new Date().toISOString().split('-')[1];
  const currentYear = new Date().toISOString().split('-')[0];
  const currentMonthStr = `${currentYear}-${currentMonth}`;

  const thisMonthRevenue = (data.members || []).reduce((sum, m) => {
    const joinedThisMonth = m.joinDate && m.joinDate.startsWith(currentMonthStr);
    const renewedThisMonth = m.lastRenewedDate && m.lastRenewedDate.startsWith(currentMonthStr);
    if (joinedThisMonth || renewedThisMonth) {
      return sum + (Number(m.paidAmount) || 0);
    }
    return sum;
  }, 0);
  const formattedMonthlyRevenue = `₹${thisMonthRevenue.toLocaleString('en-IN')}`;

  const totalPendingDues = (data.members || []).reduce((sum, m) => sum + (Number(m.dueAmount) || 0), 0);
  const formattedPendingDues = `₹${totalPendingDues.toLocaleString('en-IN')}`;
  const membersWithDues = (data.members || []).filter(m => (Number(m.dueAmount) || 0) > 0).length;

  const totalMembersCount = (data.members || []).length;
  const activeMembersCount = (data.members || []).filter(m => m.status === 'Active').length;
  const renewalRate = totalMembersCount > 0 
    ? `${Math.round((activeMembersCount / totalMembersCount) * 100)}%` 
    : "100%";

  const allMembers = data.members || [];
  const totalPaymentsPages = Math.ceil(allMembers.length / perPagePayments) || 1;
  const paginatedMembers = allMembers.slice((pagePayments - 1) * perPagePayments, pagePayments * perPagePayments);

  const allInvoices = data.invoices || [];
  const totalInvoicesPages = Math.ceil(allInvoices.length / perPageInvoices) || 1;
  const paginatedInvoices = allInvoices.slice((pageInvoices - 1) * perPageInvoices, pageInvoices * perPageInvoices);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>{gymName} Revenue & Financial Reports</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Real-time revenue metrics, dues ledger, and billing breakdown</p>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
            <CreditCard />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Total Revenue</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{formattedTotalRevenue}</h3>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>Calculated from database</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <CreditCard />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>This Month's Revenue</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{formattedMonthlyRevenue}</h3>
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '600' }}>{new Date().toLocaleString('default', { month: 'long' })} Collections</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <ShieldAlert />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Outstanding Pending Dues</p>
            <h3 style={{ fontSize: '1.6rem', color: '#fca5a5' }}>{formattedPendingDues}</h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>From {membersWithDues} member{membersWithDues === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
            <CreditCard />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#0ea5e9' }}>Digital Settlement</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>UPI / Card</h3>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700' }}>Instant Billing Ledger</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <CheckCircle2 />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Active Retention Rate</p>
            <h3 style={{ fontSize: '1.6rem', color: '#f9fafb' }}>{renewalRate}</h3>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: '700' }}>{activeMembersCount} Active / {totalMembersCount} Total</span>
          </div>
        </div>
      </div>

      {/* Member Payments Ledger Table */}
      <div className="data-table-container" style={{ marginBottom: '28px' }}>
        <div className="table-toolbar">
          <h3 style={{ fontSize: '1.1rem' }}>Member Payments Ledger</h3>
        </div>

        {allMembers.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Payment Method</th>
                  <th>Payment Date</th>
                  <th>Renewal Month</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, index) => {
                  const paymentDate = member.lastRenewedDate || member.joinDate || 'N/A';
                  let renewalMonth = 'N/A';
                  if (member.expiryDate) {
                    const dateObj = new Date(member.expiryDate);
                    renewalMonth = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
                  }

                  return (
                    <tr key={member.id || index}>
                      <td><strong>{member.name}</strong></td>
                      <td><span className="badge badge-active">{member.paymentMethod || 'UPI'}</span></td>
                      <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{paymentDate}</td>
                      <td style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '600' }}>{renewalMonth}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              currentPage={pagePayments}
              totalPages={totalPaymentsPages}
              onPageChange={setPagePayments}
              totalItems={allMembers.length}
              itemsPerPage={perPagePayments}
              onItemsPerPageChange={(num) => {
                setPerPagePayments(num);
                setPagePayments(1);
              }}
              itemLabel="records"
            />
          </>
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
            <CreditCard size={36} color="#4b5563" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
            No members registered yet.
          </div>
        )}
      </div>

      {/* Invoices History Table */}
      <div className="data-table-container">
        <div className="table-toolbar">
          <h3 style={{ fontSize: '1.1rem' }}>Invoices & Payment Ledger ({gymName})</h3>
          <button onClick={() => setActiveTab('pos')} className="btn btn-sm btn-secondary">
            + Generate Invoice in POS <ArrowUpRight size={14} />
          </button>
        </div>

        {allInvoices.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Member Name</th>
                  <th>Date</th>
                  <th>Items / Service</th>
                  <th>Payment Mode</th>
                  <th>Amount Paid</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ color: '#38bdf8', fontWeight: '700' }}>{inv.id}</td>
                    <td><strong>{inv.member}</strong></td>
                    <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{inv.date}</td>
                    <td style={{ fontSize: '0.85rem' }}>{inv.items}</td>
                    <td><span className="badge badge-active">{inv.method || 'Cash/UPI'}</span></td>
                    <td><strong style={{ color: '#10b981', fontSize: '1rem' }}>₹{(inv.total || 0).toLocaleString()}</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete invoice ${inv.id}?`)) {
                            deleteInvoice(inv.id);
                          }
                        }}
                        className="btn btn-sm btn-secondary" 
                        style={{ padding: '6px 8px', color: '#ef4444' }}
                        title="Delete Invoice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={pageInvoices}
              totalPages={totalInvoicesPages}
              onPageChange={setPageInvoices}
              totalItems={allInvoices.length}
              itemsPerPage={perPageInvoices}
              onItemsPerPageChange={(num) => {
                setPerPageInvoices(num);
                setPageInvoices(1);
              }}
              itemLabel="invoices"
            />
          </>
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
            <DollarSign size={36} color="#4b5563" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
            No store invoices generated yet for {gymName}. Use the &quot;POS & Store Billing&quot; tab to issue invoices.
          </div>
        )}
      </div>
    </div>
  );
}

