import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import ScoreBadge from '../components/ui/ScoreBadge';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import {
  getResumes,
  updateResume,
  deleteResume,
  formatDisplayDate
} from '../utils/resumeStorage';
import {
  RiAddLine,
  RiSearchLine,
  RiFileCodeLine,
  RiMore2Line,
  RiEyeLine,
  RiSparklingLine,
  RiEdit2Line,
  RiDeleteBin6Line,
  RiCloseLine,
  RiFileTextLine,
  RiCalendarLine,
  RiBriefcaseLine
} from '@remixicon/react';

export default function ResumesPage({ onNavigate }) {
  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'lowest', 'name'

  // Active Dropdown Menu Row ID
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals state
  const [viewingResume, setViewingResume] = useState(null);
  const [editingResume, setEditingResume] = useState(null);
  const [deletingResume, setDeletingResume] = useState(null);

  // Form state for Edit modal
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // Load resumes from LocalStorage on mount
  useEffect(() => {
    setResumes(getResumes());
  }, []);

  const refreshList = () => {
    setResumes(getResumes());
  };

  // Search & Filter Logic
  const filteredAndSortedResumes = useMemo(() => {
    let result = resumes.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.targetRole && item.targetRole.toLowerCase().includes(q))
      );
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt || b.uploadedAt) - new Date(a.updatedAt || a.uploadedAt);
      }
      if (sortBy === 'highest') {
        return (b.latestScore || 0) - (a.latestScore || 0);
      }
      if (sortBy === 'lowest') {
        return (a.latestScore || 0) - (b.latestScore || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [resumes, searchQuery, sortBy]);

  // Edit Save Handler
  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editingResume) return;

    if (editName.trim()) {
      updateResume(editingResume.id, {
        name: editName.trim(),
        targetRole: editRole.trim() || 'General',
      });
      refreshList();
    }
    setEditingResume(null);
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = () => {
    if (!deletingResume) return;
    deleteResume(deletingResume.id);
    refreshList();
    setDeletingResume(null);
  };

  const handleAnalyzeClick = (resume) => {
    if (onNavigate) {
      onNavigate('analyze', {
        name: resume.name,
        size: resume.size || '1.8 MB',
        targetRole: resume.targetRole || 'Frontend Developer',
        score: resume.latestScore,
      });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Page Header */}
      <PageHeader
        title="My Resumes"
        description="Manage and analyze your uploaded resumes."
        actions={
          <PrimaryButton
            icon={RiAddLine}
            onClick={() => onNavigate && onNavigate('upload')}
          >
            Upload Resume
          </PrimaryButton>
        }
      />

      {/* Top Controls Row: Search & Sort */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-16)',
          backgroundColor: 'var(--surface)',
          padding: 'var(--space-16) var(--space-20)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
          <RiSearchLine
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes or target roles..."
            style={{
              width: '100%',
              padding: '8px 14px 8px 38px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)' }}>
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 'var(--fw-medium)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="recent">Recently Updated</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Resumes List Table */}
      {filteredAndSortedResumes.length > 0 ? (
        <Card padding="none" style={{ overflow: 'hidden' }}>
          {/* Desktop Table View */}
          <div className="desktop-only" style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Resume
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Target Role
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Latest Score
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Last Updated
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedResumes.map((row, idx) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: idx === filteredAndSortedResumes.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Resume File Name & Size */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <RiFileCodeLine size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                            {row.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {row.type || 'PDF'} • {row.size || '1.8 MB'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Target Role */}
                    <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
                      {row.targetRole || 'General'}
                    </td>

                    {/* Latest Score Badge */}
                    <td style={{ padding: '16px 24px' }}>
                      {row.latestScore !== null && row.latestScore !== undefined ? (
                        <ScoreBadge score={row.latestScore} label={`${row.latestScore}%`} size="sm" />
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Not analyzed yet</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {formatDisplayDate(row.updatedAt || row.uploadedAt)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <SecondaryButton
                          size="sm"
                          onClick={() => setViewingResume(row)}
                        >
                          View
                        </SecondaryButton>

                        <PrimaryButton
                          size="sm"
                          icon={RiSparklingLine}
                          onClick={() => handleAnalyzeClick(row)}
                        >
                          Analyze
                        </PrimaryButton>

                        {/* Three-Dot Menu Trigger */}
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            title="More actions"
                            onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            <RiMore2Line size={16} />
                          </button>

                          {/* Action Dropdown Menu */}
                          {activeMenuId === row.id && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '32px',
                                width: '160px',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-lg)',
                                padding: '4px',
                                zIndex: 40,
                                textAlign: 'left',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setViewingResume(row);
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '12.5px',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <RiEyeLine size={14} />
                                <span>View Details</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setEditingResume(row);
                                  setEditName(row.name);
                                  setEditRole(row.targetRole || '');
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '12.5px',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <RiEdit2Line size={14} />
                                <span>Edit Details</span>
                              </button>

                              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setDeletingResume(row);
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '12.5px',
                                  color: 'var(--danger)',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <RiDeleteBin6Line size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards List View */}
          <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAndSortedResumes.map((row) => (
              <div
                key={row.id}
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <RiFileCodeLine size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                        {row.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {row.targetRole || 'General'}
                      </div>
                    </div>
                  </div>
                  {row.latestScore !== null && row.latestScore !== undefined ? (
                    <ScoreBadge score={row.latestScore} label={`${row.latestScore}%`} size="sm" />
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unanalyzed</span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Updated: {formatDisplayDate(row.updatedAt || row.uploadedAt)}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <SecondaryButton
                    size="sm"
                    onClick={() => setViewingResume(row)}
                  >
                    View
                  </SecondaryButton>
                  <PrimaryButton
                    size="sm"
                    icon={RiSparklingLine}
                    onClick={() => handleAnalyzeClick(row)}
                  >
                    Analyze
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={() => setEditingResume(row)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingResume(row)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--danger-light)',
                      border: '1px solid var(--danger)',
                      fontSize: '12px',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Empty State */
        <EmptyState
          icon={RiFileTextLine}
          title={searchQuery ? 'No matching resumes' : 'No resumes yet'}
          description={
            searchQuery
              ? `No resumes found matching "${searchQuery}". Try a different search term.`
              : 'Upload your first resume to start analyzing your career opportunities.'
          }
          actionLabel="Upload Resume"
          onAction={() => onNavigate && onNavigate('upload')}
        />
      )}

      {/* 1. VIEW DETAILS MODAL */}
      {viewingResume && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setViewingResume(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-24)',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Resume Details
              </h3>
              <button onClick={() => setViewingResume(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RiCloseLine size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <RiFileCodeLine size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                    {viewingResume.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {viewingResume.type || 'PDF'} • {viewingResume.size || '1.8 MB'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Target Role</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{viewingResume.targetRole || 'General'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Latest Score</span>
                  <strong>{viewingResume.latestScore !== null ? `${viewingResume.latestScore}%` : 'Not analyzed'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Uploaded</span>
                  <span style={{ color: 'var(--text-primary)' }}>{formatDisplayDate(viewingResume.uploadedAt)}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Last Updated</span>
                  <span style={{ color: 'var(--text-primary)' }}>{formatDisplayDate(viewingResume.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <SecondaryButton onClick={() => setViewingResume(null)}>Close</SecondaryButton>
              <PrimaryButton
                icon={RiSparklingLine}
                onClick={() => {
                  const target = viewingResume;
                  setViewingResume(null);
                  handleAnalyzeClick(target);
                }}
              >
                Analyze This Resume
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT DETAILS MODAL */}
      {editingResume && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setEditingResume(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-24)',
              maxWidth: '420px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Edit Resume Details
              </h3>
              <button onClick={() => setEditingResume(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RiCloseLine size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Resume File Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <Input
                label="Target Role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <SecondaryButton onClick={() => setEditingResume(null)}>Cancel</SecondaryButton>
                <PrimaryButton type="submit">Save Changes</PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {deletingResume && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setDeletingResume(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-24)',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <RiDeleteBin6Line size={18} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Delete Resume?
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.45 }}>
              Are you sure you want to delete "<strong>{deletingResume.name}</strong>"? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <SecondaryButton onClick={() => setDeletingResume(null)}>Cancel</SecondaryButton>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--danger)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 'var(--fw-medium)',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
