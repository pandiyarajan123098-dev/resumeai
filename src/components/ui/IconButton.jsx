import React from 'react';

export default function IconButton({
  icon: Icon,
  onClick,
  title,
  active = false,
  badge = false,
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const dimension = size === 'sm' ? '32px' : size === 'lg' ? '44px' : '38px';
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        backgroundColor: active ? 'var(--primary-light)' : 'var(--surface)',
        color: active ? 'var(--primary)' : 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.backgroundColor = 'var(--surface-alt)';
          e.currentTarget.style.color = 'var(--primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.backgroundColor = 'var(--surface)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      className={className}
      {...props}
    >
      {Icon && <Icon size={iconSize} strokeWidth={1.8} />}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--secondary)',
          }}
        />
      )}
    </button>
  );
}
