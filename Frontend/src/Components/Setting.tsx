import React, { useState, useEffect } from 'react';
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
  const [language, setLanguage] = useState<string>(currentLanguage || "");
  const [level, setLevel] = useState<string>(currentLevel || "");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [yogaMode, setYogaMode] = useState<boolean>(currentYogaMode || false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLanguage(currentLanguage || "");
    setLevel(currentLevel || "");
    setYogaMode(currentYogaMode || false);
    setSaved(false);
  }, [currentLanguage, currentLevel, currentYogaMode]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/auth/userinfo");
        const data = res.data;

        setUserName(data.name ?? "");
        setEmail(data.email ?? "");

        if (data.language) setLanguage(data.language);
        if (data.level) setLevel(data.level);
        if (typeof data.yogaMode === "boolean") setYogaMode(data.yogaMode);

        setSaved(true);
      } catch (err: any) {
        console.error("Failed to fetch user info:", err.response?.data?.msg || err.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async () => {
    if (!language || !level) {
      toast("Please select both language and level");
      return;
    }

    setLoading(true);
    setSaved(false);

    try {
      const res = await api.post("/api/auth/update_detail", {
        language,
        level,
        yogaMode,
      });

      if (res.data.language) setLanguage(res.data.language);
      if (res.data.level) setLevel(res.data.level);
      if (typeof res.data.yogaMode === "boolean") setYogaMode(res.data.yogaMode);

      toast.success(res.data.message);
      onComplete(language, level, yogaMode);
      setSaved(true);
    } catch (err: any) {
      console.error("Error setting preference:", err.response?.data?.msg || err.message);
      toast.error("Error setting preference");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="language-selector">
      <div className="user-info">
        <p>Name:- <strong>{userName || "N/A"}</strong></p>
        <p>Gmail:- <strong>{email || "N/A"}</strong></p>
      </div>

      <div className="form-group">
        <label>Select Language</label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setSaved(false);
          }}
        >
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
        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setSaved(false);
          }}
        >
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
            checked={!!yogaMode}
            onChange={(e) => {
              setYogaMode(e.target.checked);
              setSaved(false);
            }}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="preview">
        <p>Language: <strong>{language ? language.toLowerCase() : "-"}</strong></p>
        <p>Level: <strong>{level ? level.toLowerCase() : "-"}</strong></p>
        <p>Yoga Mode: <strong>{yogaMode ? "ON" : "OFF"}</strong></p>
      </div>

      <button
        className="sett-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : saved ? "Saved" : "Set"}
      </button>
    </div>
  );
};

export default Setting;
