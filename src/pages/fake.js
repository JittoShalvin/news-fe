import React, { useState } from 'react';
import axios from 'axios';
import './fake.css';

function PredictForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post('http://localhost:5000/predict', {
        title,
        content
      });
      setResult(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Server error. Please make sure the Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="predict-container">
      <div className="form-header">
        <h2>Analyze Content</h2>
        <p className="form-description">
          Enter a  article title and content to check its credibility.
          Our AI will analyze the text and provide a prediction on whether it's likely to be real or fake article.
        </p>
      </div>

      <div className="input-form-container">
        <form onSubmit={handleSubmit} className="predict-form">
          <div className="input-group">
            <label htmlFor="news-title">Title</label>
            <input
              id="news-title"
              type="text"
              placeholder="Enter the headline or title of the article"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="news-content"> Content</label>
            <textarea
              id="news-content"
              placeholder="Paste the full text of the news article here"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              className="form-input news-textarea"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="action-button submit-btn" 
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading ? (
                <>
                  <svg className="spin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Analyze Article
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="action-button reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className={`result-container ${result.prediction === "Fake" ? 'fake' : 'real'}`}>
            <div className="result-header">
              <h3>Analysis Results</h3>
              <div className={`prediction-badge ${result.prediction === "Fake" ? 'fake' : 'real'}`}>
                {result.prediction === "Fake" ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
                {result.prediction}
              </div>
            </div>
            
            <div className="result-details">
              <div className="confidence-meter">
                <label>Confidence Level</label>
                <div className="confidence-bar-container">
                  <div 
                    className="confidence-bar" 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="confidence-value">{(result.confidence * 100).toFixed(2)}%</span>
              </div>
              
              <div className="analysis-tips">
                <h4>What does this mean?</h4>
                {result.prediction === "Fake" ? (
                  <p>This content has characteristics often found in misleading or false information. 
                  We recommend fact-checking with trusted sources before sharing.</p>
                ) : (
                  <p>This content appears to be credible based on our analysis. 
                  However, it's always good practice to verify information from multiple sources.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictForm;