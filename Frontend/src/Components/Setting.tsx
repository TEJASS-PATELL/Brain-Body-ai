import React, { useState, useEffect } from 'react';
import './Setting.css';
import toast from 'react-hot-toast';
import api from '../api';

interface SettingProps {
  onComplete: (language: string, level: string) => void;
  currentLanguage: string;
  currentLevel: string;
}

const Setting: React.FC<SettingProps> = ({ onComplete, currentLanguage, currentLevel }) => {
  const [language, setLanguage] = useState(currentLanguage);
  const [level, setLevel] = useState(currentLevel);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setLanguage(currentLanguage);
    setLevel(currentLevel);
  }, [currentLanguage, currentLevel]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/auth/userinfo");
        const data = res.data;

        setUserName(data.name);
        setEmail(data.email);
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

    try {
      const res = await api.post("/auth/update_detail", {
        language,
        level,
      });

      toast.success(res.data.message);
      onComplete(language, level);
    } catch (err: any) {
      console.error("Error setting preference:", err.response?.data?.msg || err.message);
      toast.error("Error setting preference");
    }
  };

  return (
    <div className="language-selector">
      <div className="user-info">
        <p>Name:- <strong>{userName}</strong></p>
        <p>Gmail:- <strong>{email}</strong></p>
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

      <div className="preview">
        <p>Language: <strong>{language.toLowerCase()}</strong></p>
        <p>Level: <strong>{level.toLowerCase()}</strong></p>
      </div>

      <button className='sett-button' onClick={handleSubmit}>Set</button>
    </div>
  );
};

export default Setting;
