import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, Truck, ChevronRight } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/my-orders')
      .then((res) => {
        setOrders(res.data.orders);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card-glass" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Orders Placed Yet</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          When you place an order, it will appear here so you can track delivery and manage items.
        </p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Orders ({orders.length})</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orders.map((order) => (
          <div key={order._id} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)' }}>{order.orderNumber}</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-bestseller' : order.orderStatus === 'Cancelled' ? 'badge-discount' : 'badge-new'}`}>
                  {order.orderStatus}
                </span>
                <Link to={`/account/orders/${order._id}`} className="btn btn-secondary btn-sm">
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Products Thumbnails Preview */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
                {order.items?.map((item: any, i: number) => (
                  <img
                    key={i}
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', padding: '2px', backgroundColor: '#fff' }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.items?.length || 1} Items</span>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{order.totalAmount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
