import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartQuantity, removeCartItem, applyCoupon, removeCoupon, clearCouponState } from '../store/slices/cartSlice';
import { Trash2, Tag, ArrowRight, ShoppingBag, ShieldCheck, Check } from 'lucide-react';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, isLoading, couponError, couponSuccess } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      dispatch(applyCoupon(couponCode.trim()));
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '440px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          <ShoppingBag size={48} color="var(--primary-500)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Shopping Bag is Waiting</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Please log in or register an account to view your saved items and checkout.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Sign In to View Bag
          </Link>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  let subtotal = 0;
  items.forEach((item: any) => {
    subtotal += item.price * item.quantity;
  });

  const discountAmount = cart?.discountAmount || 0;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShoppingBag size={56} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Bag is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.75rem' }}>
            Looks like you haven't added any beauty items to your shopping bag yet. Explore our latest arrivals!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Shopping Bag ({items.length} Items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Left: Cart Items Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item: any) => {
            const product = item.product || {};
            return (
              <div key={item._id || item.product._id} className="card-glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300'}
                  alt={product.name}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {product.brand?.name}
                  </span>
                  <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.15rem 0' }}>
                      {product.name}
                    </h3>
                  </Link>
                  {item.variantName && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      Shade/Option: {item.variantName}
                    </span>
                  )}
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '0.35rem' }}>
                    ₹{item.price} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>each</span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button
                    onClick={() => dispatch(updateCartQuantity({ productId: product._id, variantId: item.variantId, quantity: item.quantity - 1 }))}
                    style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--bg-primary)', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.85rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateCartQuantity({ productId: product._id, variantId: item.variantId, quantity: item.quantity + 1 }))}
                    style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--bg-primary)', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => dispatch(removeCartItem({ productId: product._id, variantId: item.variantId }))}
                    style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.35rem' }}
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Coupon Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Coupon Input Card */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={18} color="var(--primary-600)" /> Apply Promo Coupon
            </h3>

            {cart?.couponCode ? (
              <div style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-300)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.9rem' }}>{cart.couponCode}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>You saved ₹{discountAmount}!</p>
                </div>
                <button onClick={handleRemoveCoupon} style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. BEAUTY20"
                  className="input-field"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ textTransform: 'uppercase', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </form>
            )}

            {couponSuccess && (
              <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem', fontWeight: 600 }}>
                ✓ {couponSuccess}
              </p>
            )}
            {couponError && (
              <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.5rem', fontWeight: 600 }}>
                ✕ {couponError}
              </p>
            )}
          </div>

          {/* Order Summary Breakdown */}
          <div className="card-glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Bag Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{discountAmount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
                <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#16a34a' : 'var(--text-primary)' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary-600)' }}>₹{grandTotal}</span>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
