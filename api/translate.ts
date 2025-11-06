// This is a serverless function that will run on the hosting provider (e.g., Vercel).
// It's not code that runs in the user's browser.
// Note: This file should be placed in a new folder named `api`.

import { GoogleGenAI } from "@google/genai";

// This is the main function that will be executed.
export default async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text to translate is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize the Gemini client with the API key from a secure environment variable.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text to English. Respond with only the translated text, without any introductory phrases, explanations, or quotation marks. Text to translate: "${text}"`,
    });
    
    const translatedText = response.text.trim();

    // Send the successful translation back to the browser.
    return new Response(JSON.stringify({ translation: translatedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in serverless function:", error);
    // Send a generic error response.
    return new Response(JSON.stringify({ error: 'Failed to communicate with the AI service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Configuration for Vercel to run this as a serverless function.
export const config = {
  runtime: 'edge',
};
