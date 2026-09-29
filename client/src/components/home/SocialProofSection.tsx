import React from 'react';
import { Star, CheckCircle, Instagram, Heart, MessageCircle } from 'lucide-react';

interface ReviewTestimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  productName: string;
  title: string;
  comment: string;
}

export const SocialProofSection: React.FC = () => {
  const reviews: ReviewTestimonial[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      location: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      rating: 5,
      productName: 'MAC Ruby Woo Matte Lipstick',
      title: 'Absolute holy grail red lipstick!',
      comment: 'Ruby Woo is hands down the best classic matte red lipstick ever made. Long lasting and stays through all my meals during festive events!'
    },
    {
      id: '2',
      name: 'Ananya Roy',
      location: 'Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      rating: 5,
      productName: 'The Ordinary Niacinamide Serum',
      title: 'Cleared my acne scars in 3 weeks',
      comment: 'Super lightweight and non-sticky. My pores look noticeably tighter and my skin texture is so much smoother now!'
    },
    {
      id: '3',
      name: 'Riya Sen',
      location: 'Delhi',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
      rating: 5,
      productName: 'Maybelline Fit Me Foundation',
      title: 'Perfect natural matte finish for hot weather',
      comment: 'Fits my warm skin tone perfectly and controls shine throughout the hot day. Fast delivery by GlowCart!'
    }
  ];

  const socialPosts = [
    { id: 'p1', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', likes: '1.2k', handle: '@priya_beauty' },
    { id: 'p2', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', likes: '890', handle: '@ananya_glow' },
    { id: 'p3', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', likes: '2.4k', handle: '@riya_makeup' },
    { id: 'p4', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', likes: '1.5k', handle: '@luxury_scents' }
  ];

  return (
    <section
      role="region"
      aria-label="Social Proof and Customer Reviews"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Loved By 50,000+ Beauty Lovers
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Real Reviews, Real Glow
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Hear from verified beauty enthusiasts who trust GlowCart for authentic skincare and makeup.
          </p>
        </div>

        {/* Customer Review Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              className="card-glass"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* User Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <img
                    src={r.avatar}
                    alt={r.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{r.name}</h4>
                      <span title="Verified Buyer" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <CheckCircle size={14} color="#16a34a" />
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {r.location} • Verified Purchase
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>

                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  "{r.title}"
                </h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {r.comment}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                Bought: {r.productName}
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Feed Grid */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Instagram size={20} color="var(--primary-600)" /> Join #GlowCartBeauty Community
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Tag @GlowCartBeauty on Instagram to be featured on our homepage!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {socialPosts.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
              className="social-post-card"
            >
              <img src={p.img} alt="Community Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15,23,42,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.25s ease'
                }}
                className="social-hover-overlay"
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.handle}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Heart size={14} fill="#fff" /> {p.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MessageCircle size={14} /> 24
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .social-post-card:hover .social-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};
