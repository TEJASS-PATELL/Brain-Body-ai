import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaBrain, FaDumbbell, FaAppleAlt, FaSmile, FaBullseye, FaCheckCircle, FaPlus } from "react-icons/fa";
import '../Pages/Chatbot.css';
import api from "../api";

interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
  displayedText: string;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, displayedText, isLoading }) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [username, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/auth/userinfo");
        const data = res.data;

        setUserName(data.name);
      } catch (err: any) {
        console.error("Failed to fetch user info:", err.response?.data?.msg || err.message);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading, displayedText]);

  return (
    <div className="chat-window" ref={chatWindowRef}>
      {messages.length === 0 && (
        <div className="chat-intro">
          <h2>
            Hi! <strong>{username}</strong> , Welcome to <strong>BrainBody</strong> AI
          </h2>
          <p>Your personal assistant for optimizing both mind and body.</p>
          <p>You can ask me about:</p>

          <div className="badge-container">
            <span className="tag"><FaBrain style={{ marginRight: '6px' }} /> Mental Fitness</span>
            <span className="tag"><FaDumbbell style={{ marginRight: '6px' }} /> Workout Routines</span>
            <span className="tag"><FaAppleAlt style={{ marginRight: '6px' }} /> Balanced Nutrition</span>
            <span className="tag"><FaSmile style={{ marginRight: '6px' }} /> Stress Management</span>
            <span className="tag"><FaBullseye style={{ marginRight: '6px' }} /> Focus & Concentration</span>
            <span className="tag"><FaCheckCircle style={{ marginRight: '6px' }} /> Habit Building</span>
            <span className="tag more"><FaPlus style={{ marginRight: '6px' }} /> More</span>
          </div>
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.role}-message ${msg.role === "model" ? "ai-message" : ""}`}
        >
          {msg.role === "model" && (
            <div className="icon">
              <img className="brain-ai" src="brain.png" alt="AI" />
            </div>
          )}
          <div className="message-bubble">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        </div>
      ))}

      {displayedText && (
        <div className="message model-message">
          <div className="icon">
            <img className="brain-ai" src="brain.png" alt="AI" />
          </div>
          <div className="message-bubble">
            <ReactMarkdown>{displayedText}</ReactMarkdown>
          </div>
        </div>
      )}

      {isLoading && !displayedText && (
        <div className="message model-message">
          <div className="message-bubble typing-indicator">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
