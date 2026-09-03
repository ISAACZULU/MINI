import React from 'react';
import { 
  AppProvider, 
  useApp 
} from './context/AppContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import CrisisBanner from './components/CrisisBanner';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import ThreadModal from './components/ThreadModal';
import AppointmentModal from './components/AppointmentModal';
import ComplianceModal from './components/ComplianceModal';
import ResourceLibraryModal from './components/ResourceLibraryModal';
import SafetyPlanModal from './components/SafetyPlanModal';
import TelehealthRoomModal from './components/TelehealthRoomModal';
import CounselorDashboard from './components/CounselorDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ModerationHub from './components/ModerationHub';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import Toast from './components/Toast';

// Inline Tab Views
import ArticlesTab from './components/ArticlesTab';
import ResourcesTab from './components/ResourcesTab';
import SessionsTab from './components/SessionsTab';
import InboxTab from './components/InboxTab';

import { 
  IconlyCheckCircle,
  IconlyRefresh,
  IconlyUser,
  IconlyShield,
  IconlyCalendar,
  IconlyAlert,
  IconlyHelp,
  IconlyClose,
  IconlyActivity,
  IconlyDocument,
  IconlyChat
} from './components/Iconly';
import { CATEGORIES } from './types';

function MainAppContent() {
  const {
    isAuthenticated,
    authLoading,
    role,
    activeTab, 
    setActiveTab, 
    selectedCategory, 
    setSelectedCategory, 
    posts, 
    myPostIds,
    setIsCreateModalOpen,
    setIsCrisisModalOpen,
    isCrisisModalOpen,
    setIsFerpaModalOpen,
    setIsAppointmentModalOpen,
    setIsSafetyPlanModalOpen,
    setIsPrivacyModalOpen,
    isPrivacyModalOpen,
    userAuth,
    sessionHash,
    rotateSessionHash
  } = useApp();

  const [showWelcome, setShowWelcome] = React.useState(true);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, isAuthenticated]);

  React.useEffect(() => {
    if (!showWelcome) return;
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowWelcome(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showWelcome]);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading Haven KNUST...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toast />
        <LoginPage />
        <ComplianceModal />
      </>
    );
  }

  const getFilteredPosts = () => {
    let list = [...posts];

    if (activeTab === 'my_posts') {
      list = list.filter(p => myPostIds.includes(p.id));
    }

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.tag === selectedCategory);
    }

    return list;
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast />

      {/* Real-time Crisis Safety Banner (FIRST FROM TOP) */}
      <CrisisBanner />

      {/* Header Bar (SECOND) */}
      <Header />

      {/* Main Content Area */}
      <main className="main-content">
        {role === 'student' ? (
          <>
            {/* Greeting Section (Lie alone on page, not as card; auto-hides on scroll) */}
            {showWelcome && (
              <div style={{ padding: '8px 0 20px 0', margin: '0', textAlign: 'left' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 550, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.015em' }}>
                  {userAuth?.isGuest ? 'Welcome' : `Welcome back, ${userAuth?.displayName?.replace('Student ', '') || 'Student'}!`}
                </h1>
              </div>
            )}

            {/* Sub-Navigation Pills Bar */}
            <div className="sub-nav-container">
              <div className="sub-nav-bar-wrapper" data-active-tab={activeTab}>
                <div className="sub-nav-bar">
                  <button 
                    className={`sub-nav-btn ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                  >
                    Articles & Goodwill
                  </button>

                  <button 
                    className={`sub-nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resources')}
                  >
                    Resources
                  </button>

                  <button 
                    className={`sub-nav-btn ${activeTab === 'peer_threads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('peer_threads')}
                  >
                    Peer Threads
                  </button>

                  <button
                    className={`sub-nav-btn ${activeTab === 'sessions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                  >
                    My Sessions
                  </button>

                  <button
                    className={`sub-nav-btn ${activeTab === 'inbox' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inbox')}
                  >
                    Inbox
                  </button>

                  <button
                    className="sub-nav-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{ color: 'var(--primary-teal)', fontWeight: 600 }}
                  >
                    + Post
                  </button>

                  {!userAuth?.isGuest && (
                    <button 
                      className={`sub-nav-btn ${activeTab === 'my_posts' ? 'active' : ''}`}
                      onClick={() => setActiveTab('my_posts')}
                    >
                      My Posts {myPostIds.length > 0 && `(${myPostIds.length})`}
                    </button>
                  )}
                </div>
                <div className="sub-nav-slider-line" />
              </div>
            </div>

            {/* Inline Articles Tab */}
            {activeTab === 'articles' && <ArticlesTab />}

            {/* Inline Resources Tab */}
            {activeTab === 'resources' && <ResourcesTab />}

            {/* Inline Sessions Tab */}
            {activeTab === 'sessions' && <SessionsTab />}

            {/* Inline Inbox Tab */}
            {activeTab === 'inbox' && <InboxTab />}

            {/* Peer Threads & My Posts Feed View */}
            {(activeTab === 'peer_threads' || activeTab === 'my_posts') && (
              <>
                {/* Tag Pills Filter Row */}
                <div className="tags-scroll-row">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      className={`tag-pill ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Posts Feed */}
                {filteredPosts.length > 0 ? (
                  <div className="posts-feed">
                    {filteredPosts.map(post => (
                       <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <IconlyHelp size={40} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>No threads found</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                      {activeTab === 'my_posts' ? "You haven't posted any anonymous threads yet." : `No posts currently under category "${selectedCategory}".`}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsCreateModalOpen(true)}>
                        + Share a thread anonymously
                      </button>
                      {selectedCategory !== 'All' && (
                        <button className="sub-nav-btn" style={{ background: 'var(--pill-bg)' }} onClick={() => setSelectedCategory('All')}>
                          View All Threads
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* Counselor Enterprise Portal & Sub Navigation */
          <div>
            <div className="sub-nav-container" style={{ marginBottom: '20px' }}>
              <div className="sub-nav-bar">
                <button 
                  className={`sub-nav-btn ${activeTab === 'counselor_triage' || activeTab === 'peer_threads' ? 'active' : ''}`}
                  onClick={() => setActiveTab('counselor_triage')}
                >
                  Triage Queue & Telehealth
                </button>
                <button 
                  className={`sub-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconlyActivity size={15} />
                  <span>Campus Analytics Heatmap</span>
                </button>
                <button
                  className={`sub-nav-btn ${activeTab === 'moderation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('moderation')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconlyShield size={15} />
                  <span>Safety Shield & Moderation</span>
                </button>
                <button
                  className={`sub-nav-btn ${activeTab === 'inbox' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inbox')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconlyChat size={15} />
                  <span>Direct Messages (Inbox)</span>
                </button>
              </div>
            </div>

            {activeTab === 'analytics' ? (
              <AnalyticsDashboard />
            ) : activeTab === 'moderation' ? (
              <ModerationHub />
            ) : activeTab === 'inbox' ? (
              <InboxTab />
            ) : (
              <CounselorDashboard />
            )}
          </div>
        )}
      </main>

      {/* Modals & Floating AI Assistant Suite */}
      <CreatePostModal />
      <ThreadModal />
      <AppointmentModal />
      <ComplianceModal />
      <ResourceLibraryModal />
      <SafetyPlanModal />
      <TelehealthRoomModal />
      {/* <FloatingAIAssistant /> */}

      {/* Contact Counselor & Emergency Crisis Modal */}
      {isCrisisModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCrisisModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Campus Counseling & Emergency Support</h3>
              <button className="close-btn" onClick={() => setIsCrisisModalOpen(false)}>
                <IconlyClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--restrained-red-light)', border: '1px solid rgba(220, 38, 38, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--restrained-red)', fontWeight: 700, marginBottom: '4px' }}>
                  <IconlyAlert size={18} />
                  <span>Immediate Crisis Support Available 24/7</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                  If you or someone you know is in immediate distress, please connect with professional emergency resources immediately.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>KNUST Counselling Centre Hotlines</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Alternative lines: +233 59 439 9772 / +233 59 351 0668</p>
                  </div>
                  <a href="tel:+233506449747" style={{ background: 'var(--primary-teal)', color: '#fff', padding: '8px 14px', borderRadius: '9999px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Call +233 50 644 9747
                  </a>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>General Inquiry & VoIP Extension</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>General Office Ext: 510303 | Head Ext: 510301</p>
                  </div>
                  <a href="mailto:counsellingcentre@knust.edu.gh" style={{ textDecoration: 'none', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.9rem' }}>
                    Email Centre
                  </a>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Physical Office Location</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>J. Harper Building, Commercial Area, KNUST, Kumasi</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-subtle)' }}>J. Harper Bldg</span>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Schedule 1-on-1 Session</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Book a private, confidential consult</p>
                  </div>
                  <button className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => { setIsCrisisModalOpen(false); setIsAppointmentModalOpen(true); }}>
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPrivacyModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Privacy Policy & Anonymity Guarantee</h3>
              <button className="close-btn" onClick={() => setIsPrivacyModalOpen(false)}>
                <IconlyClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                Haven KNUST is designed ground-up for complete student privacy. Peer threads use randomized SHA-256 session hashes refreshed regularly. IP logging is permanently disabled, and end-to-end encryption protects peer communications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p className="footer-disclaimer" style={{ margin: 0 }}>
            All posts are anonymous. SHA-256 protected session tokens. Ghana Data Protection Act (Act 843) audited.
          </p>

          <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button className="footer-link ferpa-badge" onClick={() => setIsFerpaModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <IconlyCheckCircle size={14} color="var(--safety-green)" />
              <span>DPA Act 843 Verified</span>
            </button>
            <button className="footer-link" onClick={() => setIsCrisisModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Crisis resources
            </button>
            <button className="footer-link" onClick={() => setIsPrivacyModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Privacy policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
