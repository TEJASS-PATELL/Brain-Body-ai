import React, { useEffect, useRef, useState, useMemo } from "react";
import "./Chatbot.css";
import LeftSidebar from "../Components/LeftSidebar";
import RightSidebar from "../Components/RightSidebar";
import SettingsModal from "../Components/SettingsModal";
import BMIPopup from "../Components/BMI";
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
    const [showRightSidebar, setShowRightSidebar] = useState(true);
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
                const res = await fetch("http://localhost:5000/api/auth/get_detail", {
                    credentials: "include",
                });
                const data = await res.json();
                setUserId(data.id || null);
                setLanguage(data.language || "english");
                setLevel(data.level || "beginner");
            } catch (err) {
                console.error("Failed to fetch user details:", err);
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
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + fullText[index]);
            index++;
            if (index === fullText.length) {
                clearInterval(interval);
                setMessages((prev) => [...prev, { role: "model", text: fullText }]);
                setDisplayedText("");
            }
        }, 30);
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                if (userId) {
                    localStorage.removeItem(`selectedSessionId-${userId}`);
                }
                navigate("/login", { replace: true });
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleSendMessage = async () => {
        const userMessageText = userInput.trim();
        if (!userMessageText || isLoading || !selectedSessionId || !userId) {
            console.log("Message send nahi ho paya, missing required fields.");
            return;
        }

        const newUserMessage: Message = { role: "user", text: userMessageText };
        setMessages((prev) => [...prev, newUserMessage]);
        setUserInput("");
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/chats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    sessionId: selectedSessionId,
                    message: userMessageText,
                    language,
                    level,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.reply || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const reply = data.reply || "Sorry, I couldn't get a response.";
            typeMessage(reply); 
            
            setHistoryRefreshTrigger(prev => prev + 1);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => {
                const updatedMessages = prev.filter(msg => msg.role !== 'user' || msg.text !== userMessageText);
                return [
                    ...updatedMessages,
                    {
                        role: "model",
                        text: `Error: ${error instanceof Error ? error.message : "Something went wrong."}`,
                    },
                ];
            });
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

        if (userId) {
            localStorage.setItem(`selectedSessionId-${userId}`, sessionId);
        }
        localStorage.setItem("showIntro", "false");
        try {
            const res = await fetch(`http://localhost:5000/api/chats/${sessionId}`, { credentials: "include", });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || `HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            
            const formattedMessages = data.messages.map((msg: any) => ({
                role: msg.role, 
                text: msg.text, 
            }));

            setMessages(formattedMessages || []);
        } catch (err) {
            console.error("Failed to fetch chat:", err);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettingsUpdate = (newLanguage: string, newLevel: string) => {
        setLanguage(newLanguage);
        setLevel(newLevel);
        setShowSettingsModal(false);
    };

    return (
        <div className="container">
            <div className="main-box">
                <LeftSidebar
                    userId={userId}
                    handleNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    selectedSessionId={selectedSessionId}
                    historyRefreshTrigger={historyRefreshTrigger} />

                <div className="chat-box">
                    <ChatHeader
                        toggleBMIPopup={toggleBMIPopup}
                        setShowSettingsModal={setShowSettingsModal}
                        handleLogout={handleLogout}
                        showRightSidebar={showRightSidebar}
                        setShowRightSidebar={setShowRightSidebar}/>
                    <ChatWindow messages={messages} displayedText={displayedText} isLoading={isLoading} />
                    <InputArea
                        userInput={userInput}
                        setUserInput={setUserInput}
                        handleVoiceInput={handleVoiceInput}
                        handleSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        isListening={isListening}
                        isReadyToChat={isReadyToChat}/>
                </div>

                {showRightSidebar && <RightSidebar />}
            </div>

            {showSettingsModal && (
                <SettingsModal
                    onClose={() => setShowSettingsModal(false)}
                    onSave={handleSettingsUpdate}
                    currentLanguage={language}
                    currentLevel={level}
                />
            )}
            <BMIPopup show={showBMIPopup} onClose={toggleBMIPopup} />
        </div>
    );
};

export default Chatbot;
