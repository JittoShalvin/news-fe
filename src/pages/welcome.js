import React from 'react';
import { Search, AlertTriangle, CheckCircle, Globe, BarChart2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

const FakeNewsDetector = () => {
  const navigate = useNavigate();

  const redirectToAnalysis = () => {
    navigate('/predict');
  };

  // Create an SVG illustration as a fallback
  const renderSVGIllustration = () => (
    <div className="svg-illustration">
      <svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect x="50" y="50" width="300" height="200" rx="10" fill="#2d2d2d" stroke="#3f3f46" strokeWidth="2" />
        
        {/* Document */}
        <rect x="80" y="70" width="240" height="160" rx="5" fill="#1e1e1e" stroke="#4f46e5" strokeWidth="1" />
        
        {/* Document lines */}
        <line x1="100" y1="100" x2="220" y2="100" stroke="#9ca3af" strokeWidth="2" />
        <line x1="100" y1="120" x2="280" y2="120" stroke="#9ca3af" strokeWidth="2" />
        <line x1="100" y1="140" x2="260" y2="140" stroke="#9ca3af" strokeWidth="2" />
        <line x1="100" y1="160" x2="240" y2="160" stroke="#9ca3af" strokeWidth="2" />
        <line x1="100" y1="180" x2="200" y2="180" stroke="#9ca3af" strokeWidth="2" />
        
        {/* Verification symbols */}
        <circle cx="300" cy="90" r="20" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2" />
        <path d="M290,90 L298,98 L310,82" stroke="#22c55e" strokeWidth="3" fill="none" />
        
        <circle cx="100" cy="210" r="20" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" />
        <path d="M90,200 L110,220 M110,200 L90,220" stroke="#ef4444" strokeWidth="3" />
        
        {/* Magnifying glass */}
        <circle cx="250" cy="210" r="25" stroke="#6366f1" strokeWidth="3" fill="none" />
        <line x1="267" y1="227" x2="290" y2="250" stroke="#6366f1" strokeWidth="4" />
      </svg>
    </div>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <div className="logo">
            <AlertTriangle className="logo-icon fake" />
            <CheckCircle className="logo-icon real" />
          </div>
          <h1>TruthSeeker</h1>
        </div>
        <p className="tagline">AI-Powered Fake News Detection & Source Verification</p>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Combat Misinformation with AI</h2>
            <p>
              Our advanced deep learning model analyzes news content to determine authenticity
              and verifies sources across trusted platforms.
            </p>
            <div className="features">
              <div className="feature">
                <Search className="feature-icon" />
                <span>Content Analysis</span>
              </div>
              <div className="feature">
                <Globe className="feature-icon" />
                <span>Source Verification</span>
              </div>
              <div className="feature">
                <BarChart2 className="feature-icon" />
                <span>Confidence Score</span>
              </div>
            </div>
            <div className="cta-container">
              <button 
                className="cta-button"
                onClick={redirectToAnalysis}
              >
                <Search size={20} />
                Start Analyzing News
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              {/* Custom SVG illustration instead of external image */}
              {renderSVGIllustration()}
              <div className="overlay-elements">
                <div className="verification-badge real">
                  <CheckCircle size={24} />
                  <span>Verified</span>
                </div>
                <div className="verification-badge fake">
                  <AlertTriangle size={24} />
                  <span>Suspicious</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Input News Content</h3>
              <p>Paste article text or provide URL to news content you want to verify</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our deep learning model evaluates content patterns, language, and consistency</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Source Verification</h3>
              <p>We check if similar content appears on trusted news platforms</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Results</h3>
              <p>Receive detailed analysis with confidence score and verified sources</p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default FakeNewsDetector;