import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '/uploads/brands/default.jpg',
    description: '',
    active: true
  });

  const fetchBrands = () => {
    setIsLoading(true);
    api
      .get('/brands')
      .then((res) => {
        setBrands(res.data.brands || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({ name: '', slug: '', logo: '/uploads/brands/default.jpg', description: '', active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBrand(b);
    setFormData({
      name: b.name,
      slug: b.slug,
      logo: b.logo || '/uploads/brands/default.jpg',
      description: b.description || '',
      active: !!b.active
    });
    setShowModal(true);
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('Deactivate this brand?')) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      fetchBrands();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to deactivate brand.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await api.put(`/admin/brands/${editingBrand._id}`, formData);
      } else {
        await api.post('/admin/brands', formData);
      }
      setShowModal(false);
      fetchBrands();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save brand.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading brands...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Brand Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage beauty partner brands & logos.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Add Brand
        </button>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Logo</th>
              <th style={{ padding: '0.75rem' }}>Brand Name</th>
              <th style={{ padding: '0.75rem' }}>Slug</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <img src={b.logo} alt={b.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{b.name}</strong>
                </td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{b.slug}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${b.active ? 'badge-bestseller' : 'badge-discount'}`}>
                    {b.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleOpenEdit(b)} className="btn btn-secondary btn-sm">
                      <Edit2 size={14} /> Edit
                    </button>
                    {b.active && (
                      <button onClick={() => handleDeactivate(b._id)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }}>
                        <Trash2 size={14} /> Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card-glass" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Brand Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="input-label">Slug (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Logo Image URL</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  required
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                Active
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
