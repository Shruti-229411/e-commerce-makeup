import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { OrderStatusTimeline } from '../../components/account/OrderStatusTimeline';
import { ReturnRequestModal } from '../../components/account/ReturnRequestModal';
import { WriteReviewModal } from '../../components/account/WriteReviewModal';
import { Package, Truck, MapPin, RefreshCw, Star, XCircle, ArrowLeft } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal Triggers
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string } | null>(null);

  const fetchOrder = () => {
    setIsLoading(true);
    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.order);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch order details.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await api.put(`/orders/${id}/cancel`, { reason: 'Cancelled by customer' });
      if (res.data.success) {
        fetchOrder();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order cancellation failed.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="card-glass" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>Access Denied or Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/account/orders" className="btn btn-primary">Back to My Orders</Link>
      </div>
    );
  }

  const isEligibleForCancel = ['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus);
  const isEligibleForReturn = order.orderStatus === 'Delivered';

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/account/orders" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order {order.orderNumber}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEligibleForCancel && (
            <button onClick={handleCancelOrder} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }}>
              <XCircle size={16} /> Cancel Order
            </button>
          )}

          {isEligibleForReturn && (
            <button onClick={() => setShowReturnModal(true)} className="btn btn-primary btn-sm">
              <RefreshCw size={16} /> Request Return
            </button>
          )}
        </div>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Order Status Timeline</h3>
        <OrderStatusTimeline orderStatus={order.orderStatus} statusHistory={order.statusHistory} />
      </div>

      {/* Grid: Order Items & Delivery Address */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Items List */}
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Items in Order ({order.items?.length})</h3>

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

                <button
                  onClick={() => setReviewProduct({ id: item.product?._id || item.product, name: item.name })}
                  className="btn btn-outline-primary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Star size={14} /> Write Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Summary Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={18} color="var(--primary-600)" /> Shipping Address
            </h4>
            <strong style={{ fontSize: '0.9rem' }}>{order.shippingAddress?.name}</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.35rem' }}>Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Payment & Totals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Method</span>
                <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items Subtotal</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>Discount</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary-600)' }}>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Request Modal */}
      {showReturnModal && (
        <ReturnRequestModal
          orderId={order._id}
          orderNumber={order.orderNumber}
          onClose={() => setShowReturnModal(false)}
          onSuccess={fetchOrder}
        />
      )}

      {/* Write Review Modal */}
      {reviewProduct && (
        <WriteReviewModal
          productId={reviewProduct.id}
          productName={reviewProduct.name}
          onClose={() => setReviewProduct(null)}
          onSuccess={() => alert('Review submitted successfully!')}
        />
      )}
    </div>
  );
};
