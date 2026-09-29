import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import api from '../../services/api';
import { User, CheckCircle, AlertCircle, Save, Lock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    skinType: user?.preferences?.skinType || 'Combination',
    hairType: user?.preferences?.hairType || 'Straight'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setIsSavingProfile(true);

    try {
      const res = await api.put('/auth/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        preferences: {
          skinType: formData.skinType,
          hairType: formData.hairType
        }
      });

      if (res.data.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Profile & Personal Details</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Info Form */}
        <div className="card-glass" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary-600)" /> Personal Information
          </h3>

          {profileMsg.text && (
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', backgroundColor: profileMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: profileMsg.type === 'success' ? '#15803d' : '#b91c1c', fontSize: '0.875rem' }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">First Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="input-label">Last Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">Email Address (Read only)</label>
              <input type="email" className="input-field" value={user?.email || ''} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>

            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="text"
                className="input-field"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Beauty Preferences</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Skin Type</label>
                  <select
                    className="input-field"
                    value={formData.skinType}
                    onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                  >
                    <option value="Oily">Oily</option>
                    <option value="Dry">Dry</option>
                    <option value="Combination">Combination</option>
                    <option value="Sensitive">Sensitive</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Hair Type</label>
                  <select
                    className="input-field"
                    value={formData.hairType}
                    onChange={(e) => setFormData({ ...formData, hairType: e.target.value })}
                  >
                    <option value="Straight">Straight</option>
                    <option value="Wavy">Wavy</option>
                    <option value="Curly">Curly</option>
                    <option value="Coily">Coily</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSavingProfile} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Save size={18} /> {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card-glass" style={{ padding: '1.75rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--primary-600)" /> Security & Password
          </h3>

          {passwordMsg.text && (
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', backgroundColor: passwordMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: passwordMsg.type === 'success' ? '#15803d' : '#b91c1c', fontSize: '0.875rem' }}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="input-label">Current Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="input-label">New Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={isSavingPassword} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
              {isSavingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
