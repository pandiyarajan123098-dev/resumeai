import React from 'react';
import Card from './Card';
import { RiLoader4Line } from '@remixicon/react';

export default function LoadingState({
  title = 'Processing...',
  subtitle = 'Please wait while we complete the request.',
  inline = false,
}) {
  if (inline) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
        <RiLoader4Line className="spin-icon" size={18} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px' }}>{title}</span>
      </div>
    );
  }

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-40)',
      }}
    >
      <RiLoader4Line
        size={32}
        style={{
          color: 'var(--primary)',
          animation: 'spin 1s linear infinite',
          marginBottom: 'var(--space-16)',
        }}
      />
      <h3 style={{ fontSize: '15px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '4px' }}>
        {title}
      </h3>
      {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtitle}</p>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Card>
  );
}
