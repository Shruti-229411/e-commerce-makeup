import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: '',
    category: '',
    price: '',
    mrp: '',
    sku: '',
    stock: '25',
    images: ['/uploads/products/default.jpg'],
    ingredients: '',
    usageInstructions: '',
    highlights: ['Long-lasting formula', 'Cruelty-free beauty'],
    variants: [] as any[],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    isActive: true
  });

  useEffect(() => {
    // Fetch Brands & Categories for select dropdowns
    Promise.all([api.get('/categories'), api.get('/brands')])
      .then(([catRes, brandRes]) => {
        setCategories(catRes.data.categories || []);
        setBrands(brandRes.data.brands || []);

        if (!isEditMode && catRes.data.categories?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: catRes.data.categories[0]._id,
            brand: brandRes.data.brands[0]?._id || ''
          }));
        }
      })
      .catch(console.error);

    if (isEditMode) {
      api
        .get('/admin/products')
        .then((res) => {
          const prod = res.data.products.find((p: any) => p._id === id);
          if (prod) {
            setFormData({
              name: prod.name || '',
              slug: prod.slug || '',
              description: prod.description || '',
              shortDescription: prod.shortDescription || '',
              brand: prod.brand?._id || prod.brand || '',
              category: prod.category?._id || prod.category || '',
              price: prod.price?.toString() || '',
              mrp: prod.mrp?.toString() || '',
              sku: prod.sku || '',
              stock: prod.stock?.toString() || '0',
              images: prod.images?.length > 0 ? prod.images : ['/uploads/products/default.jpg'],
              ingredients: prod.ingredients || '',
              usageInstructions: prod.usageInstructions || '',
              highlights: prod.highlights || [],
              variants: prod.variants || [],
              isFeatured: !!prod.isFeatured,
              isBestseller: !!prod.isBestseller,
              isNewArrival: !!prod.isNewArrival,
              isActive: !!prod.isActive
            });
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to fetch product');
          setIsLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (isEditMode) {
        await api.put(`/admin/products/${id}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      setIsSaving(false);
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product.');
      setIsSaving(false);
    }
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: `${prev.sku || 'SKU'}-VAR-${prev.variants.length + 1}`,
          name: 'Shade Variant',
          type: 'shade',
          value: '#e91e63',
          price: Number(prev.price) || 500,
          mrp: Number(prev.mrp) || 600,
          stock: 10,
          isAvailable: true
        }
      ]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading product editor...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/products" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Basic Information</h3>

            <div>
              <label className="input-label">Product Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Master SKU</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. MAC-LIP-RUBY-01"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div>
                <label className="input-label">URL Slug (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="mac-ruby-woo-lipstick"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Short Description</label>
              <input
                type="text"
                className="input-field"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="input-label">Full Product Description</label>
              <textarea
                className="input-field"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Pricing & Inventory Stock</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Selling Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="input-label">MRP Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="input-label">Initial Stock Count</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Variant Selector Manager */}
          <div className="card-glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Shade / Size Variants ({formData.variants.length})</h3>
              <button type="button" onClick={handleAddVariant} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Variant
              </button>
            </div>

            {formData.variants.map((variant, idx) => (
              <div key={idx} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr 100px 40px', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Variant Name"
                  value={variant.name}
                  onChange={(e) => {
                    const newVars = [...formData.variants];
                    newVars[idx].name = e.target.value;
                    setFormData({ ...formData, variants: newVars });
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) => {
                    const newVars = [...formData.variants];
                    newVars[idx].sku = e.target.value;
                    setFormData({ ...formData, variants: newVars });
                  }}
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => {
                    const newVars = [...formData.variants];
                    newVars[idx].price = Number(e.target.value);
                    setFormData({ ...formData, variants: newVars });
                  }}
                />
                <button type="button" onClick={() => handleRemoveVariant(idx)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Category & Brand</h4>

            <div>
              <label className="input-label">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Brand</label>
              <select
                className="input-field"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              >
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card-glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Product Toggles</h4>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active in Storefront
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              Featured Product
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
              />
              Bestseller Badge
            </label>
          </div>

          <button type="submit" disabled={isSaving} className="btn btn-primary btn-lg">
            <Save size={18} /> {isSaving ? 'Saving Product...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
