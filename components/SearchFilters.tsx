import React from 'react';

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  return (
    <div className="mt-3 flex items-center justify-center gap-4 relative">
      <div className="flex items-center gap-2">
        <label htmlFor="sort-by" className="text-sm text-gray-400">Sort by:</label>
        <select
          id="sort-by"
          onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
          className="bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-md focus:ring-red-500 focus:border-red-500 block w-full p-1.5"
        >
          <option>Relevance</option>
          <option>Upload Date</option>
          <option>View Count</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;