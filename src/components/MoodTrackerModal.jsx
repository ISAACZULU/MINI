import React, { useState } from 'react';
import { 
  IconlyClose, 
  IconlyFrown, 
  IconlyMeh, 
  IconlySmile, 
  IconlyFlame, 
  IconlyDocument, 
  IconlySend, 
  IconlyStar 
} from './Iconly';
import { useApp } from '../context/AppContext';

const MOOD_OPTIONS = [
  { level: 1, label: 'Struggling', icon: IconlyFrown, color: 'var(--restrained-red)', bg: 'var(--restrained-red-light)' },
  { level: 2, label: 'Low', icon: IconlyFrown, color: 'var(--alert-yellow)', bg: 'rgba(217, 119, 6, 0.05)' },
  { level: 3, label: 'Okay', icon: IconlyMeh, color: 'var(--primary-blue)', bg: 'rgba(44, 82, 130, 0.05)' },
  { level: 4, label: 'Good', icon: IconlySmile, color: 'var(--safety-green)', bg: 'var(--safety-green-light)' },
  { level: 5, label: 'Thriving', icon: IconlyStar, color: 'var(--primary-teal)', bg: 'rgba(26, 83, 92, 0.05)' }
];

const TRIGGER_TAGS = ['Exams', 'Sleep Deprivation', 'Isolation', 'Heavy Workload', 'Family Stress', 'Relationships', 'Financial'];

export default function MoodTrackerModal() {
  const { 
    isMoodModalOpen, 
    setIsMoodModalOpen, 
    moodLogs, 
    handleAddMoodLog, 
    streakCount 
  } = useApp();

  const [selectedMood, setSelectedMood] = useState(4);
  const [selectedTriggers, setSelectedTriggers] = useState(['Exams']);
  const [journalNote, setJournalNote] = useState('');

  if (!isMoodModalOpen) return null;

  const toggleTrigger = (tag) => {
    if (selectedTriggers.includes(tag)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== tag));
    } else {
      setSelectedTriggers([...selectedTriggers, tag]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleAddMoodLog(selectedMood, selectedTriggers, journalNote);
    setJournalNote('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsMoodModalOpen(false)}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '850px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 className="modal-title">Daily Wellness & Mood Tracker</h3>
            <span className="streak-badge" title="Daily consecutive check-in streak" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--pill-bg)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>
              <IconlyFlame size={14} fill="var(--alert-yellow)" style={{ color: 'var(--alert-yellow)' }} />
              <span>{streakCount} Day Streak</span>
            </span>
          </div>
          <button className="close-btn" onClick={() => setIsMoodModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Left Column: Form */}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">How are you feeling today?</label>
              <div className="mood-faces-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {MOOD_OPTIONS.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedMood === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      className={`mood-face-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedMood(item.level)}
                      style={{
                        borderColor: isSelected ? item.color : 'var(--border-color)',
                        backgroundColor: isSelected ? item.bg : 'var(--card-bg)',
                        flex: '1 1 80px',
                        padding: '10px 4px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Icon size={24} color={item.color} />
                      <span className="mood-face-label" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isSelected ? item.color : 'var(--text-muted)' }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Key Influencing Factors / Triggers</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {TRIGGER_TAGS.map(tag => {
                  const isSelected = selectedTriggers.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleTrigger(tag)}
                      style={{ fontSize: '0.775rem', padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', background: isSelected ? 'var(--primary-teal)' : 'var(--pill-bg)', color: isSelected ? '#ffffff' : 'var(--text-main)' }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Gratitude or Reflection Journal</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '80px', width: '100%' }}
                placeholder="What is 1 positive thing or thought you experienced today?"
                value={journalNote}
                onChange={e => setJournalNote(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <IconlySend size={15} />
              <span>Save Daily Check-In</span>
            </button>
          </form>

          {/* Right Column: Mood Logs History */}
          <div className="mood-history-column" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconlyDocument size={16} color="var(--primary-blue)" />
              <span>Recent Check-In History</span>
            </h4>

            <div className="mood-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
              {moodLogs && moodLogs.length > 0 ? (
                moodLogs.map(log => {
                  const moodMeta = MOOD_OPTIONS.find(m => m.level === log.moodLevel) || MOOD_OPTIONS[3];
                  return (
                    <div key={log.id} className="mood-history-item" style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: moodMeta.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ● {moodMeta.label} ({log.moodLevel}/5)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{log.date}</span>
                      </div>
                      {log.triggers && log.triggers.length > 0 && (
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: '2px 0' }}>
                          Triggers: {log.triggers.join(', ')}
                        </p>
                      )}
                      {log.note && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                          "{log.note}"
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>No mood entries logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
