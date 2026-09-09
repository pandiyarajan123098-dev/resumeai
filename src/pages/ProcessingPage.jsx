import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { analyzeResume } from '../services/aiService';
import { generateDemoAnalysis } from '../services/demoAiService';
import { saveAnalysis } from '../utils/analysisStorage';
import {
  RiLoader4Line,
  RiCheckboxCircleLine,
  RiSparklingLine,
  RiArrowRightLine,
  RiErrorWarningLine,
  RiRefreshLine
} from '@remixicon/react';

export default function ProcessingPage({ analysisSetup, onNavigate }) {
  const [progress, setProgress] = useState(15);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorState, setErrorState] = useState(null);

  const resumeName = analysisSetup?.name || 'Pandi_Resume.pdf';
  const typeLabel = analysisSetup?.typeLabel || 'Domain Analysis';
  const targetLabel = analysisSetup?.target || 'Frontend Developer';

  const processingSteps = [
    'Reading resume & extracting layout structure...',
    'Understanding target requirements & retrieving RAG context...',
    'Matching competencies, experience & ATS keywords...',
    'Generating actionable AI improvement suggestions...',
  ];

  // Execute AI analysis call on mount with fast animation & 6s failsafe timeout
  useEffect(() => {
    let isMounted = true;

    // Progress bar animation interval (moves every 300ms)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90 && !analysisResult) return 90; // Wait for AI promise
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = prev + 20;
        if (next >= 75) setActiveStepIndex(3);
        else if (next >= 50) setActiveStepIndex(2);
        else if (next >= 25) setActiveStepIndex(1);
        return next;
      });
    }, 300);

    // Hard 6-second failsafe timeout to prevent user hanging at 90%
    const failsafeTimeout = setTimeout(() => {
      if (isMounted && !analysisResult) {
        console.warn('Analysis safety failsafe triggered after 6s timeout');
        const fallback = generateDemoAnalysis(analysisSetup);
        setAnalysisResult(fallback);
        saveAnalysis(fallback);
        setProgress(100);
        setActiveStepIndex(3);
        setTimeout(() => {
          if (isMounted && onNavigate) {
            onNavigate('results', fallback);
          }
        }, 500);
      }
    }, 6000);

    // Call AI Service
    async function runAI() {
      try {
        const result = await analyzeResume(analysisSetup, analysisSetup?.rawFile || null);
        if (isMounted) {
          clearTimeout(failsafeTimeout);
          setAnalysisResult(result);
          saveAnalysis(result);
          setProgress(100);
          setActiveStepIndex(3);

          // Smooth automatic navigation to Results page
          setTimeout(() => {
            if (isMounted && onNavigate) {
              onNavigate('results', result);
            }
          }, 500);
        }
      } catch (err) {
        console.warn('AI Analysis fallback:', err);
        if (isMounted) {
          clearTimeout(failsafeTimeout);
          const fallback = generateDemoAnalysis(analysisSetup);
          setAnalysisResult(fallback);
          saveAnalysis(fallback);
          setProgress(100);
          setActiveStepIndex(3);
          setTimeout(() => {
            if (isMounted && onNavigate) {
              onNavigate('results', fallback);
            }
          }, 500);
        }
      }
    }

    runAI();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
      clearTimeout(failsafeTimeout);
    };
  }, [analysisSetup]);

  // Handle navigate to results when complete
  const handleProceedToResults = () => {
    if (onNavigate) {
      onNavigate('results', analysisResult);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Subtle Step Indicator */}
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
        <span style={{ color: 'var(--primary)', fontWeight: 'var(--fw-bold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>3 AI Processing</span>
        <span style={{ color: 'var(--border)' }}>──────</span>
        <span style={{ color: 'var(--text-muted)' }}>4 Results</span>
      </div>

      {/* Main Processing Card */}
      <Card style={{ padding: 'var(--space-40) var(--space-32)', textAlign: 'center' }}>
        {!errorState ? (
          <>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-20)',
              }}
            >
              <RiSparklingLine size={30} style={{ animation: progress < 100 ? 'pulse 1.5s infinite ease-in-out' : 'none' }} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {progress < 100 ? 'Analyzing Your Resume with ResumeX AI...' : 'Analysis Complete!'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: 'var(--space-24)' }}>
              Target: <strong>{targetLabel}</strong> ({typeLabel}) • File: <strong>{resumeName}</strong>
            </p>

            {/* Progress Bar */}
            <div style={{ maxWidth: '480px', margin: '0 auto var(--space-32)' }}>
              <ProgressBar value={progress} showPercentage color="var(--primary)" size="lg" />
            </div>

            {/* Processing Steps List */}
            <div
              style={{
                maxWidth: '480px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'left',
                backgroundColor: 'var(--bg-main)',
                padding: 'var(--space-20)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
              }}
            >
              {processingSteps.map((step, idx) => {
                const isDone = idx < activeStepIndex || progress >= 100;
                const isCurrent = idx === activeStepIndex && progress < 100;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '13px',
                      fontWeight: isCurrent || isDone ? 'var(--fw-medium)' : 'var(--fw-regular)',
                      color: isDone
                        ? 'var(--text-primary)'
                        : isCurrent
                        ? 'var(--primary)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {isDone ? (
                      <RiCheckboxCircleLine size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    ) : isCurrent ? (
                      <RiLoader4Line size={18} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border)', flexShrink: 0 }} />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* View Results Button */}
            {progress >= 100 && (
              <div style={{ marginTop: 'var(--space-24)' }}>
                <PrimaryButton
                  size="lg"
                  icon={RiArrowRightLine}
                  iconPosition="right"
                  onClick={handleProceedToResults}
                >
                  View Full Analysis Results
                </PrimaryButton>
              </div>
            )}
          </>
        ) : (
          /* Friendly Error State */
          <div style={{ padding: 'var(--space-24)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiErrorWarningLine size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
              We couldn't complete your analysis.
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
              {errorState}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <SecondaryButton icon={RiRefreshLine} onClick={() => window.location.reload()}>
                Try Again
              </SecondaryButton>
              <PrimaryButton onClick={() => onNavigate && onNavigate('upload')}>
                Back to Upload
              </PrimaryButton>
            </div>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
