import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import '../Pages/Chatbot.css';

// Props ko define kiya gaya hai, including the new 'isReadyToChat' prop
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
  // 'isDisabled' variable, jo check karta hai ki kya app loading state mein hai
  // ya chat start karne ke liye ready nahi hai.
  // Agar koi bhi condition true hoti hai, toh buttons aur input field disabled ho jaate hain.
  const isDisabled = isLoading || !isReadyToChat;

  return (
    <div className="input-area">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ready to level up? Ask your AI Chatbot...."
        disabled={isDisabled} // isDisabled state ko use kiya gaya hai
        onKeyDown={(e) => {
          // 'Enter' key press hone par message send karo, lekin sirf tab jab
          // input disabled na ho aur usmein kuch text ho.
          if (e.key === 'Enter' && !isDisabled && userInput.trim()) {
            handleSendMessage();
          }
        }}
      />
      {/* Mic button bhi isDisabled state par depend karta hai */}
      <button onClick={handleVoiceInput} title="Voice Input" className="mic-button" disabled={isDisabled}>
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
      {/* Send button disabled hota hai agar isDisabled true hai ya input empty hai */}
      <button onClick={handleSendMessage} className="send-button" disabled={isDisabled || !userInput.trim()}>
        Send
      </button>
    </div>
  );
};

export default InputArea;
