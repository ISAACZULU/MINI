import React, { useState } from 'react';
import { 
  IconlyDocument, 
  IconlyHeart, 
  IconlyStar, 
  IconlyUser, 
  IconlyCalendar, 
  IconlyClock, 
  IconlyClose, 
  IconlyChevronRight 
} from './Iconly';

const GOODWILL_MESSAGES = [
  {
    id: 'gw-1',
    text: "You are doing your absolute best, and that is enough. Take a deep breath and take things one step at a time today.",
    author: "Counselor Sarah, LCSW",
    role: "Lead Campus Therapist",
    color: "rgba(20, 184, 166, 0.08)",
    textColor: "#0d9488"
  },
  {
    id: 'gw-2',
    text: "Your academic results do not define your human worth. Rest is not a reward; it is a fundamental need.",
    author: "Dr. Sarah Jenkins",
    role: "Mental Health Director",
    color: "rgba(99, 102, 241, 0.08)",
    textColor: "#4f46e5"
  },
  {
    id: 'gw-3',
    text: "Sending strength and calm to everyone studying late tonight. Your health and peace are what matter most.",
    author: "Campus Peer Care Team",
    role: "Wellness Volunteers",
    color: "rgba(245, 158, 11, 0.08)",
    textColor: "#d97706"
  }
];

const ARTICLES_DATA = [
  {
    id: 'art-1',
    title: "Navigating Academic Burnout at KNUST",
    author: "Dr. Sarah Jenkins, LCSW",
    category: "Burnout",
    readTime: "4 min read",
    summary: "Recognize the subtle difference between high stress and clinical burnout, and learn how to implement boundary systems to protect your energy.",
    content: `
      Academic burnout is more than just feeling tired after a long week. It is a state of physical, emotional, and mental exhaustion caused by prolonged stress. For students at KNUST, the pressure of maintaining academic excellence can make burnout feel inevitable—but it doesn't have to be.

      ### Signs of Academic Burnout
      - **Anhedonia**: Loss of interest in subjects or hobbies you once enjoyed.
      - **Cognitive fatigue**: Difficulty focusing, studying, or remembering facts.
      - **Physical symptoms**: Persistent headaches, body tension, or sleep disturbances.

      ### Actionable Recovery Steps
      1. **Establish Strict Study Curfews**: Designate a specific hour (e.g., 8:00 PM) after which all academic tasks cease.
      2. **Micro-breaks (The 50/10 Rule)**: Study intensely for 50 minutes, then stand up, walk, and stretch for 10 minutes without looking at a screen.
      3. **Separate Identity from GPA**: Remind yourself daily that your value as a person is not bound to a grade sheet.
    `
  },
  {
    id: 'art-2',
    title: "Exam Anxiety Survival Protocol",
    author: "Counselor Mark, PsyD",
    category: "Anxiety",
    readTime: "3 min read",
    summary: "A practical guide to handling panic attacks, racing heart, and mind-blanking during midterm season.",
    content: `
      Exam anxiety is a physiological response to stress. Your sympathetic nervous system prepares you for a threat, causing a racing heart, shallow breathing, and racing thoughts. Here is a professional protocol to calm your nervous system right before or during an exam.

      ### The Grounding Protocol
      - **Double Inhales (The Physiological Sigh)**: Take two quick deep breaths through your nose, then blow it out slowly through your mouth. Repeat 3 times to quickly lower heart rate.
      - **Acknowledge and Reframe**: Tell yourself, "My racing heart is not panic; it is my body generating energy and oxygen to help me focus."
      - **Physical Grounding**: Feel your feet flat on the floor and your back against the chair. Notice the weight of the pen in your hand to pull yourself out of spiraling thoughts.
    `
  },
  {
    id: 'art-3',
    title: "Insomnia & Sleep Circadian Resets",
    author: "Dr. Elizabeth Owusu, PhD",
    category: "Sleep",
    readTime: "5 min read",
    summary: "Proven circadian rhythm optimization strategies for students dealing with late-night study pressures.",
    content: `
      A healthy sleep pattern is the single most powerful cognitive enhancer available. Yet, university schedules often lead to chronic sleep deprivation, which dramatically worsens anxiety and depression. Let's explore how to optimize your circadian clock.

      ### Sleep Hygiene Best Practices
      - **Blue Light Blocking**: Avoid smartphone and laptop screens at least 45 minutes before trying to sleep, or use strong blue-light filters.
      - **The 20-Minute Rule**: If you cannot fall asleep after 20 minutes in bed, get out of bed. Sit in a dim room and read a physical book until you feel drowsy. Do not associate your bed with frustration.
      - **Morning Sunlight**: Get 10 minutes of direct outdoor light into your eyes as soon as possible after waking up to set your melatonin release timer for the night.
    `
  }
];

export default function ArticlesTab() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="articles-tab-view animate-fade-in">
      {/* Goodwill Board */}
      <section className="goodwill-section" style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <IconlyStar size={20} color="var(--primary-teal)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Daily Encouragements & Goodwill</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {GOODWILL_MESSAGES.map((msg) => (
            <div 
              key={msg.id} 
              className="goodwill-card" 
              style={{ 
                background: msg.color, 
                border: 'none',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <p style={{ 
                fontSize: '0.925rem', 
                color: 'var(--text-main)', 
                lineHeight: 1.5, 
                fontStyle: 'italic',
                marginBottom: '16px',
                marginTop: 0 
              }}>
                "{msg.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  background: msg.textColor, 
                  color: '#fff', 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <IconlyUser size={14} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{msg.author}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Counselor Articles Feed */}
      <section className="counselor-articles-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <IconlyDocument size={20} color="var(--primary-teal)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Psychoeducational Articles from Counselors</h2>
        </div>

        <div className="articles-grid">
          {ARTICLES_DATA.map((art) => (
            <div 
              key={art.id} 
              className="article-row-card" 
              onClick={() => setSelectedArticle(art)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="category-badge" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{art.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconlyClock size={12} /> {art.readTime}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>{art.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{art.summary}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Written by:</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}>{art.author}</span>
                </div>
              </div>
              <IconlyChevronRight size={20} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Article Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-card modal-large" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="category-badge" style={{ marginBottom: '6px', display: 'inline-block' }}>{selectedArticle.category}</span>
                <h3 className="modal-title" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedArticle.title}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  By {selectedArticle.author} • {selectedArticle.readTime}
                </p>
              </div>
              <button className="close-btn" onClick={() => setSelectedArticle(null)}>
                <IconlyClose size={22} />
              </button>
            </div>
            
            <div className="modal-body article-modal-body" style={{ padding: '24px 0', fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-main)' }}>
              {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                
                // Render headers nicely
                if (trimmed.startsWith('###')) {
                  return (
                    <h4 
                      key={index} 
                      style={{ 
                        fontSize: '1.15rem', 
                        fontWeight: 700, 
                        marginTop: '20px', 
                        marginBottom: '8px',
                        color: 'var(--text-main)' 
                      }}
                    >
                      {trimmed.replace('###', '').trim()}
                    </h4>
                  );
                }
                
                // Render bullet lists nicely
                if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
                  const items = trimmed.split('\n');
                  return (
                    <ul key={index} style={{ paddingLeft: '20px', margin: '12px 0' }}>
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} style={{ marginBottom: '6px' }}>
                          {item.replace(/^-\s*|^\d+\.\s*/, '').trim()}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return <p key={index} style={{ marginBottom: '16px' }}>{trimmed}</p>;
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setSelectedArticle(null)}>
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
