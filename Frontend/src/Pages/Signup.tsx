import React, { useState } from 'react';
import './Signup.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Full Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await axios.post('/api/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert(res.data.msg || "Signup successful!");
      navigate('/chatbot', { replace: true });
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("Email already exists. Please login.");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-box" onSubmit={handleSubmit} noValidate>

        <div className="logo-top-left">
          <img src="/brain.png" alt="Logo" />
        </div>

        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Join us and start your <span>Body + Brain</span> journey today!</p>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            aria-describedby="name-error"
          />
          {errors.name && <p className="error-text" id="name-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            aria-describedby="email-error"
          />
          {errors.email && <p className="error-text" id="email-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              aria-describedby="password-error"
            />
          </div>
          {errors.password && <p className="error-text" id="password-error">{errors.password}</p>}
          <small className="password-help">Password must be at least 6 characters.</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            aria-describedby="confirmPassword-error"
          />
          {errors.confirmPassword && <p className="error-text" id="confirmPassword-error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        <p className="login-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
