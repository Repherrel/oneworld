
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="relative rounded-lg bg-gray-700 aspect-video w-full"></div>
      <div className="mt-3 flex items-start">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gray-700"></div>
        </div>
        <div className="ml-3 flex-grow">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
