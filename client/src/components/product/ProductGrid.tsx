import React from 'react';
import { ProductCard } from './ProductCard';
import { IProduct } from '../../types';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: IProduct[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="card-glass" style={{ height: '360px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%' }} />
            <div className="skeleton" style={{ height: '24px', width: '80%' }} />
            <div className="skeleton" style={{ height: '20px', width: '50%' }} />
            <div className="skeleton" style={{ height: '36px', width: '100%', marginTop: 'auto', borderRadius: 'var(--radius-md)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="card-glass" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', margin: '1rem 0' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <Sparkles size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Products Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
          We couldn't find any products matching your active filter criteria or search query. Try clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
