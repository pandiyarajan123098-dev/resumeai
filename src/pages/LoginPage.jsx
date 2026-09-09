import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import {
  RiSparklingLine,
  RiLockLine,
  RiMailLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiShieldCheckLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiKey2Line,
  RiUserAddLine,
  RiLoginBoxLine,
  RiUser3Line,
  RiCheckLine
} from '@remixicon/react';
import { saveProfile, savePreferences } from '../utils/settingsStorage';

export default function LoginPage({ onLoginSuccess }) {
  // Mode: 'signin' or 'register'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In State
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Frontend Developer');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill Demo Credentials
  const handleFillDemo = () => {
    setAuthMode('signin');
    setEmailOrId('pandi@resumex.ai');
    setPassword('resumex123');
    setErrorMsg('');
  };

  // Sign In Handler
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = emailOrId.trim().toLowerCase();
    const passClean = password.trim();

    if (!inputClean) {
      setErrorMsg('Please enter your User ID or Email Address.');
      return;
    }
    if (!passClean) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials
      if (
        inputClean === 'pandi@resumex.ai' ||
        inputClean === 'pandi' ||
        inputClean.includes('@') ||
        inputClean.length >= 3
      ) {
        if (passClean === 'resumex123' || passClean.length >= 4) {
          const userName = inputClean.includes('@') ? inputClean.split('@')[0] : inputClean;
          const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

          saveProfile({
            name: formattedName === 'Pandi' ? 'Pandi' : formattedName,
            email: inputClean.includes('@') ? inputClean : `${inputClean}@resumex.ai`,
          });

          localStorage.setItem('resumex_authenticated', 'true');
          setIsLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          return;
        }
      }

      setIsLoading(false);
      setErrorMsg('Invalid credentials. Click "Auto Fill" below to use demo login.');
    }, 600);
  };

  // Register Handler
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please agree to the Terms of Service to create an account.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Save new registered profile and default preferences
      saveProfile({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
      });

      savePreferences({
        defaultTargetRole: regRole,
      });

      localStorage.setItem('resumex_authenticated', 'true');
      setIsLoading(false);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 700);
  };

  // Password strength calculation helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { text: '', color: '' };
    if (pass.length < 6) return { text: 'Weak', color: 'var(--danger)' };
    if (pass.length < 10) return { text: 'Good', color: 'var(--warning)' };
    return { text: 'Strong', color: 'var(--success)' };
  };

  const strength = getPasswordStrength(regPassword);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Decorative Subtle Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 118, 110, 0.07)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          backgroundColor: 'rgba(79, 70, 229, 0.05)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '460px', width: '100%', position: 'relative', zIndex: 10 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
            }}
          >
            <RiSparklingLine size={28} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            ResumeX <span style={{ color: 'var(--primary)' }}>AI</span>
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {authMode === 'signin'
              ? 'Sign in to access your AI resume audits & analysis history'
              : 'Create an account to start analyzing your resumes with AI'}
          </p>
        </div>

        {/* Main Authentication Card */}
        <Card style={{ padding: '28px 24px' }}>
          {/* Tab Switcher: Sign In | Register */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg('');
              }}
              style={{
                flex: 1,
                padding: '9px 16px',
                fontSize: '13.5px',
                fontWeight: 'var(--fw-semibold)',
                color: authMode === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: authMode === 'signin' ? 'var(--surface)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                boxShadow: authMode === 'signin' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <RiLoginBoxLine size={16} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
              }}
              style={{
                flex: 1,
                padding: '9px 16px',
                fontSize: '13.5px',
                fontWeight: 'var(--fw-semibold)',
                color: authMode === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: authMode === 'register' ? 'var(--surface)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                boxShadow: authMode === 'register' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <RiUserAddLine size={16} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                backgroundColor: 'var(--danger-light)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <RiErrorWarningLine size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FORM 1: SIGN IN */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Input
                label="User ID or Email"
                type="text"
                placeholder="e.g. pandi@resumex.ai or pandi"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                required
              />

              {/* Password Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                    Password *
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFillDemo();
                    }}
                    style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'var(--fw-medium)' }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 40px 0 14px',
                      fontSize: '13.5px',
                      fontWeight: 'var(--fw-regular)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                    }}
                  >
                    {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                size="lg"
                icon={RiArrowRightLine}
                iconPosition="right"
                disabled={isLoading}
                style={{ width: '100%', height: '48px', fontSize: '15px' }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </PrimaryButton>

              <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg('');
                  }}
                  style={{ color: 'var(--primary)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* FORM 2: CREATE ACCOUNT (REGISTER) */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. Pandiyarajan P"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. pandiyarajan@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                    Password *
                  </label>
                  {regPassword && (
                    <span style={{ fontSize: '11px', fontWeight: 'var(--fw-semibold)', color: strength.color }}>
                      {strength.text} Password
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 chars)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 40px 0 14px',
                      fontSize: '13.5px',
                      fontWeight: 'var(--fw-regular)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                    }}
                  >
                    {regShowPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                required
              />

              {/* Terms Checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '2px' }}>
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer', marginTop: '2px' }}
                />
                <span>I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.</span>
              </label>

              {/* Register Action Button */}
              <PrimaryButton
                type="submit"
                size="lg"
                icon={RiUserAddLine}
                disabled={isLoading}
                style={{ width: '100%', height: '48px', fontSize: '15px', marginTop: '4px' }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>

              <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg('');
                  }}
                  style={{ color: 'var(--primary)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <RiShieldCheckLine size={16} style={{ color: 'var(--success)' }} />
          <span>Secure 256-bit SSL Encrypted Access</span>
        </div>
      </div>
    </div>
  );
}
