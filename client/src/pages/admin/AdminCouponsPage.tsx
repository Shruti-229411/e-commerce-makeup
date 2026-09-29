import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '15',
    minimumOrderValue: '500',
    maximumDiscount: '500',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  });

  const fetchCoupons = () => {
    setIsLoading(true);
    api
      .get('/admin/coupons')
      .then((res) => {
        setCoupons(res.data.coupons || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '15',
      minimumOrderValue: '500',
      maximumDiscount: '500',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this promotional coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon._id}`, formData);
      } else {
        await api.post('/admin/coupons', formData);
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save coupon.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading promotional coupons...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Coupons & Promotions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Create promotional codes, discount caps & minimum spend rules.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Promo Code</th>
              <th style={{ padding: '0.75rem' }}>Discount</th>
              <th style={{ padding: '0.75rem' }}>Min Spend</th>
              <th style={{ padding: '0.75rem' }}>Expires</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-600)', fontFamily: 'monospace' }}>{c.code}</strong>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong>{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</strong>
                  {c.maximumDiscount && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Max ₹{c.maximumDiscount}</span>}
                </td>
                <td style={{ padding: '0.75rem' }}>₹{c.minimumOrderValue || 0}</td>
                <td style={{ padding: '0.75rem' }}>{new Date(c.expiryDate).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${c.active ? 'badge-bestseller' : 'badge-discount'}`}>
                    {c.active ? 'Active' : 'Expired'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(c._id)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card-glass" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Create Promo Code</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Coupon Code</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="GLOW20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Type</label>
                  <select
                    className="input-field"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Value</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Min Spend (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.minimumOrderValue}
                    onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Expiry Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
