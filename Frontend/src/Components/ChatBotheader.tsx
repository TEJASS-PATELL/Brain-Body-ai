import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import './ChatHeader.css';

interface ChatHeaderProps {
  setShowSettingsModal: (show: boolean) => void;
  handleLogout: () => void;
  showLeftSidebar: boolean;
  setShowLeftSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  setShowSettingsModal,
  handleLogout,
  showLeftSidebar,
  setShowLeftSidebar,
}) => {
  const navigate = useNavigate();
  
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <button className="header-logo-btn" onClick={() => navigate('/')} title="Back to home">
          <img src="/DocuMind.svg" alt="DocuMind" className="header-logo" />
        </button>
      </div>

      <div className="chat-header-actions">
        <button
          className="header-btn"
          onClick={() => setShowLeftSidebar(prev => !prev)}
          title="Toggle sidebar"
        >
          {showLeftSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <button className="header-btn" onClick={() => setShowSettingsModal(true)} title="Settings">
          <Settings size={18} />
        </button>

        <div className="header-divider" />

        <button className="header-btn header-btn--danger" onClick={handleLogout} title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;