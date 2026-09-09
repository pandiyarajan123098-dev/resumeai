import React from 'react';

export default function PageHeader({ title, description, actions, children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        marginBottom: 'var(--space-32)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-16)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-regular)' }}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
