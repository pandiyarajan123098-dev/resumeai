import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import ScoreBadge from '../components/ui/ScoreBadge';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { syncAnalysisToResume } from '../utils/resumeStorage';
import { saveAnalysis, getAnalyses } from '../utils/analysisStorage';
import {
  RiSparklingLine,
  RiRefreshLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiBookmarkLine,
  RiCheckLine,
  RiArrowRightLine,
  RiTargetLine,
  RiFlashlightLine
} from '@remixicon/react';

export default function ResultsPage({ analysisResult: propAnalysisResult, analysisSetup, onNavigate }) {
  const [saved, setSaved] = useState(false);
  const [showImproveModal, setShowImproveModal] = useState(false);

  // Default fallback mock analysis result
  const defaultFallback = {
    id: `hist-${Date.now()}`,
    resumeName: analysisSetup?.name || 'Pandi_Resume.pdf',
    analysisType: analysisSetup?.type || 'domain',
    typeLabel: analysisSetup?.typeLabel || 'Domain Analysis',
    target: analysisSetup?.target || 'Frontend Developer',
    targetRole: analysisSetup?.targetRole || 'Frontend Developer',
    score: 78,
    summary: 'Your resume is a good match for this role. Technical skills and resume structure are clear, but adding targeted keywords and measurable outcomes will boost your ATS score.',
    strengths: [
      { title: 'Strong Technical Foundation', desc: 'Your resume demonstrates relevant frontend development skills.' },
      { title: 'Good Resume Structure', desc: 'Your sections are clear and easy to scan.' },
      { title: 'Relevant Development Experience', desc: 'Your experience aligns well with the selected role.' },
    ],
    improvements: [
      { title: 'Improve Keyword Coverage', desc: 'Add relevant terms such as React, TypeScript, APIs, and testing where applicable.', priority: 'High', priorityVariant: 'danger' },
      { title: 'Add Stronger Project Details', desc: 'Explain your contribution and technologies used.', priority: 'Medium', priorityVariant: 'warning' },
      { title: 'Include Measurable Results', desc: 'Show impact using numbers where possible.', priority: 'Low', priorityVariant: 'indigo' },
    ],
    breakdown: [
      { name: 'Skills Match', value: 85, color: 'var(--success)' },
      { name: 'Experience', value: 72, color: 'var(--primary)' },
      { name: 'Projects', value: 68, color: 'var(--secondary)' },
      { name: 'Keywords', value: 60, color: 'var(--warning)' },
      { name: 'Resume Structure', value: 90, color: 'var(--success)' },
    ],
    recommendedSkills: ['TypeScript', 'Next.js', 'REST APIs', 'Testing', 'State Management'],
    nextSteps: [
      { num: 1, title: 'Improve keyword usage', desc: 'Add role-relevant skills and technologies where genuinely applicable.' },
      { num: 2, title: 'Strengthen project descriptions', desc: 'Explain what you built, what technologies you used, and the outcome.' },
      { num: 3, title: 'Add measurable achievements', desc: 'Use numbers to show your contribution and impact.' },
    ],
  };

  // Get latest saved analysis from LocalStorage as fallback
  const latestSaved = getAnalyses()?.[0];

  // Helper to verify if an object contains valid populated analysis arrays
  const hasValidFields = (obj) => obj && Array.isArray(obj.strengths) && obj.strengths.length > 0;

  // Resolve analysis payload with robust fallback cascade
  const analysisResult = hasValidFields(propAnalysisResult)
    ? propAnalysisResult
    : hasValidFields(analysisSetup)
    ? analysisSetup
    : hasValidFields(latestSaved)
    ? latestSaved
    : defaultFallback;

  const fileName = analysisResult.resumeName || 'Pandi_Resume.pdf';
  const roleName = analysisResult.targetRole || analysisResult.target || 'Frontend Developer';
  const typeLabel = analysisResult.typeLabel || 'Domain Analysis';
  const score = analysisResult.score || 78;

  const handleSaveAnalysis = () => {
    try {
      syncAnalysisToResume(analysisResult);
      saveAnalysis(analysisResult);
    } catch (e) {
      console.log('Saved to state');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* 1. Subtle Step Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '12px',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--surface)',
          padding: '12px var(--space-24)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <span style={{ color: 'var(--success)', fontWeight: 'var(--fw-semibold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>1 Upload Resume <RiCheckLine size={14} /></span>
        <span style={{ color: 'var(--border)' }}>──────</span>
        <span style={{ color: 'var(--success)', fontWeight: 'var(--fw-semibold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>2 Analysis Setup <RiCheckLine size={14} /></span>
        <span style={{ color: 'var(--border)' }}>──────</span>
        <span style={{ color: 'var(--success)', fontWeight: 'var(--fw-semibold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>3 AI Processing <RiCheckLine size={14} /></span>
        <span style={{ color: 'var(--border)' }}>──────</span>
        <span style={{ color: 'var(--primary)', fontWeight: 'var(--fw-bold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>4 Results</span>
      </div>

      {/* 2. Page Header with "Analyze Again" button */}
      <PageHeader
        title="Analysis Results"
        description="Here’s how your resume matches your selected target."
        actions={
          <SecondaryButton
            icon={RiRefreshLine}
            onClick={() => onNavigate && onNavigate('analyze')}
          >
            Analyze Again
          </SecondaryButton>
        }
      />

      {/* 3. Result Summary Card (Circular SVG + Analyzed For + AI Summary) */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }} className="result-summary-row">
          {/* Circular Match Score SVG */}
          <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r="54"
                stroke="var(--border-subtle)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r="54"
                stroke="var(--primary)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={(2 * Math.PI * 54) * (1 - score / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
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
              <span style={{ fontSize: '28px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                {score}%
              </span>
              <span style={{ fontSize: '11px', fontWeight: 'var(--fw-semibold)', color: score >= 80 ? 'var(--success)' : 'var(--primary)' }}>
                {score >= 80 ? 'Excellent Match' : score >= 65 ? 'Good Match' : 'Needs Work'}
              </span>
            </div>
          </div>

          {/* Right Summary Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '280px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Analyzed For
              </span>
              <div style={{ fontSize: '18px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiTargetLine size={18} style={{ color: 'var(--primary)' }} />
                <span>{roleName}</span>
                <ScoreBadge label={typeLabel} size="sm" variant="indigo" />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                File: <strong>{fileName}</strong>
              </div>
            </div>

            {/* Dynamic AI Summary */}
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                backgroundColor: 'var(--bg-main)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              “{analysisResult.summary}”
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Primary Highlighted Insight */}
      <div
        style={{
          padding: 'var(--space-16) var(--space-20)',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <RiFlashlightLine size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '12px', fontWeight: 'var(--fw-bold)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Highest Impact Improvement
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginTop: '2px' }}>
            {analysisResult.improvements?.[0]?.title || 'Improve your project descriptions.'}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
            {analysisResult.improvements?.[0]?.desc || 'Add technologies used, your contribution, and measurable results.'}
          </p>
        </div>
      </div>

      {/* 5. Main Analysis Section (Two Column Layout) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-24)',
        }}
        className="results-two-col"
      >
        {/* LEFT: Resume Strengths */}
        <Card style={{ padding: 'var(--space-24)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiCheckboxCircleLine size={18} style={{ color: 'var(--success)' }} />
            <span>Resume Strengths</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(analysisResult.strengths || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RIGHT: Areas to Improve */}
        <Card style={{ padding: 'var(--space-24)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiErrorWarningLine size={18} style={{ color: 'var(--warning)' }} />
            <span>Areas to Improve</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(analysisResult.improvements || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <ScoreBadge label={item.priority || 'Medium'} size="sm" variant={item.priorityVariant || 'warning'} />
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 6. Score Breakdown Section */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            Resume Match Breakdown
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Individual component scores evaluated against target role benchmarks.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          {(analysisResult.breakdown || []).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                  {item.value}%
                </span>
              </div>
              <ProgressBar value={item.value} showPercentage={false} color={item.color || 'var(--primary)'} size="sm" />
            </div>
          ))}
        </div>
      </Card>

      {/* 7. Recommended Skills Section */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
          Recommended Skills
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: '16px' }}>
          Skills that may strengthen your match for {roleName}.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(analysisResult.recommendedSkills || []).map((skill, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '12.5px',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
              }}
            >
              + {skill}
            </span>
          ))}
        </div>
      </Card>

      {/* 8. AI Action Plan (Your Next Steps) */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Your Next Steps
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-16)' }}>
          {(analysisResult.nextSteps || []).map((step, i) => (
            <div
              key={step.num || i}
              style={{
                padding: 'var(--space-16)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'var(--fw-bold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                }}
              >
                {step.num || i + 1}
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 9. Bottom Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <SecondaryButton
          icon={saved ? RiCheckLine : RiBookmarkLine}
          onClick={handleSaveAnalysis}
        >
          {saved ? 'Analysis Saved!' : 'Save Analysis'}
        </SecondaryButton>

        <PrimaryButton
          size="lg"
          icon={RiArrowRightLine}
          iconPosition="right"
          onClick={() => setShowImproveModal(true)}
        >
          Improve Resume
        </PrimaryButton>
      </div>

      {/* Interactive Improve Resume Modal */}
      {showImproveModal && (
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
          onClick={() => setShowImproveModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-32)',
              maxWidth: '520px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <RiSparklingLine size={22} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                Resume Optimization Plan
              </h3>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Recommendations to lift your match score to <strong>90%+</strong> for {roleName}:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', fontSize: '13px' }}>
                <strong>1. Impact Statement:</strong> Add metrics to your bullet points to quantify team results.
              </div>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', fontSize: '13px' }}>
                <strong>2. Technical Keywords:</strong> Add recommended skills ({analysisResult.recommendedSkills?.slice(0, 3).join(', ')}) to your skills matrix.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <SecondaryButton onClick={() => setShowImproveModal(false)}>Close</SecondaryButton>
              <PrimaryButton onClick={() => { setShowImproveModal(false); onNavigate && onNavigate('dashboard'); }}>
                Return to Dashboard
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .results-two-col, .result-summary-row {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
