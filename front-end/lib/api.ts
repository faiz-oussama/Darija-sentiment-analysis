/**
 * API service for sentiment analysis
 */

// Using Next.js API route as a proxy to the Flask backend
const API_URL = '/api';

/**
 * Response type from the sentiment analysis API
 */
export interface SentimentResponse {
  positive_probability: number;
  negative_probability: number;
  prediction: number;  // 1 for positive, 0 for negative
}

/**
 * Analyze text sentiment using the Flask backend
 * @param text The text to analyze
 * @returns Promise with analysis results
 */
export async function analyzeSentiment(text: string): Promise<SentimentResponse> {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
} 