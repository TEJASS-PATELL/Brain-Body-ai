import React from 'react';
import Setting from './Setting';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
  currentLanguage: string;
  currentLevel: string;
  currentYogaMode: boolean;  
  onSave: (language: string, level: string, yogaMode: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  currentLanguage,
  currentLevel,
  currentYogaMode, 
  onSave
}) => {
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
          currentYogaMode={currentYogaMode}   
        />
      </div>
    </div>
  );
};

export default SettingsModal;
