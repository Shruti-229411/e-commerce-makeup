import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  bgColor: string;
}

export const HeroPromoSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides: Slide[] = [
    {
      id: 'festive-glow',
      badge: 'FESTIVE GLOW SEASON SALE',
      title: 'Unveil Your True Radiance with',
      highlightText: 'GlowCart Luxury',
      subtitle: 'Explore over 50+ luxury lipsticks, dermatologist-approved serums, and signature perfumes with up to 40% OFF.',
      ctaText: 'Shop Luxury Beauty',
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      bgColor: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)'
    },
    {
      id: 'derm-skincare',
      badge: 'DERMATOLOGIST APPROVED',
      title: 'Glass Skin Serums &',
      highlightText: 'Pure Moisture',
      subtitle: 'Target dark spots, fine lines, and hydration barriers with clinical K-beauty & clinical formulations.',
      ctaText: 'Explore Skincare',
      ctaLink: '/category/skincare',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      bgColor: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
    },
    {
      id: 'luxury-fragrance',
      badge: 'SIGNATURE SCENTS',
      title: 'Captivate the Senses with',
      highlightText: 'Luxury Fragrance',
      subtitle: 'Indulge in long-lasting Eau de Parfum, delicate floral body mists, and artisanal solid perfumes.',
      ctaText: 'Discover Perfumes',
      ctaLink: '/category/fragrance',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      bgColor: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)'
    }
  ];

  // Respect prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const slide = slides[currentSlide];

  return (
    <section
      role="region"
      aria-label="Hero Promotion Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: slide.bgColor,
        padding: '3.5rem 1rem',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s ease-in-out'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            alignItems: 'center',
            gap: '2rem'
          }}
        >
          {/* Content Column */}
          <div style={{ animation: 'fade-in 0.4s ease-in-out' }}>
            <span
              className="badge badge-bestseller"
              style={{
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={14} /> {slide.badge}
            </span>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}
            >
              {slide.title}{' '}
              <span style={{ color: 'var(--primary-600)', display: 'inline-block' }}>
                {slide.highlightText}
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.75rem',
                maxWidth: '520px',
                lineHeight: 1.6
              }}
            >
              {slide.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={slide.ctaLink} className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
                {slide.ctaText} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Image Column */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 25px -5px rgba(233,30,99,0.2)',
                width: '100%',
                maxHeight: '420px',
                objectFit: 'cover',
                margin: '0 auto',
                transition: 'transform 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid var(--border-light)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={22} color="var(--text-primary)" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid var(--border-light)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronRight size={22} color="var(--text-primary)" />
      </button>

      {/* Pagination Dot Indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: currentSlide === idx ? '28px' : '10px',
              height: '10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: currentSlide === idx ? 'var(--primary-600)' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </section>
  );
};
