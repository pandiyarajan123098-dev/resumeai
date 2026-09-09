import React from 'react';
import Card from './Card';
import PrimaryButton from './PrimaryButton';
import { RiFileSearchLine } from '@remixicon/react';

export default function EmptyState({
  icon: Icon = RiFileSearchLine,
  title = 'No Resumes Found',
  description = 'You have not uploaded or analyzed any resumes yet. Start by uploading a resume to get instant AI analysis.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
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
      className={className}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: 'var(--space-16)',
        }}
      >
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '420px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: actionLabel ? 'var(--space-24)' : '0' }}>
        {description}
      </p>
      {actionLabel && (
        <PrimaryButton onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </PrimaryButton>
      )}
    </Card>
  );
}
