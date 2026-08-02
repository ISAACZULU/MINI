import React, { useState } from 'react';
import { X, Frown, Meh, Smile, Flame, BookOpen, Send, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MOOD_OPTIONS = [
  { level: 1, label: 'Struggling', icon: Frown, color: '#e11d48', bg: '#ffe4e6' },
  { level: 2, label: 'Low', icon: Frown, color: '#d97706', bg: '#fef3c7' },
  { level: 3, label: 'Okay', icon: Meh, color: '#0284c7', bg: '#e0f2fe' },
  { level: 4, label: 'Good', icon: Smile, color: '#059669', bg: '#d1fae5' },
  { level: 5, label: 'Thriving', icon: Sparkles, color: '#10b981', bg: '#ecfdf5' }
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
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="modal-title">Daily Wellness & Mood Tracker</h3>
            <span className="streak-badge" title="Daily consecutive check-in streak">
              <Flame size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{streakCount} Day Streak</span>
            </span>
          </div>
          <button className="close-btn" onClick={() => setIsMoodModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Left Column: Form */}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">How are you feeling today?</label>
              <div className="mood-faces-row">
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
                        backgroundColor: isSelected ? item.bg : 'var(--card-bg)'
                      }}
                    >
                      <Icon size={24} color={item.color} />
                      <span className="mood-face-label" style={{ color: isSelected ? item.color : 'var(--text-muted)' }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Key Influencing Factors / Triggers</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TRIGGER_TAGS.map(tag => {
                  const isSelected = selectedTriggers.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleTrigger(tag)}
                      style={{ fontSize: '0.775rem', padding: '4px 10px' }}
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
                style={{ minHeight: '80px' }}
                placeholder="What is 1 positive thing or thought you experienced today?"
                value={journalNote}
                onChange={e => setJournalNote(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">
              <Send size={15} /> Save Daily Check-In
            </button>
          </form>

          {/* Right Column: Mood Logs History */}
          <div className="mood-history-column">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} color="#0284c7" />
              <span>Recent Check-In History</span>
            </h4>

            <div className="mood-history-list">
              {moodLogs && moodLogs.length > 0 ? (
                moodLogs.map(log => {
                  const moodMeta = MOOD_OPTIONS.find(m => m.level === log.moodLevel) || MOOD_OPTIONS[3];
                  return (
                    <div key={log.id} className="mood-history-item">
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
