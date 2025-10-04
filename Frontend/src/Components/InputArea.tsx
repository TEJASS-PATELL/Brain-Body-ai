import React from 'react';
import { ArrowRight, Mic, MicOff } from 'lucide-react';
import './Input.css';

interface InputAreaProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleVoiceInput: () => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isListening: boolean;
  isReadyToChat: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  userInput,
  setUserInput,
  handleVoiceInput,
  handleSendMessage,
  isLoading,
  isListening,
  isReadyToChat,
}) => {
  const isDisabled = isLoading || !isReadyToChat;

  return (
    <div className="input-area">
      <textarea
        className="chat-input"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask your AI Chatbot...."
        disabled={isDisabled}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isDisabled && userInput.trim()) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button onClick={handleVoiceInput} title="Voice Input" className="mic-button" disabled={isDisabled}>
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      <button
        onClick={handleSendMessage}
        className="send-button"
        disabled={isDisabled || !userInput.trim()}
        title="Send"
      >
          <ArrowRight size={22} />
      </button>
    </div>
  );
};

export default InputArea;
