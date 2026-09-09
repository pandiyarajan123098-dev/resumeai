import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  bordered = true,
  style = {},
  ...props
}) {
  const paddingMap = {
    none: '0',
    sm: 'var(--space-16)',
    md: 'var(--space-24)',
    lg: 'var(--space-32)',
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: bordered ? '1px solid var(--border)' : 'none',
        borderRadius: 'var(--radius-lg)',
        padding: paddingMap[padding] || paddingMap.md,
        boxShadow: 'var(--shadow-sm)',
        transition: hover ? 'transform var(--transition-fast), box-shadow var(--transition-fast)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
