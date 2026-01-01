import "./Home.css";
import { Link } from "react-router-dom";
import Demo from "../Components/Demo";
import { useEffect, useState } from "react";
import api from "../api";
import { FaSignInAlt } from "react-icons/fa";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    api.get('/api/auth/check')
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);
  return (
      <div className="heroo">
        <div className="hero-container">
          <main className="content">
            <span className="header-text">
              AI-POWERED PERFORMANCE COACH
            </span>

            <h1>
              Unlock Your Peak Potential with <span>Brain + Body</span> AI
            </h1>

            <p className="description">
              Sharpen your mental focus and transform your physical health with a single AI companion. Personalised neuroscience-backed strategies for modern achievers.
            </p>

            <p className="second-description">
              Smart Workouts • Cognitive Training • Stress Recovery • Daily Motivation
            </p>

            <div className="cta-buttons">
              {isLoggedIn ? (
                <Link to="/chatbot" className="chatbot" title="Start BrainBody AI">
                  <img src="brain.png" alt="BrainBody AI" width={90} height={90} />
                </Link>
              ) : (
                <div className="create-account">
                  <Link to="/login" className="login">
                    <FaSignInAlt style={{ marginRight: '8px' }} />
                    Login
                  </Link>

                  <Link to="/signup" className="signup">
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
        <Demo />
      </div>
  );
};

export default HomePage;
