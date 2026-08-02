import React from 'react';
import { useApp } from '../context/AppContext';

export const EMPATHY_BADGES = [
  { id: 'resilient', emoji: '💛', label: 'Resilient' },
  { id: 'hug', emoji: '🫂', label: 'Warm Hug' },
  { id: 'star', emoji: '🌟', label: "You've Got This" },
  { id: 'coffee', emoji: '☕', label: 'Take a Rest' }
];

export default function EmpathyBadges({ postId, reactions = {} }) {
  const { handleAddReaction } = useApp();

  return (
    <div className="empathy-badges-row">
      {EMPATHY_BADGES.map(b => {
        const count = reactions[b.id] || 0;
        return (
          <button
            key={b.id}
            type="button"
            className={`empathy-badge-btn ${count > 0 ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddReaction(postId, b.id);
            }}
            title={`Send "${b.label}" encouragement`}
          >
            <span>{b.emoji}</span>
            <span className="empathy-badge-label">{b.label}</span>
            {count > 0 && <span className="empathy-badge-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
