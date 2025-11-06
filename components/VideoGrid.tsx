
import React from 'react';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import type { Video } from '../types';

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
  onVideoSelect: (video: Video) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, isLoading, onVideoSelect }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onVideoSelect={onVideoSelect} />
      ))}
    </div>
  );
};

export default VideoGrid;