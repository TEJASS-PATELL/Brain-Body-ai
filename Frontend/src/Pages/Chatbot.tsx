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

            recognition.current.onend = () => {
                setIsListening(false);
            };
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
                setYogaMode(data.yogaMode || false);
            } catch (err: any) {
                console.error("Failed to fetch user details:", err.response?.data?.msg || err.message);
                setUserId(null);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (userId) {
            const savedSessionId = localStorage.getItem(`selectedSessionId-${userId}`);
            if (savedSessionId) {
                setSelectedSessionId(savedSessionId);
                handleSelectChat(savedSessionId);
            } else {
                handleNewChat();
            }
        }
    }, [userId]);

    useEffect(() => {
        if (window.innerWidth < 900) {
            setShowRightSidebar(false);
        }
    }, []);

    const toggleBMIPopup = () => {
        setShowBMIPopup(prev => !prev);
    };

    const typeMessage = (fullText: string) => {
        setDisplayedText("");
        let index = 0;

        const step = () => {
            setDisplayedText((prev) => prev + fullText[index]);
            index++;
            if (index < fullText.length) {
                requestAnimationFrame(step);
            } else {
                setMessages((prev) => [...prev, { role: "model", text: fullText }]);
                setDisplayedText("");
            }
        };

        requestAnimationFrame(step);
    };

    const handleLogout = async () => {
        try {
            const res = await api.post("/api/auth/logout");
            if (res.status === 200) {
                if (userId) {
                    localStorage.removeItem(`selectedSessionId-${userId}`);
                }
                navigate("/login", { replace: true });
            } else {
                console.error("Logout failed:", res.data?.msg || "Unknown error");
            }
        } catch (err: any) {
            console.error("Logout error:", err.response?.data?.msg || err.message);
        }
    };

    const handleSendMessage = async () => {
    const userMessageText = userInput.trim();
    if (!userMessageText || isLoading || !selectedSessionId || !userId) return;

    const newUserMessage: Message = { role: "user", text: userMessageText };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
        const payload = {
            sessionId: selectedSessionId,
            message: userMessageText,
            language: language || "english",
            level: level || "beginner",
            yogaMode: yogaMode || false,
        };

        const res = await api.post("/api/chats/startChat", payload);

        const reply = res.data?.reply || "Sorry, I couldn't get a response.";
        typeMessage(reply);

        setHistoryRefreshTrigger((prev) => prev + 1);

    } catch (err: any) {
        console.error("Error sending message:", err.response?.data?.reply || err.message);

        setMessages((prev) => [
            ...prev,
            { role: "model", text: `Error: ${err.response?.data?.reply || err.message}` },
        ]);
    } finally {
        setIsLoading(false);
    }
};

    const handleVoiceInput = () => {
        if (!recognition.current) return;
        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
        }
        setIsListening((prev) => !prev);
    };

    const handleNewChat = () => {
        const newSessionId = `session-${Date.now()}`;
        setSelectedSessionId(newSessionId);
        setMessages([]);
        if (userId) {
            localStorage.setItem(`selectedSessionId-${userId}`, newSessionId);
        }
        localStorage.setItem("showIntro", "false");

        setHistoryRefreshTrigger(prev => prev + 1);
    };

    const handleSelectChat = async (sessionId: string) => {
        if (!userId) {
            console.log("User ID is not available. Cannot fetch chat history.");
            return;
        }

        setSelectedSessionId(sessionId);
        setMessages([]);
        setIsLoading(true);

        localStorage.setItem(`selectedSessionId-${userId}`, sessionId);
        localStorage.setItem("showIntro", "false");

        try {
            const res = await api.get(`/api/chats/${sessionId}`);
            const data = res.data;

            const formattedMessages = data.messages.map((msg: any) => ({
                role: msg.role,
                text: msg.text,
            }));

            setMessages(formattedMessages || []);
        } catch (err: any) {
            console.error("Failed to fetch chat:", err.response?.data?.msg || err.message);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettingsUpdate = async (newLanguage: string, newLevel: string, newYogaMode: boolean) => {
        try {
            await api.post("/api/auth/update_detail", {
                language: newLanguage,
                level: newLevel,
                yogaMode: newYogaMode,
            });
            setLanguage(newLanguage);
            setLevel(newLevel);
            setYogaMode(newYogaMode);
        } catch (err) {
            console.error("Failed to update settings", err);
        } finally {
            setShowSettingsModal(false);
        }
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
                        historyRefreshTrigger={historyRefreshTrigger}
                    />
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

                {showRightSidebar && <RightSidebar />}
            </div>

            {showSettingsModal && (
                <SettingsModal
                    onClose={() => setShowSettingsModal(false)}
                    onSave={handleSettingsUpdate}
                    currentLanguage={language}
                    currentLevel={level}
                    currentYogaMode={yogaMode}
                />
            )}
            <BMIPopup show={showBMIPopup} onClose={toggleBMIPopup} />
        </div>
    );
};

export default Chatbot;
