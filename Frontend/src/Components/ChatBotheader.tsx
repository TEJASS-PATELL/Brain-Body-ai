import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Settings, HelpCircle, LogOut, PanelRightClose, PanelRightOpen } from 'lucide-react';
import '../Pages/Chatbot.css'; 

interface ChatHeaderProps {
  toggleBMIPopup: () => void;
  setShowSettingsModal: (show: boolean) => void;
  handleLogout: () => void;
  showRightSidebar: boolean;
  setShowRightSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleBMIPopup,
  setShowSettingsModal,
  handleLogout,
  showRightSidebar,
  setShowRightSidebar,
}) => {
  return (
    <div className="chat-headerr">
      <div className="header-leftt">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img className="brain-ai" src="brain.png" alt="Brain" />
          <div style={{ marginLeft: "10px" }}>
            <div className="title">BrainBody Coach</div>
            <div className="status">Online</div>
          </div>
        </div>
        <div className="round-button">
          <button className="bmi-button" onClick={toggleBMIPopup} title="BMI Calculator">
            <HeartPulse size={22} />
          </button>
          <button className="main" onClick={() => setShowSettingsModal(true)} title="Setting">
            <Settings size={22} />
          </button>
          <Link to="/help" className="main">
            <HelpCircle size={22} />
          </Link>
          <button className="logout" onClick={handleLogout} title="logout">
            <LogOut size={22} />
          </button>
          <button className="main" onClick={() => setShowRightSidebar((prev) => !prev)}>
            {showRightSidebar ? <PanelRightClose size={22} /> : <PanelRightOpen size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;