import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart } from '../store/slices/cartSlice';
import api from '../services/api';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, Truck, Plus, ArrowRight } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Mock' | 'UPI'>('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  // Add Address Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    phone: user?.phone || '+91 ',
    addressLine: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: true
  });

  useEffect(() => {
    dispatch(fetchCart());
    loadAddresses();
  }, [dispatch]);

  const loadAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.addresses);
      if (res.data.addresses.length > 0) {
        const defaultAddr = res.data.addresses.find((a: any) => a.isDefault) || res.data.addresses[0];
        setSelectedAddressId(defaultAddr._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', newAddr);
      setAddresses([...addresses, res.data.address]);
      setSelectedAddressId(res.data.address._id);
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      const res = await api.post('/orders', {
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod === 'UPI' ? 'Mock' : paymentMethod,
        couponCode: cart?.couponCode
      });

      if (res.data.success) {
        dispatch(fetchCart());
        navigate(`/order-confirmation/${res.data.order._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order placement failed.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const items = cart?.items || [];
  let subtotal = 0;
  items.forEach((item: any) => {
    subtotal += item.price * item.quantity;
  });

  const discountAmount = cart?.discountAmount || 0;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Checkout & Order Placement</h1>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✕ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Left Column: Delivery Address & Payment Method */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step 1: Address Selection */}
          <div className="card-glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--primary-600)" /> 1. Select Delivery Address
              </h3>
              <button onClick={() => setShowAddModal(true)} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                <Plus size={14} /> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No saved addresses found. Please add a new address.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    style={{
                      border: selectedAddressId === addr._id ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                      backgroundColor: selectedAddressId === addr._id ? 'var(--primary-50)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'block'
                    }}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <strong style={{ fontSize: '0.9rem' }}>{addr.name}</strong> ({addr.addressType})
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      {addr.addressLine}, {addr.apartment && `${addr.apartment}, `}{addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem' }}>Phone: {addr.phone}</p>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Add Address Modal Form */}
          {showAddModal && (
            <div className="card-glass" style={{ padding: '1.5rem', border: '1.5px solid var(--primary-400)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Delivery Address</h4>
              <form onSubmit={handleCreateAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <input type="text" required placeholder="Full Name" className="input-field" value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })} />
                <input type="tel" required placeholder="Phone Number" className="input-field" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
                <input type="text" required placeholder="Address Line" className="input-field" style={{ gridColumn: 'span 2' }} value={newAddr.addressLine} onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })} />
                <input type="text" placeholder="Apartment / Landmark" className="input-field" value={newAddr.apartment} onChange={(e) => setNewAddr({ ...newAddr, apartment: e.target.value })} />
                <input type="text" required placeholder="City" className="input-field" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                <input type="text" required placeholder="State" className="input-field" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                <input type="text" required placeholder="Postal Code" className="input-field" value={newAddr.postalCode} onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })} />
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Save & Select</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Payment Method Selection */}
          <div className="card-glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--primary-600)" /> 2. Select Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>Cash on Delivery (COD)</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay with cash when courier delivers package to your doorstep</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'Mock'} onChange={() => setPaymentMethod('Mock')} />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>Instant Test Online Payment (Cards / NetBanking)</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe development sandbox mode for instant online order processing</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Box */}
        <div className="card-glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Order Items ({items.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
            {items.map((item: any) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.product?.name}</span>
                <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>Coupon Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary-600)' }}>₹{grandTotal}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            {isPlacingOrder ? 'Processing Order...' : 'Confirm & Place Order'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
