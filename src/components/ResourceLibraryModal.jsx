import React, { useState } from 'react';
import { 
  IconlyClose, 
  IconlyDocument, 
  IconlySearch, 
  IconlyBookmark, 
  IconlyCheckCircle, 
  IconlyStar, 
  IconlyWind 
} from './Iconly';
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

  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return <span>{text}</span>;
    const cleanHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${cleanHighlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} style={{ backgroundColor: 'var(--alert-yellow-light)', color: 'var(--alert-yellow-dark)', padding: '0 2px', borderRadius: '2px', fontWeight: 'bold' }}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

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
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '800px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
            <IconlyDocument size={20} />
            <h3 className="modal-title" style={{ color: 'inherit' }}>Psychoeducational Resource Library</h3>
          </div>
          <button className="close-btn" onClick={() => setIsResourceModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Left Column: Guides List & Search */}
          <div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <IconlySearch size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%' }} 
                  placeholder="Search toolkits (e.g. Anxiety, Sleep)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="resource-guides-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
              {filteredGuides.map(guide => {
                const isSelected = selectedGuide?.id === guide.id;
                const isSaved = bookmarked.includes(guide.id);
                return (
                  <div 
                    key={guide.id} 
                    className={`resource-guide-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedGuide(guide)}
                    style={{ background: isSelected ? 'rgba(44, 82, 130, 0.05)' : 'var(--card-bg)', border: isSelected ? '1px solid var(--primary-blue)' : '1px solid var(--border-color)', borderRadius: '10px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="category-badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{highlightText(guide.category, searchQuery)}</span>
                      <button onClick={(e) => toggleBookmark(guide.id, e)} title="Save guide" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <IconlyBookmark size={15} fill={isSaved ? 'var(--primary-blue)' : 'none'} color={isSaved ? 'var(--primary-blue)' : 'var(--text-subtle)'} />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '4px 0', color: 'var(--text-main)' }}>{highlightText(guide.title, searchQuery)}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{guide.readTime}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Guide Content */}
          {selectedGuide && (
            <div className="guide-detail-view" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="category-badge">{highlightText(selectedGuide.category, searchQuery)}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{selectedGuide.readTime}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                {highlightText(selectedGuide.title, searchQuery)}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '20px' }}>
                {highlightText(selectedGuide.description, searchQuery)}
              </p>

              {selectedGuide.hasBreathingTool && (
                <div style={{ background: 'var(--safety-green-light)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--safety-green-dark)', fontWeight: 600 }}>Interactive 4-7-8 Breathing Tool Available</span>
                  <button 
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem', height: 'auto' }}
                    onClick={() => { setIsResourceModalOpen(false); setIsBreathingModalOpen(true); }}
                  >
                    <IconlyWind size={14} /> 
                    <span>Start Exercise</span>
                  </button>
                </div>
              )}

              <h4 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconlyStar size={16} color="var(--safety-green)" />
                <span>Actionable Micro-Steps</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedGuide.steps.map((step, idx) => (
                  <div key={idx} className="guide-step-box" style={{ display: 'flex', gap: '8px', background: 'var(--pill-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <IconlyCheckCircle size={16} color="var(--safety-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45 }}>{step}</span>
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
