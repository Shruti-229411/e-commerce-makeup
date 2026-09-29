import React, { useState } from 'react';
import { Copy, Check, Sparkles, Tag, Gift } from 'lucide-react';
import { useToast } from '../common/ToastContainer';

export const PromoBannerSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section
      role="region"
      aria-label="Promotional Banners and Offers"
      style={{
        padding: '3.5rem 1rem',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Banner 1: GLOW10 */}
          <div
            className="card-glass"
            style={{
              background: 'linear-gradient(135deg, #be185d 0%, #e91e63 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem 1.75rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Tag size={12} /> FESTIVE BEAUTY PASS
              </span>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.85rem', marginBottom: '0.4rem', color: '#fff' }}>
                Flat 10% OFF Sitewide
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#fce7f3', marginBottom: '1.5rem', maxWidth: '380px', lineHeight: 1.5 }}>
                Valid on luxury lipsticks, serums, sunscreens & perfumes above ₹499.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1.5px dashed rgba(255,255,255,0.8)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    letterSpacing: '1px'
                  }}
                >
                  GLOW10
                </div>

                <button
                  onClick={() => handleCopy('GLOW10')}
                  style={{
                    backgroundColor: '#ffffff',
                    color: 'var(--primary-700)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {copiedCode === 'GLOW10' ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                  <span>{copiedCode === 'GLOW10' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner 2: WELCOME500 */}
          <div
            className="card-glass"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem 1.75rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: '#0f172a',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Gift size={12} /> NEW USER BENEFIT
              </span>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.85rem', marginBottom: '0.4rem', color: '#fff' }}>
                ₹500 Instant Cashback
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '380px', lineHeight: 1.5 }}>
                Get flat ₹500 discount on luxury beauty orders above ₹1,999.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1.5px dashed var(--accent-gold)',
                    color: 'var(--accent-gold)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    letterSpacing: '1px'
                  }}
                >
                  WELCOME500
                </div>

                <button
                  onClick={() => handleCopy('WELCOME500')}
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {copiedCode === 'WELCOME500' ? <Check size={16} color="#0f172a" /> : <Copy size={16} />}
                  <span>{copiedCode === 'WELCOME500' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
