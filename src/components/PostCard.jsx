import React from 'react';
import { 
  IconlyStar, 
  IconlyClock, 
  IconlyUser, 
  IconlyHeart, 
  IconlyChat, 
  IconlyChevronRight, 
  IconlyAlert, 
  IconlyHelp, 
  IconlyCheckCircle, 
  IconlyShield 
} from './Iconly';
import { useApp } from '../context/AppContext';
import { RISK_CONFIG } from '../types';
import EmpathyBadges from './EmpathyBadges';

export default function PostCard({ post }) {
  const { handleToggleSupport, setActiveReplyPost } = useApp();
  
  const riskMeta = RISK_CONFIG[post.riskAnalysis?.riskLevel] || RISK_CONFIG.LOW;
  const counselorRepliesCount = post.replies ? post.replies.filter(r => r.isCounselor).length : 0;

  const renderRiskIcon = () => {
    switch (post.riskAnalysis?.riskLevel) {
      case 'CRISIS':
        return <IconlyAlert size={13} />;
      case 'HIGH':
        return <IconlyAlert size={13} />;
      case 'MODERATE':
        return <IconlyHelp size={13} />;
      default:
        return <IconlyCheckCircle size={13} />;
    }
  };

  return (
    <article className="post-card">
      <div className="post-card-header">
        <span className="post-timestamp">
          <IconlyClock size={13} />
          {post.timeAgo}
        </span>
      </div>

      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-card-body">{post.content}</p>

      {/* Peer Empathy Reactions Bar */}
      <EmpathyBadges postId={post.id} reactions={post.reactions} />

      <div className="post-card-footer">
        <div className="footer-left">
          <span className="anon-author">
            <IconlyUser size={14} />
            {post.author}
          </span>

          <button 
            className={`support-btn ${post.isSupported ? 'supported' : ''}`}
            onClick={(e) => handleToggleSupport(post.id, e)}
          >
            <IconlyHeart size={15} fill={post.isSupported ? 'var(--restrained-red)' : 'none'} style={{ color: post.isSupported ? 'var(--restrained-red)' : 'currentColor' }} />
            <span>{post.supportCount} supporting</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="replies-btn"
            onClick={() => setActiveReplyPost(post)}
          >
            <IconlyChat size={15} />
            <span>{post.replyCount} replies</span>
            <IconlyChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
