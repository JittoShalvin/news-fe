import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h3>TruthSeeker</h3>
          <p className="tagline">Fighting misinformation with AI</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Links</h4>
            <ul>
              <li><a href="/">Home</a></li>

              <li><a href="/webscraper">URL Analysis</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#!">Documentation</a></li>
              <li><a href="#!">API</a></li>
              <li><a href="#!">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="disclaimer">
        <p>TruthSeeker is an AI-powered tool designed to help identify potentially misleading information. 
        Our analysis should not be considered definitive and we recommend cross-checking with multiple trusted sources.</p>
        <p className="copyright">© {new Date().getFullYear()} TruthSeeker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;