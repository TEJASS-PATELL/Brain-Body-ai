import React, { useState } from 'react';
import { X, Settings, Globe, MessageSquare, Zap, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
  current: {
    language: string;
    yogaMode: boolean;
    replyType: string;
  };
  onSave: (updated: { language: string; yogaMode: boolean; replyType: string }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, current, onSave }) => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(current.language);
  const [yogaMode, setYogaMode] = useState(current.yogaMode);
  const [replyType, setReplyType] = useState(current.replyType);
  
  const userName = localStorage.getItem('username') || 'User';
  const email = localStorage.getItem('email') || 'No email found';
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = { language, yogaMode, replyType };
      await api.post('/api/auth/update_detail', updatedSettings);
      toast.success('Preferences saved');
      onSave(updatedSettings);
      onClose();
    } catch {
      toast.error('Error saving preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/api/auth/delete-account');
      toast.success('Account deleted');
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch {
      toast.error('Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon"><Settings size={15} /></div>
            <div>
              <h2 className="modal-title">Settings</h2>
              <p className="modal-subtitle">Profile and AI preferences</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="setting-body">
          <div className="setting-profile">
            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-name"><strong>{userName}</strong></div>
              <div className="profile-email">{email}</div>
            </div>
          </div>

          <div className="setting-divider" />
          <div className="setting-section-label">AI Preferences</div>
          
          <div className="setting-fields">
            <div className="setting-field">
              <label className="field-label"><Globe size={13} /> Language</label>
              <select className="field-select" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="english">English</option>
                <option value="hinglish">Hinglish</option>
                <option value="hindi">Hindi</option>
                <option value="marathi">Marathi</option>
                <option value="bengali">Bengali</option>
              </select>
            </div>

            <div className="setting-field">
              <label className="field-label"><MessageSquare size={13} /> Reply Type</label>
              <select className="field-select" value={replyType} onChange={e => setReplyType(e.target.value)}>
                <option value="concise">Concise</option>
                <option value="balanced">Balanced</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <div className="setting-field setting-field--toggle">
              <div className="toggle-info">
                <label className="field-label"><Zap size={13} /> Focus Mode</label>
                <span className="toggle-desc">Precise answers only</span>
              </div>
              <button 
                className={`toggle-switch ${yogaMode ? 'toggle-switch--on' : ''}`}
                onClick={() => setYogaMode(!yogaMode)}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          <div className="setting-divider" />

          <div className="setting-actions">
            <button className="setting-btn setting-btn--save" onClick={handleSubmit} disabled={isSaving}>
              <Save size={15} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            {!showConfirmDelete ? (
              <button className="setting-btn setting-btn--delete-init" onClick={() => setShowConfirmDelete(true)}>
                <Trash2 size={15} /> Delete Account
              </button>
            ) : (
              <div className="delete-confirm">
                <p className="delete-confirm-text">Sure? This cannot be undone.</p>
                <div className="delete-confirm-btns">
                  <button className="setting-btn setting-btn--delete" onClick={handleDeleteAccount} disabled={isDeleting}>
                    {isDeleting ? '...' : 'Confirm'}
                  </button>
                  <button className="setting-btn setting-btn--cancel" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;