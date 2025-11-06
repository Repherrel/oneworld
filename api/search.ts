
// This serverless function securely queries the YouTube Data API.
import type { Video } from '../types';

interface RequestBody {
  query?: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { query } = (await req.json()) as RequestBody;

    if (!query) {
      return new Response(JSON.stringify({ error: 'Search query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured on the server.");
    }

    // Construct the YouTube API URL
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '15');
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      const error = await searchResponse.json();
      console.error('YouTube API search error:', error);
      throw new Error(error.error.message || 'Failed to fetch from YouTube API.');
    }
    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    if (!videoIds) {
       return new Response(JSON.stringify({ videos: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get video details (like view count) for the found videos
    const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    detailsUrl.searchParams.set('part', 'snippet,statistics');
    detailsUrl.searchParams.set('id', videoIds);
    detailsUrl.searchParams.set('key', YOUTUBE_API_KEY);
    
    const detailsResponse = await fetch(detailsUrl.toString());
     if (!detailsResponse.ok) {
      const error = await detailsResponse.json();
      console.error('YouTube API details error:', error);
      throw new Error(error.error.message || 'Failed to fetch video details from YouTube API.');
    }
    const detailsData = await detailsResponse.json();

    // Format the data into our Video type
    const videos: Video[] = detailsData.items.map((item: any) => ({
      id: item.id,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      views: item.statistics.viewCount || '0',
      uploadedAt: item.snippet.publishedAt,
      channelId: item.snippet.channelId,
    }));

    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in YouTube search function:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to communicate with the YouTube service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  runtime: 'edge',
};
