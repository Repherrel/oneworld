
// This serverless function detects the language of a given text using Gemini.

import { GoogleGenAI } from "@google/genai";

interface RequestBody {
  text?: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text } = (await req.json()) as RequestBody;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text for language detection is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    // A more resource-efficient model can be used for this simple task.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Detect the BCP-47 language code of the following text. Respond with only the two-letter language code and nothing else. For example, for "Hello world", respond "en". For "Hola mundo", respond "es". Text: "${text}"`,
    });
    
    const languageCode = response.text.trim().toLowerCase();

    return new Response(JSON.stringify({ languageCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in detect-language function:", error);
    return new Response(JSON.stringify({ error: 'Failed to communicate with the AI language service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  runtime: 'edge',
};
