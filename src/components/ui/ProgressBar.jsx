import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = 'var(--primary)',
  size = 'md',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const heightMap = { sm: '4px', md: '8px', lg: '12px' };
  const height = heightMap[size] || heightMap.md;

  return (
    <div className={className} style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          {label && (
            <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)' }}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'var(--border-subtle)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '999px',
            transition: 'width 0.4s ease-out',
          }}
        />
      </div>
    </div>
  );
}
