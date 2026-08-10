import React from 'react';
import { Shield, Heart, Sparkles, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EMPATHY_BADGES = [
  { id: 'resilient', Icon: Shield, label: 'Resilient', animClass: 'animate-icon-lock' },
  { id: 'hug', Icon: Heart, label: 'Warm Hug', animClass: 'animate-icon-heart' },
  { id: 'star', Icon: Sparkles, label: "You've Got This", animClass: 'animate-icon-star' },
  { id: 'coffee', Icon: Coffee, label: 'Take a Rest', animClass: 'animate-icon-user' }
];

export default function EmpathyBadges({ postId, reactions = {} }) {
  const { handleAddReaction } = useApp();

  return (
    <div className="empathy-badges-row">
      {EMPATHY_BADGES.map(b => {
        const count = reactions[b.id] || 0;
        const BadgeIcon = b.Icon;
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
            <span className={b.animClass} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <BadgeIcon size={14} />
            </span>
            <span className="empathy-badge-label">{b.label}</span>
            {count > 0 && <span className="empathy-badge-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
