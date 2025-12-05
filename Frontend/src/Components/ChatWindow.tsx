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
  const [username, setUserName] = useState<string>(() => {
    return localStorage.getItem("username") || ""; 
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if(username) return;
      try {
        const res = await api.get("/api/auth/userinfo");
        const data = res.data;
        setUserName(data.name);
        localStorage.setItem("username", data.name);
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
            Hey <strong>{localStorage.getItem("username")}</strong> Welcome to <strong>BrainBody AI</strong>
          </h2>

          <p>Your all-in-one companion for a sharper mind and stronger body.</p>
          <p>You can ask me anything related to:</p>

          <div className="badge-container">
            <span className="tag">
              <FaBrain style={{ marginRight: "6px" }} /> Mind Fitness
            </span>

            <span className="tag">
              <FaDumbbell style={{ marginRight: "6px" }} /> Workout Plans
            </span>

            <span className="tag">
              <FaAppleAlt style={{ marginRight: "6px" }} /> Healthy Nutrition
            </span>

            <span className="tag">
              <FaSmile style={{ marginRight: "6px" }} /> Stress Relief
            </span>

            <span className="tag">
              <FaBullseye style={{ marginRight: "6px" }} /> Focus Boost
            </span>

            <span className="tag">
              <FaCheckCircle style={{ marginRight: "6px" }} /> Habit Tracking
            </span>

            <span className="tag more">
              <FaPlus style={{ marginRight: "6px" }} /> Explore More
            </span>
          </div>

          <p className="intro-note">
            Just type your question — I’ll guide you with personalized, science-based suggestions.
          </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.role}-message ${msg.role === "model" ? "ai-message" : ""}`}
        >
          {msg.role === "model" && (
            <div className="icon">
              <img className="brain-aii" src="brain.png" alt="AI" />
            </div>
          )}
          <div className="message-bubble">
            {msg.role === "model" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <p style={{ whiteSpace: "pre-line", textAlign: "left" }}>{msg.text}</p>
            )}
          </div>
        </div>
      ))}

      {displayedText && (
        <div className="message model-message">
          <div className="icon">
            <img className="brain-aii" src="brain.png" alt="AI" />
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
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
