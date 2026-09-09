import React, { useState, useRef } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { saveResume, getResumes } from '../utils/resumeStorage';
import {
  RiUploadCloud2Line,
  RiFileCodeLine,
  RiCheckboxCircleLine,
  RiShieldCheckLine,
  RiArrowRightLine,
  RiRefreshLine,
  RiDeleteBin6Line,
  RiErrorWarningLine
} from '@remixicon/react';

export default function UploadPage({ onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Recent Uploads loaded from LocalStorage
  const recentUploads = getResumes().slice(0, 3);

  // Helper function to validate file type & size
  const validateAndSetFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    const validExtensions = ['pdf', 'docx', 'doc'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
      setErrorMsg('Please upload a PDF or DOCX file.');
      return;
    }

    // 10 MB limit (10 * 1024 * 1024 bytes)
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMsg('File size must be less than 10 MB.');
      return;
    }

    setSelectedFile(file);

    // Automatically save resume metadata into LocalStorage
    saveResume({
      name: file.name,
      type: extension.toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      targetRole: 'Frontend Developer',
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = (resumeData) => {
    const dataToPass = resumeData || {
      name: selectedFile ? selectedFile.name : 'Pandi_Resume.pdf',
      size: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : '1.8 MB',
      targetRole: 'Frontend Developer',
      rawFile: selectedFile || null,
    };

    if (selectedFile && !dataToPass.rawFile) {
      dataToPass.rawFile = selectedFile;
    }

    // Save/sync resume to LocalStorage
    saveResume(dataToPass);

    if (onNavigate) {
      onNavigate('analyze', dataToPass);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Page Header */}
      <PageHeader
        title="Upload Resume"
        description="Upload your latest resume and let ResumeX AI help you improve it."
      />

      {/* Main Grid: Upload Card + Side Tips Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: 'var(--space-24)',
          alignItems: 'start',
        }}
        className="upload-two-col"
      >
        {/* LEFT: Main Upload Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card style={{ padding: 'var(--space-32)' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.docx,.doc"
              style={{ display: 'none' }}
            />

            {!selectedFile ? (
              /* Empty Dropzone State */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  border: isDragging
                    ? '2px solid var(--primary)'
                    : '1px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-40) var(--space-24)',
                  textAlign: 'center',
                  backgroundColor: isDragging ? 'var(--primary-light)' : 'var(--bg-main)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '16px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <RiUploadCloud2Line size={26} />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Upload your resume
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Drag and drop your file here, or choose a file from your device.
                </p>

                <div style={{ display: 'inline-block', marginBottom: '16px' }}>
                  <PrimaryButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current && fileInputRef.current.click();
                    }}
                  >
                    Choose File
                  </PrimaryButton>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Supported formats: PDF and DOCX</span>
                  <span>•</span>
                  <span>Maximum size: 10 MB</span>
                </div>
              </div>
            ) : (
              /* Selected File State */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-20)',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <RiFileCodeLine size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                        {selectedFile.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {selectedFile.name.split('.').pop().toUpperCase()} • {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SecondaryButton
                      size="sm"
                      icon={RiRefreshLine}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      Replace
                    </SecondaryButton>
                    <SecondaryButton
                      size="sm"
                      icon={RiDeleteBin6Line}
                      onClick={handleRemoveFile}
                    >
                      Remove
                    </SecondaryButton>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <PrimaryButton
                    size="lg"
                    icon={RiArrowRightLine}
                    iconPosition="right"
                    onClick={() => handleContinue()}
                  >
                    Continue to Analysis
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* Inline Error Message */}
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--danger-light)',
                  border: '1px solid #FCA5A5',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--danger)',
                  fontSize: '13px',
                }}
              >
                <RiErrorWarningLine size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Disabled State Action Button when no file selected */}
            {!selectedFile && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <PrimaryButton
                  size="lg"
                  disabled
                  icon={RiArrowRightLine}
                  iconPosition="right"
                >
                  Continue to Analysis
                </PrimaryButton>
              </div>
            )}
          </Card>

          {/* Privacy Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <RiShieldCheckLine size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>Your resume is only used to provide your analysis.</span>
          </div>
        </div>

        {/* RIGHT: Side Helpful Information Section */}
        <Card style={{ padding: 'var(--space-24)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Tips for better analysis
          </h3>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              'Use your latest resume',
              'Include relevant skills',
              'Add important projects',
              'Mention measurable achievements',
            ].map((tip, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <RiCheckboxCircleLine size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recent Uploads Section */}
      <Card style={{ padding: 'var(--space-24)' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
            Recent Uploads
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Continue with a previously uploaded resume.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-16)' }}>
          {recentUploads.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-16)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}
                >
                  <RiFileCodeLine size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.size || '1.8 MB'} • {item.targetRole || 'Frontend Developer'}
                  </span>
                </div>
              </div>

              <SecondaryButton
                size="sm"
                icon={RiArrowRightLine}
                iconPosition="right"
                onClick={() => handleContinue(item)}
              >
                Analyze
              </SecondaryButton>
            </div>
          ))}
        </div>
      </Card>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 860px) {
          .upload-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
