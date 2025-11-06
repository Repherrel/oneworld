
import type { Video } from '../types';

export const searchVideos = async (query: string): Promise<Video[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'YouTube search failed.');
    }

    const data = await response.json();
    return data.videos;

  } catch (error) {
    console.error("Error calling YouTube search service:", error);
    throw new Error("Could not fetch video results. Please try again later.");
  }
};