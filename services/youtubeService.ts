
import type { Video } from '../types';

export const searchVideos = async (query: string): Promise<Video[]> => {
  console.log(`Searching for videos with mock query: "${query}"`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real application, you would fetch this data from the YouTube API via a backend proxy.
  // For this demo, we return a static list of mock data.
  const mockResults: Video[] = Array.from({ length: 12 }, (_, i) => ({
    id: `mock_video_${i + 1}_${query.replace(/\s/g, '_')}`,
    thumbnailUrl: `https://picsum.photos/seed/${query}${i}/480/270`,
    title: `Amazing Video about ${query} - Part ${i + 1}`,
    channelName: `ContentCreator${i + 1}`,
    views: `${Math.floor(Math.random() * 500) + 1}K views`,
    uploadedAt: `${i + 1} weeks ago`,
  }));

  return mockResults;
};
