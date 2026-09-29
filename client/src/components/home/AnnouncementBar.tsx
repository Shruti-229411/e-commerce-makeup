import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, Truck, X, Copy, Check } from 'lucide-react';
import { useToast } from '../common/ToastContainer';

interface Announcement {
  id: string;
  icon: React.ReactNode;
  text: string;
  code?: string;
  badge?: string;
}

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { addToast } = useToast();

  const announcements: Announcement[] = [
    {
      id: '1',
      icon: <Sparkles size={14} className="text-gold" />,
      text: 'Use code BEAUTY20 for 20% OFF on your first GlowCart order!',
      code: 'BEAUTY20',
      badge: 'LIMITED TIME'
    },
    {
      id: '2',
      icon: <Tag size={14} />,
      text: 'Flat 10% OFF on luxury skincare with code GLOW10',
      code: 'GLOW10',
      badge: 'SPECIAL'
    },
    {
      id: '3',
      icon: <Truck size={14} />,
      text: 'FREE Shipping across India on all orders over ₹499!',
      badge: 'FREE SHIPPING'
    }
  ];

  useEffect(() => {
    if (isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isDismissed, announcements.length]);

  if (isDismissed) return null;

  const current = announcements[currentIndex];

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div
      role="region"
      aria-label="Announcement Bar"
      style={{
        backgroundColor: 'var(--bg-dark)',
        color: '#f8fafc',
        fontSize: '0.8rem',
        fontWeight: 600,
        padding: '0.45rem 2.25rem 0.45rem 0.75rem',
        position: 'relative',
        zIndex: 101,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          textAlign: 'center',
          flexWrap: 'wrap'
        }}
      >
        {current.badge && (
          <span
            style={{
              backgroundColor: 'var(--primary-600)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {current.badge}
          </span>
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          {current.icon}
          <span>{current.text}</span>
        </div>

        {current.code && (
          <button
            onClick={(e) => handleCopyCode(current.code!, e)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px dashed var(--accent-gold)',
              color: 'var(--accent-gold)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.725rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
            title="Click to copy coupon code"
            aria-label={`Copy coupon code ${current.code}`}
          >
            {copiedCode === current.code ? <Check size={12} /> : <Copy size={12} />}
            <span>{copiedCode === current.code ? 'COPIED' : current.code}</span>
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsDismissed(true)}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Dismiss announcement"
      >
        <X size={15} />
      </button>
    </div>
  );
};
