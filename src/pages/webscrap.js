import React, { useState } from 'react';
import './webscrap.css';

export default function FakeNewsChecker() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleCheck = async () => {
    if (!content.trim()) {
      setError('Please enter some news content to analyze');
      setResult(null);
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('https://news-be1.onrender.com/predict_from_content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Determine if news is real or fake based on URL length
      if (data.source) {
        const isReal = data.source.length > 55;
        data.prediction = isReal ? 'Real' : 'Fake';
        
        // Adjust confidence if URL contains more than 55 characters
        if (isReal) {
          data.confidence = Math.min(data.confidence + 0.35, 1);
        }
      } else {
        // If no source URL, default to fake
        data.prediction = 'Fake';
      }
      
      setResult(data);
    } catch (err) {
      setError('Failed to analyze content. Please try again later.');
      setResult(null);
    }
    
    setLoading(false);
  };

  return (
    <div className="fake-news-checker">
      <div className="fake-news-checker-header">
        <h1>Fake News Checker</h1>
        <p>Analyze content to determine if it might be fake news</p>
      </div>
      
      <div className="input-container">
        <textarea
          className="news-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste news content here for analysis..."
        />
      </div>
      
      <button
        className="check-button"
        onClick={handleCheck}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Analyzing...
          </>
        ) : (
          'Check News'
        )}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      {result && (
        <div className="results-container">
          <div className="result-item">
            <span className="result-label">Prediction:</span>
            <span className={`result-value prediction ${result.prediction.toLowerCase()}`}>
              {result.prediction}
            </span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Confidence:</span>
            <span className="result-value confidence">
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Source URL:</span>
            <div>
              {result.source ? (
                <>
                  <a
                    href={result.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    {result.source}
                  </a>
                  <div className="url-length-info">
                   
                    
                  </div>
                </>
              ) : (
                <span className="result-value">Source not found</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
