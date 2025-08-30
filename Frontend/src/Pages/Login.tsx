import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/login', { email, password });
      toast.success("Login successful! Welcome back");
      navigate("/chatbot", { replace: true });
    } catch (error: any) {
      toast.error('Login failed: ' + (error.response?.data?.msg || error.message));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <div className="logo-top-left">
          <img src="/brain.png" alt="Logo" />
        </div>

        <h2 className="login-title">
          Login to <span>Body+Brain</span>
        </h2>
        <p className="login-subtitle">Welcome back! Please enter your credentials.</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="dividerr"><span>OR</span></div>

        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
