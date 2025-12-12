import React from "react";
import "./LiveChat.css";

const LiveChat: React.FC = () => {

    const handleSpeek = () => {
        const voice = new SpeechSynthesisUtterance("hello how are you kaise ho app kya kar rahe ho app");
        speechSynthesis.speak(voice);
    }

    const endSpeek = () => {
        window.speechSynthesis.cancel();
    }

  return (
    <div className="container">

      <div className="micSection">
        <img src="/brain.png" className="brainImg" />

        <div className="btnRow">
          <button className="startBtn" onClick={handleSpeek}>Start</button>
          <button className="stopBtn" onClick={endSpeek}>Stop</button>
          <button className="backBtn" onClick={() => window.history.back()}> Back </button>
        </div>

        <p className="text">Tap mic to talk with <strong>Brain+Body AI</strong></p>
      </div>

    </div>
  );
};

export default LiveChat;
