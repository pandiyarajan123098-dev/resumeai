import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  accentColor = 'var(--primary)',
  className = '',
}) {
  const isPositiveTrend = trend && !trend.startsWith('-');

  return (
    <Card hover className={className} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
            {title}
          </span>
          <div style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginTop: '4px' }}>
            {value}
          </div>
        </div>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
            }}
          >
            <Icon size={20} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {(trend || trendLabel) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px' }}>
          {trend && (
            <span
              style={{
                fontWeight: 'var(--fw-semibold)',
                color: isPositiveTrend ? 'var(--success)' : 'var(--danger)',
                backgroundColor: isPositiveTrend ? 'var(--success-light)' : 'var(--danger-light)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              {trend}
            </span>
          )}
          {trendLabel && (
            <span style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
}
