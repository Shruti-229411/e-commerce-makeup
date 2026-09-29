import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const CustomerLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ backgroundColor: 'var(--bg-dark)', color: '#94a3b8', padding: '2.5rem 1rem', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
        <div className="container" style={{ textAlign: 'center', fontSize: '0.875rem' }}>
          <p>© 2026 GlowCart Beauty & Lifestyle Platform. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: '#64748b' }}>
            Full-Stack MERN Architecture powered by React, TypeScript, Node.js, Express & MongoDB Atlas.
          </p>
        </div>
      </footer>
    </div>
  );
};
