import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import '../Pages/Chatbot.css';
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
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ready to level up? Ask your AI Chatbot...."
        disabled={isDisabled} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isDisabled && userInput.trim()) {
            handleSendMessage();
          }
        }}
      />

      <button onClick={handleVoiceInput} title="Voice Input" className="mic-button" disabled={isDisabled}>
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
      <button onClick={handleSendMessage} className="send-button" disabled={isDisabled || !userInput.trim()}>
        Send
      </button>
    </div>
  );
};

export default InputArea;
