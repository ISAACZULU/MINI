import React, { useState } from 'react';
import { X, BookOpen, Search, Bookmark, CheckCircle, Sparkles, Wind } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GUIDES_DATA = [
  {
    id: 'g-1',
    category: 'Anxiety',
    title: 'Exam Anxiety Survival Guide',
    readTime: '4 min read',
    description: 'Evidence-based cognitive grounding protocols for managing panic, racing heart, and mental blocks right before tests.',
    hasBreathingTool: true,
    steps: [
      'Perform 3 cycles of 4-7-8 box breathing before flipping your exam sheet.',
      'Reframe panic symptoms: racing heart is your body preparing energy, not failing.',
      'Sip room-temperature water and drop shoulders away from your ears.'
    ]
  },
  {
    id: 'g-2',
    category: 'Burnout',
    title: 'Burnout Recovery & Energy Management',
    readTime: '5 min read',
    description: 'A structured blueprint to transition out of emotional numbness and restore mental clarity.',
    hasBreathingTool: false,
    steps: [
      'Implement strict digital curfews 1 hour before sleep.',
      'Schedule non-negotiable 30-minute restorative breaks without screen exposure.',
      'Separate self-worth from academic productivity metrics.'
    ]
  },
  {
    id: 'g-3',
    category: 'Sleep',
    title: 'Sleep Hygiene & Insomnia Recovery Protocol',
    readTime: '3 min read',
    description: 'Proven circadian rhythm reset strategies for students dealing with late-night deadline stress.',
    hasBreathingTool: true,
    steps: [
      'Stop caffeine intake at least 6 hours before bedtime.',
      'Use progressive muscle relaxation starting from toes to jaw.',
      'If awake in bed for >20 mins, get up and read a book under warm light.'
    ]
  },
  {
    id: 'g-4',
    category: 'Academic pressure',
    title: 'Overcoming Impostor Syndrome in College',
    readTime: '4 min read',
    description: 'Deconstruct feelings of inadequacy and build resilience against toxic perfectionism.',
    hasBreathingTool: false,
    steps: [
      'Keep a "Wins Log" documenting past challenges you successfully conquered.',
      'Acknowledge that asking for help is a demonstration of strength, not weakness.',
      'Connect with peer support groups or campus mentors.'
    ]
  }
];

export default function ResourceLibraryModal() {
  const { isResourceModalOpen, setIsResourceModalOpen, setIsBreathingModalOpen, showToast } = useApp();
  const [selectedGuide, setSelectedGuide] = useState(GUIDES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState(['g-1']);

  if (!isResourceModalOpen) return null;

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(b => b !== id));
      showToast('Guide removed from bookmarks', 'info');
    } else {
      setBookmarked([...bookmarked, id]);
      showToast('Guide saved to your bookmarks!', 'success');
    }
  };

  const filteredGuides = GUIDES_DATA.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={() => setIsResourceModalOpen(false)}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
            <BookOpen size={20} />
            <h3 className="modal-title" style={{ color: 'inherit' }}>Psychoeducational Resource Library & Toolkits</h3>
          </div>
          <button className="close-btn" onClick={() => setIsResourceModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>
          {/* Left Column: Guides List & Search */}
          <div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '36px', fontSize: '0.85rem' }} 
                  placeholder="Search toolkits (e.g. Anxiety, Sleep)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="resource-guides-list">
              {filteredGuides.map(guide => {
                const isSelected = selectedGuide?.id === guide.id;
                const isSaved = bookmarked.includes(guide.id);
                return (
                  <div 
                    key={guide.id} 
                    className={`resource-guide-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '4px' }}>
                      <span className="category-badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{guide.category}</span>
                      <button onClick={(e) => toggleBookmark(guide.id, e)} title="Save guide">
                        <Bookmark size={15} fill={isSaved ? '#0284c7' : 'none'} color={isSaved ? '#0284c7' : 'var(--text-subtle)'} />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0', color: 'var(--text-main)' }}>{guide.title}</h4>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-subtle)' }}>{guide.readTime}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Guide Content */}
          {selectedGuide && (
            <div className="guide-detail-view">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="category-badge">{selectedGuide.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{selectedGuide.readTime}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                {selectedGuide.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedGuide.description}
              </p>

              {selectedGuide.hasBreathingTool && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>Interactive 4-7-8 Breathing Tool Available</span>
                  <button 
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => { setIsResourceModalOpen(false); setIsBreathingModalOpen(true); }}
                  >
                    <Wind size={14} /> Start Exercise
                  </button>
                </div>
              )}

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#059669" />
                <span>Actionable Micro-Steps</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedGuide.steps.map((step, idx) => (
                  <div key={idx} className="guide-step-box">
                    <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
