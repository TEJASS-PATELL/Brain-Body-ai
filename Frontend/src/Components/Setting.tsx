import React, { useState, useEffect } from 'react';
import './Setting.css';
import toast from 'react-hot-toast';
import api from '../api';

interface SettingProps {
  onComplete: (language: string, level: string, yogaMode: boolean, replytype: string) => void;
  currentLanguage: string;
  currentLevel: string;
  currentReplyType: string;
  currentYogaMode: boolean;
}

const Setting: React.FC<SettingProps> = ({ onComplete, currentLanguage = "", currentLevel = "", currentYogaMode = false, currentReplyType = "" }) => {
  const [language, setLanguage] = useState(currentLanguage);
  const [level, setLevel] = useState(currentLevel);
  const [yogaMode, setYogaMode] = useState(currentYogaMode);
  const [replyType, setReplyType] = useState(currentReplyType);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [DeleteAccount, setDeleteAccount] = useState(false);
  const [SetValue, setSetValue] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/auth/userinfo");
        const data = res.data;
        setUserName(data.name || "");
        setEmail(data.email || "");
        setLanguage(data.language || currentLanguage);
        setLanguage(data.replyType || currentReplyType);
        setLevel(data.level || currentLevel);
        setYogaMode(!!data.yogaMode || currentYogaMode);
      } catch (err: any) {
        console.error("Failed to fetch user info:", err.response?.data?.msg || err.message);
      }
    };
    fetchUserInfo();
  }, [currentLanguage, currentLevel, currentYogaMode, currentReplyType]);

  const handleSubmit = async () => {
    if(!level || !language || !replyType){
      toast.error("Please Select each field's")
      return;
    }

    setSetValue(true);
    try {
      const { data } = await api.post("/api/auth/update_detail", { language, level, yogaMode, replyType });

      const updatedLanguage = data.language || language;
      const updatedReplyType = data.replyType || language;
      const updatedLevel = data.level || level;
      const updatedYogaMode = typeof data.yogaMode === "boolean" ? data.yogaMode : yogaMode;

      setLanguage(updatedLanguage);
      setLevel(updatedLevel);
      setYogaMode(updatedYogaMode);
      setReplyType(updatedReplyType);

      toast.success(data.message || "Preferences updated");
      onComplete(updatedLanguage, updatedLevel, updatedYogaMode, updatedReplyType);
    } catch (err: any) {
      toast.error("Error updating preferences");
    } finally {
      setSetValue(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is permanent!")) return;
    setDeleteAccount(true);
    try {
      const { data } = await api.delete("/api/auth/delete-account");
      if (data?.success) {
        toast.success(data?.msg);
      } else {
        toast.error(data?.msg);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Error deleting account");
    } finally {
      setDeleteAccount(false);
    }
  };

  return (
    <div className="language-selector">
      <div className="user-info">
        <p>
          Name: <strong>{userName ? userName : "Loading...."}</strong>
        </p>
        <p>
          Email: <strong>{email ? email : "Loading...."}</strong>
        </p>
      </div>

      <div className="form-group">
        <label>Select Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">-- Choose Language --</option>
          <option value="english">English</option>
          <option value="hinglish">Hinglish</option>
          <option value="hindi">Hindi</option>
          <option value="marathi">Marathi</option>
          <option value="bengali">Bengali</option>
          <option value="tamil">Tamil</option>
          <option value="telugu">Telugu</option>
          <option value="gujarati">Gujarati</option>
          <option value="punjabi">Punjabi</option>
          <option value="kannada">Kannada</option>
          <option value="malayalam">Malayalam</option>
          <option value="urdu">Urdu</option>
          <option value="odia">Odia</option>
          <option value="assamese">Assamese</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Level</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">-- Choose Level --</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="form-group">
        <label>Reply Type</label>
        <select value={replyType} onChange={(e) => setReplyType(e.target.value)}>
          <option value="">-- Select Reply Type --</option>
          <option value="concise">Short (50-100 words)</option>
          <option value="balanced">Medium (120-200 words)</option>
          <option value="detailed">Detailed (250+ words)</option>
        </select>
      </div>

      <div className="form-group toggle-wrap">
        <label>Yoga & Meditation Mode</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={yogaMode}
            onChange={(e) => setYogaMode(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="button-group">
        <button className="sett-button" onClick={handleSubmit} disabled={SetValue}>
          {SetValue ? "Saving..." : "Set Preferences"}
        </button>

        <button
          className="delete-button"
          onClick={handleDeleteAccount}
          disabled={DeleteAccount}
        >
          {DeleteAccount ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>

  );
};

export default Setting;
