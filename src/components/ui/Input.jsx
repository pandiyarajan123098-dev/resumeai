import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }} className={className}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Icon size={18} strokeWidth={1.8} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: Icon ? '10px 14px 10px 38px' : '10px 14px',
            fontSize: '14px',
            fontWeight: 'var(--fw-regular)',
            color: 'var(--text-primary)',
            backgroundColor: disabled ? 'var(--surface-alt)' : 'var(--surface)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={(e) => {
            if (!disabled && !error) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 118, 110, 0.12)';
            }
          }}
          onBlur={(e) => {
            if (!disabled && !error) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
      {helperText && !error && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{helperText}</span>}
    </div>
  );
}
