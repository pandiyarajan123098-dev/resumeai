import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Card from '../ui/Card';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import { RiFlashlightLine, RiCloseLine, RiCheckLine } from '@remixicon/react';

export default function AppLayout({ activeTab, onSelectTab, children, onSearch, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          onSelectTab(tab);
          setMobileMenuOpen(false);
        }}
        onUpgradeClick={() => setShowUpgradeModal(true)}
        onSignOut={onSignOut}
      />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 40,
            display: 'flex',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{ width: '260px', height: '100%', backgroundColor: 'var(--sidebar-bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isMobileDrawer
              activeTab={activeTab}
              onSelectTab={(tab) => {
                onSelectTab(tab);
                setMobileMenuOpen(false);
              }}
              onUpgradeClick={() => {
                setShowUpgradeModal(true);
                setMobileMenuOpen(false);
              }}
              onSignOut={onSignOut}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-wrapper">
        <TopNavbar
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onSearch={onSearch}
          onNavigate={onSelectTab}
          onSignOut={onSignOut}
        />
        <main className="content-area">
          {children}
        </main>
      </div>

      {/* Pro Upgrade Modal */}
      {showUpgradeModal && (
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
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-24)',
              maxWidth: '460px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowUpgradeModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <RiCloseLine size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <RiFlashlightLine size={20} style={{ margin: 'auto' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>
                  Upgrade to ResumeX Pro
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Unlock full AI capability</span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Get unlimited resume parsing, instant job description gap analyses, and tailored keyword optimizations.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {['Unlimited AI Resume Audits', 'Job Description Gap Matcher', 'Custom Cover Letter Generator', 'Priority ATS Parsing Engine'].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <RiCheckLine size={16} style={{ color: 'var(--success)' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <SecondaryButton onClick={() => setShowUpgradeModal(false)}>Close</SecondaryButton>
              <PrimaryButton onClick={() => { alert('Thank you for trying ResumeX Pro!'); setShowUpgradeModal(false); }}>
                Upgrade Now ($12/mo)
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
