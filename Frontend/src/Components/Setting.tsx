import React, { useState, useEffect, useMemo } from 'react';
import './Setting.css';
import toast from 'react-hot-toast';
import api from '../api';

interface SettingProps {
  onComplete: (language: string, level: string, yogaMode: boolean) => void;
  currentLanguage: string;
  currentLevel: string;
  currentYogaMode: boolean;
}

const Setting: React.FC<SettingProps> = ({
  onComplete,
  currentLanguage = "",
  currentLevel = "",
  currentYogaMode = false,
}) => {
  const [language, setLanguage] = useState(currentLanguage);
  const [level, setLevel] = useState(currentLevel);
  const [yogaMode, setYogaMode] = useState(currentYogaMode);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLanguage(currentLanguage);
    setLevel(currentLevel);
    setYogaMode(!!currentYogaMode);
  }, [currentLanguage, currentLevel, currentYogaMode]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/auth/userinfo");
        const data = res.data;
        setUserName(data.name || "");
        setEmail(data.email || "");
        setLanguage(data.language || currentLanguage);
        setLevel(data.level || currentLevel);
        setYogaMode(!!data.yogaMode || currentYogaMode);
      } catch (err: any) {
        console.error("Failed to fetch user info:", err.response?.data?.msg || err.message);
      }
    };
    fetchUserInfo();
  }, [currentLanguage, currentLevel, currentYogaMode]);

  const UserName = useMemo(() => userName || "N/A", [userName]);
  const Email = useMemo(() => email || "N/A", [email]);

  const handleSubmit = async () => {
    if (!language || !level) {
      toast.error("Please select both language and level");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/update_detail", {
        language,
        level,
        yogaMode,
      });

      const updatedLanguage = res.data.language || language;
      const updatedLevel = res.data.level || level;
      const updatedYogaMode = typeof res.data.yogaMode === "boolean" ? res.data.yogaMode : yogaMode;

      setLanguage(updatedLanguage);
      setLevel(updatedLevel);
      setYogaMode(updatedYogaMode);

      toast.success(res.data.message || "Preferences updated");
      onComplete(updatedLanguage, updatedLevel, updatedYogaMode);
    } catch (err: any) {
      toast.error("Error updating preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="language-selector">
      <div className="user-info">
        <p>
          Name: <strong>{UserName}</strong>
        </p>
        <p>
          Email: <strong>{Email}</strong>
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

      <div className="preview">
        <p>Language: <strong>{language || "-"}</strong></p>
        <p>Level: <strong>{level || "-"}</strong></p>
        <p>Yoga Mode: <strong>{yogaMode ? "ON" : "OFF"}</strong></p>
      </div>

      <button className="sett-button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Set Preferences"}
      </button>
    </div>
  );
};

export default Setting;
