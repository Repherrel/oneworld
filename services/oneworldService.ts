
import type { Video } from '../types';

export interface IntelligentSearchResult {
  videos: Video[];
  translatedQuery: string;
}

export const performIntelligentSearch = async (query: string): Promise<IntelligentSearchResult> => {
  if (!query.trim()) {
    return { videos: [], translatedQuery: '' };
  }

  try {
    const response = await fetch('/api/intelligent-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'The intelligent search service failed.');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error calling intelligent search service:", error);
    throw new Error("Failed to perform the search. Please check your connection and try again.");
  }
};

export const performDirectSearch = async (query: string): Promise<Video[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch('/api/direct-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'The direct search service failed.');
    }

    const data = await response.json();
    return data.videos;

  } catch (error) {
    console.error("Error calling direct search service:", error);
    // Return empty array instead of throwing, so the UI doesn't show a hard error
    // if the intelligent search can still succeed.
    return [];
  }
};
