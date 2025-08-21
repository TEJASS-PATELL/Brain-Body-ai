import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';
import { FaHeart } from 'react-icons/fa';

const socialLinks = {
  github: 'https://github.com/TEJASS-PATELL',
  linkedin: 'https://www.linkedin.com/in/tejasspatell',
  email: 'mailto:tejasspatell2@gmail.com',
  portfolio: 'dd'
};

const Footer: React.FC = () => {
  return (
    <footer className="bb-footer">
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} <strong>Body + Brain</strong> — All Rights Reserved</p>
        <p>
          Made with <FaHeart style={{ color: '#3B82F6', display: 'inline', verticalAlign: 'middle' }} /> by <strong>Tejas Patel</strong> using <strong>Gemini AI</strong>
        </p>
        <div className="footer-social-icons">
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
            <FontAwesomeIcon icon={faGlobe} /> 
          </a>
          <a href={socialLinks.email} aria-label="Email">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;