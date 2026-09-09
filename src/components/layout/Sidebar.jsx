import React, { useState, useEffect } from 'react';
import { getProfile } from '../../utils/settingsStorage';
import {
  RiDashboardLine,
  RiUploadCloud2Line,
  RiSparklingLine,
  RiFileTextLine,
  RiHistoryLine,
  RiSettings4Line,
  RiArrowRightSLine,
  RiLogoutBoxRLine
} from '@remixicon/react';

export default function Sidebar({ activeTab = 'dashboard', onSelectTab, onUpgradeClick, onSignOut, isMobileDrawer = false }) {
  const [userProfile, setUserProfile] = useState(getProfile());

  useEffect(() => {
    const handleProfileUpdate = () => setUserProfile(getProfile());
    window.addEventListener('resumex_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('resumex_profile_updated', handleProfileUpdate);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: RiDashboardLine },
    { id: 'upload', label: 'Upload Resume', icon: RiUploadCloud2Line },
    { id: 'analyze', label: 'Analyze Resume', icon: RiSparklingLine },
    { id: 'resumes', label: 'My Resumes', icon: RiFileTextLine },
    { id: 'history', label: 'Analysis History', icon: RiHistoryLine },
    { id: 'settings', label: 'Settings', icon: RiSettings4Line },
  ];

  return (
    <aside
      className={`app-sidebar ${isMobileDrawer ? 'mobile-drawer' : 'desktop-only'}`}
      style={{
        width: isMobileDrawer ? '100%' : '260px',
        backgroundColor: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: isMobileDrawer ? 'relative' : 'fixed',
        left: 0,
        top: 0,
        flexShrink: 0,
        zIndex: 30,
        overflowY: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Top Logo Section */}
      <div>
        <div
          style={{
            height: '70px',
            minHeight: '70px',
            padding: '0 var(--space-24)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(225, 232, 240, 0.08)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 4px rgba(15, 118, 110, 0.4)',
            }}
          >
            <RiSparklingLine size={20} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'var(--fw-bold)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Resume<span style={{ color: '#99F6E4' }}>X</span> AI
            </div>
            <div style={{ fontSize: '11px', color: 'var(--sidebar-text)', fontWeight: 'var(--fw-medium)' }}>
              Resume Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={{ padding: 'var(--space-16) var(--space-12)' }}>
          <div style={{ fontSize: '11px', fontWeight: 'var(--fw-semibold)', color: '#64748B', padding: '0 12px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Menu
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTab && onSelectTab(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                      color: isActive ? '#FFFFFF' : 'var(--sidebar-text)',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--sidebar-text)';
                      }
                    }}
                  >
                    <Icon
                      size={19}
                      style={{ color: isActive ? '#99F6E4' : 'inherit' }}
                    />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isActive && <RiArrowRightSLine size={16} style={{ color: '#99F6E4' }} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Upgrade to Pro Section at Bottom */}
      <div style={{ padding: 'var(--space-16)' }}>
        {/* User Account / Sign Out info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 4px',
            borderTop: '1px solid rgba(225, 232, 240, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 'var(--fw-semibold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {(userProfile.name || 'P')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: '#FFFFFF' }}>
                {userProfile.name || 'Pandi'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--sidebar-text)' }}>
                Free Member
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Sign Out"
            onClick={() => onSignOut && onSignOut()}
            style={{ color: 'var(--sidebar-text)', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sidebar-text)')}
          >
            <RiLogoutBoxRLine size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
