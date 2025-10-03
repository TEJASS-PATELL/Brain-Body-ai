import React, { useEffect, useState } from "react";
import "./LeftSidebar.css";
import api from "../api";
import { MessageCircle, History, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

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

  const fetchHistory = async () => {
    if (!userId) {
      setChatHistory([]);
      return;
    }
    try {
      const res = await api.get("/api/chats/history");
      const data = res.data;
      setChatHistory(data.history || []);
    } catch (err: any) {
      toast.error("Failed to load chat history: ", err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId, historyRefreshTrigger]);

  const onDeleteChat = async (sessionId: string) => {
    try {
      await api.delete(`/api/chats/${sessionId}`);
      toast.success("Chat deleted successfully");
      fetchHistory();
    } catch (err: any) {
      toast.error("Failed to delete chat:", err.response?.data?.msg || err.message);
    }
  };

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
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <strong
                      className="history"
                      onClick={() => onSelectChat(chat.session_id)}
                      style={{ cursor: "pointer", flexGrow: 1 }}
                    >
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

                    <Trash2
                      size={16}
                      color="black"
                      style={{ cursor: "pointer", marginLeft: "8px" }}
                      onClick={() => onDeleteChat(chat.session_id)}
                    />
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
