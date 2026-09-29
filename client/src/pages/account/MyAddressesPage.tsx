import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase, Globe } from 'lucide-react';

export const MyAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'Home',
    isDefault: false
  });

  const fetchAddresses = () => {
    setIsLoading(true);
    api
      .get('/addresses')
      .then((res) => {
        setAddresses(res.data.addresses || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      addressType: 'Home',
      isDefault: addresses.length === 0
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (addr: any) => {
    setEditingAddress(addr);
    setFormData({
      name: addr.name,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
      addressType: addr.addressType || 'Home',
      isDefault: addr.isDefault || false
    });
    setShowModal(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete address.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/addresses/${id}/default`);
      fetchAddresses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to set default address.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress._id}`, formData);
      } else {
        await api.post('/addresses', formData);
      }
      setShowModal(false);
      fetchAddresses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save address.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading saved addresses...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Saved Addresses ({addresses.length})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage delivery locations for quick checkout.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card-glass" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <MapPin size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Addresses Saved</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Add your primary shipping address for fast and effortless one-click checkout.
          </p>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            + Add First Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                border: addr.isDefault ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                position: 'relative'
              }}
            >
              {addr.isDefault && (
                <span className="badge badge-featured" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Default
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {addr.addressType === 'Work' ? <Briefcase size={16} color="var(--primary-600)" /> : <Home size={16} color="var(--primary-600)" />}
                <strong style={{ fontSize: '0.95rem' }}>{addr.name}</strong>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                {addr.addressLine}, {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong>
              </p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Phone: {addr.phone}</p>

              <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                    Set as Default
                  </button>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                  <button onClick={() => handleOpenEditModal(addr)} className="btn btn-secondary btn-sm" title="Edit Address">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }} title="Delete Address">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card-glass" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Recipient Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Flat / House / Street Address</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="input-label">City</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">State</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Pincode</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Address Tag</label>
                  <select
                    className="input-field"
                    value={formData.addressType}
                    onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <label htmlFor="isDefault" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Set as default address
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
