import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  RefreshCw, 
  Shield, 
  UserCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingGatewayPage() {
  const { 
    setRole, 
    sessionHash, 
    rotateSessionHash, 
    setUserAuth, 
    setHasEnteredGateway, 
    showToast 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState('guest'); // 'guest' | 'student' | 'counselor'

  // Student SSO form
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Counselor Form
  const [counselorId, setCounselorId] = useState('');
  const [counselorKey, setCounselorKey] = useState('');

  const handleEnterAsGuest = () => {
    setUserAuth({
      isGuest: true,
      userType: 'student',
      displayName: sessionHash,
      email: 'anonymous@campus.edu'
    });
    setRole('student');
    setHasEnteredGateway(true);
    showToast(`Welcome to MindSpace! Entered as Anonymous Visitor (${sessionHash})`, 'success');
  };

  const handleStudentSSO = (e) => {
    e.preventDefault();
    const name = studentEmail ? studentEmail.split('@')[0] : 'Student';
    setUserAuth({
      isGuest: false,
      userType: 'student',
      displayName: `Student ${name}`,
      email: studentEmail || 'alex.student@campus.edu'
    });
    setRole('student');
    setHasEnteredGateway(true);
    showToast(`Welcome! Signed in as Student (${studentEmail || 'alex.student@campus.edu'})`, 'success');
  };

  const handleCounselorLogin = (e) => {
    e.preventDefault();
    setUserAuth({
      isGuest: false,
      userType: 'counselor',
      displayName: 'Dr. Sarah Jenkins, LCSW',
      email: 's.jenkins@counseling.campus.edu',
      licenseId: counselorId || 'LCSW-88492'
    });
    setRole('counselor');
    setHasEnteredGateway(true);
    showToast('Signed in to Counselor Center', 'success');
  };

  const fillDemoStudent = () => {
    setStudentEmail('jordan.rivera@university.edu');
    setStudentPassword('••••••••••••');
  };

  const fillDemoCounselor = () => {
    setCounselorId('LCSW-88492');
    setCounselorKey('••••••••••••');
  };

  return (
    <div className="gateway-container">
      {/* Background Gradient Orbs */}
      <div className="gateway-bg-orb orb-1" />
      <div className="gateway-bg-orb orb-2" />

      <div className="gateway-content-box">
        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="gateway-logo-icon">
            <Heart size={32} fill="#ffffff" color="#ffffff" />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>MindSpace</h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
            Campus Mental Health & AI Safety Platform • Select your entry role to access the encrypted wellness portal.
          </p>
        </div>

        {/* 3 Role Selection Cards Row */}
        <div className="gateway-cards-grid">
          {/* Card 1: Anonymous Visitor */}
          <div 
            className={`gateway-role-card ${selectedRole === 'guest' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('guest')}
          >
            <div className="role-card-badge">RECOMMENDED</div>
            <div className="role-card-icon guest-icon">
              <User size={24} />
            </div>
            <h3 className="role-card-title">Anonymous Student Visitor</h3>
            <p className="role-card-desc">
              Zero registration required. Assigned cryptographic SHA-256 session token for total privacy.
            </p>
          </div>

          {/* Card 2: Student SSO */}
          <div 
            className={`gateway-role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            <div className="role-card-icon student-icon">
              <Lock size={24} />
            </div>
            <h3 className="role-card-title">Student Campus SSO</h3>
            <p className="role-card-desc">
              Sign in with your official university credentials for authenticated campus wellness tracking.
            </p>
          </div>

          {/* Card 3: Verified Counselor */}
          <div 
            className={`gateway-role-card ${selectedRole === 'counselor' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('counselor')}
          >
            <div className="role-card-icon counselor-icon">
              <ShieldCheck size={24} />
            </div>
            <h3 className="role-card-title">Verified Counselor Portal</h3>
            <p className="role-card-desc">
              Licensed Practitioner Portal. Access AI Risk Triage, Telehealth Sessions, and Safety Shield.
            </p>
          </div>
        </div>

        {/* Selected Role Form Container */}
        <div className="gateway-action-container">
          {selectedRole === 'guest' && (
            <div>
              <div className="privacy-banner" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', marginBottom: '18px' }}>
                <CheckCircle size={18} style={{ flexShrink: 0 }} />
                <span>Your identity is cryptographically protected under FERPA & HIPAA safeguards.</span>
              </div>

              <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block' }}>Assigned Anonymous Session Token:</span>
                  <code style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'monospace' }}>{sessionHash}</code>
                </div>
                <button onClick={rotateSessionHash} className="hash-rotate-btn" title="Rotate hash">
                  <RefreshCw size={16} />
                </button>
              </div>

              <button className="btn-primary" style={{ padding: '14px 24px', fontSize: '1rem' }} onClick={handleEnterAsGuest}>
                <span>Enter MindSpace as Anonymous Visitor</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {selectedRole === 'student' && (
            <form onSubmit={handleStudentSSO}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>University Single Sign-On (SSO)</span>
                <button type="button" onClick={fillDemoStudent} style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
                  + Fill Demo Student Credentials
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">University Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="jordan.rivera@university.edu" 
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••••••" 
                  value={studentPassword}
                  onChange={e => setStudentPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                <span>Sign In via Campus SSO</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {selectedRole === 'counselor' && (
            <form onSubmit={handleCounselorLogin}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Licensed Practitioner Verification</span>
                <button type="button" onClick={fillDemoCounselor} style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
                  + Fill Demo Counselor Credentials
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Counselor License ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. LCSW-88492" 
                  value={counselorId}
                  onChange={e => setCounselorId(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Access Key</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••••••" 
                  value={counselorKey}
                  onChange={e => setCounselorKey(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px 24px', fontSize: '1rem', background: '#1e4d40' }}>
                <span>Enter Counselor Center</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
