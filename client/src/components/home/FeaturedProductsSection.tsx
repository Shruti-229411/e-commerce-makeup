import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/slices/productSlice';
import { ProductCard } from '../product/ProductCard';

export const FeaturedProductsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'bestseller' | 'new'>('featured');
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.product);

  useEffect(() => {
    let params: any = { limit: 8 };
    if (activeTab === 'featured') {
      params.featured = 'true';
    } else if (activeTab === 'bestseller') {
      params.bestseller = 'true';
    } else if (activeTab === 'new') {
      params.sort = '-createdAt';
    }
    dispatch(fetchProducts(params));
  }, [activeTab, dispatch]);

  return (
    <section
      role="region"
      aria-label="Featured and Bestseller Products"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Header & Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Flame size={14} /> Trending Beauty Catalog
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '1.25rem' }}>
            Featured & Bestsellers
          </h2>

          {/* Tab Controls */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-surface)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '100%'
            }}
          >
            <button
              onClick={() => setActiveTab('featured')}
              aria-selected={activeTab === 'featured'}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'featured' ? 'var(--primary-600)' : 'transparent',
                color: activeTab === 'featured' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              Featured Glow
            </button>

            <button
              onClick={() => setActiveTab('bestseller')}
              aria-selected={activeTab === 'bestseller'}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'bestseller' ? 'var(--primary-600)' : 'transparent',
                color: activeTab === 'bestseller' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              🔥 Bestsellers
            </button>

            <button
              onClick={() => setActiveTab('new')}
              aria-selected={activeTab === 'new'}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'new' ? 'var(--primary-600)' : 'transparent',
                color: activeTab === 'new' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              ✨ New Arrivals
            </button>
          </div>
        </div>

        {/* Grid Display */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading products...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            to="/products"
            className="btn btn-primary btn-lg"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Explore Entire Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
