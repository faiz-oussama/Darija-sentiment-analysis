# Darija Sentiment Analysis

A modern web application for sentiment analysis of Darija (Moroccan Arabic dialect) text.

## Project Overview

This project provides a sentiment analysis tool that can determine whether a given text in Darija has a positive, negative, or neutral sentiment. It consists of three main components:

- **ML Model**: A trained BERT-based sentiment analysis model specialized for Darija text
- **Flask API**: Backend service that handles text processing and sentiment prediction
- **Next.js Frontend**: Modern, responsive web interface for user interaction

## Features

- Real-time sentiment analysis of Darija text
- Visual representation of sentiment scores
- Responsive design for desktop and mobile devices
- Dark theme with a modern interface

## Project Structure

```
Darija-Sentiment-Analysis/
├── datasets/               # Training and testing datasets
├── flask-api/              # Flask backend API service
├── front-end/              # Next.js frontend application
├── model-training-notebook/# Jupyter notebooks for model training
└── darija_sentiment_model.pt # Trained sentiment analysis model
```

## Getting Started

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- pip (Python package manager)
- npm (Node.js package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Darija-Sentiment-Analysis.git
   cd Darija-Sentiment-Analysis
   ```

2. Set up the Flask API:
   ```bash
   cd flask-api
   pip install -r requirements.txt
   # Required packages: flask, flask-cors, torch, numpy, transformers
   ```

3. Set up the Next.js frontend:
   ```bash
   cd ../front-end
   npm install
   ```

### Running the Application

1. Start the Flask API:
   ```bash
   cd flask-api
   python ml-api.py
   ```

2. In a separate terminal, start the Next.js frontend:
   ```bash
   cd front-end
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter Darija text in the input field
2. Click the "Analyze" button
3. View the sentiment analysis results displayed below with positive and negative probability scores

## Model Information

The sentiment analysis model is trained on a dataset of Darija text with labeled sentiments. The model uses the following architecture:

- **Base Model**: BERT (bert-base-multilingual-cased)
- **Architecture**: Fine-tuned BERT with a classification head (768 -> 50 -> 2)
- **Classes**: Positive and Negative sentiment
- **Training**: The model was trained for 2 epochs with evaluation metrics showing 82% accuracy

The model was trained on datasets from:
- MSAC (Arabic Sentiment Analysis corpus)
- OMCD (Offensive Moroccan Comments Dataset)

## Technologies Used

- **Backend**: Python, Flask, PyTorch, Transformers
- **Frontend**: Next.js, React, Bootstrap
- **Machine Learning**: BERT, PyTorch
- **Development**: Jupyter Notebook (for model training)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- HuggingFace Transformers library for providing pre-trained models
- Dataset sources: MSAC and OMCD projects for Arabic sentiment data 