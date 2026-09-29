import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Award, Stethoscope } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <ShieldCheck size={28} color="var(--primary-500)" />,
      title: '100% Authentic',
      description: 'Sourced direct from official brands'
    },
    {
      icon: <Truck size={28} color="var(--primary-500)" />,
      title: 'Free Shipping',
      description: 'On all orders above ₹499'
    },
    {
      icon: <RefreshCw size={28} color="var(--primary-500)" />,
      title: 'Easy Returns',
      description: 'Hassle-free 15-day return policy'
    },
    {
      icon: <Award size={28} color="var(--primary-500)" />,
      title: 'Top Rated Brands',
      description: 'MAC, Maybelline, Lakmé & more'
    },
    {
      icon: <Stethoscope size={28} color="var(--primary-500)" />,
      title: 'Derm Approved',
      description: 'Clinically tested & 100% safe'
    }
  ];

  return (
    <section
      role="region"
      aria-label="Trust and Assurance Badges"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        padding: '1.75rem 1rem'
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        {badges.map((badge, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                padding: '0.65rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {badge.icon}
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {badge.title}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
