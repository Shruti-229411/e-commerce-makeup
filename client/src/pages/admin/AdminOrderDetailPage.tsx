import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { OrderStatusTimeline } from '../../components/account/OrderStatusTimeline';
import { ArrowLeft, Save, MapPin, Package, Truck, ShieldCheck } from 'lucide-react';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [orderStatus, setOrderStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  const fetchOrder = () => {
    setIsLoading(true);
    api
      .get(`/orders/${id}`)
      .then((res) => {
        const ord = res.data.order;
        setOrder(ord);
        setOrderStatus(ord.orderStatus);
        setTrackingNumber(ord.trackingNumber || '');
        setPaymentStatus(ord.paymentStatus);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMsg('');

    try {
      const res = await api.put(`/admin/orders/${id}/status`, {
        orderStatus,
        trackingNumber,
        paymentStatus,
        note
      });

      if (res.data.success) {
        setMsg('Order status & tracking updated successfully!');
        setNote('');
        fetchOrder();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order management details...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Order {order.orderNumber}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Placed by {order.user?.firstName} {order.user?.lastName} ({order.user?.email}) on {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Order Lifecycle Stepper</h3>
        <OrderStatusTimeline orderStatus={order.orderStatus} statusHistory={order.statusHistory} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Left: Items list */}
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Order Items ({order.items?.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} {item.variantName && `• ${item.variantName}`}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '0.2rem' }}>₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Status Audit Log ({order.statusHistory?.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {order.statusHistory?.map((hist: any, i: number) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>{hist.status}</strong> — {new Date(hist.timestamp).toLocaleString()}
                  {hist.note && <span style={{ display: 'block', color: 'var(--text-muted)' }}>"{hist.note}"</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Admin Action Box & Shipping Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Admin Control Form */}
          <div className="card-glass" style={{ padding: '1.25rem', border: '1px solid var(--primary-400)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--primary-600)" /> Fulfillment Controls
            </h4>

            {msg && (
              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="input-label">Order Status</label>
                <select
                  className="input-field"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
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

              <div>
                <label className="input-label">Carrier Tracking AWB</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="AWB-88392019"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Payment Status</label>
                <select
                  className="input-field"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="input-label">Admin Audit Note (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Dispatched via BlueDart"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button type="submit" disabled={isUpdating} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Save size={16} /> {isUpdating ? 'Updating...' : 'Save Order Status'}
              </button>
            </form>
          </div>

          {/* Shipping Address Box */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="var(--primary-600)" /> Shipping Address
            </h4>
            <strong>{order.shippingAddress?.name}</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem' }}>Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
