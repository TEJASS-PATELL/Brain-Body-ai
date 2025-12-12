import React, { useState, useRef, useEffect } from "react";
import "./LiveChat.css";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const LiveChat: React.FC = () => {
  const [startChat, setStartChat] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) { 
      console.warn("SpeechRecognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join("");
      setUserTranscript(transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const StartLiveChat = () => {
    setStartChat(true);

    const voice = new SpeechSynthesisUtterance(
      "Hello, I am Brain Body AI. Nice to meet you!"
    );
    window.speechSynthesis.speak(voice);

    recognitionRef.current?.start();
  };

  const stopLiveChat = () => {
    if (startChat) {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
      setStartChat(false);
    }
  };

  return (
    <div className="container">
      <div className="micSection">
        <img src="/brain.png" className="brainImg" alt="Brain Body AI" />

        <div className="btnRow">
          <button onClick={StartLiveChat} className="startBtn">
            Start
          </button>

          <button onClick={stopLiveChat} className="stopBtn">
            Stop
          </button>

          <button className="backBtn" onClick={() => window.history.back()}>
            Back
          </button>
        </div>

        <p className="text">
          {startChat ? "Listening..." : "Tap Start to talk with Brain+Body AI"}
        </p>

        {startChat && (
          <p className="userTranscript">You said: {userTranscript}</p>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
