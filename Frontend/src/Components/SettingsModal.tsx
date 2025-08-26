import React, { useState } from 'react';
import Setting from './Setting';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
  currentLanguage: string;
  currentLevel: string;
  onSave: (language: string, level: string, yogaMode: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, currentLanguage, currentLevel, onSave }) => {
  const [yogaMode, setYogaMode] = useState(false);

  const handleComplete = (language: string, level: string, isYogaMode: boolean) => {
    onSave(language, level, isYogaMode); 
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Select Preferences</h2>
        <Setting
          onComplete={handleComplete}
          currentLanguage={currentLanguage}
          currentLevel={currentLevel}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
