import React, { useState, useEffect, useRef } from 'react';
import { getBotReply, QUICK_QUESTIONS } from '../utils/chatKB';
import './ChatBot.css';

export default function ChatBot({ pending, onUsed }) {
  const [msgs, setMsgs]     = useState([{ from: 'bot', text: 'Hi! I am your eye health assistant 👁 Ask me anything about diabetic retinopathy, symptoms, or how the AI screening works.' }]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (pending) {
      sendMessage(pending);
      onUsed();
    }
  }, [pending]); // eslint-disable-line

  async function sendMessage(text) {
    const txt = (text || input).trim();
    if (!txt) return;
    setInput('');
    setMsgs((m) => [...m, { from: 'user', text: txt }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    setTyping(false);
    setMsgs((m) => [...m, { from: 'bot', text: getBotReply(txt) }]);
  }

  return (
    <div className="chatbot-box">
      {/* Header */}
      <div className="chatbot-hdr">
        <div className="chatbot-hdr-info">
          <div className="online-dot" />
          Eye Health Assistant
        </div>
        <span className="chatbot-sub">👁 DR Assistant</span>
      </div>

      {/* Messages */}
      <div className="chatbot-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`cmsg ${m.from}`}>
            {m.from === 'bot' && <div className="m-av">👁</div>}
            <div className="m-bub">{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="cmsg bot">
            <div className="m-av">👁</div>
            <div className="m-bub">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Questions */}
      <div className="chatbot-quick">
        {QUICK_QUESTIONS.map((q) => (
          <button key={q} className="qbtn" onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="chatbot-inp-row">
        <input
          className="chatbot-inp"
          placeholder="Ask about symptoms, treatment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="chatbot-send" onClick={() => sendMessage()}>→</button>
      </div>
    </div>
  );
}
