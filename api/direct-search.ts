
import type { Video } from '../types';

interface RequestBody {
  query?: string;
}

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
    // Step 1: Search YouTube with the ORIGINAL query
    // =======================================================
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured on the server.");
    }
    
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', query);
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
       return new Response(JSON.stringify({ videos: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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
    // Step 2: Return the final result
    // =======================================================
    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in direct-search function:", error);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred on the server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
