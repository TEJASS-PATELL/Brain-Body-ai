import React, { useState, useEffect } from 'react';
import './Setting.css';
import toast from 'react-hot-toast';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface SettingProps {
  onComplete: (language: string, level: string, yogaMode: boolean, replyType: string) => void;
  currentLanguage: string;
  currentLevel: string;
  currentReplyType: string;
  currentYogaMode: boolean;
}

const Setting: React.FC<SettingProps> = ({
  onComplete,
  currentLanguage = "",
  currentLevel = "",
  currentYogaMode = false,
  currentReplyType = ""
}) => {
  const [language, setLanguage] = useState(currentLanguage);
  const [level, setLevel] = useState(currentLevel);
  const [yogaMode, setYogaMode] = useState(currentYogaMode);
  const [replyType, setReplyType] = useState(currentReplyType);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data } = await api.get("/api/auth/userinfo");

        setUserName(data.name || "");
        setEmail(data.email || "");

      } catch (err: any) {
        console.error("Failed to fetch user info:", err.response?.data?.msg || err.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async () => {
    if (!language || !level || !replyType) {
      toast.error("Please select all fields");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/api/auth/update_detail", { language, level, yogaMode, replyType });
      toast.success("Preferences updated");
      onComplete(language, level, yogaMode, replyType);
    } catch {
      toast.error("Error updating preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is permanent!")) return;

    setIsDeleting(true);
    try {
      const res = await api.delete("/api/auth/delete-account");

      if (res.status === 200) {
        toast.success(res.data?.msg || "Account deleted successfully"); 
        navigate("/login", { replace: true });
      } else {
        toast.error(res.data?.msg || "Error deleting account");
      }
    } catch (err: any) {
      console.error("Delete Account Error:", err);
      toast.error(err.response?.data?.msg || "Error deleting account: Server or Network issue");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="language-selector">
      <div className="user-info">
        <p>Name: <strong>{userName || "Loading..."}</strong></p>
        <p>Email: <strong>{email || "Loading..."}</strong></p>
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
        <label>-- Select Level --</label>
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
          <option value="concise">Short 50 to 100 words</option>
          <option value="balanced">Balanced 120 to 200 words</option>
          <option value="detailed">Detailed 250+ words</option>
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
        <button className="sett-button" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Set Preferences"}
        </button>

        <button className="delete-button" onClick={handleDeleteAccount} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Setting;
