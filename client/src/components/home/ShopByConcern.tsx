import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../product/ProductCard';
import { IProduct } from '../../types';
import api from '../../services/api';

interface ConcernFilter {
  id: string;
  name: string;
  keyword: string;
  icon: string;
}

export const ShopByConcern: React.FC = () => {
  const [activeConcern, setActiveConcern] = useState<string>('acne');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const concerns: ConcernFilter[] = [
    { id: 'acne', name: 'Acne & Blemishes', keyword: 'serum', icon: '✨' },
    { id: 'anti-aging', name: 'Anti-Aging & Wrinkles', keyword: 'matte', icon: '🌸' },
    { id: 'dullness', name: 'Dullness & Glow', keyword: 'lipstick', icon: '💫' },
    { id: 'dryness', name: 'Dry & Dehydrated Skin', keyword: 'foundation', icon: '💧' },
    { id: 'frizz', name: 'Frizz Control', keyword: 'haircare', icon: '🌿' },
    { id: 'sun', name: 'Sun Protection', keyword: 'skincare', icon: '☀️' }
  ];

  useEffect(() => {
    const loadProductsByConcern = async () => {
      setLoading(true);
      try {
        const currentKeyword = concerns.find((c) => c.id === activeConcern)?.keyword || 'skincare';
        // Reuse existing catalog search/filter endpoint
        const res = await api.get('/products', { params: { search: currentKeyword, limit: 4 } });
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load products by concern', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductsByConcern();
  }, [activeConcern]);

  return (
    <section
      role="region"
      aria-label="Shop By Concern Section"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2rem auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} /> Tailored Skincare & Haircare
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Shop By Beauty Concern
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Target specific skin concerns with dermatologist-tested, clinically proven beauty solutions.
          </p>
        </div>

        {/* Concern Selector Pills Ribbon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '0.65rem',
            overflowX: 'auto',
            maxWidth: '100%',
            paddingBottom: '0.5rem',
            marginBottom: '2rem',
            scrollbarWidth: 'none'
          }}
        >
          {concerns.map((item) => {
            const isActive = activeConcern === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveConcern(item.id)}
                aria-pressed={isActive}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                  backgroundColor: isActive ? 'var(--primary-500)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 4px 14px rgba(233, 30, 99, 0.3)' : 'var(--shadow-sm)',
                  transition: 'all 0.25s ease'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid using existing ProductCard */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading concern solutions...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View Catalog Link */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            to={`/search?q=${encodeURIComponent(concerns.find((c) => c.id === activeConcern)?.keyword || '')}`}
            className="btn btn-outline-primary"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            View All {concerns.find((c) => c.id === activeConcern)?.name} Solutions <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
