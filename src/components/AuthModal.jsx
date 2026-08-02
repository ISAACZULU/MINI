import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, User, Lock, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
    showToast(`Entered MindSpace as Anonymous Visitor (${sessionHash})`, 'success');
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
    showToast('Signed in to Counselor Enterprise Command Center', 'success');
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
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)} style={{ zIndex: 950 }}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-teal-light)', color: 'var(--primary-teal)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>Campus Access & Authentication Portal</h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>MindSpace University Single Sign-On (SSO)</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsAuthModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Auth Access Mode Tabs */}
          <div className="auth-tab-bar">
            <button 
              className={`auth-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
              onClick={() => setActiveTab('guest')}
            >
              <User size={15} />
              <span>Anonymous Visitor</span>
            </button>

            <button 
              className={`auth-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              <Lock size={15} />
              <span>Student SSO</span>
            </button>

            <button 
              className={`auth-tab-btn ${activeTab === 'counselor' ? 'active' : ''}`}
              onClick={() => setActiveTab('counselor')}
            >
              <ShieldCheck size={15} />
              <span>Counselor</span>
            </button>
          </div>

          {/* Tab 1: Anonymous Visitor / Guest */}
          {activeTab === 'guest' && (
            <div>
              <div className="privacy-banner" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', marginBottom: '18px' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>Zero registration required. Your privacy is cryptographically protected under FERPA guidelines.</span>
              </div>

              <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assigned Anonymous Session Token:</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <code style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'monospace' }}>{sessionHash}</code>
                  <button onClick={rotateSessionHash} title="Rotate hash" style={{ color: 'var(--text-muted)' }}>
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>

              <button className="btn-primary" onClick={handleGuestLogin}>
                <span>Enter MindSpace as Anonymous Visitor</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Tab 2: Student SSO */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentSSO}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Sign in with your official university credentials</span>
                <button type="button" onClick={fillDemoStudent} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
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

              <button type="submit" className="btn-primary">
                <span>Sign In via Campus SSO</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Tab 3: Counselor Portal */}
          {activeTab === 'counselor' && (
            <form onSubmit={handleCounselorLogin}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Campus Mental Health Professional Portal</span>
                <button type="button" onClick={fillDemoCounselor} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 700 }}>
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

              <button type="submit" className="btn-primary" style={{ background: '#1e4d40' }}>
                <ShieldCheck size={16} />
                <span>Enter Counselor Command Center</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
