import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { IProduct } from '../../types';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500';
  const brandName = (product.brand as any)?.name || 'Beauty';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div
      className="card-glass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        transition: 'var(--transition-normal)',
        overflow: 'hidden'
      }}
    >
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {product.discount > 0 && (
          <span className="badge badge-discount">{product.discount}% OFF</span>
        )}
        {product.isBestseller && (
          <span className="badge badge-bestseller">Bestseller</span>
        )}
        {product.isNewArrival && (
          <span className="badge badge-new">New</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        title="Save to Wishlist"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Heart
          size={18}
          color={isWishlisted ? '#e91e63' : '#64748b'}
          fill={isWishlisted ? '#e91e63' : 'none'}
        />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug}`} style={{ display: 'block', padding: '1.25rem 1rem 0.5rem 1rem', textAlign: 'center' }}>
        <div style={{ height: '200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={primaryImage}
            alt={product.name}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      </Link>

      {/* Content Section */}
      <div style={{ padding: '0.75rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Brand Name */}
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {brandName}
          </span>

          {/* Title */}
          <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.6em' }}>
              {product.name}
            </h3>
          </Link>

          {/* Rating Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div className="rating-pill">
              <span>{product.rating.toFixed(1)}</span>
              <Star size={12} fill="#fff" color="#fff" />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({product.reviewCount})
            </span>

            {/* Variant count badge */}
            {product.variants && product.variants.length > 1 && (
              <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, marginLeft: 'auto' }}>
                {product.variants.length} Options
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.mrp}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`btn ${isAddedToCart ? 'btn-secondary' : 'btn-outline-primary'} btn-sm`}
            style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
          >
            {isAddedToCart ? (
              <>
                <Check size={16} color="#16a34a" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
