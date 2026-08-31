import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  IconlyClose,
  IconlyUser,
  IconlyShield,
  IconlyLock,
  IconlyArrowRight,
  IconlyCheckCircle,
  IconlyRefresh
} from './Iconly';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    setRole, 
    sessionHash, 
    rotateSessionHash, 
    setUserAuth, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('guest'); // 'guest' | 'student' | 'counselor'
  
  // Student SSO form
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Counselor Form
  const [counselorId, setCounselorId] = useState('');
  const [counselorKey, setCounselorKey] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGuestLogin = () => {
    setUserAuth({
      isGuest: true,
      userType: 'student',
      displayName: sessionHash,
      email: 'anonymous@campus.edu'
    });
    setRole('student');
    setIsAuthModalOpen(false);
    showToast(`Entered Haven KNUST as Anonymous Visitor (${sessionHash})`, 'success');
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
    setIsAuthModalOpen(false);
    showToast(`Signed in as Student (${studentEmail || 'alex.student@campus.edu'})`, 'success');
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
    setIsAuthModalOpen(false);
    showToast('Signed in to Counselor Center', 'success');
  };

  const fillDemoStudent = () => {
    setStudentEmail('jordan.rivera@university.edu');
    setStudentPassword('password123');
  };

  const fillDemoCounselor = () => {
    setCounselorId('LCSW-88492');
    setCounselorKey('counselorpass');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)} style={{ zIndex: 950 }}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '90%' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-teal-light)', color: 'var(--primary-teal)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <IconlyUser size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>Campus Access Portal</h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>KNUST Single Sign-On (SSO) Portal</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsAuthModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Auth Access Mode Tabs */}
          <div className="auth-tab-bar" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <button 
              className={`auth-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
              onClick={() => setActiveTab('guest')}
              style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: activeTab === 'guest' ? '2px solid var(--primary-teal)' : 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: activeTab === 'guest' ? 'var(--primary-teal)' : 'var(--text-muted)' }}
            >
              <IconlyUser size={15} />
              <span>Visitor</span>
            </button>

            <button 
              className={`auth-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
              style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: activeTab === 'student' ? '2px solid var(--primary-teal)' : 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: activeTab === 'student' ? 'var(--primary-teal)' : 'var(--text-muted)' }}
            >
              <IconlyLock size={15} />
              <span>Student SSO</span>
            </button>

            <button 
              className={`auth-tab-btn ${activeTab === 'counselor' ? 'active' : ''}`}
              onClick={() => setActiveTab('counselor')}
              style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: activeTab === 'counselor' ? '2px solid var(--primary-teal)' : 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: activeTab === 'counselor' ? 'var(--primary-teal)' : 'var(--text-muted)' }}
            >
              <IconlyShield size={15} />
              <span>Counselor</span>
            </button>
          </div>

          {/* Tab 1: Anonymous Visitor / Guest */}
          {activeTab === 'guest' && (
            <div>
              <div className="privacy-banner" style={{ background: 'var(--safety-green-light)', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--safety-green-dark)', marginBottom: '18px', padding: '12px', border: '1px solid', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconlyCheckCircle size={18} style={{ flexShrink: 0 }} />
                <span>Zero registration required. Your privacy is cryptographically protected under FERPA guidelines.</span>
              </div>

              <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assigned Anonymous Session Token:</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <code style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'monospace' }}>{sessionHash}</code>
                  <button onClick={rotateSessionHash} title="Rotate hash" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    <IconlyRefresh size={15} />
                  </button>
                </div>
              </div>

              <button className="btn-anon-guest" onClick={handleGuestLogin} style={{ width: '100%' }}>
                <span>Enter as Anonymous Visitor</span>
                <IconlyArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Tab 2: Student SSO */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentSSO}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Sign in with your official university credentials</span>
                <button type="button" onClick={fillDemoStudent} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                  + Fill Demo Student
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
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <span>Sign In via Campus SSO</span>
                <IconlyArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Tab 3: Counselor Portal */}
          {activeTab === 'counselor' && (
            <form onSubmit={handleCounselorLogin}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Campus Mental Health Professional Portal</span>
                <button type="button" onClick={fillDemoCounselor} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                  + Fill Demo Counselor
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
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <span>Enter Counselor Center</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
