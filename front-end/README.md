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
