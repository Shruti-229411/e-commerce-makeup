import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { useToast } from '../common/ToastContainer';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubscribed(true);
    addToast('Welcome to the Glow Club! Check your inbox for your ₹200 welcome gift code.', 'success');
    setEmail('');
  };

  return (
    <section
      role="region"
      aria-label="Newsletter Subscription Section"
      style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1e1b4b 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              backgroundColor: 'rgba(233,30,99,0.2)',
              border: '1px solid var(--primary-500)',
              color: 'var(--primary-300)',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} /> EXCLUSIVE VIP GLOW CLUB
          </span>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
            Unlock 15% OFF Your First Order
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Subscribe to receive secret flash sales, product launch invitations, and weekly dermatologist skincare advice directly to your inbox.
          </p>

          {/* Perks list */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} color="var(--primary-400)" /> Early Access to Sales
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} color="var(--primary-400)" /> ₹200 Instant Welcome Gift
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} color="var(--primary-400)" /> No Spam, Unsubscribe Anytime
            </span>
          </div>

          {/* Subscription Form */}
          {isSubscribed ? (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              🎉 You are officially subscribed to the Glow Club! Check your email for your exclusive coupon code.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '520px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ flex: '1 1 200px', width: '100%', position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.5rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.925rem',
                    outline: 'none'
                  }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.85rem 1.75rem', minWidth: '140px' }}
              >
                Join Now <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
