import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Star, CheckCircle, XCircle, Trash2, ShieldCheck } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = () => {
    setIsLoading(true);
    api
      .get('/admin/reviews')
      .then((res) => {
        setReviews(res.data.reviews || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/reviews/${id}/status`, { status });
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update review status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product review permanently?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading reviews for moderation...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Review Moderation ({reviews.length})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Approve, reject, or delete user reviews. Verified buyer badges remain server-derived.</p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Product</th>
              <th style={{ padding: '0.75rem' }}>Reviewer</th>
              <th style={{ padding: '0.75rem' }}>Rating & Content</th>
              <th style={{ padding: '0.75rem' }}>Verified Buyer</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>{rev.product?.name || 'Product'}</strong>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong>{rev.user?.firstName} {rev.user?.lastName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{rev.user?.email}</span>
                </td>
                <td style={{ padding: '0.75rem', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                    <div className="rating-pill">
                      <span>{rev.rating}</span>
                      <Star size={11} fill="#fff" color="#fff" />
                    </div>
                    <strong style={{ fontSize: '0.85rem' }}>{rev.title}</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>"{rev.comment}"</p>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {rev.isVerifiedPurchase ? (
                    <span className="badge badge-bestseller" style={{ fontSize: '0.7rem' }}>
                      ✓ Verified Buyer
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unverified</span>
                  )}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${rev.status === 'Approved' ? 'badge-bestseller' : rev.status === 'Rejected' ? 'badge-discount' : 'badge-new'}`}>
                    {rev.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    {rev.status !== 'Approved' && (
                      <button onClick={() => handleUpdateStatus(rev._id, 'Approved')} className="btn btn-secondary btn-sm" style={{ color: '#16a34a' }}>
                        Approve
                      </button>
                    )}
                    {rev.status !== 'Rejected' && (
                      <button onClick={() => handleUpdateStatus(rev._id, 'Rejected')} className="btn btn-secondary btn-sm" style={{ color: '#b91c1c' }}>
                        Reject
                      </button>
                    )}
                    <button onClick={() => handleDelete(rev._id)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
