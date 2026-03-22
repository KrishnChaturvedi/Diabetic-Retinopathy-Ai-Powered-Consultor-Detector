import React, { useState } from 'react';
import ChatBot from './ChatBot';
import './ChatFAB.css';

export default function ChatFAB({ pending, onUsed }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-fab-wrapper">
      {/* Chat Window — appears above FAB */}
      {open && (
        <div className="chat-popup">
          <ChatBot pending={pending} onUsed={onUsed} />
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chat-fab-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Eye Health Assistant"
      >
        <span className="fab-icon">{open ? '✕' : '💬'}</span>
        {!open && <span className="fab-badge">AI</span>}
      </button>
    </div>
  );
}
