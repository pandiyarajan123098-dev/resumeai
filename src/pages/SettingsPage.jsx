import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import {
  getProfile,
  saveProfile,
  getPreferences,
  savePreferences,
  exportAllData,
  clearAllDemoData
} from '../utils/settingsStorage';
import {
  RiUser3Line,
  RiEqualizerLine,
  RiDatabase2Line,
  RiDownload2Line,
  RiDeleteBin6Line,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine
} from '@remixicon/react';

export default function SettingsPage({ onNavigate }) {
  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Preferences Form State
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [analysisType, setAnalysisType] = useState('domain');
  const [prefSavedToast, setPrefSavedToast] = useState(false);

  // Clear Data Modal State
  const [showClearModal, setShowClearModal] = useState(false);
  const [dataClearedToast, setDataClearedToast] = useState(false);

  // Load saved settings from LocalStorage on mount
  useEffect(() => {
    const prof = getProfile();
    setProfileName(prof.name || 'Pandi');
    setProfileEmail(prof.email || 'pandi@example.com');

    const pref = getPreferences();
    setTargetRole(pref.defaultTargetRole || 'Frontend Developer');
    setAnalysisType(pref.defaultAnalysisType || 'domain');
  }, []);

  // Save Profile Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profileName.trim()) {
      saveProfile({
        name: profileName.trim(),
        email: profileEmail.trim(),
      });
      setProfileSavedToast(true);
      setTimeout(() => setProfileSavedToast(false), 3000);
    }
  };

  // Save Preferences Handler
  const handleSavePreferences = (e) => {
    e.preventDefault();
    savePreferences({
      defaultTargetRole: targetRole,
      defaultAnalysisType: analysisType,
    });
    setPrefSavedToast(true);
    setTimeout(() => setPrefSavedToast(false), 3000);
  };

  // Export JSON Data Handler
  const handleExportData = () => {
    exportAllData();
  };

  // Clear Demo Data Confirm Handler
  const handleConfirmClearData = () => {
    clearAllDemoData();
    setShowClearModal(false);
    setDataClearedToast(true);
    setTimeout(() => setDataClearedToast(false), 4000);
  };

  const domainOptions = [
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Software Engineer', label: 'Software Engineer' },
  ];

  const analysisTypeOptions = [
    { value: 'domain', label: 'Domain Analysis' },
    { value: 'company', label: 'Company + Role' },
    { value: 'job_description', label: 'Job Description' },
  ];

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Manage your ResumeX AI preferences."
      />

      {/* Global Success Notification Toast */}
      {(profileSavedToast || prefSavedToast || dataClearedToast) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: dataClearedToast ? 'var(--warning-light)' : 'var(--success-light)',
            border: `1px solid ${dataClearedToast ? 'var(--warning)' : 'var(--success)'}`,
            borderRadius: 'var(--radius-md)',
            color: dataClearedToast ? 'var(--warning)' : 'var(--success)',
            fontSize: '13.5px',
            fontWeight: 'var(--fw-medium)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {dataClearedToast ? (
            <RiAlertLine size={18} />
          ) : (
            <RiCheckLine size={18} />
          )}
          <span>
            {dataClearedToast
              ? 'Demo resumes and analysis history have been cleared.'
              : 'Changes saved successfully'}
          </span>
        </div>
      )}

      {/* SECTION 1 — PROFILE */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <RiUser3Line size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            Profile
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Manage your basic account information.
        </p>

        {/* Profile Avatar Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '12px 16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 'var(--fw-bold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {(profileName || 'P')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
              {profileName || 'Pandi'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {profileEmail || 'pandi@example.com'}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Full Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="e.g. Pandi"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            placeholder="e.g. pandi@example.com"
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <PrimaryButton type="submit">
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </Card>

      {/* SECTION 2 — ANALYSIS PREFERENCES */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <RiEqualizerLine size={20} style={{ color: 'var(--secondary)' }} />
          <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            Analysis Preferences
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Set your default preferences for resume analysis.
        </p>

        <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Default Target Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            options={domainOptions}
          />

          <Select
            label="Default Analysis Type"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            options={analysisTypeOptions}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <PrimaryButton type="submit">
              Save Preferences
            </PrimaryButton>
          </div>
        </form>
      </Card>

      {/* SECTION 3 — DATA MANAGEMENT */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <RiDatabase2Line size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            Data Management
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Manage locally stored ResumeX AI demo data.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action 1: Export My Data */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Export My Data
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Download your locally stored resume metadata and analysis history.
              </p>
            </div>
            <SecondaryButton icon={RiDownload2Line} onClick={handleExportData}>
              Export Data
            </SecondaryButton>
          </div>

          {/* Action 2: Clear Demo Data */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Clear Demo Data
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Remove all locally stored resumes and analysis history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--danger)',
                backgroundColor: 'var(--danger-light)',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
            >
              <RiDeleteBin6Line size={16} />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      </Card>

      {/* CLEAR DEMO DATA CONFIRMATION MODAL */}
      {showClearModal && (
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
          onClick={() => setShowClearModal(false)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RiDeleteBin6Line size={20} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                Clear all demo data?
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.45 }}>
              This will remove your locally stored resumes, analyses, and progress history.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <SecondaryButton onClick={() => setShowClearModal(false)}>Cancel</SecondaryButton>
              <button
                type="button"
                onClick={handleConfirmClearData}
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
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
