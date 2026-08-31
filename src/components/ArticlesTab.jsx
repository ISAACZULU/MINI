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
        <div className="section-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <IconlyStar size={20} color="var(--primary-teal)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Daily Encouragements & Goodwill</h2>
        </div>

        <div className="goodwill-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {GOODWILL_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className="goodwill-card"
              style={{
                background: msg.color,
                border: '1px solid rgba(148, 163, 184, 0.14)',
                padding: '20px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px'
              }}
            >
              <p style={{
                fontSize: '0.925rem',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '16px',
                marginTop: 0
              }}>
                "{msg.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: msg.textColor,
                  color: '#fff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)'
                }}>
                  <IconlyUser size={14} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{msg.author}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Counselor Articles Feed */}
      <section className="counselor-articles-section">
        <div className="section-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span className="category-badge" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{art.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconlyClock size={12} /> {art.readTime}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)', lineHeight: 1.4 }}>{art.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>{art.summary}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Written by:</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-teal)', fontWeight: 700 }}>{art.author}</span>
                </div>
              </div>
              <div className="article-read-cta" aria-hidden="true">
                <IconlyChevronRight size={20} color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Article Reader Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div
            className="article-modal-shell"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,249,252,0.98))',
              borderRadius: '22px',
              width: '90%',
              maxWidth: '760px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 28px 80px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}
          >
            <div className="article-reader-header" style={{
              padding: '20px 32px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              flexShrink: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(248,249,252,0.5))'
            }}>
              <div>
                <span className="category-badge" style={{ marginBottom: '10px', display: 'inline-block' }}>
                  {selectedArticle.category}
                </span>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  margin: '0 0 10px 0',
                  color: 'var(--text-main)',
                  lineHeight: 1.2,
                }}>
                  {selectedArticle.title}
                </h2>
                <div className="article-reader-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-teal), var(--primary-blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow: '0 10px 22px rgba(50, 121, 249, 0.2)'
                  }}>
                    {selectedArticle.author.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedArticle.author}</strong>
                    {' '}·{' '}{selectedArticle.readTime}
                  </span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedArticle(null)} style={{ flexShrink: 0, marginTop: '4px' }}>
                <IconlyClose size={22} />
              </button>
            </div>

            <div className="article-reader-body" style={{
              overflowY: 'auto',
              padding: '32px',
              flex: 1,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(240,244,255,0.22))'
            }}>
              <ArticleRenderer content={selectedArticle.content} />
            </div>

            <div style={{
              padding: '16px 32px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
              flexShrink: 0,
              background: 'rgba(255,255,255,0.8)'
            }}>
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

/* ── Beautiful Markdown-like Article Renderer ── */
function renderInline(text) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700, color: 'var(--text-main)' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function ArticleRenderer({ content }) {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ### Section Header
    if (line.startsWith('###')) {
      const headerText = line.replace(/^###\s*/, '');
      elements.push(
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '32px 0 14px 0',
        }}>
          <div style={{
            width: '4px',
            height: '22px',
            background: 'linear-gradient(180deg, var(--primary-teal), var(--primary-blue))',
            borderRadius: '2px',
            flexShrink: 0,
          }} />
          <h3 style={{
            margin: 0,
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            letterSpacing: '-0.01em',
          }}>
            {headerText}
          </h3>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list item: 1. text
    if (/^\d+\.\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i]);
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 0, margin: '12px 0 20px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {listItems.map((item, idx) => {
            const text = item.replace(/^\d+\.\s*/, '');
            const num = idx + 1;
            return (
              <li key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{
                  minWidth: '26px',
                  height: '26px',
                  background: 'linear-gradient(135deg, var(--primary-teal), var(--primary-blue))',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  {num}
                </span>
                <span style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-main)' }}>
                  {renderInline(text)}
                </span>
              </li>
            );
          })}
        </ol>
      );
      continue;
    }

    // Bullet list item: - text
    if (line.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i]);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 0, margin: '12px 0 20px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {listItems.map((item, idx) => {
            const text = item.replace(/^-\s*/, '');
            return (
              <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  minWidth: '8px',
                  height: '8px',
                  background: 'var(--primary-teal)',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '8px',
                }} />
                <span style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-main)' }}>
                  {renderInline(text)}
                </span>
              </li>
            );
          })}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{
        fontSize: '1.0625rem',
        lineHeight: 1.8,
        color: 'var(--text-main)',
        margin: '0 0 18px 0',
      }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}
