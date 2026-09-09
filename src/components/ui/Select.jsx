import React from 'react';

export default function Select({
  label,
  error,
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
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
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '14px',
          fontWeight: 'var(--fw-regular)',
          color: 'var(--text-primary)',
          backgroundColor: disabled ? 'var(--surface-alt)' : 'var(--surface)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
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
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}
