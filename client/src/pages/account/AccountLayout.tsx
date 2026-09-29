import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { User, Package, RefreshCw, MapPin, Star, Heart, LogOut, ShieldAlert, Settings } from 'lucide-react';

export const AccountLayout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { to: '/account', label: 'Overview', icon: User, end: true },
    { to: '/account/orders', label: 'My Orders', icon: Package },
    { to: '/account/returns', label: 'Returns & Refunds', icon: RefreshCw },
    { to: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
    { to: '/account/reviews', label: 'My Reviews', icon: Star },
    { to: '/wishlist', label: 'My Wishlist', icon: Heart },
    { to: '/account/profile', label: 'Profile & Settings', icon: Settings }
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Account Sidebar */}
        <aside className="card-glass" style={{ padding: '1.25rem', height: 'fit-content' }}>
          {/* User Brief */}
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              {user?.firstName?.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{user?.firstName} {user?.lastName}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                    color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  marginTop: '0.5rem'
                }}
              >
                <ShieldAlert size={18} />
                <span>Admin Portal</span>
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#dc2626',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                marginTop: '0.5rem'
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Content View */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
