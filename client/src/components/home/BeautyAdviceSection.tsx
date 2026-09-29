import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, ArrowRight, X, User } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  bannerImage: string;
}

export const BeautyAdviceSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  const articles: ArticleItem[] = [
    {
      id: 'glass-skin-guide',
      title: 'The Ultimate 10-Step Glass Skin Routine Guide',
      excerpt: 'Discover how K-beauty double cleansing, essences, and niacinamide lock in luminous moisture for translucent skin.',
      content: `Glass skin isn't about perfection; it's about intense hydration and skin barrier support.

Step 1: Oil Cleansing - Dissolve sunscreen, waterproof makeup, and sebum without stripping your barrier.
Step 2: Hydrating Water Cleanser - Follow with a gentle pH-balanced foaming cleanser.
Step 3: Exfoliate (Twice Weekly) - Use mild AHAs or BHAs to clear congested pores.
Step 4: Hydrating Toner - Layer lightweight hydrating toners 3-7 times for deep moisture saturation.
Step 5: Essence & Niacinamide Serum - Target hyperpigmentation and lock in glass-like radiance.
Step 6: Ceramide Moisture Cream - Seal all nutrients inside your skin barrier.
Step 7: Daily Broad-Spectrum SPF 50+ - Protect your glow against daily UV damage!`,
      author: 'Dr. Ananya Roy (Dermatologist)',
      category: 'Skincare',
      readTime: '5 min read',
      bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'
    },
    {
      id: 'foundation-undertone-guide',
      title: 'Finding Your Perfect Foundation Undertone in 3 Steps',
      excerpt: 'Stop wearing ghostly or orange foundation! Learn the vein test and jewelry rule to match warm, cool, or neutral shades.',
      content: `Matching foundation isn't just about shade depth; it's about undertones!

1. The Vein Test: Look at your inner wrist veins in natural daylight.
   - Blue or purple veins indicate Cool undertones (Pink / Rosy base).
   - Greenish veins indicate Warm undertones (Golden / Yellow base).
   - Can't tell? You likely have Neutral undertones.

2. The Jewelry Test:
   - Silver jewelry makes Cool skin pop.
   - Gold jewelry flatters Warm skin tones.

3. Jawline Swatch Rule:
   - Always swatch 3 candidate shades along your jawline in natural daylight. The right shade will vanish seamlessly into your skin and neck!`,
      author: 'Rohan Mehta (Master Makeup Artist)',
      category: 'Makeup',
      readTime: '4 min read',
      bannerImage: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800'
    },
    {
      id: 'hair-oiling-guide',
      title: 'Ayurvedic Scalp Oiling & Anti-Frizz Rituals',
      excerpt: 'Revitalize dull hair strands with warm bhringraj, rosemary, and cold-pressed coconut oil therapies.',
      content: `Scalp oiling is an ancient Ayurvedic ritual designed to nourish hair roots and balance scalp sebum.

- Warm 2 tablespoons of Bhringraj & Rosemary infused oil.
- Section your hair and massage gently using fingertip pads for 10 minutes to stimulate blood circulation.
- Wrap hair in a warm damp towel for 30 minutes before washing with a sulphate-free shampoo.
- Result: Silky, lustrous locks with zero frizz!`,
      author: 'Priya Sharma (Wellness Editor)',
      category: 'Haircare',
      readTime: '3 min read',
      bannerImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800'
    }
  ];

  return (
    <section
      role="region"
      aria-label="Beauty Advice and Guides"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} /> Expert Beauty Advice
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Glow Magazine & Guides</h2>
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {articles.map((item) => (
            <div
              key={item.id}
              className="card-glass"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.bannerImage}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'var(--primary-600)',
                      color: '#fff',
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={12} /> {item.author}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {item.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                <button
                  onClick={() => setActiveArticle(item)}
                  className="btn btn-outline-primary btn-sm"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                >
                  Read Full Guide <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="card-glass"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <span className="badge badge-bestseller" style={{ marginBottom: '0.75rem' }}>
              {activeArticle.category} • {activeArticle.readTime}
            </span>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {activeArticle.title}
            </h2>

            <p style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 700, marginBottom: '1.25rem' }}>
              By {activeArticle.author}
            </p>

            <img
              src={activeArticle.bannerImage}
              alt={activeArticle.title}
              style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}
            />

            <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {activeArticle.content}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', textAlign: 'right' }}>
              <button
                onClick={() => setActiveArticle(null)}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
