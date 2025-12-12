import React, { useState } from "react";
import "./LiveChat.css";

const LiveChat: React.FC = () => {
  const [startChat, setStartChat] = useState<boolean>(false);

  const StartLiveChat = async () => {
    const voice = new SpeechSynthesisUtterance("hello i am brain body ai nice to meet you");
    setStartChat(true);
    const synth: SpeechSynthesis = window.speechSynthesis;
    synth.speak(voice);
  };

  const stopLiveChat = () => {
    if(startChat){
      window.speechSynthesis.cancel();
      setStartChat(false);
    }
  };

  return (
    <div className="container">
      <div className="micSection">
        <img src="/brain.png" className="brainImg" />

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
          {startChat ? "Listening..." : "Tap Start to talk with AI"}
        </p>
      </div>
    </div>
  );
};

export default LiveChat;
