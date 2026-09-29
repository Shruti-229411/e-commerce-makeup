import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Layers, Edit2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const [inventories, setInventories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingInv, setEditingInv] = useState<any>(null);
  const [newStock, setNewStock] = useState('');
  const [newThreshold, setNewThreshold] = useState('10');

  const fetchInventory = () => {
    setIsLoading(true);
    api
      .get('/admin/inventory')
      .then((res) => {
        setInventories(res.data.inventories || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenModal = (inv: any) => {
    setEditingInv(inv);
    setNewStock(inv.availableStock.toString());
    setNewThreshold((inv.lowStockThreshold || 10).toString());
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/inventory/${editingInv._id}`, {
        availableStock: Number(newStock),
        lowStockThreshold: Number(newThreshold)
      });

      if (res.data.success) {
        setEditingInv(null);
        fetchInventory();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update stock.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading inventory stock levels...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Inventory Stock Control ({inventories.length})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monitor SKU available stock, reserved checkout stock & low-stock alerts.</p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Product & SKU</th>
              <th style={{ padding: '0.75rem' }}>Available Stock</th>
              <th style={{ padding: '0.75rem' }}>Reserved Stock</th>
              <th style={{ padding: '0.75rem' }}>Low Threshold</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((inv) => (
              <tr key={inv._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ display: 'block' }}>{inv.product?.name || 'Item'}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>SKU: {inv.sku}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '1rem', color: inv.availableStock <= (inv.lowStockThreshold || 10) ? '#dc2626' : '#16a34a' }}>
                    {inv.availableStock}
                  </strong>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{inv.reservedStock || 0}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>{inv.lowStockThreshold || 10}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${inv.availableStock <= (inv.lowStockThreshold || 10) ? 'badge-discount' : 'badge-bestseller'}`}>
                    {inv.availableStock <= (inv.lowStockThreshold || 10) ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(inv)} className="btn btn-secondary btn-sm">
                    <Edit2 size={14} /> Adjust Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {editingInv && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card-glass" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '420px', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>Adjust Stock</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {editingInv.product?.name} (SKU: {editingInv.sku})
            </p>

            <form onSubmit={handleSaveStock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Available Stock Count</label>
                <input
                  type="number"
                  className="input-field"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="input-label">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  className="input-field"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingInv(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
