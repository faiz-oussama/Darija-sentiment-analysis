'use client';

import { useState } from 'react';
import { analyzeSentiment } from '../lib/api';

interface SentimentResult {
  positive_probability: number;
  negative_probability: number;
  prediction: number;
}

export default function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const sentimentResult = await analyzeSentiment(text);
      setResult(sentimentResult);
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Darija Sentiment Analysis</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="textInput" className="form-label">Enter text in Darija:</label>
                  <textarea
                    id="textInput"
                    className="form-control"
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your Darija text here..."
                  />
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Analyzing...
                    </>
                  ) : 'Analyze Sentiment'}
                </button>
              </form>
              
              {result && (
                <div className="mt-4">
                  <h4>Analysis Results</h4>
                  <div className="progress mb-3" style={{ height: '30px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${result.positive_probability}%` }}
                      aria-valuenow={result.positive_probability} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    >
                      Positive: {result.positive_probability.toFixed(2)}%
                    </div>
                  </div>
                  <div className="progress" style={{ height: '30px' }}>
                    <div 
                      className="progress-bar bg-danger" 
                      role="progressbar" 
                      style={{ width: `${result.negative_probability}%` }}
                      aria-valuenow={result.negative_probability} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    >
                      Negative: {result.negative_probability.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="alert alert-info mt-3">
                    <strong>Prediction:</strong> {result.prediction === 1 ? 'Positive' : 'Negative'} sentiment
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 