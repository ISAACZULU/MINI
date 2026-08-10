import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  User, 
  RefreshCw, 
  Moon, 
  Sun, 
  CheckCircle,
  RotateCcw,
  Shield,
  LogOut,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { 
    role, 
    sessionHash, 
    rotateSessionHash, 
    theme, 
    toggleTheme, 
    setActiveTab, 
    setSelectedCategory,
    setIsFerpaModalOpen,
    setIsSafetyPlanModalOpen,
    setIsAppointmentModalOpen,
    setIsCrisisModalOpen,
    logout,
    resetDemoData
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div 
          className="brand-group" 
          onClick={() => { setActiveTab('articles'); setSelectedCategory('All'); }}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-logo-icon">
            <span className="animate-icon-heart">
              <Heart size={22} fill="#ffffff" color="#ffffff" />
            </span>
          </div>
          <div className="brand-text-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">Haven KNUST</span>
            </div>
            <span className="brand-subtitle">Department of Computer Science Support & Safety Portal</span>
          </div>
        </div>

        <div className="header-actions">
          <div className={`dropdown-container ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button 
              className="hash-pill" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', outline: 'none' }}
              title="Click to view actions and session status"
            >
              <span className="animate-icon-user"><User size={13} style={{ color: 'var(--text-subtle)' }} /></span>
              <span className="hash-value" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{sessionHash}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-subtle)', marginLeft: '2px' }}>▼</span>
            </button>

            <div className="dropdown-menu">
              {role === 'student' && (
                <>
                  <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsSafetyPlanModalOpen(true); }}>
                    <span className="animate-icon-lock"><Shield size={14} color="#10b981" /></span>
                    <span>Safety Plan</span>
                  </button>
                  <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsAppointmentModalOpen(true); }}>
                    <span className="animate-icon-user"><Calendar size={14} color="#0284c7" /></span>
                    <span>Book Counselor</span>
                  </button>
                  <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsCrisisModalOpen(true); }} style={{ color: 'var(--restrained-red)' }}>
                    <span className="animate-icon-alert"><AlertTriangle size={14} color="var(--restrained-red)" /></span>
                    <span style={{ fontWeight: 600 }}>Crisis Helplines</span>
                  </button>
                  <div className="dropdown-divider" />
                </>
              )}

              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsFerpaModalOpen(true); }}>
                <span className="animate-icon-heart"><CheckCircle size={14} color="var(--safety-green)" /></span>
                <span>FERPA Status</span>
              </button>

              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); toggleTheme(); }}>
                <span className="animate-icon-settings">{theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}</span>
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); resetDemoData(); }}>
                <span className="animate-icon-refresh"><RotateCcw size={14} /></span>
                <span>Reset Demo Data</span>
              </button>

              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); rotateSessionHash(); }} title="Rotate session hash for complete anonymity">
                <span className="animate-icon-refresh"><RefreshCw size={14} /></span>
                <span>Rotate Identity Token</span>
              </button>

              <div className="dropdown-divider" />

              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); logout(); }} style={{ color: '#e11d48' }}>
                <span className="animate-icon-arrow-right"><LogOut size={14} /></span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
