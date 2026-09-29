import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Search, Edit2, Trash2, Check, X, Star, Package } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = () => {
    setIsLoading(true);
    api
      .get('/admin/products')
      .then((res) => {
        setProducts(res.data.products || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeactivate = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"? Historical order references will be preserved.`)) return;

    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to deactivate product.');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading catalog products...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Product Catalog CRUD</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage catalog items, pricing, inventory stock & variants.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card-glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search products by name, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Image</th>
              <th style={{ padding: '0.75rem' }}>Product & SKU</th>
              <th style={{ padding: '0.75rem' }}>Brand & Category</th>
              <th style={{ padding: '0.75rem' }}>Price / MRP</th>
              <th style={{ padding: '0.75rem' }}>Stock</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <img src={prod.images[0] || '/uploads/products/default.jpg'} alt={prod.name} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', padding: '2px', backgroundColor: '#fff' }} />
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>{prod.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>SKU: {prod.sku}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>{prod.brand?.name || 'N/A'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.category?.name || 'N/A'}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>₹{prod.price}</strong>
                  {prod.mrp > prod.price && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                      ₹{prod.mrp}
                    </span>
                  )}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: prod.stock <= 10 ? '#dc2626' : '#16a34a' }}>
                    {prod.stock}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${prod.isActive ? 'badge-bestseller' : 'badge-discount'}`}>
                    {prod.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link to={`/admin/products/${prod._id}/edit`} className="btn btn-secondary btn-sm" title="Edit Product">
                      <Edit2 size={14} /> Edit
                    </Link>
                    {prod.isActive && (
                      <button onClick={() => handleDeactivate(prod._id, prod.name)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }} title="Deactivate">
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
    </div>
  );
};
