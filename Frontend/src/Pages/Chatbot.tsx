import React, { useEffect, useState, useMemo } from "react";
import "./Chatbot.css";
import SettingsModal from "../Components/SettingsModal";
import api from '../api';
import { useNavigate } from 'react-router-dom';
import ChatHeader from "../Components/ChatBotheader";
import ChatWindow from "../Components/ChatWindow";
import InputArea from "../Components/InputArea";

interface Message {
    role: "user" | "model";
    text: string;
}

const Chatbot: React.FC = () => {
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const [settings, setSettings] = useState({
        language: "english",
        yogaMode: false,
        replyType: "concise"
    });

    const isReadyToChat = useMemo(() => userId !== null, [userId]);

    useEffect(() => {
        const initChatbot = async () => {
            try {
                const { data } = await api.get("/api/auth/get_detail");
                setUserId(data.id || null);
                setSettings({
                    language: data.language || "english",
                    yogaMode: data.yogaMode || false,
                    replyType: data.replyType || "concise"
                });
            } catch {
                setUserId(null);
            }
        };
        initChatbot();
    }, []);

    const handleNewChat = () => {
        setMessages([]);
    };

    const typeMessage = (fullText: string) => {
        let index = 0;
        setDisplayedText("");
        const interval = setInterval(() => {
            setDisplayedText(prev => prev + fullText[index]);
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
                setMessages(prev => [...prev, { role: "model", text: fullText }]);
                setDisplayedText("");
            }
        }, 15);
    };

    const handleSendMessage = async () => {
        const text = userInput.trim();
        if (!text || isLoading || !isReadyToChat) return;

        setMessages(prev => [...prev, { role: "user", text }]);
        setUserInput("");
        setIsLoading(true);

        try {
            const { data } = await api.post("/api/chats/startChat", {
                message: text,
                ...settings 
            });
            typeMessage(data?.reply || "No response.");
        } catch {
            setMessages(prev => [...prev, { role: "model", text: "Error: Connection failed." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
            navigate("/login", { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="main-box">
                <div className="chat-box">
                    <ChatHeader
                        setShowSettingsModal={setShowSettingsModal}
                        handleNewChat={() => handleNewChat()}
                        handleLogout={handleLogout}
                    />
                    
                    <ChatWindow 
                        messages={messages} 
                        displayedText={displayedText} 
                        isLoading={isLoading} 
                    />

                    <InputArea
                        userInput={userInput}
                        setUserInput={setUserInput}
                        handleSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        isReadyToChat={isReadyToChat}
                    />
                </div>
            </div>

            {showSettingsModal && (
                <SettingsModal
                    onClose={() => setShowSettingsModal(false)}
                    onSave={(updated) => setSettings(updated)}
                    current={settings}
                />
            )}
        </div>
    );
};

export default Chatbot;

