import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

export const AdminReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRet, setEditingRet] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  const fetchReturns = () => {
    setIsLoading(true);
    api
      .get('/admin/returns')
      .then((res) => {
        setReturns(res.data.returns || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleOpenModal = (ret: any) => {
    setEditingRet(ret);
    setStatus(ret.status);
    setAdminNotes(ret.adminNotes || '');
    setRefundAmount((ret.refundAmount || ret.order?.totalAmount || 0).toString());
  };

  const handleUpdateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/returns/${editingRet._id}/status`, {
        status,
        adminNotes,
        refundAmount: Number(refundAmount)
      });

      if (res.data.success) {
        setEditingRet(null);
        fetchReturns();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update return status.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading self-service return requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Return Requests & Refunds ({returns.length})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Review customer return requests, update resolution lifecycle & restock inventory.</p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Return Request</th>
              <th style={{ padding: '0.75rem' }}>Customer</th>
              <th style={{ padding: '0.75rem' }}>Order Ref</th>
              <th style={{ padding: '0.75rem' }}>Reason</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((ret) => (
              <tr key={ret._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>RET-#{ret._id.substring(18).toUpperCase()}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{new Date(ret.createdAt).toLocaleDateString()}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ display: 'block' }}>{ret.user?.firstName} {ret.user?.lastName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ret.user?.email}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{ret.order?.orderNumber || 'REF'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total: ₹{ret.order?.totalAmount}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong>{ret.reason}</strong>
                  {ret.description && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>"{ret.description}"</p>}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${['Approved', 'Refunded', 'Returned'].includes(ret.status) ? 'badge-bestseller' : ret.status === 'Rejected' ? 'badge-discount' : 'badge-new'}`}>
                    {ret.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(ret)} className="btn btn-secondary btn-sm">
                    Moderate & Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Return Resolution Modal */}
      {editingRet && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card-glass" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '480px', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Moderate Return Request</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Order {editingRet.order?.orderNumber} • Reason: {editingRet.reason}
            </p>

            <form onSubmit={handleUpdateReturn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Resolution Lifecycle Status</label>
                <select
                  className="input-field"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Requested">Requested</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved (Awaiting Pickup)</option>
                  <option value="Pickup Scheduled">Pickup Scheduled</option>
                  <option value="Returned">Returned (Item Received & Restocked)</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="input-label">Refund Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Admin Resolution Notes for Customer</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="e.g. Return approved. Courier pickup scheduled for tomorrow."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingRet(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
