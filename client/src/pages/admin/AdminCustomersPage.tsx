import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Search, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = () => {
    setIsLoading(true);
    api
      .get('/admin/customers')
      .then((res) => {
        setCustomers(res.data.customers || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean, email: string) => {
    const actionText = currentStatus ? 'Deactivate' : 'Activate';
    if (!window.confirm(`${actionText} account for ${email}? Deactivated accounts cannot sign in or use APIs.`)) return;

    try {
      await api.put(`/admin/customers/${id}/status`, { isActive: !currentStatus });
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="card-glass" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading registered customer accounts...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Account Controls ({customers.length})</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>View customer directory & manage account active/deactivation status.</p>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="card-glass" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Customer</th>
              <th style={{ padding: '0.75rem' }}>Email</th>
              <th style={{ padding: '0.75rem' }}>Phone</th>
              <th style={{ padding: '0.75rem' }}>Joined</th>
              <th style={{ padding: '0.75rem' }}>Account Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{c.firstName} {c.lastName}</strong>
                </td>
                <td style={{ padding: '0.75rem' }}>{c.email}</td>
                <td style={{ padding: '0.75rem' }}>{c.phone || 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${c.isActive ? 'badge-bestseller' : 'badge-discount'}`}>
                    {c.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleStatus(c._id, c.isActive, c.email)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: c.isActive ? '#dc2626' : '#16a34a' }}
                  >
                    {c.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
