import React, { useEffect, useRef, useState, useMemo } from "react";
import "./Chatbot.css";
import LeftSidebar from "../Components/LeftSidebar";
import RightSidebar from "../Components/RightSidebar";
import SettingsModal from "../Components/SettingsModal";
import BMIPopup from "../Components/BMI";
import api from '../api';
import { useNavigate } from 'react-router-dom';
import ChatHeader from "../Components/ChatBotheader";
import ChatWindow from "../Components/ChatWindow";
import InputArea from "../Components/InputArea";

interface Message {
    role: "user" | "model";
    text: string;
}

interface CustomWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}
declare const window: CustomWindow;

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [yogaMode, setYogaMode] = useState<boolean>(false);
    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [displayedText, setDisplayedText] = useState<string>("");
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [language, setLanguage] = useState<string>("english");
    const [showBMIPopup, setShowBMIPopup] = useState(false);
    const navigate = useNavigate();
    const [level, setLevel] = useState<string>("beginner");
    const [replyType, setReplyType] = useState<string>("Short 50 to 100 words");
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const [isListening, setIsListening] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
    const recognition = useRef<any>(null);

    const isReadyToChat = useMemo(() => userId !== null && selectedSessionId !== null, [userId, selectedSessionId]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.lang = "en-US";
            recognition.current.interimResults = false;
            recognition.current.continuous = false;

            recognition.current.onresult = (event: any) => {
                const speechResult = event.results[0][0].transcript;
                setUserInput((prev) => prev + " " + speechResult);
            };

            recognition.current.onend = () => setIsListening(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await api.get("/api/auth/get_detail");
                const data = res.data;
                setUserId(data.id || null);
                setLanguage(data.language || "english");
                setLevel(data.level || "beginner");
                setReplyType(data.replyType || "");
                setYogaMode(data.yogaMode || false);
            } catch (err) {
                setUserId(null);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (userId) {
            const savedSessionId = localStorage.getItem(`selectedSessionId-${userId}`);
            if (savedSessionId) {
                handleSelectChat(savedSessionId);
            } else {
                handleNewChat();
            }
        }
    }, [userId]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 900) setShowRightSidebar(false);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleBMIPopup = () => setShowBMIPopup(prev => !prev);

    const typeMessage = (fullText: string) => {
        setDisplayedText("");
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + fullText[index]);
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
                setMessages((prev) => [...prev, { role: "model", text: fullText }]);
                setDisplayedText("");
            }
        }, 15);
    };

    const handleLogout = async () => {
        try {
            const res = await api.post("/api/auth/logout");
            if (res.status === 200) {
                if (userId) localStorage.removeItem(`selectedSessionId-${userId}`);
                navigate("/login", { replace: true });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async () => {
        const userMessageText = userInput.trim();
        if (!userMessageText || isLoading || !isReadyToChat) return;

        setMessages((prev) => [...prev, { role: "user", text: userMessageText }]);
        setUserInput("");
        setIsLoading(true);

        try {
            const res = await api.post("/api/chats/startChat", {
                sessionId: selectedSessionId,
                message: userMessageText,
                language,
                level,
                yogaMode,
            });
            typeMessage(res.data?.reply || "No response.");
            setHistoryRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "model", text: "Error: Connection failed." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!recognition.current) return;
        isListening ? recognition.current.stop() : recognition.current.start();
        setIsListening((prev) => !prev);
    };

    const handleNewChat = () => {
        const newSessionId = `session-${Date.now()}`;
        setSelectedSessionId(newSessionId);
        setMessages([]);
        if (userId) localStorage.setItem(`selectedSessionId-${userId}`, newSessionId);
        setHistoryRefreshTrigger(prev => prev + 1);
    };

    const handleSelectChat = async (sessionId: string) => {
        if (!userId) return;
        setSelectedSessionId(sessionId);
        setMessages([]);
        setIsLoading(true);
        localStorage.setItem(`selectedSessionId-${userId}`, sessionId);

        try {
            const res = await api.get(`/api/chats/${sessionId}`);
            setMessages(res.data.messages || []);
        } catch (err) {
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettingsUpdate = (language: string, level: string, yogaMode: boolean, replyType: string) => {
        setLanguage(language);
        setReplyType(replyType);
        setLevel(level);
        setYogaMode(yogaMode);
        setShowSettingsModal(false);
    };

    return (
        <div className="container">
            <div className="main-box">
                {showLeftSidebar && (
                    <LeftSidebar
                        userId={userId}
                        handleNewChat={handleNewChat}
                        onSelectChat={handleSelectChat}
                        selectedSessionId={selectedSessionId}
                        historyRefreshTrigger={historyRefreshTrigger} />
                )}

                <div className="chat-box">
                    <ChatHeader
                        toggleBMIPopup={toggleBMIPopup}
                        setShowSettingsModal={setShowSettingsModal}
                        handleLogout={handleLogout}
                        showRightSidebar={showRightSidebar}
                        showLeftSidebar={showLeftSidebar}
                        setShowRightSidebar={setShowRightSidebar}
                        setShowLeftSidebar={setShowLeftSidebar} />
                    <ChatWindow messages={messages} displayedText={displayedText} isLoading={isLoading} />
                    <InputArea
                        userInput={userInput}
                        setUserInput={setUserInput}
                        handleVoiceInput={handleVoiceInput}
                        handleSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        isListening={isListening}
                        isReadyToChat={isReadyToChat} />
                </div>

                {showRightSidebar && <RightSidebar onToggleSidebar={() => setShowRightSidebar(!showRightSidebar)} />}
            </div>

            {showSettingsModal && (
                <SettingsModal
                    onClose={() => setShowSettingsModal(false)}
                    onSave={handleSettingsUpdate}
                    currentLanguage={language}
                    currentReplyType={replyType}
                    currentLevel={level}
                    currentYogaMode={yogaMode}
                />
            )}

            <BMIPopup show={showBMIPopup} onClose={toggleBMIPopup} />
        </div>
    );
};

export default Chatbot;