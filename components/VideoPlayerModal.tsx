
import React, { useEffect } from 'react';
import type { Video } from '../types';
import { XIcon } from './icons/XIcon';

interface VideoPlayerModalProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const videoSrc = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      ></div>

      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl z-10 m-4 transform transition-all animate-fade-in-up flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold truncate" title={video.title}>{video.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close player">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="aspect-video">
          <iframe
            src={videoSrc}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="p-4 text-sm text-gray-300">
            <p className="font-semibold">{video.channelName}</p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayerModal;
