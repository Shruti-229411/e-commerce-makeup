import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductBySlug, clearCurrentProduct } from '../store/slices/productSlice';
import { ProductGrid } from '../components/product/ProductGrid';
import { WriteReviewModal } from '../components/account/WriteReviewModal';
import api from '../services/api';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const { currentProduct: product, relatedProducts, isLoading, error } = useAppSelector(
    (state) => state.product
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('400050');
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'usage' | 'reviews'>('details');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchReviews = () => {
    if (product?._id) {
      api.get(`/reviews/product/${product._id}`).then((res) => setReviews(res.data.reviews || [])).catch(console.error);
    }
  };

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?._id) {
      fetchReviews();
    }
  }, [product?._id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #e91e63', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading beauty details...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <div className="card-glass" style={{ padding: '2.5rem' }}>
          <Sparkles size={48} color="var(--primary-500)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            We couldn't find the requested beauty product. It may have been renamed, moved, or is temporarily out of stock.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore All Products
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants?.[selectedVariantIndex] || {
    price: product.price,
    mrp: product.mrp,
    stock: product.stock
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Product Detail Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
        {/* Left: Image Gallery */}
        <div>
          <div className="card-glass" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                    padding: '2px',
                    backgroundColor: '#fff'
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div>
          {/* Brand & Category */}
          <Link to={`/brand/${(product.brand as any)?.slug}`} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {(product.brand as any)?.name}
          </Link>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.35rem 0 0.75rem 0' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="rating-pill">
              <span>{product.rating.toFixed(1)}</span>
              <Star size={13} fill="#fff" color="#fff" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {product.reviewCount} Verified Customer Reviews
            </span>
          </div>

          {/* Price Block */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.mrp > selectedVariant.price && (
              <>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{selectedVariant.mrp}
                </span>
                <span className="badge badge-discount" style={{ fontSize: '0.85rem' }}>
                  {Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Variant Selector (Shades / Sizes) */}
          {product.variants && product.variants.length > 1 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                Select Shade / Size Option: <span style={{ color: 'var(--primary-600)' }}>{selectedVariant.name}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedVariantIndex === idx ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                      backgroundColor: selectedVariantIndex === idx ? 'var(--primary-50)' : 'var(--bg-surface)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    {v.type === 'shade' && v.value?.startsWith('#') && (
                      <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: v.value, border: '1px solid #ccc' }} />
                    )}
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Main Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
                style={{ padding: '0.6rem 0.85rem', backgroundColor: 'var(--bg-primary)', fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ padding: '0 1rem', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.6rem 0.85rem', backgroundColor: 'var(--bg-primary)', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn ${isAddedToCart ? 'btn-secondary' : 'btn-primary'} btn-lg`}
              style={{ flex: 1 }}
            >
              {isAddedToCart ? <><Check size={20} color="#16a34a" /> Added to Cart</> : <><ShoppingBag size={20} /> Add to Cart</>}
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="btn btn-secondary btn-lg"
              title="Add to Wishlist"
            >
              <Heart size={20} color={isWishlisted ? '#e91e63' : 'currentColor'} fill={isWishlisted ? '#e91e63' : 'none'} />
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="card-glass" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Truck size={18} color="var(--primary-600)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Delivery & Service Check</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="input-field"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '140px' }}
              />
              <button onClick={() => setPincodeVerified(true)} className="btn btn-secondary btn-sm">
                Check
              </button>
            </div>
            {pincodeVerified && (
              <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem', fontWeight: 600 }}>
                ✓ Express Delivery available for {pincode}. Get it by Tomorrow!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabbed Info & Reviews */}
      <div className="card-glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {(['details', 'ingredients', 'usage', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                color: activeTab === tab ? 'var(--primary-600)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--primary-500)' : 'none',
                paddingBottom: '0.5rem'
              }}
            >
              {tab === 'usage' ? 'How to Use' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {product.description}
            </p>
            {product.highlights && product.highlights.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Key Highlights</h4>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {product.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Full Ingredient List</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {product.ingredients || 'Dermatologically tested. Free from harmful parabens, sulfates, and cruelty.'}
            </p>
          </div>
        )}

        {activeTab === 'usage' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Usage Directions</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {product.usageInstructions || 'Apply evenly onto clean skin or lips as part of your beauty routine.'}
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Customer Reviews ({reviews.length})</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Average Rating: <strong>{product.rating.toFixed(1)} / 5.0</strong> ({product.reviewCount} total ratings)
                </p>
              </div>

              {user ? (
                <button onClick={() => setShowReviewModal(true)} className="btn btn-primary btn-sm">
                  <Star size={14} /> Write a Review
                </button>
              ) : (
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign in to review
                </Link>
              )}
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No reviews yet. Purchased this item? Be the first verified buyer to share your feedback!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <div className="rating-pill">
                        <span>{rev.rating}</span>
                        <Star size={11} fill="#fff" color="#fff" />
                      </div>
                      <strong style={{ fontSize: '0.95rem' }}>{rev.title}</strong>
                      {rev.isVerifiedPurchase && (
                        <span className="badge badge-bestseller" style={{ fontSize: '0.7rem' }}>
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                      By {rev.user?.firstName || 'Customer'} {rev.user?.lastName ? rev.user.lastName.charAt(0) + '.' : ''} •{' '}
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <WriteReviewModal
          productId={product._id}
          productName={product.name}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            fetchReviews();
            setShowReviewModal(false);
          }}
        />
      )}

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};
