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
        
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15018.791255101472!2d77.53557069412071!3d8.086401871070764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ed3d2a087861%3A0x1e790e896aeffaa0!2sKanniyakumari%2C%20Tamil%20Nadu!5e1!3m2!1sen!2sin!4v1747518320287!5m2!1sen!2sin" 
            width="400" 
            height="200" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Kanniyakumari Map"
            className="dark-map"
          ></iframe>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/anlysis">News Analysis</a></li>
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
