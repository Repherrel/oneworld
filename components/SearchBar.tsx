import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in any language..."
          className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-5 py-2 bg-gray-700 hover:bg-gray-600 border-t border-b border-r border-gray-600 rounded-r-full disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <SpinnerIcon className="w-6 h-6" />
          ) : (
            <SearchIcon className="w-6 h-6 text-gray-300" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;