import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface SpotlightCollection {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  badgeColor: string;
}

export const SpotlightCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const collections: SpotlightCollection[] = [
    {
      id: 'glass-skin',
      tag: 'K-BEAUTY TREND',
      title: '10-Step Glass Skin Edit',
      subtitle: 'Double cleansing oils, mucin essences & peptide hydrating creams.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      link: '/category/skincare',
      badgeColor: '#e91e63'
    },
    {
      id: 'red-lipsticks',
      tag: 'ICONIC SHADES',
      title: 'The Ultimate Red Lips',
      subtitle: 'Vivid blue-reds, velvety berries, and transfer-proof liquid lipsticks.',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
      link: '/category/makeup',
      badgeColor: '#be185d'
    },
    {
      id: 'hair-recovery',
      tag: 'NOURISH & SHINE',
      title: 'Monsoon Hair Repair',
      subtitle: 'Ayurvedic cold-pressed oils, biotin shampoos & anti-frizz serums.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600',
      link: '/category/haircare',
      badgeColor: '#059669'
    },
    {
      id: 'festive-scents',
      tag: 'LUXURY EDITIONS',
      title: 'Festive Signature Scents',
      subtitle: 'Oud wood, damask rose, and vanilla amber Eau de Parfums.',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600',
      link: '/category/fragrance',
      badgeColor: '#7c3aed'
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      role="region"
      aria-label="Spotlight Collections Carousel"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} /> Curated Spotlights
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Spotlight Collections</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous collection"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} color="var(--text-primary)" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next collection"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={20} color="var(--text-primary)" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '1rem',
            scrollbarWidth: 'none'
          }}
        >
          {collections.map((item) => (
            <div
              key={item.id}
              className="card-glass"
              style={{
                width: 'calc(100vw - 3.5rem)',
                maxWidth: '340px',
                minWidth: '250px',
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: item.badgeColor,
                    color: '#fff',
                    fontSize: '0.675rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {item.subtitle}
                </p>

                <Link
                  to={item.link}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                >
                  Shop Spotlight <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
