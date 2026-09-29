import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut, ShieldAlert, Menu, X, Sparkles, ChevronRight, Tag, BookOpen, Award } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { fetchBrands } from '../../store/slices/productSlice';
import { AnnouncementBar } from '../home/AnnouncementBar';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [activeBrandTab, setActiveBrandTab] = useState<'POPULAR' | 'LUXE' | 'ONLY AT GLOWCART' | 'NEW LAUNCHES'>('POPULAR');
  const [selectedLetter, setSelectedLetter] = useState('*');

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { brands: apiBrands } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiBrands || apiBrands.length === 0) {
      dispatch(fetchBrands());
    }
  }, [dispatch, apiBrands]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const categoryNavItems = [
    { name: 'Makeup', path: '/category/makeup' },
    { name: 'Skincare', path: '/category/skincare' },
    { name: 'Haircare', path: '/category/haircare' },
    { name: 'Fragrance', path: '/category/fragrance' },
    { name: 'Bath & Body', path: '/category/bath-body' },
    { name: 'Wellness', path: '/category/wellness' },
    { name: 'Brands', path: '/brands' },
    { name: '🔥 Offers', path: '/offers', isSpecial: true },
    { name: '✨ Beauty Advice', path: '/beauty-advice', isPurple: true }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* 1. AnnouncementBar */}
      <AnnouncementBar />

      {/* Main Header Bar */}
      <div className="container" style={{ padding: '0.75rem 1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', flexShrink: 0 }}>
            <div
              style={{
                backgroundColor: 'var(--primary-500)',
                color: '#fff',
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(233,30,99,0.3)'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(135deg, #e91e63 0%, #be185d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                GlowCart
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Beauty & Lifestyle
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <form
            onSubmit={handleSearch}
            className="header-search-desktop"
            style={{ flex: 1, maxWidth: '520px', position: 'relative' }}
          >
            <input
              type="text"
              className="input-field"
              placeholder="Search lipsticks, serums, brands like MAC, Maybelline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
          </form>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)' }}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, marginTop: '2px' }} className="header-icon-label">
                Wishlist
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)' }}
              title="Cart"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, marginTop: '2px' }} className="header-icon-label">
                Cart
              </span>
            </Link>

            {/* Account Menu */}
            <div style={{ position: 'relative' }}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                    aria-label="User Account Menu"
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-500)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}
                    >
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }} className="header-icon-label">
                      {user?.firstName}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="card-glass"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        width: '210px',
                        padding: '0.5rem',
                        zIndex: 110,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                        {user?.role === 'admin' && (
                          <span className="badge badge-featured" style={{ marginTop: '0.25rem', fontSize: '0.65rem' }}>
                            Administrator
                          </span>
                        )}
                      </div>

                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.825rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <User size={15} /> My Account
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{
                            padding: '0.45rem 0.65rem',
                            fontSize: '0.825rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--primary-600)',
                            fontWeight: 600
                          }}
                        >
                          <ShieldAlert size={15} /> Admin Portal
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        style={{
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.825rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          color: '#dc2626',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="header-mobile-toggle"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '4px',
                cursor: 'pointer',
                display: 'none'
              }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dedicated Full-Width Search Bar */}
        <form
          onSubmit={handleSearch}
          className="header-search-mobile"
          style={{ marginTop: '0.6rem', position: 'relative' }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Search lipsticks, serums, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.25rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              paddingTop: '0.45rem',
              paddingBottom: '0.45rem'
            }}
          />
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
        </form>
      </div>

      {/* Category Navigation Ribbon (Desktop / Tablet) */}
      <nav className="header-nav-ribbon" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-surface)', position: 'relative' }}>
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            overflowX: 'visible',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            scrollbarWidth: 'none'
          }}
        >
          {categoryNavItems.map((item) => {
            if (item.name === 'Brands') {
              return (
                <div
                  key={item.name}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setIsBrandMenuOpen(true)}
                  onMouseLeave={() => setIsBrandMenuOpen(false)}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
                    style={{
                      color: isBrandMenuOpen ? 'var(--primary-600)' : 'var(--text-primary)',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    Brands
                  </Link>

                  {/* Nykaa-Style Brand Mega Menu Popover */}
                  {isBrandMenuOpen && (
                    <div
                      className="card-glass"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '-100px',
                        width: '880px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
                        zIndex: 200,
                        display: 'flex',
                        padding: '1.25rem',
                        gap: '1.5rem'
                      }}
                    >
                      {/* Left Column: Search & A-Z Index */}
                      <div style={{ width: '260px', borderRight: '1px solid var(--border-light)', paddingRight: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Search Brands"
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            style={{ paddingLeft: '2.2rem', fontSize: '0.8rem', paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
                          />
                          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minHeight: '260px' }}>
                          {/* Brand Text List */}
                          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOP BRANDS</span>
                            {(apiBrands || []).filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase())).map((b) => (
                              <Link
                                key={b._id}
                                to={`/brand/${b.slug}`}
                                onClick={() => setIsBrandMenuOpen(false)}
                                style={{ fontSize: '0.825rem', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}
                              >
                                {b.name}
                              </Link>
                            ))}
                          </div>

                          {/* A-Z Quick Index Sidebar */}
                          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', gap: '2px', alignItems: 'center' }}>
                            {'* ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                              <span
                                key={letter}
                                onClick={() => setSelectedLetter(letter)}
                                style={{ color: selectedLetter === letter ? 'var(--primary-600)' : 'var(--text-muted)' }}
                              >
                                {letter}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Tabbed Brand Logo Grid (Nykaa Style) */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Tabs Bar */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                          {(['POPULAR', 'LUXE', 'ONLY AT GLOWCART', 'NEW LAUNCHES'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveBrandTab(tab)}
                              style={{
                                flex: 1,
                                padding: '0.5rem 0',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: activeBrandTab === tab ? '#fff' : 'var(--text-secondary)',
                                backgroundColor: activeBrandTab === tab ? '#be185d' : '#f1f5f9',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* 5-Column Clean Brand Logo Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', flex: 1 }}>
                          {(apiBrands || []).slice(0, 15).map((brand) => (
                            <Link
                              key={brand._id}
                              to={`/brand/${brand.slug}`}
                              onClick={() => setIsBrandMenuOpen(false)}
                              style={{
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.65rem 0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                backgroundColor: '#ffffff',
                                transition: 'all 0.2s ease'
                              }}
                              className="brand-mega-card"
                            >
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                style={{ maxHeight: '28px', maxWidth: '85px', objectFit: 'contain', marginBottom: '4px' }}
                              />
                              <span style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.1 }}>
                                {brand.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  color: item.isSpecial ? 'var(--primary-600)' : item.isPurple ? 'var(--accent-purple)' : 'var(--text-primary)',
                  fontWeight: item.isSpecial || item.isPurple ? 700 : 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          className="header-mobile-drawer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
            Catalog Categories
          </div>

          {categoryNavItems.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                color: cat.isSpecial ? 'var(--primary-600)' : cat.isPurple ? 'var(--accent-purple)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              <span>{cat.name}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </Link>
          ))}
        </div>
      )}

      {/* Media Queries for Header Responsiveness */}
      <style>{`
        @media (max-width: 767px) {
          .header-search-desktop {
            display: none !important;
          }
          .header-search-mobile {
            display: block !important;
          }
          .header-mobile-toggle {
            display: block !important;
          }
          .header-nav-ribbon {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .header-search-desktop {
            display: block !important;
          }
          .header-search-mobile {
            display: none !important;
          }
          .header-mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .header-icon-label {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
