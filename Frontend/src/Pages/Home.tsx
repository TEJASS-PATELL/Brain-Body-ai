import "./Home.css";
import { Link } from "react-router-dom";
import Demo from "../Components/Demo";
import { useEffect, useState } from "react";
import api from "../api";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    api.get('/api/auth/check')
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);
  return (
    <>
      <div className="heroo">
        <div className="navbar-container">
          <div className="hero-container">
            <main className="content">
              <span className="header-text">
                YOUR AI COMPANION FOR MENTAL CLARITY & PHYSICAL ENERGY
              </span>

              <h1>
                Elevate Your Mind and Body with <span>Brain + Body</span> Intelligence
              </h1>

              <p className="description">
                Experience highly personalized AI guidance carefully designed to sharpen your mental focus, strengthen your workout habits, effectively reduce daily stress, and keep you consistently motivated every single day.
              </p>

              <p className="second-description">
                Tailored for modern lifestyles and powered by neuroscience, real-time behavioral insights, practical actionable recommendations, and deeply personalized strategies.
              </p>

              <div className="cta-buttons">
                {isLoggedIn ? (
                  <Link to="/chatbot" className="chatbot" title="Start BrainBody AI">
                    <img src="brain.png" alt="Open BrainBody Chatbot" width={85} height={85} />
                  </Link>
                ) : (
                  <div className="create-account">
                    <Link to="/login" className="login" title="Login to your account">
                      <FaSignInAlt style={{ marginRight: '5px' }} />
                      Login
                    </Link>

                    <Link to="/signup" className="signup" title="Create a new account">
                      <FaUserPlus style={{ marginRight: '5px' }} />
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </main>
          </div>
          <Demo />
        </div>
      </div>
    </>
  );
};

export default HomePage;
