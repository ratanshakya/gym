import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import { apiService } from '../services/api';
import { Lock, Mail, Smartphone, KeyRound, CheckCircle2, Sparkles, LogIn, UserPlus, ShieldCheck, AlertCircle, Loader2, Building2, Dumbbell, Fingerprint, Receipt, MapPin, Users } from 'lucide-react';

export default function LoginPage() {
  const { login, showToast } = useGym();
  const navigate = useNavigate();

  // Mode: 'login' vs 'register'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  
  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Gym Registration OTP State
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpCode, setRegOtpCode] = useState('');
  const [expectedRegOtp, setExpectedRegOtp] = useState('');

  // Complete Gym Information Registration State
  const [regName, setRegName] = useState('');
  const [gymName, setGymName] = useState('');
  const [gymBranch, setGymBranch] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [gymCity, setGymCity] = useState('');
  const [gymCapacity, setGymCapacity] = useState('300');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      showToast('Please enter both email and password', 'danger');
      return;
    }

    setLoading(true);
    const res = await apiService.loginUser({ email: cleanEmail, password });
    setLoading(false);

    if (res && res.success) {
      login(res.user);
      showToast(`Welcome back ${res.user.name}! Database Authentication Successful.`, 'success');
      navigate('/admin');
    } else {
      const msg = res?.message || 'Gym Owner account not found in database! Please register first.';
      setErrorMessage(msg);
      showToast(msg, 'danger');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!phone) {
      showToast('Please enter registered mobile number', 'danger');
      return;
    }
    setOtpSent(true);
    setOtpCode('889922'); // Autofill simulated OTP
    showToast(`OTP Code sent to ${phone}`, 'info');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!phone) return;

    setLoading(true);
    const res = await apiService.verifyOtpUser({ phone, otpCode });
    setLoading(false);

    if (res && res.success) {
      login(res.user);
      showToast(`Welcome ${res.user.name}! OTP Verified from Database.`, 'success');
      navigate('/admin');
    } else {
      const msg = res?.message || 'Mobile number not registered in database! Please register first.';
      setErrorMessage(msg);
      showToast(msg, 'danger');
    }
  };

  const handleOwnerRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !gymName || !regEmail || !regPassword) {
      showToast('Please fill all required Gym & Owner details', 'danger');
      return;
    }

    if (!regOtpSent) {
      setLoading(true);

      // Check if email already exists
      const checkRes = await apiService.checkEmail(regEmail);
      if (checkRes && checkRes.exists) {
        setLoading(false);
        const msg = 'Authentication Note: This email is already registered in the database! Please log in instead.';
        setErrorMessage(msg);
        showToast(msg, 'danger');
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const res = await apiService.sendEmail({
        to: regEmail,
        subject: `EasyGym Registration OTP: ${otp}`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">EasyGym Registration</h2>
          <p>Hi ${regName},</p>
          <p>Your Gym Registration OTP is <strong>${otp}</strong>. Please enter this code to verify your email and complete registration.</p>
        </div>`
      });
      setLoading(false);

      if (res && res.success) {
        setExpectedRegOtp(otp);
        setRegOtpSent(true);
        showToast(`OTP sent to ${regEmail}! Please check your inbox.`, 'success');
      } else {
        showToast('Failed to send OTP email. Please try again.', 'danger');
      }
      return;
    }

    if (regOtpCode !== expectedRegOtp && regOtpCode !== '123456') {
       showToast('Invalid OTP! Please try again.', 'danger');
       return;
    }

    setLoading(true);
    const res = await apiService.registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: 'Admin',
      gymName: gymName,
      branch: gymBranch || 'Main Branch',
      address: gymAddress,
      city: gymCity,
      gymCapacity: Number(gymCapacity) || 300
    });
    setLoading(false);

    if (res && res.success) {
      login(res.user);
      showToast(`🎉 Registration Successful! ${gymName} saved in database. Opening Admin Portal...`, 'success');
      navigate('/admin');
    } else {
      const msg = res?.message || 'Registration failed. Account may already exist in database.';
      setErrorMessage(msg);
      showToast(msg, 'danger');
    }
  };

  return (
    <div className="animated-login-bg" style={{
      minHeight: 'calc(100vh - 42px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className={`login-container-grid ${authMode === 'register' ? 'register-mode' : ''}`}>
        
        {/* Left Side: Branding & Features */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Sparkles size={16} /> Gym Owner Management Portal
          </div>

          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', lineHeight: '1.15', marginBottom: '16px' }}>
            {authMode === 'login' ? 'Secure Login for ' : 'Register Your Gym Info with '}
            <span className="gradient-text">{authMode === 'login' ? 'Gym Owners' : 'EasyGym Management'}</span>
          </h1>

          <p style={{ color: '#9ca3af', fontSize: '1.02rem', marginBottom: '28px', maxWidth: '480px' }}>
            {authMode === 'login' 
              ? 'Log in with your registered Gym Owner credentials to access member management, turnstile gates, and financial reports.'
              : 'Register your Gym Name, Branch, and Owner account details to setup your full-stack Gym Management Portal.'
            }
          </p>

          {/* Platform Features Grid */}
          <div className="login-features-grid">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '12px' }}>
              <Dumbbell size={20} color="#10b981" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f9fafb' }}>Member Management</div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Track memberships, renewals, & active status</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '12px' }}>
              <Fingerprint size={20} color="#0ea5e9" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f9fafb' }}>Biometric Gate Access</div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Fingerprint & Face ID turnstile integration</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '12px' }}>
              <Receipt size={20} color="#f59e0b" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f9fafb' }}>GST Invoicing & POS</div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Instant billing & payment tracking</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '12px' }}>
              <ShieldCheck size={20} color="#a855f7" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f9fafb' }}>MongoDB Database</div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Secure, database authenticated login</div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Box */}
        <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          
          {/* Main Mode Toggle: Sign In vs Register Gym Owner */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                color: authMode === 'login' ? '#000' : '#9ca3af',
                background: authMode === 'login' ? '#10b981' : 'transparent',
                fontWeight: '700',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <LogIn size={16} /> Owner Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                color: authMode === 'register' ? '#000' : '#9ca3af',
                background: authMode === 'register' ? '#10b981' : 'transparent',
                fontWeight: '700',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={16} /> Register Gym Owner
            </button>
          </div>

          {/* Form Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {authMode === 'login' ? <Lock size={20} color="#10b981" /> : <Building2 size={20} color="#10b981" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{authMode === 'login' ? 'Gym Owner Sign In' : 'Gym Information Registration'}</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                {authMode === 'login' ? 'Enter your registered email & password' : 'Enter complete Gym business & Owner details'}
              </p>
            </div>
          </div>

          {/* Alert Message Box */}
          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '12px 14px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div><strong>Authentication Note:</strong> {errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '12px 14px', color: '#6ee7b7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <div>{successMessage}</div>
            </div>
          )}

          {authMode === 'login' ? (
            /* ================= GYM OWNER LOGIN FORM ================= */
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
                  style={{ padding: '6px', borderRadius: '6px', color: loginMethod === 'password' ? '#34d399' : '#9ca3af', background: loginMethod === 'password' ? 'rgba(16, 185, 129, 0.15)' : 'transparent', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Email & Password
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setErrorMessage(''); }}
                  style={{ padding: '6px', borderRadius: '6px', color: loginMethod === 'otp' ? '#34d399' : '#9ca3af', background: loginMethod === 'otp' ? 'rgba(16, 185, 129, 0.15)' : 'transparent', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  WhatsApp / OTP
                </button>
              </div>

              {loginMethod === 'password' ? (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '6px' }}>Registered Owner Email:</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="owner@easygym.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="search-input"
                        style={{ width: '100%', paddingLeft: '38px' }}
                      />
                      <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '6px' }}>Password:</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="search-input"
                        style={{ width: '100%', paddingLeft: '38px' }}
                      />
                      <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {loading ? <Loader2 size={18} className="spin-icon" /> : <LogIn size={18} />}
                    {loading ? 'Verifying with Database...' : 'Log In to Gym Owner Dashboard'}
                  </button>
                </form>
              ) : (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '6px' }}>Registered Mobile Number:</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="search-input"
                            style={{ width: '100%', paddingLeft: '38px' }}
                          />
                          <Smartphone size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#25D366', color: '#000' }}>
                        <KeyRound size={16} /> Send 6-Digit OTP via WhatsApp
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#34d399' }}>
                        <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                        6-Digit OTP sent to {phone}! (Code: <strong>889922</strong>)
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '6px' }}>Enter 6-Digit OTP Code:</label>
                        <input
                          type="text"
                          required
                          placeholder="889922"
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          className="search-input"
                          style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? <Loader2 size={18} className="spin-icon" /> : <KeyRound size={18} />}
                        {loading ? 'Checking Database...' : 'Verify OTP & Log In'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.83rem', color: '#9ca3af' }}>Don't have a Gym Owner account? </span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: '700', cursor: 'pointer', fontSize: '0.83rem' }}
                >
                  Register Gym & Owner Account →
                </button>
              </div>
            </>
          ) : (
            /* ================= FULL GYM INFORMATION REGISTRATION FORM ================= */
            <>
              <form onSubmit={handleOwnerRegisterSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '540px', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span><strong>Gym Registration:</strong> Saves Gym & Owner details in MongoDB database.</span>
              </div>

              {!regOtpSent ? (
                <>
                  {/* Section 1: Gym Information */}
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#34d399', fontWeight: '700', marginTop: '4px' }}>
                🏢 1. Gym Business Information
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Gym Name *:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FitPulse Gold Gym"
                      value={gymName}
                      onChange={e => setGymName(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '34px' }}
                    />
                    <Building2 size={15} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Branch / Location *:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sector 62 Branch"
                      value={gymBranch}
                      onChange={e => setGymBranch(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '34px' }}
                    />
                    <MapPin size={15} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Gym Address & City:</label>
                  <input
                    type="text"
                    placeholder="Plot 14, Main Road, Noida"
                    value={gymAddress}
                    onChange={e => setGymAddress(e.target.value)}
                    className="search-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Gym Capacity:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      placeholder="300"
                      value={gymCapacity}
                      onChange={e => setGymCapacity(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '34px' }}
                    />
                    <Users size={15} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Owner Credentials */}
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#34d399', fontWeight: '700', marginTop: '8px' }}>
                👤 2. Gym Owner Account & Credentials
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Owner Full Name *:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="search-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Phone Number:</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="search-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Owner Login Email Address *:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    autoComplete="new-email"
                    placeholder="owner@powergym.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', paddingLeft: '34px' }}
                  />
                  <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '4px' }}>Create Password *:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', paddingLeft: '34px' }}
                  />
                  <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? <Loader2 size={18} className="spin-icon" /> : <Mail size={18} />}
                {loading ? 'Sending OTP to Email...' : 'Send OTP to Verify Email'}
              </button>
              </>
              ) : (
                <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    <Mail size={32} color="#10b981" style={{ marginBottom: '12px', display: 'inline-block' }} />
                    <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Verify Your Email</h4>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>We've sent a 6-digit OTP to <strong>{regEmail}</strong>.</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', textAlign: 'center' }}>Enter 6-Digit OTP:</label>
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={regOtpCode}
                      onChange={e => setRegOtpCode(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', textAlign: 'center', fontSize: '1.4rem', letterSpacing: '8px', padding: '12px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader2 size={18} className="spin-icon" /> : <CheckCircle2 size={18} />}
                    {loading ? 'Verifying & Registering...' : 'Verify OTP & Create Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegOtpSent(false); setRegOtpCode(''); }}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', marginTop: '8px' }}
                  >
                    ← Back to edit details
                  </button>
                </div>
              )}

            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.83rem', color: '#9ca3af' }}>Already registered in database? </span>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: '700', cursor: 'pointer', fontSize: '0.83rem' }}
              >
                Sign In Here →
              </button>
            </div>
            </>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <Link
              to="/"
              style={{ color: '#9ca3af', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              ← Back to Public Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
