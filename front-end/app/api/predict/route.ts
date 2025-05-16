import { NextResponse } from "next/server";

/**
 * This API endpoint proxies requests to the Flask backend for sentiment analysis
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // Proxy the request to the Flask backend
    // In development, you can use a different URL if your Flask server runs separately
    const apiUrl = process.env.FLASK_API_URL || "http://localhost:5000/predict";
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Flask API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in sentiment analysis API:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
} 