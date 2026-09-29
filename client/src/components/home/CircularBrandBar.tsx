import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBrands } from '../../store/slices/productSlice';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';

export const CircularBrandBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brands: apiBrands } = useAppSelector((state) => state.product);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!apiBrands || apiBrands.length === 0) {
      dispatch(fetchBrands());
    }
  }, [dispatch, apiBrands]);

  // Use API brands if loaded, otherwise fallback list with correct database slugs
  const displayBrands = (apiBrands && apiBrands.length > 0)
    ? apiBrands.map((b) => ({
        name: b.name,
        slug: b.slug,
        logo: b.logo,
        tagline: b.description ? b.description.slice(0, 20) + '...' : 'Luxury Brand'
      }))
    : [
        { name: 'MAC Cosmetics', slug: 'mac-cosmetics', logo: 'https://images.unsplash.com/photo-1583241799056-e2d304956d47?w=300', tagline: 'Pro Beauty' },
        { name: 'Maybelline', slug: 'maybelline', logo: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300', tagline: 'NYC Makeup' },
        { name: 'Lakmé', slug: 'lakme', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300', tagline: 'Indian Luxury' },
        { name: "L'Oréal Paris", slug: 'loreal-paris', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300', tagline: 'Parisian Edit' },
        { name: 'The Ordinary', slug: 'the-ordinary', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', tagline: 'Clinical Care' },
        { name: 'Clinique', slug: 'clinique', logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', tagline: 'Derm Tested' },
        { name: 'Dior', slug: 'dior', logo: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300', tagline: 'Haute Beauty' },
        { name: 'YSL Beauty', slug: 'ysl-beauty', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300', tagline: 'Couture Glam' },
        { name: 'Forest Essentials', slug: 'forest-essentials', logo: 'https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=300', tagline: 'Ayurvedic Luxury' },
        { name: 'Plum', slug: 'plum', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300', tagline: '100% Vegan' },
        { name: 'Innisfree', slug: 'innisfree', logo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300', tagline: 'Jeju Natural' },
        { name: 'Nivea', slug: 'nivea', logo: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300', tagline: 'Body Care' }
      ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      role="region"
      aria-label="Top Brands Circular Bar"
      style={{
        padding: '3rem 1rem',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={14} /> Official Brand Stores
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Shop Top Brands</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous brand"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={18} color="var(--text-primary)" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next brand"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={18} color="var(--text-primary)" />
            </button>
          </div>
        </div>

        {/* Circular Avatar Cards Row */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.5rem',
            maxWidth: '100%',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '0.5rem 0 1rem 0',
            scrollbarWidth: 'none'
          }}
        >
          {displayBrands.map((b) => (
            <Link
              key={b.slug}
              to={`/brand/${b.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                width: '100px'
              }}
            >
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--accent-gold) 100%)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="brand-circular-avatar"
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={b.logo}
                    alt={b.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginTop: '0.65rem',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}
              >
                {b.name}
              </span>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                {b.tagline}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .brand-circular-avatar:hover {
          transform: scale(1.08);
          box-shadow: 0 0 15px rgba(233,30,99,0.35) !important;
        }
      `}</style>
    </section>
  );
};
