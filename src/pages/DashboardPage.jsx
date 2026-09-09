import React, { useState } from 'react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import ScoreBadge from '../components/ui/ScoreBadge';
import ProgressBar from '../components/ui/ProgressBar';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
  RiFileTextLine,
  RiBarChartGroupedLine,
  RiTargetLine,
  RiSparklingLine,
  RiArrowRightLine,
  RiCodeSSlashLine,
  RiBriefcaseLine,
  RiGitRepositoryLine,
  RiKey2Line,
  RiLayoutGridLine,
  RiMore2Line,
  RiEdit2Line,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiFileCodeLine,
  RiLineChartLine,
  RiDoubleQuotesL,
  RiUser3Line
} from '@remixicon/react';

export default function DashboardPage({ onNavigate }) {
  // State for Target Role update interaction
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [tempRoleInput, setTempRoleInput] = useState(targetRole);

  // State for Analysis Selection Dropdown
  const [selectedAnalysisId, setSelectedAnalysisId] = useState('1');

  // Interactive Resumes Dataset
  const resumesData = [
    {
      id: '1',
      fileName: 'Pandi_Resume.pdf',
      targetRole: 'Frontend Developer',
      score: 78,
      lastAnalyzed: 'Today, 10:30 AM',
      metrics: [
        { name: 'Skills Match', value: 85, icon: RiCodeSSlashLine, color: 'var(--success)' },
        { name: 'Experience', value: 72, icon: RiBriefcaseLine, color: 'var(--primary)' },
        { name: 'Projects', value: 68, icon: RiGitRepositoryLine, color: 'var(--secondary)' },
        { name: 'Keywords', value: 60, icon: RiKey2Line, color: 'var(--warning)' },
        { name: 'Resume Structure', value: 90, icon: RiLayoutGridLine, color: 'var(--success)' },
      ],
      insight: 'Your resume structure is strong. Improve keyword usage and add more relevant projects.'
    },
    {
      id: '2',
      fileName: 'UIUX_Resume.pdf',
      targetRole: 'UI/UX Designer',
      score: 65,
      lastAnalyzed: 'Aug 28, 2026',
      metrics: [
        { name: 'Skills Match', value: 70, icon: RiCodeSSlashLine, color: 'var(--secondary)' },
        { name: 'Experience', value: 60, icon: RiBriefcaseLine, color: 'var(--warning)' },
        { name: 'Projects', value: 75, icon: RiGitRepositoryLine, color: 'var(--primary)' },
        { name: 'Keywords', value: 55, icon: RiKey2Line, color: 'var(--warning)' },
        { name: 'Resume Structure', value: 82, icon: RiLayoutGridLine, color: 'var(--success)' },
      ],
      insight: 'Add more user testing metrics & prototype links to improve UI/UX alignment.'
    },
    {
      id: '3',
      fileName: 'Data_Analyst_Resume.pdf',
      targetRole: 'Data Analyst',
      score: 52,
      lastAnalyzed: 'Aug 25, 2026',
      metrics: [
        { name: 'Skills Match', value: 55, icon: RiCodeSSlashLine, color: 'var(--warning)' },
        { name: 'Experience', value: 50, icon: RiBriefcaseLine, color: 'var(--warning)' },
        { name: 'Projects', value: 48, icon: RiGitRepositoryLine, color: 'var(--danger)' },
        { name: 'Keywords', value: 45, icon: RiKey2Line, color: 'var(--danger)' },
        { name: 'Resume Structure', value: 70, icon: RiLayoutGridLine, color: 'var(--primary)' },
      ],
      insight: 'Include SQL, Python, and data visualization keywords to raise your ATS score.'
    },
  ];

  const currentAnalysis = resumesData.find((r) => r.id === selectedAnalysisId) || resumesData[0];

  const handleRoleSave = (e) => {
    e.preventDefault();
    if (tempRoleInput.trim()) {
      setTargetRole(tempRoleInput.trim());
    }
    setIsEditingRole(false);
  };

  // Determine time of day for subtle greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';

  return (
    <div className="dashboard-container">
      {/* 1. Dashboard Greeting Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-20)',
          backgroundColor: 'var(--surface)',
          padding: 'var(--space-24)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
            {greeting}
          </span>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-primary)',
              margin: '4px 0 6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Pandi</span>
            <RiUser3Line size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Keep going! A better resume opens better opportunities.
          </p>
        </div>

        {/* Motivational Quote Card */}
        <div
          style={{
            maxWidth: '360px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <RiDoubleQuotesL size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px', opacity: 0.8 }} />
          <div>
            <p style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.45, margin: 0 }}>
              “Small improvements today create bigger opportunities tomorrow.”
            </p>
            <span style={{ fontSize: '11px', fontWeight: 'var(--fw-semibold)', color: 'var(--primary)', marginTop: '4px', display: 'block' }}>
              — ResumeX AI
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Statistics Section (4 Equal Cards Grid) */}
      <div className="dashboard-stats-grid">
        {/* Stat 1: Total Resumes */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
                Total Resumes
              </span>
              <div style={{ fontSize: '28px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginTop: '4px' }}>
                3
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                flexShrink: 0,
              }}
            >
              <RiFileTextLine size={18} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--success)', fontWeight: 'var(--fw-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↑ +1 this month</span>
          </div>
        </Card>

        {/* Stat 2: Total Analyses */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
                Total Analyses
              </span>
              <div style={{ fontSize: '28px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginTop: '4px' }}>
                8
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                flexShrink: 0,
              }}
            >
              <RiBarChartGroupedLine size={18} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--success)', fontWeight: 'var(--fw-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↑ +3 this month</span>
          </div>
        </Card>

        {/* Stat 3: Latest Match Score */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
                Latest Match Score
              </span>
              <div style={{ fontSize: '28px', fontWeight: 'var(--fw-bold)', color: 'var(--primary)', marginTop: '4px' }}>
                78%
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <RiTargetLine size={18} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--success)', fontWeight: 'var(--fw-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↑ +12% improvement</span>
          </div>
        </Card>

        {/* Stat 4: Target Role */}
        <Card hover style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
                Target Role
              </span>
              <div style={{ fontSize: '16px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {targetRole}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                flexShrink: 0,
              }}
            >
              <RiCodeSSlashLine size={18} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTempRoleInput(targetRole);
              setIsEditingRole(true);
            }}
            style={{
              marginTop: '14px',
              fontSize: '12px',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            <span>Update role</span>
            <RiArrowRightLine size={13} />
          </button>
        </Card>
      </div>

      {/* 3. Main Dashboard Section (Two Column Layout) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 'var(--space-24)',
        }}
        className="dashboard-two-col"
      >
        {/* LEFT COLUMN: Resume Strength Breakdown */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div>
            {/* Header with Title & Dropdown */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                  Resume Strength Breakdown
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  See which areas of your resume are strong and where to improve.
                </p>
              </div>

              {/* Latest Analysis Dropdown */}
              <div style={{ width: '210px' }}>
                <select
                  value={selectedAnalysisId}
                  onChange={(e) => setSelectedAnalysisId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {resumesData.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5 Metrics List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
              {currentAnalysis.metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} strokeWidth={1.8} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                          {metric.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', minWidth: '40px', textAlign: 'right' }}>
                        {metric.value}%
                      </span>
                    </div>

                    {/* Controlled Horizontal Progress Bar */}
                    <ProgressBar
                      value={metric.value}
                      showPercentage={false}
                      color={metric.color}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Insight Note */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <RiCheckboxCircleLine size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>{currentAnalysis.insight}</span>
          </div>
        </Card>

        {/* RIGHT COLUMN: AI Insight Card */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div>
            {/* AI Insight Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiSparklingLine size={18} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                  AI Insight
                </h2>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                Powered by AI
              </span>
            </div>

            {/* Circular Match Score & Progress Visualization */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                padding: 'var(--space-16) 0',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              {/* Circular Ring SVG */}
              <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    stroke="var(--border-subtle)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    stroke="var(--primary)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={(2 * Math.PI * 46) * (1 - currentAnalysis.score / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                    {currentAnalysis.score}%
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)' }}>
                    Match Score
                  </span>
                </div>
              </div>

              {/* Status & Target Role details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--success)',
                      backgroundColor: 'var(--success-light)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    Good Progress!
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Your resume matches well for the selected role. Keep improving your skills and add more relevant projects.
                </p>

                {/* Target Role Tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    fontSize: '11px',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    alignSelf: 'flex-start',
                  }}
                >
                  <RiCodeSSlashLine size={14} style={{ color: 'var(--primary)' }} />
                  <span>Target: {targetRole}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width View Analysis Action Button */}
          <div style={{ marginTop: '20px' }}>
            <PrimaryButton
              fullWidth
              size="lg"
              icon={RiArrowRightLine}
              iconPosition="right"
              onClick={() => onNavigate && onNavigate('analyze')}
            >
              View Full Analysis
            </PrimaryButton>
          </div>
        </Card>
      </div>

      {/* 4. Recent Resumes Section */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        {/* Table Header */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
              Recent Resumes
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your latest uploaded resumes and analysis results.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('resumes')}
            style={{
              fontSize: '13px',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <span>View All</span>
            <RiArrowRightLine size={14} />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="desktop-only" style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  File Name
                </th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target Role
                </th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Score
                </th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Last Analyzed
                </th>
                <th style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {resumesData.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: idx === resumesData.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* File Name */}
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
                        {row.fileName}
                      </span>
                    </div>
                  </td>

                  {/* Target Role */}
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {row.targetRole}
                  </td>

                  {/* Clean Score Badge */}
                  <td style={{ padding: '16px 24px' }}>
                    <ScoreBadge score={row.score} size="sm" />
                  </td>

                  {/* Last Analyzed */}
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {row.lastAnalyzed}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <SecondaryButton
                        size="sm"
                        onClick={() => {
                          setSelectedAnalysisId(row.id);
                          onNavigate && onNavigate('analyze');
                        }}
                      >
                        View
                      </SecondaryButton>
                      <button
                        type="button"
                        title="More Options"
                        onClick={() => alert(`Options for ${row.fileName}`)}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resumesData.map((row) => (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiFileCodeLine size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                    {row.fileName}
                  </span>
                </div>
                <ScoreBadge score={row.score} size="sm" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>Role: {row.targetRole}</span>
                <span>{row.lastAnalyzed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <SecondaryButton
                  size="sm"
                  onClick={() => {
                    setSelectedAnalysisId(row.id);
                    onNavigate && onNavigate('analyze');
                  }}
                >
                  View Analysis
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Target Role Update Modal Dialog */}
      {isEditingRole && (
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
          onClick={() => setIsEditingRole(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Update Target Role
              </h3>
              <button onClick={() => setIsEditingRole(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <RiCloseLine size={18} />
              </button>
            </div>

            <form onSubmit={handleRoleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Target Career Position / Job Title"
                value={tempRoleInput}
                onChange={(e) => setTempRoleInput(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <SecondaryButton onClick={() => setIsEditingRole(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit">
                  Save Role
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Grid CSS Overrides */}
      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .dashboard-container {
            gap: 20px;
          }
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .dashboard-two-col {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-container {
            gap: 16px;
          }
          .dashboard-stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}

