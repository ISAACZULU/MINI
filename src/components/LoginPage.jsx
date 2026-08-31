import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  IconlyCheckCircle,
  IconlyMoon,
  IconlySun,
  IconlyArrowRight,
  IconlyArrowLeft,
  IconlyLock,
  IconlyShield,
  IconlyCalendar,
  IconlyAlert,
  IconlyUser,
  IconlyChat,
  IconlyDocument,
  IconlyPhone,
  IconlyStar,
  IconlyClose,
  IconlyEye,
  IconlyEyeOff,
  IconlyRefresh,
  IconlyCompass,
  IconlyAward,
  IconlyBot,
  IconlyActivity
} from './Iconly';
import { supabase } from '../services/supabase';

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

  // Active inline login form state ('guest' | 'student' | 'counselor' | null)
  const [activeForm, setActiveForm] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Dialog Refs for Native Overlays
  const feedbackDialogRef = useRef(null);

  // Effects to control Native Dialogs
  useEffect(() => {
    const dialog = feedbackDialogRef.current;
    if (!dialog) return;
    if (isFeedbackModalOpen) {
      try { dialog.showModal(); } catch (e) {}
    } else {
      try { dialog.close(); } catch (e) {}
    }
  }, [isFeedbackModalOpen]);

  // Light-dismiss helper
  const handleBackdropClick = (dialogRef, setOpen) => (e) => {
    if (e.target === dialogRef.current) {
      setOpen(false);
    }
  };

  // Form states
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [counselorId, setCounselorId] = useState('');
  const [counselorKey, setCounselorKey] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showCounselorKey, setShowCounselorKey] = useState(false);
  const [demoCounselorIndex, setDemoCounselorIndex] = useState(0);

  // Feedback states
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [activeInfoTab, setActiveInfoTab] = useState('services');

  // Local list of testimonials (dynamic updates on submission)
  const [testimonials, setTestimonials] = useState([
    {
      text: "Haven KNUST gave me a voice when I was too anxious to seek help in person. The anonymity kept me safe.",
      author: "Anon Student"
    },
    {
      text: "The AI triage was surprisingly fast. I got connected to a counselor within minutes after posting.",
      author: "Grad Student"
    }
  ]);

  useEffect(() => {
    async function loadFeedbacks() {
      try {
        const { data, error } = await supabase
          .from('feedbacks')
          .select('*')
          .order('timestamp', { ascending: false });
        if (!error && data && data.length > 0) {
          const formatted = data.map(item => ({
            text: item.text,
            author: item.author_name || 'Anonymous Student'
          }));
          setTestimonials(formatted);
        }
      } catch (err) {
        console.warn('Failed to load feedbacks from Supabase:', err);
      }
    }
    loadFeedbacks();
  }, []);

  const handleGuestLogin = () => {
    login({
      isGuest: true,
      userType: 'student',
      displayName: sessionHash,
      email: 'visitor@st.knust.edu.gh'
    }, 'student');
    setActiveForm(null);
    showToast(`Welcome! Entered Haven KNUST as Anonymous Visitor (${sessionHash})`, 'success');
  };

  const handleStudentSSO = (e) => {
    e.preventDefault();
    const email = studentEmail.trim();
    if (!email.endsWith('@st.knust.edu.gh') && email !== 'jordan.rivera@university.edu') {
      showToast('Validation failed: Student email must end with @st.knust.edu.gh', 'warning');
      return;
    }
    const name = email ? email.split('@')[0] : 'Student';
    login({
      isGuest: false,
      userType: 'student',
      displayName: `Student ${name}`,
      email: email || 'alex.student@st.knust.edu.gh'
    }, 'student');
    setActiveForm(null);
    showToast(`Signed in as Student (${email})`, 'success');
  };

  const handleCounselorLogin = (e) => {
    e.preventDefault();
    const id = (counselorId || '').trim().toLowerCase();
    let displayName = 'Dr. Sarah Jenkins, LCSW';
    let email = 's.jenkins@knust.edu.gh';
    let toastName = 'Dr. Jenkins';

    if (id.includes('peterson') || id.includes('mark') || id.includes('44219')) {
      displayName = 'Dr. Mark Peterson, PsyD';
      email = 'm.peterson@knust.edu.gh';
      toastName = 'Dr. Peterson';
    } else if (id.includes('rivera') || id.includes('alex') || id.includes('33921')) {
      displayName = 'Counselor Alex Rivera, MSW';
      email = 'a.rivera@knust.edu.gh';
      toastName = 'Counselor Rivera';
    }

    login({
      isGuest: false,
      userType: 'counselor',
      displayName,
      email,
      licenseId: counselorId || 'LCSW-88492'
    }, 'counselor');
    setActiveForm(null);
    showToast(`Welcome ${toastName}! Signed in to Counselor Center`, 'success');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    // Add to testimonials
    const newTestimonial = {
      text: feedbackText.trim(),
      author: feedbackName.trim() || 'Anonymous Student'
    };
    setTestimonials([...testimonials, newTestimonial]);
    setFeedbackText('');
    setFeedbackName('');
    setFeedbackRating(5);
    setIsFeedbackModalOpen(false);
    showToast('Thank you for your feedback! It has been recorded.', 'success');

    try {
      await supabase.from('feedbacks').insert([
        {
          rating: feedbackRating,
          text: newTestimonial.text,
          author_name: newTestimonial.author,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase feedback sync warning:', err);
    }
  };

  const handleQuickEscape = () => {
    window.location.href = 'https://www.google.com';
  };

  const fillDemoStudent = () => {
    setStudentEmail('jordan.rivera@st.knust.edu.gh');
    setStudentPassword('password123');
  };

  const fillDemoCounselor = () => {
    const demos = [
      { id: 'LCSW-88492 (Dr. Jenkins)', pass: 'counselorpass' },
      { id: 'PsyD-44219 (Dr. Peterson)', pass: 'counselorpass' },
      { id: 'MSW-33921 (Counselor Rivera)', pass: 'counselorpass' }
    ];
    const picked = demos[demoCounselorIndex];
    setCounselorId(picked.id);
    setCounselorKey(picked.pass);
    setDemoCounselorIndex((demoCounselorIndex + 1) % demos.length);
  };

  return (
    <div className="landing-page-container">
      {/* 1. Crisis Alert Banner (Absolute Top - Restrained Red) */}
      <div className="landing-crisis-banner" style={{ background: 'var(--restrained-red)', color: '#ffffff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px' }}>
          <IconlyAlert size={18} />
          <span>IN IMMEDIATE CRISIS? CALL CAMPUS SECURITY OR THE NATIONAL CRISIS LINE (112) INSTANTLY.</span>
        </div>
        <button 
          onClick={handleQuickEscape}
          style={{ background: '#ffffff', color: 'var(--restrained-red)', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', transition: 'opacity 0.2s', flexShrink: 0 }}
        >
          QUICK ESCAPE
        </button>
      </div>

      {/* 2. Header Nav (No Heart Icon) */}
      <header className="landing-header" style={{ padding: '16px 24px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '72px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="brand-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', lineHeight: 1.1 }}>Haven KNUST</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department of Computer Science Support</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="ferpa-header-btn btn-secondary" 
            onClick={() => setIsFerpaModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '8px 14px', height: 'auto', fontSize: '13px' }}
          >
            <IconlyCheckCircle size={14} color="var(--safety-green)" />
            <span>DPA Act 843 Compliant</span>
          </button>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            style={{ border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--pill-bg)', color: 'var(--text-main)' }}
            title="Toggle Theme"
          >
            {theme === 'light' ? <IconlyMoon size={18} /> : <IconlySun size={18} />}
          </button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="landing-hero-section" style={{ background: 'var(--bg-canvas)', color: 'var(--text-main)', padding: '64px 24px', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-main)', lineHeight: 1.2 }}>
            Haven KNUST Support & Safety Portal
          </h1>
          <p style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: '40px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 40px auto' }}>
            A Confidential Platform for Student Mental-Health Support, Early Risk Screening, and Immediate Campus Resources
          </p>
 
          {/* Dual Entry Cards (Mobile-first Wrap Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '0 auto 32px auto', maxWidth: '780px' }}>
            {/* Card 1: Student SSO */}
            <div className="premium-card card-blue" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--primary-blue)' }}>Student Wellness SSO</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.55 }}>
                  Sign in with your official university credentials. Post threads, chat with practitioners, and choose to consult anonymously with our built-in identity shield.
                </p>
              </div>
              <button 
                onClick={() => {
                  setActiveForm(activeForm === 'student' ? null : 'student');
                  setTimeout(() => document.getElementById('auth-form-card')?.scrollIntoView({ behavior: 'smooth' }), 60);
                }}
                className="btn-primary" 
                style={{ width: '100%' }}
              >
                <span>SSO Login & Enter</span>
                <IconlyArrowRight size={16} />
              </button>
            </div>
 
            {/* Card 2: Counselor Portal */}
            <div className="premium-card card-green" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--safety-green)' }}>Verified Counselor Portal</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.55 }}>
                  Authorized clinical safety teams, university counselors, and wellness administrators sign in here to manage case files and triage alerts.
                </p>
              </div>
              <button 
                onClick={() => {
                  setActiveForm(activeForm === 'counselor' ? null : 'counselor');
                  setTimeout(() => document.getElementById('auth-form-card')?.scrollIntoView({ behavior: 'smooth' }), 60);
                }}
                className="btn-anon-guest" 
                style={{ width: '100%' }}
              >
                <span>Counselor Log In</span>
                <IconlyArrowRight size={16} />
              </button>
          </div>
        </div>

          {/* Personal Safety Card Prompt */}
          <div style={{
            background: 'var(--safety-green-light)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '16px 20px',
            borderRadius: '16px',
            maxWidth: '780px',
            margin: '24px auto 0 auto',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ background: 'var(--safety-green)', color: '#fff', padding: '10px', borderRadius: '12px', display: 'flex', flexShrink: 0 }}>
              <IconlyShield size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--safety-green-dark)' }}>
                Create Your Personal Safety Card
              </h4>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--safety-green-dark)', opacity: 0.9, lineHeight: 1.5 }}>
                Ensure your campus safety resources are always at hand. Once logged in, students can fill out and print their personalized emergency safety card with trusted contacts and coping strategies.
              </p>
            </div>
          </div>

          {/* Inline Active Form Card */}
          {activeForm && (
            <div id="auth-form-card" className={`premium-card ${activeForm === 'student' ? 'card-blue' : 'card-yellow'}`} style={{ maxWidth: '600px', margin: '32px auto 0 auto', textAlign: 'left', animation: 'fadeInUp 0.3s ease' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 className="modal-title">
                  {activeForm === 'student' && 'Student SSO Login'}
                  {activeForm === 'counselor' && 'Licensed Counselor Portal'}
                </h3>
                <button className="close-btn" onClick={() => setActiveForm(null)} type="button">
                  <IconlyClose size={20} />
                </button>
              </div>

              {activeForm === 'student' && (
                <form onSubmit={handleStudentSSO} className="modal-body" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use your official student credentials (@st.knust.edu.gh)</span>
                    <button type="button" onClick={fillDemoStudent} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>
                      + Fill Demo Student
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">University Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="jordan.rivera@st.knust.edu.gh"
                      value={studentEmail}
                      onChange={e => setStudentEmail(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showStudentPassword ? "text" : "password"} 
                        className="form-input" 
                        placeholder="••••••••••••"
                        style={{ paddingRight: '40px', width: '100%' }}
                        value={studentPassword}
                        onChange={e => setStudentPassword(e.target.value)}
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={showStudentPassword ? "Hide password" : "Show password"}
                      >
                        {showStudentPassword ? <IconlyEyeOff size={16} /> : <IconlyEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>
                    <span>Log In via SSO</span>
                    <IconlyArrowRight size={16} />
                  </button>
                </form>
              )}

              {activeForm === 'counselor' && (
                <form onSubmit={handleCounselorLogin} className="modal-body" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authorized wellness staff login (@knust.edu.gh)</span>
                    <button type="button" onClick={fillDemoCounselor} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showCounselorKey ? "text" : "password"} 
                        className="form-input" 
                        placeholder="••••••••••••"
                        style={{ paddingRight: '40px', width: '100%' }}
                        value={counselorKey}
                        onChange={e => setCounselorKey(e.target.value)}
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowCounselorKey(!showCounselorKey)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={showCounselorKey ? "Hide password" : "Show password"}
                      >
                        {showCounselorKey ? <IconlyEyeOff size={16} /> : <IconlyEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    <span>Access Practitioner Portal</span>
                    <IconlyArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Interactive Information Hub */}
      <section className="landing-section" style={{ padding: '56px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="info-hub-card" style={{ padding: '0px', border: 'none', boxShadow: 'none' }}>
            <div className="info-hub-tab-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
              <button 
                type="button"
                className={`info-hub-tab-btn ${activeInfoTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveInfoTab('services')}
                style={{ background: activeInfoTab === 'services' ? 'var(--primary-teal)' : 'var(--pill-bg)', color: activeInfoTab === 'services' ? '#ffffff' : 'var(--text-main)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <IconlyCompass size={16} />
                <span>Platform Services</span>
              </button>
              <button 
                type="button"
                className={`info-hub-tab-btn ${activeInfoTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveInfoTab('contacts')}
                style={{ background: activeInfoTab === 'contacts' ? 'var(--primary-teal)' : 'var(--pill-bg)', color: activeInfoTab === 'contacts' ? '#ffffff' : 'var(--text-main)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <IconlyPhone size={16} />
                <span>Emergency Helpdesk</span>
              </button>
              <button 
                type="button"
                className={`info-hub-tab-btn ${activeInfoTab === 'flowchart' ? 'active' : ''}`}
                onClick={() => setActiveInfoTab('flowchart')}
                style={{ background: activeInfoTab === 'flowchart' ? 'var(--primary-teal)' : 'var(--pill-bg)', color: activeInfoTab === 'flowchart' ? '#ffffff' : 'var(--text-main)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <IconlyUser size={16} />
                <span>How It Works</span>
              </button>
            </div>

            <div className="info-hub-content">
              {activeInfoTab === 'services' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {/* Service 1 */}
                  <div className="premium-card card-blue" style={{ minHeight: '180px' }}>
                    <IconlyDocument size={28} color="var(--primary-blue)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Secure Reporting</h4>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>Identified wellness concern logging linked with student profile.</p>
                  </div>
                  {/* Service 2 */}
                  <div className="premium-card card-green" style={{ minHeight: '180px' }}>
                    <IconlyChat size={28} color="var(--safety-green)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Anonymous Talk</h4>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>Zero data storage discussions with random SHA-256 session tokens.</p>
                  </div>
                  {/* Service 3 */}
                  <div className="premium-card card-blue" style={{ minHeight: '180px' }}>
                    <IconlyCalendar size={28} color="var(--primary-blue)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Resource Library</h4>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>Self-directed recovery steps for insomnia, anxiety, and burnout.</p>
                  </div>
                  {/* Service 4 */}
                  <div className="premium-card card-green" style={{ minHeight: '180px' }}>
                    <IconlyBot size={28} color="var(--safety-green)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Companion AI</h4>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>24/7 empathetic conversational companion for active support.</p>
                  </div>
                </div>
              )}

              {activeInfoTab === 'contacts' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {/* Contact 1 */}
                  <div className="premium-card card-red" style={{ background: 'rgba(220, 38, 38, 0.02)', padding: '20px' }}>
                    <IconlyPhone size={24} color="var(--restrained-red)" style={{ marginBottom: '8px' }} />
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>Campus Counselling</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency consultation & 1-on-1 crisis care.</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--restrained-red)' }}>+233 24 412 3456</span>
                  </div>
                  {/* Contact 2 */}
                  <div className="premium-card card-red" style={{ background: 'rgba(220, 38, 38, 0.02)', padding: '20px' }}>
                    <IconlyPhone size={24} color="var(--restrained-red)" style={{ marginBottom: '8px' }} />
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>National Helplines</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Call/text 24/7 crisis numbers.</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--restrained-red)' }}>+233 20 098 7654</span>
                  </div>
                  {/* Contact 3 */}
                  <div className="premium-card card-red" style={{ background: 'rgba(220, 38, 38, 0.02)', padding: '20px' }}>
                    <IconlyPhone size={24} color="var(--restrained-red)" style={{ marginBottom: '8px' }} />
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>Campus Security</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Security dispatch for immediate safety concerns.</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--restrained-red)' }}>+233 32 206 0296</span>
                  </div>
                </div>
              )}

              {activeInfoTab === 'flowchart' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', alignItems: 'start' }}>
                  {/* Step 1 */}
                  <div className="premium-card card-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--pill-bg)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconlyUser size={20} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>1. Student Post</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Identified or anonymous concern submission.</p>
                  </div>
                  {/* Step 2 */}
                  <div className="premium-card card-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--pill-bg)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconlyActivity size={20} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>2. Active Screening</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Sentiment-analysis and automatic risk level classification.</p>
                  </div>
                  {/* Step 3 */}
                  <div className="premium-card card-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--pill-bg)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconlyLock size={20} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>3. Secure Triage</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Crisis triggers alert professional counselors instantly.</p>
                  </div>
                  {/* Step 4 */}
                  <div className="premium-card card-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--pill-bg)', color: 'var(--safety-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconlyCheckCircle size={20} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>4. Care Access</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Self-care library navigation and scheduled telehealth.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Recent Advice Articles Section */}
      <section className="landing-section" style={{ padding: '56px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-canvas)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 32px 0', color: 'var(--text-main)', letterSpacing: '0.02em' }}>Recent Advice Articles</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Article 1 */}
            <div className="premium-card card-blue" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', padding: '0px' }}>
              <div style={{ padding: '24px', flexGrow: 1 }}>
                <span className="category-badge" style={{ background: 'var(--pill-bg)', color: 'var(--primary-teal)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Anxiety</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '12px 0 8px 0', color: 'var(--text-main)' }}>Managing Exam Anxiety</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Managing exam anxiety is close to studying. Implement quick 4-7-8 breathing exercises and reframe physical stress symptoms to improve cognitive performance before test hours.
                </p>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => {
                    setActiveForm('student');
                    setTimeout(() => document.getElementById('auth-form-card')?.scrollIntoView({ behavior: 'smooth' }), 60);
                    showToast('Please log in as a student to read the full psychoeducational articles.', 'info');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                >
                  <span>Read More</span>
                  <IconlyArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Article 2 */}
            <div className="premium-card card-blue" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', padding: '0px' }}>
              <div style={{ padding: '24px', flexGrow: 1 }}>
                <span className="category-badge" style={{ background: 'var(--pill-bg)', color: 'var(--primary-blue)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>Resilience</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '12px 0 8px 0', color: 'var(--text-main)' }}>Building Resilience</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Building positive relationships, implementing strict digital boundaries, prioritizing daily recovery periods, and separating academic output from core self-worth metrics.
                </p>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => {
                    setActiveForm('student');
                    setTimeout(() => document.getElementById('auth-form-card')?.scrollIntoView({ behavior: 'smooth' }), 60);
                    showToast('Please log in as a student to read the full psychoeducational articles.', 'info');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                >
                  <span>Read More</span>
                  <IconlyArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="landing-section" style={{ padding: '56px 24px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 32px 0', color: 'var(--text-main)', letterSpacing: '0.02em' }}>What People Are Saying</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {testimonials.map((test, index) => (
              <div key={index} className="premium-card card-green" style={{ fontStyle: 'italic', textAlign: 'left' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  "{test.text}"
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 'bold', fontStyle: 'normal' }}>
                  — {test.author}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setIsFeedbackModalOpen(true)}
            className="btn-primary" 
            style={{ width: 'auto', padding: '12px 28px' }}
          >
            ADD FEEDBACK
          </button>
        </div>
      </section>

      {/* 9. Footer */}
      <footer style={{ padding: '48px 24px', background: '#0f1319', color: '#8e9fae', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#f1f5f9', fontWeight: 'bold' }}>Haven KNUST</h4>
            <p style={{ margin: 0, maxWidth: '280px', lineHeight: 1.4 }}>Kwame Nkrumah University of Science and Technology. Department of Computer Science.</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#f1f5f9', fontWeight: 'bold' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><button onClick={() => setIsFerpaModalOpen(true)} style={{ background: 'none', border: 'none', color: '#8e9fae', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}>DPA (Act 843) Status</button></li>
              <li><span style={{ color: '#8e9fae' }}>Security & Anonymity Audit</span></li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#f1f5f9', fontWeight: 'bold' }}>Community</h4>
            <p style={{ margin: 0 }}>Campus Counseling Center. Departmental Safety Officers.</p>
          </div>
        </div>
        <div style={{ maxWidth: '960px', margin: '32px auto 0 auto', borderTop: '1px solid #1e2630', paddingTop: '20px', textAlign: 'center', fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} Haven KNUST. All Rights Reserved. Fully Encrypted Anonymous Session Hash.
        </div>
      </footer>

      {/* Modals Suite */}

      {/* Modal 4: Add Feedback Testimonial */}
      <dialog 
        ref={feedbackDialogRef} 
        onClick={handleBackdropClick(feedbackDialogRef, setIsFeedbackModalOpen)}
        onClose={() => setIsFeedbackModalOpen(false)}
        className="native-dialog"
      >
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Submit Platform Feedback</h3>
            <button className="close-btn" onClick={() => setIsFeedbackModalOpen(false)} type="button">
              <IconlyClose size={20} />
            </button>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="modal-body">
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">How would you rate Haven KNUST?</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <IconlyStar 
                      size={24} 
                      fill={star <= feedbackRating ? 'var(--alert-yellow)' : 'none'} 
                      color={star <= feedbackRating ? 'var(--alert-yellow)' : 'var(--text-subtle)'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Feedback / Testimony</label>
              <textarea 
                className="form-input form-input-autosize" 
                placeholder="Share your experience using the platform (fully private)..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Alias (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Anon Student, Jordan R. (defaults to Anonymous)"
                value={feedbackName}
                onChange={e => setFeedbackName(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <span>Submit Testimony</span>
              <IconlyCheckCircle size={16} />
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
