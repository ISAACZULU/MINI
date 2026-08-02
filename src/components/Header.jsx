import React from 'react';
import { 
  Heart, 
  User, 
  RefreshCw, 
  Moon, 
  Sun, 
  ShieldCheck, 
  CheckCircle,
  Wind,
  RotateCcw,
  Shield,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { 
    role, 
    setRole, 
    sessionHash, 
    rotateSessionHash, 
    theme, 
    toggleTheme, 
    setActiveTab, 
    setSelectedCategory,
    setIsFerpaModalOpen,
    setIsBreathingModalOpen,
    setIsSafetyPlanModalOpen,
    userAuth,
    logout,
    resetDemoData
  } = useApp();

  return (
    <header className="app-header">
      <div className="header-inner">
        <div 
          className="brand-group" 
          onClick={() => { setActiveTab('peer_threads'); setSelectedCategory('All'); }}
        >
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

        <div className="header-actions">
          {/* Active Identity Badge */}
          <div className="user-badge-pill" title={`Logged in as ${userAuth?.displayName}`}>
            <User size={13} />
            <span>{userAuth?.displayName || sessionHash}</span>
          </div>

          {/* Sign Out Button */}
          <button 
            className="breathing-header-btn" 
            style={{ color: '#e11d48', backgroundColor: 'rgba(225, 29, 72, 0.1)', fontWeight: 600 }}
            onClick={logout}
            title="Sign out and return to Sign-In page"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          {/* Personal Safety Net Plan Button */}
          <button 
            className="breathing-header-btn" 
            style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
            onClick={() => setIsSafetyPlanModalOpen(true)}
            title="Personal Emergency Safety Net Plan"
          >
            <Shield size={14} />
            <span>Safety Plan</span>
          </button>

          {/* Guided 4-7-8 Breathwork Button */}
          <button 
            className="breathing-header-btn" 
            onClick={() => setIsBreathingModalOpen(true)}
            title="Interactive 4-7-8 Breathing Relief Exercise"
          >
            <Wind size={14} />
            <span>Breathing Tool</span>
          </button>

          {/* Student vs Counselor Toggle Pill */}
          <div className="mode-toggle-pill">
            <button 
              className={`toggle-option ${role === 'student' ? 'active' : ''}`}
              onClick={() => { setRole('student'); setActiveTab('peer_threads'); }}
            >
              <User size={15} />
              <span>Student</span>
            </button>
            <button 
              className={`toggle-option ${role === 'counselor' ? 'active' : ''}`}
              onClick={() => { setRole('counselor'); setActiveTab('counselor_triage'); }}
            >
              <ShieldCheck size={15} />
              <span>Counselor</span>
            </button>
          </div>

          {/* Cryptographic Session Hash Pill */}
          <div className="hash-pill" title="Cryptographically rotated anonymous session identifier">
            <span className="hash-label">Session:</span>
            <span className="hash-value">{sessionHash}</span>
            <button className="hash-rotate-btn" onClick={rotateSessionHash} title="Rotate session hash for complete anonymity">
              <RefreshCw size={13} />
            </button>
          </div>

          {/* FERPA Quick Verifier Button */}
          <button 
            className="ferpa-header-btn" 
            onClick={() => setIsFerpaModalOpen(true)}
            title="FERPA & HIPAA Compliance Audited"
          >
            <CheckCircle size={14} color="#10b981" />
            <span>FERPA</span>
          </button>

          {/* Reset Demo Button */}
          <button 
            className="reset-demo-btn" 
            onClick={resetDemoData}
            title="Reset to clean demo data state for presentation"
          >
            <RotateCcw size={14} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
