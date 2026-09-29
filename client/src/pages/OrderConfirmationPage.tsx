import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, Package, MapPin, Truck, ArrowRight, Sparkles } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .get(`/orders/${id}`)
        .then((res) => {
          setOrder(res.data.order);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #e91e63', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Generating order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Order Details Not Found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '720px' }}>
      <div className="card-glass" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <CheckCircle2 size={38} />
        </div>
        <span className="badge badge-bestseller" style={{ marginBottom: '0.5rem' }}>Order Confirmed</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Thank You for Your Purchase!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          Order Number: <strong style={{ color: 'var(--primary-600)' }}>{order.orderNumber}</strong>
        </p>

        {/* Tracking info box */}
        <div style={{ backgroundColor: 'var(--primary-50)', border: '1px dashed var(--primary-300)', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 0', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Truck size={28} color="var(--primary-600)" />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Tracking Number: {order.trackingNumber || 'AWB-GLOW-PENDING'}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Estimated Delivery: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : '3-4 Business Days'}
            </p>
          </div>
        </div>

        {/* Items Summary */}
        <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} {item.variantName && `• ${item.variantName}`}</p>
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/account/orders" className="btn btn-secondary btn-lg">
            <Package size={18} /> View My Orders
          </Link>
          <Link to="/" className="btn btn-primary btn-lg">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
