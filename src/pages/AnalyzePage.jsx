import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import {
  RiFileCodeLine,
  RiStackLine,
  RiBuilding2Line,
  RiClipboardLine,
  RiCheckboxCircleLine,
  RiArrowRightLine,
  RiShieldCheckLine,
  RiCheckLine,
  RiArrowRightSLine
} from '@remixicon/react';

import { getPreferences } from '../utils/settingsStorage';

export default function AnalyzePage({ onNavigate, resumeData, onStartAnalysis }) {
  // Resume details from previous step or default fallback
  const resumeName = resumeData?.name || 'Pandi_Resume.pdf';
  const resumeSize = resumeData?.size || '1.8 MB';

  // Analysis Option Selection loaded from saved preferences
  const savedPref = getPreferences();
  const [analysisType, setAnalysisType] = useState(savedPref.defaultAnalysisType || 'domain');

  // Dynamic Fields State
  const [targetDomain, setTargetDomain] = useState(savedPref.defaultTargetRole || 'Frontend Developer');
  const [companyName, setCompanyName] = useState('Google');
  const [companyRole, setCompanyRole] = useState(savedPref.defaultTargetRole || 'Frontend Developer');
  const [jobDescription, setJobDescription] = useState('');

  // Domain options list
  const domainOptions = [
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Software Engineer', label: 'Software Engineer' },
  ];

  // Check validity for action button
  const isValid = () => {
    if (analysisType === 'domain') {
      return Boolean(targetDomain);
    }
    if (analysisType === 'company') {
      return Boolean(companyName.trim() && companyRole.trim());
    }
    if (analysisType === 'job_description') {
      return Boolean(jobDescription.trim() && jobDescription.trim().length >= 10);
    }
    return false;
  };

  // Build summary text for confirmation card
  const getSummaryTargetText = () => {
    if (analysisType === 'domain') {
      return targetDomain;
    }
    if (analysisType === 'company') {
      return `${companyName || 'Google'} — ${companyRole || 'Frontend Developer'}`;
    }
    if (analysisType === 'job_description') {
      return `Custom Job Description (${jobDescription.trim().length} chars)`;
    }
    return targetDomain;
  };

  const getAnalysisTypeLabel = () => {
    if (analysisType === 'domain') return 'Domain Analysis';
    if (analysisType === 'company') return 'Company + Role Match';
    if (analysisType === 'job_description') return 'Job Description Match';
    return 'Domain Analysis';
  };

  const handleStartAnalysis = () => {
    const setupData = {
      name: resumeName,
      size: resumeSize,
      type: analysisType,
      typeLabel: getAnalysisTypeLabel(),
      target:
        analysisType === 'domain'
          ? targetDomain
          : analysisType === 'company'
          ? `${companyName} (${companyRole})`
          : 'Custom Job Description',
      targetRole: analysisType === 'domain' ? targetDomain : companyRole || 'Frontend Developer',
      company: companyName,
      jobDescription: jobDescription,
      rawFile: resumeData?.rawFile || null,
    };

    if (onStartAnalysis) {
      onStartAnalysis(setupData);
    }
    if (onNavigate) {
      onNavigate('processing', setupData);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* 1. Page Header & Compact Workflow Stepper */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-20)',
          backgroundColor: 'var(--surface)',
          padding: 'var(--space-24)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <PageHeader
          title="Analyze Resume"
          description="Choose how you want ResumeX AI to analyze your resume."
        />

        {/* 4-Step Stepper Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          {/* Step 1: Upload Resume (Completed) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'var(--fw-bold)',
              }}
            >
              <RiCheckLine size={14} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
              1. Upload Resume
            </span>
          </div>

          <div className="desktop-only" style={{ flex: 1, height: '2px', backgroundColor: 'var(--primary-border)', margin: '0 8px' }} />

          {/* Step 2: Analysis Setup (Active) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'var(--fw-bold)',
              }}
            >
              2
            </div>
            <span style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--primary)' }}>
              2. Analysis Setup
            </span>
          </div>

          <div className="desktop-only" style={{ flex: 1, height: '2px', backgroundColor: 'var(--border)', margin: '0 8px' }} />

          {/* Step 3: AI Processing (Future) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'var(--fw-medium)',
              }}
            >
              3
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              3. AI Processing
            </span>
          </div>

          <div className="desktop-only" style={{ flex: 1, height: '2px', backgroundColor: 'var(--border)', margin: '0 8px' }} />

          {/* Step 4: Results (Future) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'var(--fw-medium)',
              }}
            >
              4
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              4. Results
            </span>
          </div>
        </div>
      </div>

      {/* 2. Selected Resume Card */}
      <Card style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RiFileCodeLine size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Selected Resume
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                  {resumeName}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'var(--fw-regular)' }}>
                  PDF • {resumeSize}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('upload')}
            style={{
              fontSize: '13px',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--primary)',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-border)',
              backgroundColor: 'var(--primary-light)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
          >
            <span>Change</span>
            <RiArrowRightSLine size={14} />
          </button>
        </div>
      </Card>

      {/* 3. Analysis Type Selection Section */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            How would you like to analyze your resume?
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Choose the option that best matches your target application goal.
          </p>
        </div>

        {/* 3 Option Cards (Grid Layout) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-20)',
          }}
        >
          {/* Option 1: Domain Analysis */}
          <div
            onClick={() => setAnalysisType('domain')}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: analysisType === 'domain' ? '2px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: analysisType === 'domain' ? 'var(--primary-light)' : 'var(--surface)',
              boxShadow: analysisType === 'domain' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: analysisType === 'domain' ? 'var(--surface)' : 'var(--bg-main)',
                    color: analysisType === 'domain' ? 'var(--primary)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <RiStackLine size={20} />
                </div>
                {analysisType === 'domain' && <RiCheckboxCircleLine size={20} style={{ color: 'var(--primary)' }} />}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Domain Analysis
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Compare your resume against core skills & requirements for a career role.
              </p>
            </div>
            <div style={{ marginTop: '14px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)' }}>
              e.g. Frontend Developer, UI/UX
            </div>
          </div>

          {/* Option 2: Company + Role */}
          <div
            onClick={() => setAnalysisType('company')}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: analysisType === 'company' ? '2px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: analysisType === 'company' ? 'var(--primary-light)' : 'var(--surface)',
              boxShadow: analysisType === 'company' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: analysisType === 'company' ? 'var(--surface)' : 'var(--bg-main)',
                    color: analysisType === 'company' ? 'var(--primary)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <RiBuilding2Line size={20} />
                </div>
                {analysisType === 'company' && <RiCheckboxCircleLine size={20} style={{ color: 'var(--primary)' }} />}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Company + Role
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Evaluate how well your resume matches a specific target position at a company.
              </p>
            </div>
            <div style={{ marginTop: '14px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)' }}>
              e.g. Google — Frontend Developer
            </div>
          </div>

          {/* Option 3: Job Description */}
          <div
            onClick={() => setAnalysisType('job_description')}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: analysisType === 'job_description' ? '2px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: analysisType === 'job_description' ? 'var(--primary-light)' : 'var(--surface)',
              boxShadow: analysisType === 'job_description' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: analysisType === 'job_description' ? 'var(--surface)' : 'var(--bg-main)',
                    color: analysisType === 'job_description' ? 'var(--primary)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <RiClipboardLine size={20} />
                </div>
                {analysisType === 'job_description' && <RiCheckboxCircleLine size={20} style={{ color: 'var(--primary)' }} />}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Job Description
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Directly compare your resume text against a pasted job posting description.
              </p>
            </div>
            <div style={{ marginTop: '14px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)' }}>
              e.g. Paste job requirement details
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Connected Dynamic Configuration Form */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            Configure Target Details
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Provide the details needed for ResumeX AI to perform a targeted ATS analysis.
          </p>
        </div>

        {analysisType === 'domain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Select
              label="Target Domain *"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              options={domainOptions}
              required
            />
          </div>
        )}

        {analysisType === 'company' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              label="Company Name *"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name, e.g. Google"
              required
            />
            <Input
              label="Target Role *"
              value={companyRole}
              onChange={(e) => setCompanyRole(e.target.value)}
              placeholder="Enter target role, e.g. Frontend Developer"
              required
            />
          </div>
        )}

        {analysisType === 'job_description' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Textarea
              label="Paste Job Description *"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description text here..."
              rows={6}
              required
            />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
              {jobDescription.length} characters (minimum 10 required)
            </div>
          </div>
        )}
      </Card>

      {/* 5. Compact Analysis Summary Grid */}
      <Card style={{ padding: '20px 24px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Selected Resume
            </span>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 'var(--fw-semibold)' }}>{resumeName}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Analysis Type
            </span>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 'var(--fw-semibold)' }}>{getAnalysisTypeLabel()}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Target Configuration
            </span>
            <strong style={{ color: 'var(--primary)', fontWeight: 'var(--fw-semibold)' }}>{getSummaryTargetText()}</strong>
          </div>
        </div>
      </Card>

      {/* 6. Primary Action CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
        <PrimaryButton
          size="lg"
          icon={RiArrowRightLine}
          iconPosition="right"
          disabled={!isValid()}
          onClick={handleStartAnalysis}
          style={{
            width: '100%',
            maxWidth: '420px',
            height: '50px',
            fontSize: '15px',
            fontWeight: 'var(--fw-semibold)',
          }}
        >
          Analyze Resume
        </PrimaryButton>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          ResumeX AI will analyze your skills, experience, projects, and keywords.
        </div>
      </div>
    </div>
  );
}
