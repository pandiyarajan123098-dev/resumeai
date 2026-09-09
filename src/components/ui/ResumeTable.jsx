import React from 'react';
import ScoreBadge from './ScoreBadge';
import SecondaryButton from './SecondaryButton';
import IconButton from './IconButton';
import { RiEyeLine, RiDeleteBin6Line, RiDownload2Line } from '@remixicon/react';

export default function ResumeTable({ resumes = [], onView, onDelete, onDownload }) {
  if (!resumes || resumes.length === 0) {
    return null;
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resume Name
            </th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Role
            </th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Date
            </th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ATS Score
            </th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status
            </th>
            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((row, idx) => (
            <tr
              key={row.id || idx}
              style={{
                borderBottom: idx === resumes.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                {row.name}
              </td>
              <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {row.targetRole || 'General'}
              </td>
              <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                {row.date}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <ScoreBadge score={row.score} label={`${row.score}/100`} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'var(--fw-medium)',
                    backgroundColor: row.status === 'Completed' ? 'var(--success-light)' : 'var(--warning-light)',
                    color: row.status === 'Completed' ? 'var(--success)' : 'var(--warning)',
                  }}
                >
                  {row.status || 'Completed'}
                </span>
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '6px' }}>
                  {onView && (
                    <IconButton
                      icon={RiEyeLine}
                      size="sm"
                      title="View Analysis"
                      onClick={() => onView(row)}
                    />
                  )}
                  {onDownload && (
                    <IconButton
                      icon={RiDownload2Line}
                      size="sm"
                      title="Download Summary"
                      onClick={() => onDownload(row)}
                    />
                  )}
                  {onDelete && (
                    <IconButton
                      icon={RiDeleteBin6Line}
                      size="sm"
                      title="Delete Resume"
                      onClick={() => onDelete(row)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
