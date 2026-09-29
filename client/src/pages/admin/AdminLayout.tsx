import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  ShoppingCart,
  Users,
  Tag,
  RefreshCw,
  Star,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/brands', label: 'Brands', icon: Award },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/inventory', label: 'Inventory Stock', icon: Layers },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/returns', label: 'Return Requests', icon: RefreshCw },
    { to: '/admin/reviews', label: 'Review Moderation', icon: Star }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100
        }}
      >
        {/* Brand Header */}
        <div style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff' }}>
            <Sparkles size={24} color="#e91e63" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              GlowCart <span style={{ color: '#e91e63', fontSize: '0.85rem' }}>Admin</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
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
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--primary-500)' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Admin User */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #334155', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
              {user?.firstName?.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={12} /> Administrator
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #475569',
              backgroundColor: 'transparent',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} /> Sign Out of Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-light)',
            padding: '0.85rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 90
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>GlowCart Executive Portal</span>
            <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>Store Management & Operational Dashboard</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}>
              View Storefront &rarr;
            </a>

            {/* Top-Right Admin Profile / Account Dropdown Control */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-primary)',
                  cursor: 'pointer'
                }}
                aria-label="Admin Account Menu"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#e91e63',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                  }}
                >
                  {user?.firstName?.charAt(0) || 'A'}
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.firstName} {user?.lastName}
                </span>
              </button>

              {isAdminMenuOpen && (
                <div
                  className="card-glass"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '125%',
                    width: '220px',
                    padding: '0.5rem',
                    zIndex: 120,
                    boxShadow: 'var(--shadow-md)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.875rem' }}>{user?.firstName} {user?.lastName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    <span className="badge badge-featured" style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                      Administrator Privileges
                    </span>
                  </div>

                  <a
                    href="/account/profile"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsAdminMenuOpen(false)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    👤 Admin Profile & Account
                  </a>

                  <a
                    href="/account/profile"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsAdminMenuOpen(false)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    🔒 Change Security Password
                  </a>

                  <button
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#dc2626',
                      width: '100%',
                      textAlign: 'left',
                      fontWeight: 700,
                      borderTop: '1px solid var(--border-light)',
                      marginTop: '0.25rem',
                      paddingTop: '0.6rem'
                    }}
                  >
                    <LogOut size={15} /> Sign Out of Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
