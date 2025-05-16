# Darija Sentiment Analysis

A modern web application for analyzing sentiment in Darija (Moroccan Arabic) text.

## Project Structure

This project consists of two main components:

1. A Flask backend (`/Sentiment-analysis-website/test.py`) that runs the sentiment analysis model
2. A Next.js TypeScript frontend (`/darija-sentiment-analysis/`) with a Bootstrap UI

## Getting Started

### Running the Flask Backend

1. Navigate to the Sentiment-analysis-website directory:
   ```bash
   cd Sentiment-analysis-website
   ```

2. Install the required Python dependencies (if not already installed):
   ```bash
   pip install flask flask-cors torch numpy transformers
   ```

3. Start the Flask server:
   ```bash
   python test.py
   ```

The backend will run on `http://localhost:5000`.

### Running the Next.js Frontend

1. Navigate to the darija-sentiment-analysis directory:
   ```bash
   cd darija-sentiment-analysis
   ```

2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`.

## How It Works

1. The user enters Darija text in the form on the frontend
2. The frontend sends the text to the Next.js API proxy
3. Next.js forwards the request to the Flask backend
4. The Flask backend processes the text using the BERT sentiment analysis model
5. The results are returned to the frontend and displayed to the user

## Technologies Used

- **Backend**: Flask, PyTorch, Transformers (BERT)
- **Frontend**: Next.js, TypeScript, React, Bootstrap 5
- **API**: RESTful API with JSON

## Features

- Sentiment analysis of Darija text
- Clean, responsive UI with Bootstrap
- Real-time feedback on sentiment prediction
- Visual representation of positive/negative probabilities

# Darija Sentiment Analysis Frontend

This is the frontend part of the Darija Sentiment Analysis project, built with Next.js.

## Setup Instructions

1. Make sure you have Node.js 18+ installed

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. The frontend will be available at http://localhost:3000

## Building for Production

To create a production build:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Structure

- `/app`: Contains the Next.js app routes and pages
- `/components`: Reusable React components
- `/lib`: Utility functions and hooks
- `/public`: Static assets (images, fonts, etc.)

## API Integration

The frontend communicates with the Flask API running at `http://localhost:5000/predict` for sentiment analysis.

Make sure the Flask API is running before using the sentiment analysis feature.
