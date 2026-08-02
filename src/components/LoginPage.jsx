import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw, 
  Shield, 
  BrainCircuit, 
  Calendar, 
  Moon, 
  Sun,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { 
    sessionHash, 
    rotateSessionHash, 
    login, 
    showToast, 
    theme, 
    toggleTheme,
    setIsFerpaModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState('guest'); // 'guest' | 'student' | 'counselor'

  // Form states
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const [counselorId, setCounselorId] = useState('');
  const [counselorKey, setCounselorKey] = useState('');

  const handleGuestLogin = () => {
    login({
      isGuest: true,
      userType: 'student',
      displayName: sessionHash,
      email: 'visitor@campus.edu'
    }, 'student');
    showToast(`Welcome! Entered MindSpace as Anonymous Visitor (${sessionHash})`, 'success');
  };

  const handleStudentSSO = (e) => {
    e.preventDefault();
    const name = studentEmail ? studentEmail.split('@')[0] : 'Student';
    login({
      isGuest: false,
      userType: 'student',
      displayName: `Student ${name}`,
      email: studentEmail || 'alex.student@campus.edu'
    }, 'student');
    showToast(`Signed in as Student (${studentEmail || 'alex.student@campus.edu'})`, 'success');
  };

  const handleCounselorLogin = (e) => {
    e.preventDefault();
    login({
      isGuest: false,
      userType: 'counselor',
      displayName: 'Dr. Sarah Jenkins, LCSW',
      email: 's.jenkins@counseling.campus.edu',
      licenseId: counselorId || 'LCSW-88492'
    }, 'counselor');
    showToast('Welcome Dr. Jenkins! Signed in to Counselor Enterprise Portal', 'success');
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
    <div className="login-page-container">
      {/* Top Navbar */}
      <header className="login-header">
        <div className="login-header-inner">
          <div className="brand-group">
            <div className="brand-logo-icon">
              <Heart size={22} fill="#ffffff" color="#ffffff" />
            </div>
            <div className="brand-text-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="brand-title">MindSpace</span>
              </div>
              <span className="brand-subtitle">Campus Mental Health & AI Safety Platform</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="ferpa-header-btn" 
              onClick={() => setIsFerpaModalOpen(true)}
              title="FERPA & HIPAA Audited Compliance"
            >
              <CheckCircle size={14} color="#10b981" />
              <span>FERPA Compliant</span>
            </button>

            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Section */}
      <main className="login-main-content">
        <div className="login-hero-box">
          <div className="login-badge">
            <Sparkles size={14} color="var(--primary-teal)" />
            <span>Official University Wellness & Crisis Support Network</span>
          </div>

          <h1 className="login-title">
            Your safe space to connect, share & heal.
          </h1>

          <p className="login-subtitle">
            Sign in with single-click anonymous guest access or official campus SSO to access peer support, daily mood tracking, and licensed counselors.
          </p>

          {/* Auth Card Box */}
          <div className="login-card">
            {/* Tab Navigation */}
            <div className="login-tab-bar">
              <button 
                className={`login-tab-btn ${activeTab === 'guest' ? 'active' : ''}`}
                onClick={() => setActiveTab('guest')}
              >
                <User size={16} />
                <span>Anonymous Visitor</span>
              </button>

              <button 
                className={`login-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => setActiveTab('student')}
              >
                <Lock size={16} />
                <span>Student SSO</span>
              </button>

              <button 
                className={`login-tab-btn ${activeTab === 'counselor' ? 'active' : ''}`}
                onClick={() => setActiveTab('counselor')}
              >
                <ShieldCheck size={16} />
                <span>Counselor Portal</span>
              </button>
            </div>

            <div className="login-card-body">
              {/* Tab 1: Anonymous Visitor */}
              {activeTab === 'guest' && (
                <div className="login-tab-content">
                  <div className="privacy-banner" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', marginBottom: '20px' }}>
                    <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                    <span>Zero registration required. Your privacy is cryptographically protected under FERPA & HIPAA guidelines.</span>
                  </div>

                  <div className="session-token-box">
                    <span className="session-token-label">Assigned Cryptographic Identity Token:</span>
                    <div className="session-token-display">
                      <code className="session-token-code">{sessionHash}</code>
                      <button 
                        onClick={rotateSessionHash} 
                        className="session-rotate-btn"
                        title="Generate new anonymous identity hash"
                      >
                        <RefreshCw size={15} />
                        <span>Rotate Hash</span>
                      </button>
                    </div>
                  </div>

                  <button className="btn-primary login-action-btn" onClick={handleGuestLogin}>
                    <span>Enter MindSpace as Anonymous Visitor</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Tab 2: Student SSO */}
              {activeTab === 'student' && (
                <form onSubmit={handleStudentSSO} className="login-tab-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sign in with official campus SSO credentials</span>
                    <button type="button" onClick={fillDemoStudent} className="demo-fill-btn">
                      + Fill Demo Student
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">University Student Email</label>
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

                  <button type="submit" className="btn-primary login-action-btn">
                    <span>Sign In via Campus SSO</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              {/* Tab 3: Counselor Portal */}
              {activeTab === 'counselor' && (
                <form onSubmit={handleCounselorLogin} className="login-tab-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Campus Licensed Mental Health Staff Portal</span>
                    <button type="button" onClick={fillDemoCounselor} className="demo-fill-btn">
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

                  <button type="submit" className="btn-primary login-action-btn" style={{ background: '#1e4d40' }}>
                    <ShieldCheck size={18} />
                    <span>Enter Counselor Command Center</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="login-features-grid">
            <div className="login-feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(20, 184, 166, 0.1)', color: '#0d9488' }}>
                <Shield size={20} />
              </div>
              <h3 className="feature-title">100% Cryptographic Anonymity</h3>
              <p className="feature-desc">SHA-256 session token hashing ensures your true identity remains hidden from peers.</p>
            </div>

            <div className="login-feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                <BrainCircuit size={20} />
              </div>
              <h3 className="feature-title">Real-time AI Safety Triage</h3>
              <p className="feature-desc">Automated crisis evaluation triggers 24/7 immediate assistance when urgent support is needed.</p>
            </div>

            <div className="login-feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                <Calendar size={20} />
              </div>
              <h3 className="feature-title">Licensed Telehealth</h3>
              <p className="feature-desc">Book direct 1-on-1 sessions with verified campus counselors in confidential virtual rooms.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <p>MindSpace Platform • FERPA & HIPAA Audited • Campus Crisis Line: 1-800-555-0199</p>
      </footer>
    </div>
  );
}
