import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser, FaTrashAlt, FaShareAlt, FaPaperPlane, FaHeartbeat } from 'react-icons/fa';
import './DemoChat.css';
import { FaBrain, FaDumbbell, FaAppleAlt, FaSmile, FaClock } from "react-icons/fa";


type Sender = 'ai' | 'user';

interface Message {
  sender: Sender;
  text: string;
}

const features = [
  { name: 'Mental fitness', icon: <FaBrain /> },
  { name: 'Workout routines', icon: <FaDumbbell /> },
  { name: 'Nutrition', icon: <FaAppleAlt /> },
  { name: 'Heart Health', icon: <FaHeartbeat /> },
  { name: 'Stress management', icon: <FaSmile /> },
  { name: 'Daily productivity', icon: <FaClock /> },
];

const suggestionsList = [
  'I need a quick brain exercise',
  'What’s a quick beginner workout?',
  'What are some tips to sharpen my focus?',
  'Foods that boost brain power'
];

const welcomeMessage: Message = {
  sender: 'ai',
  text: "Hello! I'm your BrainBody AI coach. How can I help you train your brain and body today?"
};

const DemoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const aiReply: Message = { sender: 'ai', text: generateResponse(messageText) };
      setTyping(false);
      setMessages(prev => [...prev, aiReply]);
    }, 2000);
  };

  const generateResponse = (msg: string): string => {
    const message = msg.toLowerCase();
    if (message.includes('brain exercise')) {
      return "Here's a quick brain exercise: Try counting backward from 100 by 7s... Login for full access.";
    } else if (message.includes('workout')) {
      return `Here’s a quick beginner workout:\n\n
            Bodyweight Squats – Do 3 sets of 10 reps.\n\n
            It’s simple, strengthens your legs, and builds a strong foundation. `;
    } else if (message.includes('focus')) {
      return "Try the Pomodoro Technique for better focus.";
    } else if (message.includes('food') || message.includes('nutrition')) { 
      return "Foods like blueberries, walnuts, turmeric, and leafy greens boost brain power.";
    } else if (message.includes('hello') || message.includes('hi')) {
      return "Hello! What would you like to work on today?";
    } else if (message.includes('stress') || message.includes('anxiety')) {
      return "Try deep breathing, meditation, and regular physical activity.";
    } else if (message.includes('sleep')) {
      return "Keep a sleep routine and avoid screens before bed.";
    } else if (message.includes('memory')) {
      return "Try memory games, get good sleep, and reduce stress.";
    } else {
      return "You’re currently viewing the demo version. To unlock full access, please log in — it’s free!"
    }
  };

  const clearMessages = () => {
    setMessages([welcomeMessage]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <FaRobot className="icon11" />
          <div>
            <div className="titlee">BrainBody Coach</div>
          </div>
        </div>
        <div className="header-right">
          <button title="Clear conversation" onClick={clearMessages}><FaTrashAlt /></button>
          <button title="Share conversation"><FaShareAlt /></button>
        </div>
      </div>

      <div className="chat-messages">
        <div className="welcome-message">
          <h2>Welcome to <strong>BrainBody AI</strong> !!</h2>
          <p>I'm your personal brain and body training assistant.</p>
          <p>Ask me about:</p>
          <div className="ai-features-grid">
            {features.map((item, idx) => (
              <div key={idx} className="ai-feature row">
                <div className="check-icon">{item.icon}</div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`messagee ${msg.sender === 'user' ? 'user-messagee' : 'ai-messagee'}`}>
            <div className={`message-avatar ${msg.sender === 'user' ? 'user-avatarr' : 'ai-avatarr'}`}>
              {msg.sender === 'user' ? <FaUser className='user-icon' /> : <FaRobot className='ai-icon' />}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{currentTime}</div>
            </div>
          </div>
        ))}

        {typing && <div className="typing">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="suggestions">
        {suggestionsList.map((sugg, idx) => (
          <button key={idx} className="suggestion-btn" onClick={() => sendMessage(sugg)}>{sugg}</button>
        ))}
      </div>

      <div className="input-row">
        <textarea
          className="input-box"
          rows={1}
          placeholder="Type your message here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button className="send" onClick={() => sendMessage()}><FaPaperPlane /></button>
      </div>
    </div>
  );
};

export default DemoChat;
