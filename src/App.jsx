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
import AuthModal from './components/AuthModal';
import CounselorDashboard from './components/CounselorDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ModerationHub from './components/ModerationHub';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import Toast from './components/Toast';

// Inline Tab Views
import ArticlesTab from './components/ArticlesTab';
import ResourcesTab from './components/ResourcesTab';

import { 
  Plus, 
  CheckCircle, 
  HelpCircle, 
  Calendar,
  AlertTriangle,
  X,
  BookOpen,
  BarChart3,
  Shield,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { CATEGORIES } from './types';

function MainAppContent() {
  const { 
    isAuthenticated,
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
            {/* Simplified Greeting Section (Low Cognitive Load) */}
            <div className="simplified-greeting-card">
              <div className="greeting-text-area">
                <h1>Welcome back, {userAuth?.isGuest ? 'Student' : userAuth?.displayName?.replace('Student ', '') || 'Student'}!</h1>
                <p>Confidential support portal for Kwame Nkrumah University of Science and Technology.</p>
              </div>
              <div className="greeting-session-pill">
                <span className="greeting-session-label">Session ID:</span>
                <code className="greeting-session-code">{sessionHash}</code>
                <button 
                  onClick={rotateSessionHash} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-subtle)' }}
                  title="Rotate session token hash for absolute confidentiality"
                >
                  <span className="animate-icon-refresh"><RefreshCw size={13} /></span>
                </button>
              </div>
            </div>

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
                    className="sub-nav-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{ color: 'var(--primary-teal)', fontWeight: 600 }}
                  >
                    <Plus size={16} />
                    Share Anonymously
                  </button>

                  <button 
                    className={`sub-nav-btn ${activeTab === 'my_posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my_posts')}
                  >
                    My Posts {myPostIds.length > 0 && `(${myPostIds.length})`}
                  </button>
                </div>
                <div className="sub-nav-slider-line" />
              </div>
            </div>

            {/* Inline Articles Tab */}
            {activeTab === 'articles' && <ArticlesTab />}

            {/* Inline Resources Tab */}
            {activeTab === 'resources' && <ResourcesTab />}

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
                    <HelpCircle size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>No threads found</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
                      {activeTab === 'my_posts' ? "You haven't posted any anonymous threads yet." : `No posts currently under category "${selectedCategory}".`}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} /> Share a thread anonymously
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
                >
                  <BarChart3 size={15} />
                  Campus Analytics Heatmap
                </button>
                <button 
                  className={`sub-nav-btn ${activeTab === 'moderation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('moderation')}
                >
                  <ShieldAlert size={15} />
                  Safety Shield & Moderation
                </button>
              </div>
            </div>

            {activeTab === 'analytics' ? (
              <AnalyticsDashboard />
            ) : activeTab === 'moderation' ? (
              <ModerationHub />
            ) : (
              <CounselorDashboard />
            )}
          </div>
        )}
      </main>

      {/* Modals & Floating AI Assistant Suite */}
      <AuthModal />
      <CreatePostModal />
      <ThreadModal />
      <AppointmentModal />
      <ComplianceModal />
      <ResourceLibraryModal />
      <SafetyPlanModal />
      <TelehealthRoomModal />
      <FloatingAIAssistant />

      {/* Contact Counselor & Emergency Crisis Modal */}
      {isCrisisModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCrisisModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Campus Counseling & Emergency Crisis Support</h3>
              <button className="close-btn" onClick={() => setIsCrisisModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--restrained-red-light)', border: '1px solid rgba(220, 38, 38, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--restrained-red)', fontWeight: 700, marginBottom: '4px' }}>
                  <AlertTriangle size={18} />
                  <span>Immediate Crisis Support Available 24/7</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--restrained-red-dark)', lineHeight: 1.5, margin: 0 }}>
                  If you or someone you know is in immediate distress, please connect with professional emergency resources immediately.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Campus 24/7 Emergency Helpline</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Free confidential hotline for students</p>
                  </div>
                  <a href="tel:18005550199" style={{ background: 'var(--primary-teal)', color: '#fff', padding: '8px 14px', borderRadius: '9999px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Call 1-800-555-0199
                  </a>
                </div>

                <div style={{ border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>National Crisis Text Line</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Text HOME to 741741 for 24/7 support</p>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--primary-teal)', fontSize: '0.9rem' }}>Text 741741</span>
                </div>

                <div style={{ border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Schedule 1-on-1 Counselor Session</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Telehealth or in-person appointments</p>
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
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '12px' }}>
                Haven KNUST is designed ground-up for complete student privacy. Peer threads use randomized SHA-256 session hashes (e.g., Anon#4821) refreshed regularly. IP logging is permanently disabled, and end-to-end encryption protects peer communications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-disclaimer">
            All posts are anonymous. SHA-256 protected session tokens. FERPA & HIPAA audited.
          </p>

          <div className="footer-links">
            <button className="footer-link ferpa-badge" onClick={() => setIsFerpaModalOpen(true)}>
              <CheckCircle size={14} />
              <span>FERPA Verified</span>
            </button>
            <button className="footer-link" onClick={() => setIsCrisisModalOpen(true)}>
              Crisis resources
            </button>
            <button className="footer-link" onClick={() => setIsPrivacyModalOpen(true)}>
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
