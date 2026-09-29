import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import api from '../../services/api';
import { Package, Heart, MapPin, RefreshCw, Star, ChevronRight, User, ShieldCheck } from 'lucide-react';

export const AccountOverviewPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [ordersRes, addressRes, wishlistRes] = await Promise.allSettled([
          api.get('/orders/my-orders'),
          api.get('/addresses'),
          api.get('/wishlist')
        ]);

        if (ordersRes.status === 'fulfilled') {
          setRecentOrders(ordersRes.value.data.orders.slice(0, 2));
        }

        if (addressRes.status === 'fulfilled') {
          setAddresses(addressRes.value.data.addresses || []);
        }

        if (wishlistRes.status === 'fulfilled') {
          setWishlistCount(wishlistRes.value.data.wishlist?.products?.length || 0);
        }
      } catch (err) {
        console.error('Error loading account overview:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card-glass" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(233,30,99,0.08) 0%, rgba(156,39,176,0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome back, {user?.firstName}!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {user?.email} • Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <Link to="/account/orders" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>View All</h4>
          </div>
        </Link>

        <Link to="/wishlist" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fce7f3', color: '#be185d', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <Heart size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wishlist</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{wishlistCount} Saved</h4>
          </div>
        </Link>

        <Link to="/account/addresses" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <MapPin size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Addresses</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{addresses.length} Saved</h4>
          </div>
        </Link>

        <Link to="/account/returns" className="card-glass" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <RefreshCw size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Self-Service</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Returns</h4>
          </div>
        </Link>
      </div>

      {/* Grid: Recent Orders & Saved Address Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Recent Orders Box */}
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Orders</h3>
            <Link to="/account/orders" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)', textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>

          {isLoading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading recent orders...</p>
          ) : recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent orders found. Time to pamper yourself!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map((order) => (
                <div key={order._id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{order.orderNumber}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 1} items
                    </span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.2rem' }}>₹{order.totalAmount}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-bestseller' : 'badge-new'}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                      {order.orderStatus}
                    </span>
                    <br />
                    <Link to={`/account/orders/${order._id}`} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                      Details <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Address & Beauty Profile Quick Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={18} color="var(--primary-600)" /> Default Address
            </h4>
            {defaultAddress ? (
              <div style={{ fontSize: '0.85rem' }}>
                <strong>{defaultAddress.name}</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {defaultAddress.addressLine}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
                </p>
                <p style={{ marginTop: '0.25rem', fontWeight: 600 }}>Phone: {defaultAddress.phone}</p>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No default shipping address set yet.</p>
            )}
            <Link to="/account/addresses" style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              Manage Addresses &rarr;
            </Link>
          </div>

          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} color="var(--primary-600)" /> Beauty Profile
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <p><strong>Skin Type:</strong> {user?.preferences?.skinType || 'Not specified'}</p>
              <p><strong>Hair Type:</strong> {user?.preferences?.hairType || 'Not specified'}</p>
            </div>
            <Link to="/account/profile" style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              Edit Profile & Settings &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
