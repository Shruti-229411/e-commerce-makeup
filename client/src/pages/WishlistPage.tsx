import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { wishlist, isLoading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '440px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <Heart size={48} color="var(--primary-500)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Waiting</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Please log in to view your saved beauty items.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Sign In to View Wishlist
          </Link>
        </div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  if (products.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <Heart size={56} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.75rem' }}>
            Save items you love by tapping the heart icon on any product card!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Beauty Products &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Saved Wishlist ({products.length} Items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {products.map((item: any) => {
          const product = item.product || {};
          return (
            <div key={product._id} className="card-glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <img src={product.images?.[0]} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {product.brand?.name}
                </span>
                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                    {product.name}
                  </h3>
                </Link>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  ₹{product.price}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    dispatch(addToCart({ productId: product._id, quantity: 1 }));
                    dispatch(toggleWishlist(product._id));
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={14} /> Move to Cart
                </button>
                <button
                  onClick={() => dispatch(toggleWishlist(product._id))}
                  className="btn btn-secondary btn-sm"
                  title="Remove"
                >
                  <Trash2 size={14} color="#dc2626" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
