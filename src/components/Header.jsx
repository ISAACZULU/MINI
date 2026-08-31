import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  IconlyUser,
  IconlyCalendar,
  IconlyMoon,
  IconlySun,
  IconlyRefresh,
  IconlyLogOut
} from './Iconly';

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
          onClick={() => { setActiveTab(role === 'counselor' ? 'counselor_triage' : 'articles'); setSelectedCategory('All'); }}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-text-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">Haven KNUST</span>
            </div>
            <span className="brand-subtitle">Department of Computer Science Support & Safety Portal</span>
          </div>
        </div>

        <div className="header-actions">
          {/* 1. Hashed Name/Identity Display */}
          <div className="header-account-pill" title="Your cryptographically rotating session ID">
            <IconlyUser size={13} style={{ color: 'var(--text-subtle)', marginRight: '4px' }} />
            <span className="hash-value">{sessionHash}</span>
          </div>

          {/* 2. Book Counselor Button (Student Only) */}
          {role === 'student' && (
            <button 
              className="header-book-btn" 
              onClick={() => setIsAppointmentModalOpen(true)}
              title="Book a confidential counseling session"
            >
              <IconlyCalendar size={14} />
              <span className="btn-label-desktop">Book Counselor</span>
            </button>
          )}

          {/* 3. Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="header-theme-toggle"
            title="Toggle theme"
          >
            {theme === 'light' ? <IconlyMoon size={14} /> : <IconlySun size={14} />}
          </button>

          {/* 4. Dropdown Navigation Menu */}
          <div className={`dropdown-container ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button 
              className="header-menu-btn" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Toggle navigation menu"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', background: 'var(--bg-canvas)', color: 'var(--text-main)', cursor: 'pointer', height: '36px' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Menu</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setActiveTab('inbox'); }}>
                <span>Inbox</span>
              </button>

              <div className="dropdown-divider" />

              {role === 'student' && (
                <>
                  <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsSafetyPlanModalOpen(true); }}>
                    <span>Personal safety card</span>
                  </button>
                  <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsCrisisModalOpen(true); }} style={{ color: 'var(--restrained-red)' }}>
                    <span style={{ fontWeight: 600 }}>Crisis Helplines</span>
                  </button>
                  <div className="dropdown-divider" />
                </>
              )}

              <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); setIsFerpaModalOpen(true); }}>
                <span>DPA Act 843 Status</span>
              </button>

              <button className="dropdown-item" onClick={() => { rotateSessionHash(); setIsDropdownOpen(false); }} title="Rotate session hash for complete anonymity">
                <span>Rotate Identity Token</span>
              </button>

              <div className="dropdown-divider" />

              <button className="dropdown-item" onClick={() => logout()} style={{ color: 'var(--restrained-red)' }}>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
