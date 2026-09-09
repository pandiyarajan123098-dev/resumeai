import React from 'react';

export default function SecondaryButton({
  children,
  onClick,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  size = 'md',
  className = '',
  ...props
}) {
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '13px', gap: '6px' },
    md: { padding: '10px 18px', fontSize: '14px', gap: '8px' },
    lg: { padding: '12px 24px', fontSize: '15px', gap: '10px' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: 'var(--fw-medium)',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: 'var(--shadow-sm)',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--surface-alt)';
          e.currentTarget.style.borderColor = '#CBD5E1';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--surface)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }
      }}
      className={className}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : 18} strokeWidth={2} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : 18} strokeWidth={2} />}
    </button>
  );
}
