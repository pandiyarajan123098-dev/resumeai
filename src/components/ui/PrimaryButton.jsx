import React from 'react';

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  size = 'md',
  className = '',
  style = {},
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
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: 'var(--fw-medium)',
        backgroundColor: disabled ? '#94A3B8' : 'var(--primary)',
        border: '1px solid transparent',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: disabled ? 'none' : '0 1px 2px rgba(15, 118, 110, 0.2)',
        ...style,
        color: '#FFFFFF',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--primary)';
        }
      }}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : 18} strokeWidth={2} style={{ color: '#FFFFFF' }} />}
      <span style={{ color: '#FFFFFF' }}>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : 18} strokeWidth={2} style={{ color: '#FFFFFF' }} />}
    </button>
  );
}
