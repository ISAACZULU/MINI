import React from 'react';
import { 
  Sparkles, 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  ChevronRight, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
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
        return <AlertTriangle size={13} />;
      case 'HIGH':
        return <AlertCircle size={13} />;
      case 'MODERATE':
        return <HelpCircle size={13} />;
      default:
        return <CheckCircle size={13} />;
    }
  };

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="category-badge">
            <Sparkles size={13} />
            {post.tag}
          </span>

          <span 
            className={`risk-badge ${riskMeta.badgeClass}`}
            title={`AI Risk Analysis Score: ${post.riskAnalysis?.score || 15}/100`}
          >
            {renderRiskIcon()}
            <span>{riskMeta.label}</span>
          </span>
        </div>

        <span className="post-timestamp">
          <Clock size={13} />
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
            <User size={14} />
            {post.author}
          </span>

          <button 
            className={`support-btn ${post.isSupported ? 'supported' : ''}`}
            onClick={(e) => handleToggleSupport(post.id, e)}
          >
            <Heart size={15} fill={post.isSupported ? '#f43f5e' : 'none'} />
            <span>{post.supportCount} supporting</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {counselorRepliesCount > 0 && (
            <span className="counselor-reply-pill">
              <ShieldCheck size={13} />
              {counselorRepliesCount} Counselor Response
            </span>
          )}

          <button 
            className="replies-btn"
            onClick={() => setActiveReplyPost(post)}
          >
            <MessageCircle size={15} />
            <span>{post.replyCount} replies</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
