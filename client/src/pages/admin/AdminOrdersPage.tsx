import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ShoppingCart, ChevronRight, Filter } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    const url = statusFilter ? `/admin/orders?status=${statusFilter}` : '/admin/orders';
    api
      .get(url)
      .then((res) => {
        setOrders(res.data.orders || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order fulfillment list...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Fulfillment ({orders.length})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Track customer orders, update tracking IDs & manage order status workflow.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '180px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Order Number</th>
              <th style={{ padding: '0.75rem' }}>Customer</th>
              <th style={{ padding: '0.75rem' }}>Date & Items</th>
              <th style={{ padding: '0.75rem' }}>Total</th>
              <th style={{ padding: '0.75rem' }}>Payment</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--primary-600)' }}>{ord.orderNumber}</strong>
                  {ord.trackingNumber && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>AWB: {ord.trackingNumber}</span>}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ display: 'block' }}>{ord.user?.firstName} {ord.user?.lastName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{ord.items?.length || 1} item(s)</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>₹{ord.totalAmount}</strong>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${ord.paymentStatus === 'Completed' ? 'badge-bestseller' : 'badge-new'}`}>
                    {ord.paymentStatus} ({ord.paymentMethod})
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${ord.orderStatus === 'Delivered' ? 'badge-bestseller' : ord.orderStatus === 'Cancelled' ? 'badge-discount' : 'badge-new'}`}>
                    {ord.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <Link to={`/admin/orders/${ord._id}`} className="btn btn-secondary btn-sm">
                    Manage <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
