import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBrands } from '../store/slices/productSlice';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

export const BrandListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brands, isLoading } = useAppSelector((state) => state.product);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
        <span className="badge badge-featured" style={{ marginBottom: '0.75rem' }}>Official Brand Partners</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Explore Top Beauty Brands</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Discover authentic cosmetics, skincare, and fragrance from world-leading luxury brand partners.
        </p>

        <div style={{ position: 'relative', marginTop: '1.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search brand name (e.g. MAC, Maybelline, Lakmé)..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {filteredBrands.map((brand) => (
          <Link
            key={brand._id}
            to={`/brand/${brand.slug}`}
            className="card-glass"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', transition: 'var(--transition-normal)' }}
          >
            <div>
              <div style={{ height: '60px', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img src={brand.logo} alt={brand.name} style={{ maxHeight: '100%', maxWidth: '140px', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{brand.name}</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {brand.description || 'Authentic luxury beauty product range.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', marginTop: '1rem' }}>
              <span className="badge badge-discount">{(brand as any).productCount || 0} Products</span>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Shop Brand <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
