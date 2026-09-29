import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { RefreshCw, Clock, CheckCircle2, XCircle, ChevronRight, AlertCircle } from 'lucide-react';

export const MyReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/returns/my-returns')
      .then((res) => {
        setReturns(res.data.returns || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Refunded':
        return <span className="badge badge-bestseller">{status}</span>;
      case 'Rejected':
        return <span className="badge badge-discount">{status}</span>;
      case 'Under Review':
      case 'Requested':
      case 'Pickup Scheduled':
      default:
        return <span className="badge badge-new">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your return requests...</p>
      </div>
    );
  }

  if (returns.length === 0) {
    return (
      <div className="card-glass" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <RefreshCw size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Return Requests</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          You have no active or completed return requests. Eligible delivered items can be returned directly from the order details page.
        </p>
        <Link to="/account/orders" className="btn btn-primary">
          View My Orders &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Returns & Refunds ({returns.length})</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {returns.map((ret) => (
          <div key={ret._id} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Requested on {new Date(ret.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Return #{ret._id.substring(18).toUpperCase()} (Order #{ret.order?.orderNumber || 'REF'})
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusBadge(ret.status)}
                {ret.order?._id && (
                  <Link to={`/account/orders/${ret.order._id}`} className="btn btn-secondary btn-sm">
                    Order Details <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reason for Return</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <strong>{ret.reason}</strong>
                  {ret.description && ` — "${ret.description}"`}
                </p>

                {ret.adminNotes && (
                  <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', fontSize: '0.8rem', color: '#1e40af' }}>
                    <strong>Admin Response:</strong> {ret.adminNotes}
                  </div>
                )}
              </div>

              <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span><strong>Refund State:</strong> {ret.refundStatus || 'Pending Review'}</span>
                <span><strong>Estimated Amount:</strong> ₹{ret.refundAmount || 0}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Items returning: {ret.items?.length || 1} item(s)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
