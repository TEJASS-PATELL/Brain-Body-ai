import React, { useEffect, useState } from "react";
import "./LeftSidebar.css";
import api from "../api";
import { MessageCircle, History } from "lucide-react";
import toast from 'react-hot-toast';

interface ChatSession {
  session_id: string;
  started_at?: string;
}

interface LeftSidebarProps {
  userId: string | null;
  handleNewChat: () => void;
  onSelectChat: (sessionId: string) => void;
  selectedSessionId: string | null;
  historyRefreshTrigger: number;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  userId,
  handleNewChat,
  onSelectChat,
  selectedSessionId,
  historyRefreshTrigger,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  const toggleHistory = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (!userId) {
      setChatHistory([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/chats/history");
        const data = res.data;

        setChatHistory(data.history || []);
      } catch (err: any) {
        console.error("Failed to load chat history:", err.response?.data?.msg || err.message);
        toast.error("Chat history load nahi ho payi.");
      }
    };

    fetchHistory();
  }, [userId, historyRefreshTrigger]);

  return (
    <div className={`left-bar ${isExpanded ? "expanded" : ""}`}>
      <div className="top-buttons">
        <div className="circle-button" onClick={handleNewChat} title="New Chat">
          <MessageCircle className="messagecircle" />
        </div>
        <div className="square-buttons">
          <button onClick={toggleHistory} title="History">
            <History size={22} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="history-panel">
          <h4>Chat History</h4>
          <ul>
            {chatHistory.length === 0 ? (
              <li style={{ fontStyle: "italic", color: "#888" }}>No chats yet</li>
            ) : (
              chatHistory.map((chat) => {
                const formattedDate = chat.started_at
                  ? new Date(chat.started_at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                  : "Unknown time";
                return (
                  <li
                    key={chat.session_id}
                    className={chat.session_id === selectedSessionId ? "selected" : ""}
                    onClick={() => onSelectChat(chat.session_id)}
                  >
                    <strong className="history">
                      {chat.session_id.slice(0, 8)}
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginLeft: "4px",
                          fontWeight: "400",
                        }}
                      >
                        {formattedDate}
                      </span>
                    </strong>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
