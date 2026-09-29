import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, XCircle } from 'lucide-react';
import { IStatusHistory } from '../../types';

interface OrderStatusTimelineProps {
  orderStatus: string;
  statusHistory?: IStatusHistory[];
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ orderStatus, statusHistory = [] }) => {
  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: Clock },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'Processing', label: 'Processing', icon: PackageCheck },
    { key: 'Shipped', label: 'Shipped', icon: Truck },
    { key: 'Out for delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  if (orderStatus === 'Cancelled') {
    return (
      <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#b91c1c' }}>
        <XCircle size={24} />
        <div>
          <strong style={{ fontSize: '0.95rem' }}>Order Cancelled</strong>
          <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>This order has been cancelled and inventory was returned to stock.</p>
        </div>
      </div>
    );
  }

  if (orderStatus === 'Returned') {
    return (
      <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#92400e' }}>
        <AlertCircle size={24} />
        <div>
          <strong style={{ fontSize: '0.95rem' }}>Return Requested / Processing</strong>
          <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Return request active. Current status retrieved from GlowCart database history.</p>
        </div>
      </div>
    );
  }

  // Find index of current status
  const currentStepIndex = steps.findIndex(
    (s) => s.key.toLowerCase() === orderStatus.toLowerCase()
  );

  return (
    <div>
      {/* Visual Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '1.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
        {steps.map((step, idx) => {
          const isPassed = idx <= (currentStepIndex === -1 ? 0 : currentStepIndex);
          const isCurrent = idx === currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1, minWidth: '80px', textAlign: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isPassed ? 'var(--primary-500)' : 'var(--bg-primary)',
                  color: isPassed ? '#fff' : 'var(--text-muted)',
                  border: isCurrent ? '3px solid var(--primary-200)' : '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none'
                }}
              >
                <StepIcon size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 800 : 600, color: isPassed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status History Log */}
      {statusHistory.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Status History Log (Database Timestamp Record)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {statusHistory.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  ✓ {h.status} {h.note && `— ${h.note}`}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {new Date(h.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
