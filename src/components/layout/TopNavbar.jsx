import React, { useState, useEffect } from 'react';
import {
  RiNotification3Line,
  RiQuestionLine,
  RiMenuLine,
  RiArrowDownSLine,
  RiUser3Line,
  RiSettings4Line,
  RiLogoutBoxRLine
} from '@remixicon/react';
import IconButton from '../ui/IconButton';
import { getProfile } from '../../utils/settingsStorage';

export default function TopNavbar({ onMenuClick, onSearch, onNavigate, onSignOut }) {
  const [userProfile, setUserProfile] = useState(getProfile());
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  useEffect(() => {
    const handleProfileUpdate = () => setUserProfile(getProfile());
    window.addEventListener('resumex_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('resumex_profile_updated', handleProfileUpdate);
  }, []);

  const notifications = [
    { id: 1, title: 'Analysis Complete', desc: 'Pandi_Resume.pdf scored 78% for Frontend Developer', time: '10 mins ago' },
    { id: 2, title: 'New AI Insight', desc: 'Keyword match for TypeScript improved by +12%', time: '1 hour ago' },
  ];

  return (
    <header
      className="top-navbar-header"
      style={{
        height: '70px',
        minHeight: '70px',
        flexShrink: 0,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Mobile Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onMenuClick && (
          <div className="mobile-only">
            <IconButton icon={RiMenuLine} onClick={onMenuClick} title="Open navigation" size="md" />
          </div>
        )}
      </div>

      {/* Right Controls: Help, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexShrink: 0 }}>
        <IconButton
          icon={RiQuestionLine}
          title="Help & Documentation"
          size="md"
          onClick={() => alert('ResumeX AI Help Center: Upload your PDF or DOCX resume to get instant ATS scores, keyword matching, and targeted action verb suggestions.')}
        />

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <IconButton
            icon={RiNotification3Line}
            title="Notifications"
            badge={!notificationsRead}
            size="md"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
              setNotificationsRead(true);
            }}
          />

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '320px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-16)',
                zIndex: 50,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>
                  Notifications
                </span>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'var(--fw-medium)', cursor: 'pointer' }}>
                  Mark all as read
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-main)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{n.desc}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)', margin: '0 4px' }} />

        {/* User Profile Dropdown Trigger */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface)',
              transition: 'all var(--transition-fast)',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
          >
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
                flexShrink: 0,
              }}
            >
              {(userProfile.name || 'P')[0].toUpperCase()}
            </div>
            <div className="desktop-only" style={{ alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                {userProfile.name || 'Pandi'}
              </span>
              <RiArrowDownSLine size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '200px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 50,
              }}
            >
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate && onNavigate('settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <RiUser3Line size={16} />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate && onNavigate('settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <RiSettings4Line size={16} />
                <span>Settings</span>
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onSignOut && onSignOut();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--danger)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <RiLogoutBoxRLine size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

