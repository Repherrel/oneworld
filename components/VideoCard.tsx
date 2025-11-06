
import React from 'react';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="relative rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-auto object-cover aspect-video bg-gray-700" />
      </div>
      <div className="mt-3 flex items-start">
        <div className="flex-shrink-0">
          <img className="w-9 h-9 rounded-full bg-gray-600" src={`https://i.pravatar.cc/40?u=${video.channelName}`} alt={video.channelName} />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-gray-100 leading-snug break-words">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{video.channelName}</p>
          <p className="text-xs text-gray-400">
            {video.views} &bull; {video.uploadedAt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
