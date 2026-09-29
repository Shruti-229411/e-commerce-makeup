import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sparkles, Award } from 'lucide-react';

interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  active: boolean;
}

export const BrandCarousel: React.FC = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/brands')
      .then((res) => {
        const activeBrands = (res.data.brands || []).filter((b: IBrand) => b.active);
        setBrands(activeBrands);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load brands for carousel:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', opacity: 0.6 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ width: '120px', height: '48px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return null; // Empty state handles cleanly
  }

  // Duplicate the brand list to create a seamless 100% infinite loop
  const loopBrands = [...brands, ...brands];

  return (
    <section
      aria-label="Official Beauty Brands Carousel"
      style={{
        padding: '2.5rem 0',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="container" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Award size={16} /> 100% Authentic Brands & Partners
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Shop By Official Luxury Brands
        </h2>
      </div>

      {/* Infinite Moving Marquee Track */}
      <div className="brand-carousel-viewport" style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
        <div className="brand-carousel-track">
          {loopBrands.map((brand, index) => (
            <Link
              key={`${brand._id}-${index}`}
              to={`/brand/${brand.slug}`}
              className="brand-carousel-item"
              aria-label={`Shop ${brand.name} official products`}
              title={`Explore ${brand.name}`}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                  style={{
                    maxHeight: '42px',
                    maxWidth: '130px',
                    objectFit: 'contain',
                    filter: 'grayscale(30%) opacity(0.85)',
                    transition: 'all 0.25s ease'
                  }}
                />
              ) : null}
              <span
                className="brand-fallback-text"
                style={{
                  display: brand.logo ? 'none' : 'block',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.5px'
                }}
              >
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Component Styles & Animations */}
      <style>{`
        .brand-carousel-track {
          display: flex;
          align-items: center;
          gap: 3rem;
          width: max-content;
          animation: marquee-scroll ${Math.max(15, brands.length * 3.5)}s linear infinite;
          will-change: transform;
        }

        .brand-carousel-track:hover,
        .brand-carousel-track:focus-within {
          animation-play-state: paused;
        }

        .brand-carousel-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          transition: all 0.25s ease;
          text-decoration: none;
          flex-shrink: 0;
          min-width: 140px;
          height: 64px;
        }

        .brand-carousel-item:hover {
          border-color: var(--primary-500);
          box-shadow: 0 4px 14px rgba(233, 30, 99, 0.15);
          transform: translateY(-2px);
          background: #ffffff;
        }

        .brand-carousel-item:hover img {
          filter: grayscale(0%) opacity(1) scale(1.05);
        }

        .brand-carousel-item:focus-visible {
          outline: 2px solid var(--primary-500);
          outline-offset: 3px;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Accessibility: Prefers Reduced Motion Fallback */
        @media (prefers-reduced-motion: reduce) {
          .brand-carousel-track {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
            gap: 1rem;
          }
          .brand-carousel-item {
            min-width: 120px;
          }
        }
      `}</style>
    </section>
  );
};
