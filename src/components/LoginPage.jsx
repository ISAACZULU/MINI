import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  AlertTriangle,
  Users,
  MessageSquare,
  BookOpen,
  Phone,
  FileText,
  Star,
  X,
  Eye,
  EyeOff
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

  // Modal Open States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAnonymousModalOpen, setIsAnonymousModalOpen] = useState(false);
  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Dialog Refs for Native Overlays
  const studentDialogRef = useRef(null);
  const anonymousDialogRef = useRef(null);
  const counselorDialogRef = useRef(null);
  const feedbackDialogRef = useRef(null);

  // Effects to control Native Dialogs
  useEffect(() => {
    const dialog = studentDialogRef.current;
    if (!dialog) return;
    if (isStudentModalOpen) {
      try { dialog.showModal(); } catch (e) {}
    } else {
      try { dialog.close(); } catch (e) {}
    }
  }, [isStudentModalOpen]);

  useEffect(() => {
    const dialog = anonymousDialogRef.current;
    if (!dialog) return;
    if (isAnonymousModalOpen) {
      try { dialog.showModal(); } catch (e) {}
    } else {
      try { dialog.close(); } catch (e) {}
    }
  }, [isAnonymousModalOpen]);

  useEffect(() => {
    const dialog = counselorDialogRef.current;
    if (!dialog) return;
    if (isCounselorModalOpen) {
      try { dialog.showModal(); } catch (e) {}
    } else {
      try { dialog.close(); } catch (e) {}
    }
  }, [isCounselorModalOpen]);

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

  const handleGuestLogin = () => {
    login({
      isGuest: true,
      userType: 'student',
      displayName: sessionHash,
      email: 'visitor@campus.edu'
    }, 'student');
    setIsAnonymousModalOpen(false);
    showToast(`Welcome! Entered Haven KNUST as Anonymous Visitor (${sessionHash})`, 'success');
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
    setIsStudentModalOpen(false);
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
    setIsCounselorModalOpen(false);
    showToast('Welcome Dr. Jenkins! Signed in to Counselor Command Center', 'success');
  };

  const handleFeedbackSubmit = (e) => {
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
  };

  const handleQuickEscape = () => {
    window.location.href = 'https://www.google.com';
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
    <div className="landing-page-container">
      {/* 1. Crisis Alert Banner (Absolute Top) */}
      <div className="landing-crisis-banner" style={{ background: 'var(--alert-yellow)', color: '#ffffff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} className="live-mic-pulse" />
          <span>IN IMMEDIATE CRISIS? CALL CAMPUS SECURITY (0800-XXX) OR NATIONAL CRISIS LINE (112) INSTANTLY.</span>
        </div>
        <button 
          onClick={handleQuickEscape}
          style={{ background: 'var(--restrained-red)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', transition: 'background 0.2s' }}
        >
          QUICK ESCAPE (RED)
        </button>
      </div>

      {/* 2. Header Nav */}
      <header className="landing-header" style={{ padding: '16px 24px', background: 'var(--header-bg)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="brand-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-logo-icon" style={{ background: 'var(--primary-teal)', color: '#fff', padding: '6px', borderRadius: '8px' }}>
            <span className="animate-icon-heart">
              <Heart size={24} fill="#ffffff" color="#ffffff" />
            </span>
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Haven KNUST</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department of Computer Science</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="ferpa-header-btn" 
            onClick={() => setIsFerpaModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', background: 'var(--pill-bg)', color: 'var(--text-main)', fontSize: '0.8rem' }}
          >
            <span className="animate-icon-heart"><CheckCircle size={14} color="var(--safety-green)" /></span>
            <span>FERPA Compliant</span>
          </button>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            style={{ border: '1px solid var(--border)', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--pill-bg)', color: 'var(--text-main)' }}
            title="Toggle Theme"
          >
            <span className="animate-icon-settings">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</span>
          </button>
        </div>
      </header>

      {/* 3. Hero Section (Simplified Neutral Theme) */}
      <section className="landing-hero-section" style={{ background: 'var(--bg-canvas)', color: 'var(--text-main)', padding: '64px 24px', textAlign: 'center', position: 'relative', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 850, letterSpacing: '-0.02em', margin: '0 0 12px 0', color: 'var(--primary-teal)', lineHeight: 1.2 }}>
            HAVEN KNUST EMOTIONAL SUPPORT & SAFETY PORTAL
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '40px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            A Confidential Platform for Student Mental-Health Support, Early Risk Screening, and Immediate Campus Resources
          </p>
 
          {/* Dual Entry Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '0 auto 32px auto', maxWidth: '720px' }}>
            {/* Card 1: Identified Login */}
            <div style={{ background: 'var(--card-bg)', color: 'var(--text-main)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--primary-teal)' }}>GET SUPPORT IDENTIFIED (LOGIN)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.4 }}>
                  For students to submit concerns linked securely to their student account.
                </p>
              </div>
              <button 
                onClick={() => setIsStudentModalOpen(true)}
                className="btn-primary" 
                style={{ width: '100%', padding: '12px', background: 'var(--primary-teal)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>REGISTER / LOGIN TO SUBMIT A CONCERN</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--alert-yellow)', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>FR-2</span>
              </button>
            </div>
 
            {/* Card 2: Anonymous Message */}
            <div style={{ background: 'var(--card-bg)', color: 'var(--text-main)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--primary-teal)' }}>SEND ANONYMOUS MESSAGE</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.4 }}>
                  Full privacy with zero data storage (name, account, IP) on the server.
                </p>
              </div>
              <button 
                onClick={() => setIsAnonymousModalOpen(true)}
                className="btn-secondary" 
                style={{ width: '100%', padding: '10px', border: '2px solid var(--primary-teal)', background: 'transparent', color: 'var(--primary-teal)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <span>SEND SECURE, ANONYMOUS MESSAGE</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--primary-teal)', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>FR-3</span>
              </button>
            </div>
          </div>

          {/* Counselor Access Shortcut */}
          <div>
            <button 
              onClick={() => setIsCounselorModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
            >
              Licensed counselor? Log in to your portal here
            </button>
          </div>
        </div>
      </section>

      {/* 4. Interactive Information Hub (Decluttered & Reduced Cognitive Load) */}
      <section className="landing-section" style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div className="info-hub-card">
          <div className="info-hub-tab-bar">
            <button 
              type="button"
              className={`info-hub-tab-btn ${activeInfoTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveInfoTab('services')}
            >
              <Sparkles size={16} />
              <span>Platform Services</span>
            </button>
            <button 
              type="button"
              className={`info-hub-tab-btn ${activeInfoTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveInfoTab('contacts')}
            >
              <Phone size={16} />
              <span>Emergency Helpdesk</span>
            </button>
            <button 
              type="button"
              className={`info-hub-tab-btn ${activeInfoTab === 'flowchart' ? 'active' : ''}`}
              onClick={() => setActiveInfoTab('flowchart')}
            >
              <Users size={16} />
              <span>How It Works</span>
            </button>
          </div>

          <div className="info-hub-content">
            {activeInfoTab === 'services' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {/* Service 1 */}
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                  <FileText size={32} color="var(--primary-teal)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>SECURE REPORTING</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Identified wellness concern logging linked with student profile.</p>
                </div>
                {/* Service 2 */}
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                  <MessageSquare size={32} color="#3b82f6" style={{ marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>ANONYMOUS MESSAGING</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Zero data storage discussions with random SHA-256 session tokens.</p>
                </div>
                {/* Service 3 */}
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                  <BookOpen size={32} color="#f59e0b" style={{ marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>RESOURCE LIBRARY</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Self-directed recovery steps for insomnia, anxiety, and burnout.</p>
                </div>
                {/* Service 4 */}
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                  <Sparkles size={32} color="#10b981" style={{ marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>CHATBOT SUPPORT</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>24/7 empathetic conversational companion (FR-8).</p>
                </div>
              </div>
            )}

            {activeInfoTab === 'contacts' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {/* Contact 1 */}
                <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '20px' }}>
                  <Phone size={24} color="#ef4444" style={{ marginBottom: '8px' }} />
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>CAMPUS COUNSELLING</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency consultation & 1-on-1 crisis care.</p>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--restrained-red)' }}>+233 24 412 3456</span>
                </div>
                {/* Contact 2 */}
                <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '20px' }}>
                  <Phone size={24} color="#ef4444" style={{ marginBottom: '8px' }} />
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>NATIONAL HELPLINES</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Call/text 24/7 crisis numbers.</p>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--restrained-red)' }}>+233 20 098 7654</span>
                </div>
                {/* Contact 3 */}
                <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '20px' }}>
                  <Phone size={24} color="#ef4444" style={{ marginBottom: '8px' }} />
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>CAMPUS SECURITY</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Security dispatch for immediate safety concerns.</p>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--restrained-red)' }}>+233 32 206 0296</span>
                </div>
              </div>
            )}

            {activeInfoTab === 'flowchart' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'start' }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.08)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>1. Student Submission</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>(Identified or Anonymous)</p>
                </div>
                {/* Step 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BrainCircuit size={24} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>2. Intelligent Screening</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Sentiment-analysis and urgent flagging (FR-4)</p>
                </div>
                {/* Step 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>3. Admin Triage</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Triage & Response (FR-6, FR-9)</p>
                </div>
                {/* Step 4 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={24} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>4. Access Resources</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Self-care guides and telehealth care plans (FR-7)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Recent Advice Articles Section */}
      <section className="landing-section" style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 36px 0', color: 'var(--text-main)', letterSpacing: '0.05em' }}>RECENT ADVICE ARTICLES</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', flexGrow: 1 }}>
                <span className="category-badge" style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary-teal)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>ANXIETY</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: '10px 0 8px 0', color: 'var(--text-main)' }}>Managing Exam Anxiety</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Managing exam anxiety is close to studying. Implement quick 4-7-8 breathing exercises and reframe physical stress symptoms to improve cognitive performance before test hours.
                </p>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => showToast('Log in to read full psychoeducational articles', 'info')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                >
                  <span>READ MORE</span>
                  <span className="animate-icon-arrow-right"><ArrowRight size={14} /></span>
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', flexGrow: 1 }}>
                <span className="category-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>RESILIENCE</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: '10px 0 8px 0', color: 'var(--text-main)' }}>Building Resilience</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Building positive relationships, implementing strict digital boundaries, prioritizing daily recovery periods, and separating academic output from core self-worth metrics.
                </p>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => showToast('Log in to read full psychoeducational articles', 'info')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                >
                  <span>READ MORE</span>
                  <span className="animate-icon-arrow-right"><ArrowRight size={14} /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="landing-section" style={{ padding: '56px 24px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 36px 0', color: 'var(--text-main)', letterSpacing: '0.05em' }}>TESTIMONIALS (OPTIONAL FOR PROTOTYPE)</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {testimonials.map((test, index) => (
              <div key={index} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', fontStyle: 'italic', position: 'relative', textAlign: 'left' }}>
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
            style={{ width: 'auto', padding: '10px 24px', background: 'var(--primary-teal)', color: '#ffffff' }}
          >
            ADD FEEDBACK
          </button>
        </div>
      </section>

      {/* 9. Footer */}
      <footer style={{ padding: '40px 24px', background: '#0f172a', color: '#94a3b8', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontWeight: 'bold' }}>Haven KNUST</h4>
            <p style={{ margin: 0, maxWidth: '280px', lineHeight: 1.4 }}>Kwame Nkrumah University of Science and Technology. Department of Computer Science.</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontWeight: 'bold' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><button onClick={() => setIsFerpaModalOpen(true)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}>FERPA Verified Status</button></li>
              <li><a href="#privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Security & Anonymity Audit</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontWeight: 'bold' }}>Community</h4>
            <p style={{ margin: 0 }}>Campus Counseling Center. Wellness Advocates.</p>
          </div>
        </div>
        <div style={{ maxWidth: '960px', margin: '32px auto 0 auto', borderTop: '1px solid #334155', paddingTop: '20px', textAlign: 'center', fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} Haven KNUST. All Rights Reserved. Cryptographically Refreshed Session Identifiers.
        </div>
      </footer>

      {/* Modals Suite */}

      {/* Modal 1: Student SSO Login */}
      <dialog 
        ref={studentDialogRef} 
        onClick={handleBackdropClick(studentDialogRef, setIsStudentModalOpen)}
        onClose={() => setIsStudentModalOpen(false)}
        className="native-dialog"
      >
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Student SSO Login</h3>
            <button className="close-btn" onClick={() => setIsStudentModalOpen(false)} type="button">
              <span className="animate-icon-close"><X size={20} /></span>
            </button>
          </div>
          <form onSubmit={handleStudentSSO} className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use your official student email</span>
              <button type="button" onClick={fillDemoStudent} style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>
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
              <div style={{ position: 'relative' }}>
                <input 
                  type={showStudentPassword ? "text" : "password"} 
                  className="form-input" 
                  placeholder="••••••••••••"
                  style={{ paddingRight: '40px' }}
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
                  {showStudentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              <span>Log In via SSO</span>
              <span className="animate-icon-arrow-right"><ArrowRight size={16} /></span>
            </button>
          </form>
        </div>
      </dialog>

      {/* Modal 2: Anonymous Visitor Login */}
      <dialog 
        ref={anonymousDialogRef} 
        onClick={handleBackdropClick(anonymousDialogRef, setIsAnonymousModalOpen)}
        onClose={() => setIsAnonymousModalOpen(false)}
        className="native-dialog"
      >
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Secure Anonymous Visitor Entry</h3>
            <button className="close-btn" onClick={() => setIsAnonymousModalOpen(false)} type="button">
              <span className="animate-icon-close"><X size={20} /></span>
            </button>
          </div>
          <div className="modal-body">
            <div className="privacy-banner" style={{ background: 'var(--safety-green-light)', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--safety-green-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: '1px solid', fontSize: '0.8rem' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>Zero personal data recorded. Fully anonymous, cryptographically rotating guest token.</span>
            </div>

            <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Your Anonymous Session ID:</span>
                <code style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>{sessionHash}</code>
              </div>
              <button 
                onClick={rotateSessionHash} 
                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Rotate token identity"
              >
                <span className="animate-icon-refresh"><RefreshCw size={15} /></span>
              </button>
            </div>

            <button onClick={handleGuestLogin} className="btn-primary" style={{ background: 'var(--safety-green)', border: 'none' }}>
              <span>Enter Anonymously</span>
              <span className="animate-icon-arrow-right"><ArrowRight size={16} /></span>
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal 3: Counselor Portal Login */}
      <dialog 
        ref={counselorDialogRef} 
        onClick={handleBackdropClick(counselorDialogRef, setIsCounselorModalOpen)}
        onClose={() => setIsCounselorModalOpen(false)}
        className="native-dialog"
      >
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Licensed Counselor Portal</h3>
            <button className="close-btn" onClick={() => setIsCounselorModalOpen(false)} type="button">
              <span className="animate-icon-close"><X size={20} /></span>
            </button>
          </div>
          <form onSubmit={handleCounselorLogin} className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authorized wellness staff login</span>
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
                  style={{ paddingRight: '40px' }}
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
                  {showCounselorKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ background: 'var(--primary-teal)', border: 'none' }}>
              <span>Access Practitioner Portal</span>
              <span className="animate-icon-arrow-right"><ArrowRight size={16} /></span>
            </button>
          </form>
        </div>
      </dialog>

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
              <span className="animate-icon-close"><X size={20} /></span>
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
                    <span className="animate-icon-star">
                      <Star 
                        size={24} 
                        fill={star <= feedbackRating ? 'var(--alert-yellow)' : 'none'} 
                        color={star <= feedbackRating ? 'var(--alert-yellow)' : 'var(--text-subtle)'} 
                      />
                    </span>
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

            <button type="submit" className="btn-primary">
              <span>Submit Testimony</span>
              <span className="animate-icon-heart"><CheckCircle size={16} /></span>
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
