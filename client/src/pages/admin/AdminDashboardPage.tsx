import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  RefreshCw,
  Star,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => {
        setStats(res.data.stats);
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading live database analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Store Analytics & Admin Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Live server-aggregated business stats directly from MongoDB Atlas.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Revenue</span>
            <BarChart3 size={22} color="#10b981" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>₹{stats?.totalRevenue || 0}</p>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Calculated from active orders</span>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Orders</span>
            <ShoppingCart size={22} color="#3b82f6" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats?.totalOrders || 0}</p>
          <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700 }}>{stats?.pendingOrders || 0} pending dispatch</span>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Catalog Products</span>
            <Package size={22} color="#a855f7" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats?.totalProducts || 0}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats?.activeProducts || 0} active in catalog</span>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Low Stock Warnings</span>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: stats?.lowStockProducts > 0 ? '#ef4444' : 'inherit' }}>
            {stats?.lowStockProducts || 0}
          </p>
          <Link to="/admin/inventory" style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, textDecoration: 'none' }}>
            Manage stock levels &rarr;
          </Link>
        </div>
      </div>

      {/* Grid: Recent Orders & Top Selling Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Recent Orders List */}
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Customer Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)', textDecoration: 'none' }}>
              View All Orders &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.recentOrders?.map((order: any) => (
              <div key={order._id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-600)' }}>{order.orderNumber}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Customer: {order.user?.firstName} {order.user?.lastName} ({order.user?.email})
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-bestseller' : 'badge-new'}`}>
                    {order.orderStatus}
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.2rem' }}>₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--primary-600)" /> Top Selling Products
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.topSellingProducts?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.65rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '0.9rem' }}>#{idx + 1}</span>
                <img src={item._id?.images?.[0] || '/uploads/products/default.jpg'} alt="p" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item._id?.name || 'Product'}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty Sold: {item.totalQuantity}</span>
                </div>
                <strong style={{ fontSize: '0.85rem' }}>₹{item.totalSales}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
