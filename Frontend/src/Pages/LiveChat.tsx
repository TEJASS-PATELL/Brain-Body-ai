import React, { useState } from "react";
import "./LiveChat.css";

const LiveChat: React.FC = () => {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="live-container">

      <div className="micSection">
        <div className="construction-header">
          <h2 className="construction-title">Feature Under Construction!!!!!</h2>
        </div>
        <img src="/brain.png" className="brainImg" alt="AI" />

        <div className="btnRow">
          {!isListening ? (
            <button onClick={() => setIsListening(true)} className="startBtn">Start Talking</button>
          ) : (
            <button onClick={() => setIsListening(false)} className="stopBtn">End Talking</button>
          )}
          <button className="backBtn" onClick={() => window.history.back()}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;