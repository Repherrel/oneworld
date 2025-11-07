import { GoogleGenAI } from "@google/genai";
import type { Video } from '../types';

interface RequestBody {
  query?: string;
}

// Create a simple in-memory cache for translations.
// In a production environment, a distributed cache like Redis or Vercel KV Storage
// would be used for persistence across stateless serverless function invocations.
const translationCache = new Map<string, string>();


export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { query } = (await req.json()) as RequestBody;
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // =======================================================
    // Step 1: Process the query with the Gemini API (with Caching)
    // =======================================================
    let translatedQuery = query;

    // OPTIMIZATION: Check the cache before calling the API.
    if (translationCache.has(query)) {
      translatedQuery = translationCache.get(query)!;
    } else {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
          const geminiResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Translate the following text to English. Respond with ONLY the translated text, without any introductory phrases, explanations, or quotation marks. If the text is already in English, simply return the original text. Text to translate: "${query}"`,
          });

          const result = geminiResponse.text.trim();
          translatedQuery = result;
          
          // Store the successful translation in the cache for future requests.
          translationCache.set(query, result);

      } catch (geminiError) {
          console.error("Gemini API failed, falling back to original query.", geminiError);
          // Fallback to using the original query if Gemini fails for any reason
          translatedQuery = query;
      }
    }


    // =======================================================
    // Step 2: Search YouTube with the processed query
    // =======================================================
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured on the server.");
    }
    
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', translatedQuery);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '15');
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      const error = await searchResponse.json();
      throw new Error(`YouTube API Error: ${error.error.message}`);
    }
    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    if (!videoIds) {
       return new Response(JSON.stringify({ videos: [], translatedQuery }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    detailsUrl.searchParams.set('part', 'snippet,statistics');
    detailsUrl.searchParams.set('id', videoIds);
    detailsUrl.searchParams.set('key', YOUTUBE_API_KEY);
    
    const detailsResponse = await fetch(detailsUrl.toString());
    if (!detailsResponse.ok) {
        const error = await detailsResponse.json();
        throw new Error(`YouTube Details API Error: ${error.error.message}`);
    }
    const detailsData = await detailsResponse.json();

    const videos: Video[] = detailsData.items.map((item: any) => ({
      id: item.id,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      views: item.statistics.viewCount || '0',
      uploadedAt: item.snippet.publishedAt,
      channelId: item.snippet.channelId,
    }));

    // =======================================================
    // Step 3: Return the final combined result
    // =======================================================
    return new Response(JSON.stringify({ videos, translatedQuery }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in intelligent-search function:", error);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred on the server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
