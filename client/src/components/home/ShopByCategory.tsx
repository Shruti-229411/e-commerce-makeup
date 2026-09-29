import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SubCat {
  name: string;
  slug: string;
}

interface CategoryCardItem {
  name: string;
  slug: string;
  img: string;
  count: string;
  description: string;
  subcategories: SubCat[];
}

export const ShopByCategory: React.FC = () => {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);

  const categories: CategoryCardItem[] = [
    {
      name: 'Makeup & Cosmetics',
      slug: 'makeup',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
      count: '18 Products',
      description: 'Iconic lipsticks, flawless foundation & eye palettes',
      subcategories: [
        { name: 'Lipstick', slug: 'lipstick-lip-care' },
        { name: 'Foundation', slug: 'foundation-concealer' },
        { name: 'Eye Makeup', slug: 'eye-makeup' }
      ]
    },
    {
      name: 'Skincare Essentials',
      slug: 'skincare',
      img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
      count: '15 Products',
      description: 'Derm-tested serums, moisturizers & sunscreens',
      subcategories: [
        { name: 'Serums', slug: 'serums-essences' },
        { name: 'Moisturizers', slug: 'moisturizers-creams' },
        { name: 'Sunscreens', slug: 'sunscreens' }
      ]
    },
    {
      name: 'Haircare & Serums',
      slug: 'haircare',
      img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600',
      count: '8 Products',
      description: 'Nourishing oils, shampoos & hair growth masks',
      subcategories: [
        { name: 'Shampoos', slug: 'shampoo-conditioner' },
        { name: 'Hair Oils', slug: 'hair-oils-masks' }
      ]
    },
    {
      name: 'Luxury Fragrance',
      slug: 'fragrance',
      img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600',
      count: '6 Products',
      description: 'Artisanal Eau de Parfum, body mists & deodorants',
      subcategories: [
        { name: 'Perfumes', slug: 'perfumes' },
        { name: 'Body Mists', slug: 'perfumes' }
      ]
    },
    {
      name: 'Bath & Body Care',
      slug: 'bath-body',
      img: 'https://images.unsplash.com/photo-1608248597560-5a3d75c24e64?w=600',
      count: '5 Products',
      description: 'Exfoliating body washes, scrubs & lotions',
      subcategories: [
        { name: 'Body Lotions', slug: 'body-lotions' }
      ]
    },
    {
      name: 'Wellness & Teas',
      slug: 'wellness',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
      count: '4 Products',
      description: 'Glow collagen powders & herbal detox teas',
      subcategories: [
        { name: 'Supplements', slug: 'wellness' }
      ]
    }
  ];

  return (
    <section
      role="region"
      aria-label="Shop By Category"
      style={{ padding: '3.5rem 1rem', backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="container">
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Curated Catalog
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Shop By Category</h2>
          </div>
          <Link
            to="/products"
            className="btn btn-outline-primary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            Explore All Categories <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="card-glass"
              onMouseEnter={() => setActiveCategorySlug(cat.slug)}
              onMouseLeave={() => setActiveCategorySlug(null)}
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                transform: activeCategorySlug === cat.slug ? 'translateY(-4px)' : 'none',
                boxShadow: activeCategorySlug === cat.slug ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
              }}
            >
              <div>
                {/* Image Wrap */}
                <Link to={`/category/${cat.slug}`} style={{ display: 'block', overflow: 'hidden', height: '200px', position: 'relative' }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      transform: activeCategorySlug === cat.slug ? 'scale(1.06)' : 'scale(1)'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {cat.count}
                  </span>
                </Link>

                {/* Content */}
                <div style={{ padding: '1.25rem 1.25rem 0.75rem 1.25rem' }}>
                  <Link to={`/category/${cat.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      {cat.name}
                    </h3>
                  </Link>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {cat.description}
                  </p>

                  {/* Subcategories Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                <Link
                  to={`/category/${cat.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary-600)',
                    textDecoration: 'none'
                  }}
                >
                  <span>Browse {cat.name}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
