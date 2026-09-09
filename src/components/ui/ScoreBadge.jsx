import React from 'react';

export default function ScoreBadge({ score, label, variant, size = 'md' }) {
  let color = 'var(--primary)';
  let bg = 'var(--primary-light)';

  const displayVal = label !== undefined ? label : score !== undefined ? `${score}%` : '';

  if (variant === 'success' || (score !== undefined && score >= 80)) {
    color = 'var(--success)';
    bg = 'var(--success-light)';
  } else if (variant === 'warning' || (score !== undefined && score >= 60 && score < 80)) {
    color = 'var(--warning)';
    bg = 'var(--warning-light)';
  } else if (variant === 'danger' || (score !== undefined && score < 60)) {
    color = 'var(--danger)';
    bg = 'var(--danger-light)';
  } else if (variant === 'indigo') {
    color = 'var(--secondary)';
    bg = 'var(--secondary-light)';
  }

  const paddingMap = {
    sm: '2px 8px',
    md: '4px 12px',
    lg: '6px 16px',
  };

  const fontSizeMap = {
    sm: '12px',
    md: '13px',
    lg: '15px',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: paddingMap[size] || paddingMap.md,
        borderRadius: '999px',
        backgroundColor: bg,
        color: color,
        fontWeight: 'var(--fw-semibold)',
        fontSize: fontSizeMap[size] || fontSizeMap.md,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{displayVal}</span>
    </span>
  );
}

