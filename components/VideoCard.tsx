import React from 'react';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onVideoSelect: (video: Video) => void;
}

const formatViews = (views: string): string => {
  const num = parseInt(views, 10);
  if (isNaN(num)) return 'N/A';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return `${num}`;
};

const formatTimeAgo = (isoDate: string): string => {
  const date = new Date(isoDate);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
  return Math.floor(seconds) + " seconds ago";
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoSelect }) => {
  // Generate a more professional-looking avatar from channel name initials
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.channelName)}&background=random&color=fff`;

  return (
    <button 
      onClick={() => onVideoSelect(video)}
      className="flex flex-col group text-left w-full"
    >
      <div className="relative rounded-xl overflow-hidden transition-transform duration-200 group-hover:rounded-none">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-auto object-cover aspect-video bg-gray-800" loading="lazy" />
      </div>
      <div className="mt-3 flex items-start gap-3">
        <a
          href={`https://www.youtube.com/channel/${video.channelId}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => e.stopPropagation()} 
          className="flex-shrink-0"
        >
          <img
            src={avatarUrl}
            alt={`${video.channelName} avatar`}
            className="w-9 h-9 rounded-full bg-gray-700 hover:opacity-80 transition-opacity"
            loading="lazy"
          />
        </a>
        <div className="overflow-hidden">
          <h3 className="text-base font-medium text-gray-50 leading-snug break-words max-lines-2" title={video.title}>
            {video.title}
          </h3>
          <div className="text-sm text-gray-400 mt-1">
             <a 
                href={`https://www.youtube.com/channel/${video.channelId}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                className="hover:text-white transition-colors"
              >
                {video.channelName}
              </a>
            <div className="flex items-center gap-1.5">
                <span>{formatViews(video.views)} views</span>
                <span className="text-gray-500">&bull;</span>
                <span>{formatTimeAgo(video.uploadedAt)}</span>
            </div>
          </div>
        </div>
      </div>
       <style>{`
        .max-lines-2 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </button>
  );
};

export default VideoCard;