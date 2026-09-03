import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IconlyChat, IconlySend, IconlyUser } from './Iconly';

export default function InboxTab() {
  const { directChats, role, userAuth, sessionHash, handleSendDirectMessage, selectedChatCounselor, setSelectedChatCounselor } = useApp();
  const [typedMessage, setTypedMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const isCounselor = role === 'counselor';

  // Filter chats securely based on user role
  const myChats = directChats.filter(chat => {
    if (!chat || !chat.counselorName) return false;
    if (isCounselor) {
      const email = userAuth?.email?.toLowerCase() || '';
      const name = userAuth?.displayName?.toLowerCase() || '';
      const cName = (chat.counselorName || '').toLowerCase();

      if (email.includes('jenkins') || name.includes('jenkins')) {
        return cName.includes('jenkins');
      }
      if (email.includes('peterson') || name.includes('peterson')) {
        return cName.includes('peterson');
      }
      if (email.includes('rivera') || name.includes('rivera')) {
        return cName.includes('rivera');
      }
      const lastName = name.split(' ')[1]?.toLowerCase() || '';
      if (lastName && cName.includes(lastName)) {
        return true;
      }
      return cName.includes('jenkins');
    } else {
      return chat.studentAlias === userAuth?.email || chat.studentAlias === sessionHash;
    }
  });

  const activeChat = myChats.find(c => c.id === activeChatId);

  // Set default active chat or react to selectedChatCounselor from modal routing
  useEffect(() => {
    if (selectedChatCounselor) {
      const match = myChats.find(c => c.counselorName === selectedChatCounselor);
      if (match) {
        setActiveChatId(match.id);
      }
      setSelectedChatCounselor(null); // Clear modal routing focus state after selection
    } else if (!activeChatId && myChats.length > 0) {
      setActiveChatId(myChats[0].id);
    }
  }, [selectedChatCounselor, myChats, activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages?.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    // Send message (explicitly forwarding studentAlias so the counselor replies to the correct student stream)
    handleSendDirectMessage(
      activeChat.counselorName,
      typedMessage.trim(),
      false,
      activeChat.studentAlias
    );
    setTypedMessage('');
  };

  const getChatLabel = (chat) => {
    if (!chat) return { title: 'Unknown', sub: '' };
    if (isCounselor) {
      // For counselor: Show student alias as primary heading
      const sAlias = chat.studentAlias || 'Unknown Student';
      const cleanAlias = sAlias.includes('@')
        ? `Student (${sAlias.split('@')[0]})`
        : `Anon Student (${sAlias.slice(0, 9)})`;
      return {
        title: cleanAlias,
        sub: (chat.counselorName || '').split(',')[0]
      };
    } else {
      // For student: Show counselor name as primary heading
      const cName = chat.counselorName || 'Campus Counselor';
      return {
        title: cName.split(' (')[0],
        sub: cName.split('(')[1]?.replace(')', '') || 'Campus Counselor'
      };
    }
  };

  return (
    <div className="inbox-tab-view animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: 'calc(100vh - 220px)', minHeight: '520px', background: 'var(--bg-canvas)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>

      {/* Left sidebar: Conversations list */}
      <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--card-bg)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconlyChat size={18} color="var(--primary-teal)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {isCounselor ? 'Student Contacts' : 'Your Conversations'}
          </h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {myChats.length === 0 ? (
            <p style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', textAlign: 'center', marginTop: '24px', fontStyle: 'italic', lineHeight: 1.5, padding: '0 8px' }}>
              {isCounselor
                ? 'No active student inquiries in your message queue.'
                : 'No chats active. Select a counselor from the booking menu and choose "Direct Message" to start a chat.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myChats.map((chat) => {
                const isSelected = chat.id === activeChatId;
                const lastMsg = chat.messages[chat.messages.length - 1];
                const labels = getChatLabel(chat);
                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isSelected ? 'var(--pill-bg)' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ background: isSelected ? 'var(--primary-teal)' : 'var(--border-color)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconlyUser size={16} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 3px 0', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {labels.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {lastMsg ? lastMsg.text : 'No messages yet'}
                        </span>
                        {isCounselor && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-subtle)', flexShrink: 0 }}>
                            {labels.sub}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Active chat conversation */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--card-bg)' }}>
        {activeChat ? (
          <>
            {/* Active chat header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--primary-teal)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconlyUser size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  {getChatLabel(activeChat).title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {getChatLabel(activeChat).sub}
                </span>
              </div>
            </div>

            {/* Scrollable messages list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-canvas)' }}>
              {activeChat.messages.map((msg) => {
                // If counselor: messages sent by 'counselor' are mine (on the right).
                // If student: messages sent by 'student' are mine (on the right).
                const isMyMessage = isCounselor ? msg.sender === 'counselor' : msg.sender === 'student';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: isMyMessage ? 'var(--primary-teal)' : 'var(--card-bg)',
                        color: isMyMessage ? '#ffffff' : 'var(--text-main)',
                        border: isMyMessage ? 'none' : '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      <p style={{ margin: 0, wordBreak: 'break-word' }}>{msg.text}</p>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: isMyMessage ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input bar */}
            <form onSubmit={handleSend} style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={isCounselor ? "Reply to student inquiry..." : "Type message to counselor..."}
                value={typedMessage}
                onChange={e => setTypedMessage(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--primary-teal)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)',
                  transition: 'transform 0.2s'
                }}
                title="Send Message"
              >
                <IconlySend size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
            <div style={{ background: 'var(--pill-bg)', color: 'var(--primary-teal)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <IconlyChat size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-main)' }}>Your Conversation Hub</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '340px', margin: 0, lineHeight: 1.5 }}>
              {isCounselor
                ? 'Select an active student message thread from the left menu to coordinate support.'
                : 'Select an active counselor thread from the left menu to start discussing your support and safety goals.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
