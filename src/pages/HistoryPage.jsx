import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import ScoreBadge from '../components/ui/ScoreBadge';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import {
  getAnalyses,
  calculateScoreChange,
  getAnalysisById,
  deleteAnalysis
} from '../utils/analysisStorage';
import { formatDisplayDate } from '../utils/resumeStorage';
import {
  RiSparklingLine,
  RiSearchLine,
  RiFileCodeLine,
  RiEyeLine,
  RiArrowRightUpLine,
  RiArrowRightDownLine,
  RiDeleteBin6Line,
  RiCloseLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiLightbulbLine,
  RiArrowRightLine,
  RiStackLine,
  RiBuilding2Line,
  RiClipboardLine
} from '@remixicon/react';

export default function HistoryPage({ onNavigate }) {
  const [analyses, setAnalyses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'domain', 'company', 'job_description'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'

  // Modal States
  const [viewingItem, setViewingItem] = useState(null);
  const [comparingItem, setComparingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Load analyses on mount
  useEffect(() => {
    setAnalyses(getAnalyses());
  }, []);

  // Compute Top Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (!analyses || analyses.length === 0) {
      return { total: 0, bestScore: 0, avgScore: 0 };
    }

    const total = analyses.length;
    const scores = analyses.map((a) => a.score || 0);
    const bestScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / total);

    return { total, bestScore, avgScore };
  }, [analyses]);

  // Filter & Sort Logic
  const filteredAnalyses = useMemo(() => {
    let result = analyses.filter((item) => {
      // Filter by Type
      if (filterType !== 'all') {
        if (filterType === 'domain' && item.analysisType !== 'domain') return false;
        if (filterType === 'company' && item.analysisType !== 'company') return false;
        if (filterType === 'job_description' && item.analysisType !== 'job_description') return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.resumeName.toLowerCase().includes(q) ||
        (item.target && item.target.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q))
      );
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'highest') {
        return (b.score || 0) - (a.score || 0);
      }
      if (sortBy === 'lowest') {
        return (a.score || 0) - (b.score || 0);
      }
      return 0;
    });

    return result;
  }, [analyses, searchQuery, filterType, sortBy]);

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Page Header */}
      <PageHeader
        title="Analysis History"
        description="Track how your resume improves over time."
        actions={
          <PrimaryButton
            icon={RiSparklingLine}
            onClick={() => onNavigate && onNavigate('analyze')}
          >
            Analyze Resume
          </PrimaryButton>
        }
      />

      {/* Top Compact Summary Row (3 lightweight metrics) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-16)',
        }}
      >
        <Card style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
              Total Analyses
            </span>
            <div style={{ fontSize: '22px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginTop: '2px' }}>
              {summaryMetrics.total}
            </div>
          </div>
          <div style={{ color: 'var(--primary)', opacity: 0.8 }}>
            <RiSparklingLine size={22} />
          </div>
        </Card>

        <Card style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
              Best Score
            </span>
            <div style={{ fontSize: '22px', fontWeight: 'var(--fw-bold)', color: 'var(--success)', marginTop: '2px' }}>
              {summaryMetrics.bestScore}%
            </div>
          </div>
          <div style={{ color: 'var(--success)', opacity: 0.8 }}>
            <RiArrowRightUpLine size={22} />
          </div>
        </Card>

        <Card style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
              Average Score
            </span>
            <div style={{ fontSize: '22px', fontWeight: 'var(--fw-bold)', color: 'var(--primary)', marginTop: '2px' }}>
              {summaryMetrics.avgScore}%
            </div>
          </div>
          <div style={{ color: 'var(--secondary)', opacity: 0.8 }}>
            <RiStackLine size={22} />
          </div>
        </Card>
      </div>

      {/* History Controls Row: Search, Type Filter, Sort */}
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
        <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
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
            placeholder="Search analyses..."
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

        {/* Filter & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Analysis Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)' }}>
              Type:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
              <option value="all">All Analyses</option>
              <option value="domain">Domain Analysis</option>
              <option value="company">Company + Role</option>
              <option value="job_description">Job Description</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)' }}>
              Sort:
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
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis History Table */}
      {filteredAnalyses.length > 0 ? (
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
                    Analysis Target
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Type
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Score
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Change
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Date
                  </th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((row, idx) => {
                  const scoreChange = calculateScoreChange(row, analyses);

                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: idx === filteredAnalyses.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Resume Name */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <RiFileCodeLine size={18} />
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                            {row.resumeName}
                          </span>
                        </div>
                      </td>

                      {/* Analysis Target */}
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {row.targetRole}
                      </td>

                      {/* Analysis Type */}
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 'var(--fw-medium)',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-main)',
                            border: '1px solid var(--border)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          {row.typeLabel || 'Domain Analysis'}
                        </span>
                      </td>

                      {/* Score Badge */}
                      <td style={{ padding: '16px 24px' }}>
                        <ScoreBadge score={row.score} label={`${row.score}%`} size="sm" />
                      </td>

                      {/* Score Change Indicator */}
                      <td style={{ padding: '16px 24px' }}>
                        {scoreChange ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 'var(--fw-semibold)',
                              color: scoreChange.isPositive ? 'var(--success)' : 'var(--danger)',
                              backgroundColor: scoreChange.isPositive ? 'var(--success-light)' : 'var(--danger-light)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                            }}
                          >
                            {scoreChange.isPositive ? <RiArrowRightUpLine size={12} /> : <RiArrowRightDownLine size={12} />}
                            <span>{scoreChange.text}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>First audit</span>
                        )}
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {formatDisplayDate(row.createdAt)}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <SecondaryButton
                            size="sm"
                            onClick={() => setViewingItem(row)}
                          >
                            View
                          </SecondaryButton>
                          <button
                            type="button"
                            title="Delete Log"
                            onClick={() => setDeletingItem(row)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            <RiDeleteBin6Line size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAnalyses.map((row) => {
              const scoreChange = calculateScoreChange(row, analyses);
              return (
                <div
                  key={row.id}
                  style={{
                    padding: '14px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiFileCodeLine size={18} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                        {row.resumeName}
                      </span>
                    </div>
                    <ScoreBadge score={row.score} label={`${row.score}%`} size="sm" />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>Target: {row.targetRole}</span>
                    <span>{formatDisplayDate(row.createdAt)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    {scoreChange ? (
                      <span style={{ fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: scoreChange.isPositive ? 'var(--success)' : 'var(--danger)' }}>
                        {scoreChange.text}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>First audit</span>
                    )}

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <SecondaryButton size="sm" onClick={() => setViewingItem(row)}>
                        View
                      </SecondaryButton>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(row)}
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
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* Empty State */
        <EmptyState
          icon={RiSparklingLine}
          title={searchQuery ? 'No matching analyses' : 'No analysis history yet'}
          description={
            searchQuery
              ? `No analysis history found matching "${searchQuery}".`
              : 'Analyze your resume to start tracking your progress.'
          }
          actionLabel="Analyze Resume"
          onAction={() => onNavigate && onNavigate('analyze')}
        />
      )}

      {/* 1. VIEW HISTORICAL ANALYSIS DETAILS MODAL */}
      {viewingItem && (
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
          onClick={() => setViewingItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-24)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                  Historical Analysis Record
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatDisplayDate(viewingItem.createdAt)} • File: {viewingItem.resumeName}
                </span>
              </div>
              <button onClick={() => setViewingItem(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Score & Target Summary Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-16)',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analysis Target</div>
                <div style={{ fontSize: '16px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                  {viewingItem.target}
                </div>
              </div>
              <ScoreBadge score={viewingItem.score} label={`${viewingItem.score}% Overall Score`} size="lg" />
            </div>

            {/* Breakdown Progress Bars */}
            {viewingItem.breakdown && viewingItem.breakdown.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Component Score Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {viewingItem.breakdown.map((b, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>{b.name}</span>
                        <strong>{b.value}%</strong>
                      </div>
                      <ProgressBar value={b.value} showPercentage={false} color={b.color || 'var(--primary)'} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--success)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiCheckboxCircleLine size={16} /> Resume Strengths
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(viewingItem.strengths || []).map((s, i) => (
                    <div key={i} style={{ fontSize: '12px', padding: '8px 10px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                      <strong>{s.title}</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--warning)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiErrorWarningLine size={16} /> Areas to Improve
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(viewingItem.improvements || []).map((imp, i) => (
                    <div key={i} style={{ fontSize: '12px', padding: '8px 10px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                      <strong>{imp.title}</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{imp.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <SecondaryButton onClick={() => setViewingItem(null)}>Close</SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPARE PREVIOUS ANALYSIS MODAL */}
      {comparingItem && (
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
          onClick={() => setComparingItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-24)',
              maxWidth: '560px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiArrowRightUpLine size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                  Analysis Progress Comparison
                </h3>
              </div>
              <button onClick={() => setComparingItem(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RiCloseLine size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Comparing analyses for <strong>{comparingItem.current.resumeName}</strong> ({comparingItem.current.target})
            </p>

            {/* Score Comparison Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 1fr',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'var(--space-20)',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                marginBottom: '20px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Previous Score</span>
                <div style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-secondary)' }}>
                  {comparingItem.prev.score}%
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {formatDisplayDate(comparingItem.prev.createdAt)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <RiArrowRightLine size={20} style={{ color: 'var(--primary)' }} />
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 'var(--fw-bold)',
                    color: comparingItem.change.isPositive ? 'var(--success)' : 'var(--warning)',
                    marginTop: '2px',
                  }}
                >
                  {comparingItem.change.changeText}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Latest Score</span>
                <div style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--primary)' }}>
                  {comparingItem.current.score}%
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {formatDisplayDate(comparingItem.current.createdAt)}
                </span>
              </div>
            </div>

            {/* Changed Component Metrics */}
            <h4 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Meaningful Score Changes
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {(comparingItem.current.breakdown || []).map((currB, i) => {
                const prevB = (comparingItem.prev.breakdown || [])[i] || { value: currB.value };
                const diff = currB.value - prevB.value;

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                      {currB.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{prevB.value}% → <strong>{currB.value}%</strong></span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 'var(--fw-semibold)',
                          color: diff >= 0 ? 'var(--success)' : 'var(--warning)',
                        }}
                      >
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SecondaryButton onClick={() => setComparingItem(null)}>Close</SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setDeletingItem(null)}
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
              <h3 style={{ fontSize: '17px', fontWeight: 'var(--fw-bold)', color: 'var(--danger)' }}>
                Delete Analysis Log
              </h3>
              <button onClick={() => setDeletingItem(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RiCloseLine size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to delete the analysis record for <strong>{deletingItem.resumeName}</strong> ({deletingItem.targetRole})?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <SecondaryButton onClick={() => setDeletingItem(null)}>Cancel</SecondaryButton>
              <button
                type="button"
                onClick={() => {
                  deleteAnalysis(deletingItem.id);
                  setAnalyses(getAnalyses());
                  setDeletingItem(null);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 'var(--fw-medium)',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
