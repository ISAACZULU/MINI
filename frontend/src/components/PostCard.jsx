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
  IconlyShield,
  IconlyEdit,
  IconlyClose
} from './Iconly';
import { useApp } from '../context/AppContext';
import { RISK_CONFIG } from '../types';
import EmpathyBadges from './EmpathyBadges';

export default function PostCard({ post }) {
  const { handleToggleSupport, setActiveReplyPost, handleEditPost, sessionHash } = useApp();
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftContent, setDraftContent] = React.useState(post.content);

  const riskMeta = RISK_CONFIG[post.riskAnalysis?.riskLevel] || RISK_CONFIG.LOW;
  const counselorRepliesCount = post.replies ? post.replies.filter(r => r.isCounselor).length : 0;

  const canEdit = post.author === sessionHash && post.createdAt && Date.now() - post.createdAt <= 5 * 60 * 1000;

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

  const handleSaveEdit = () => {
    const firstLine = draftContent.trim().split('\n')[0];
    const generatedTitle = firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
    handleEditPost(post.id, generatedTitle, draftContent);
    setIsEditing(false);
  };

  return (
    <article className="post-card">
      <div className="post-card-header" style={{ justifyContent: 'space-between' }}>
        <span className="post-timestamp">
          <IconlyClock size={13} />
          {post.timeAgo}
        </span>

        {canEdit && !isEditing && (
          <button
            className="replies-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            <IconlyEdit size={14} />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            rows={5}
            style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '10px 12px', background: 'var(--card-bg)', color: 'var(--text-main)', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button className="sub-nav-btn" onClick={() => setIsEditing(false)} style={{ background: 'var(--pill-bg)', width: 'auto', padding: '8px 12px' }}>
              <IconlyClose size={14} />
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveEdit} style={{ width: 'auto', padding: '8px 14px', height: 'auto' }}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="post-card-body">{post.content}</p>
        </>
      )}

      {/* Peer Empathy Reactions Bar */}
      {!isEditing && <EmpathyBadges postId={post.id} reactions={post.reactions} />}

      {!isEditing && (
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
      )}
    </article>
  );
}
