import React, { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import VideoGrid from './components/VideoGrid';
import { YouTubeLogo } from './components/icons/YouTubeLogo';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import type { Video } from './types';
import { translateText } from './services/geminiService';
import { searchVideos } from './services/youtubeService';
import SearchFilters from './components/SearchFilters';

const App: React.FC = () => {
  const [translatedQuery, setTranslatedQuery] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setVideos([]);
    setTranslatedQuery(null);

    try {
      const englishQuery = await translateText(query);
      setTranslatedQuery(englishQuery);
      
      if (englishQuery) {
        const results = await searchVideos(englishQuery);
        setVideos(results);
      } else {
        setVideos([]);
      }

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <SpinnerIcon className="w-12 h-12 text-gray-400" />
          <p className="mt-4 text-lg text-gray-300">Translating & Searching...</p>
          {translatedQuery && (
            <p className="mt-2 text-sm text-gray-500">Found English query: "{translatedQuery}"</p>
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-20 text-center bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg max-w-md mx-auto">
          <h3 className="font-bold text-lg">Search Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center mt-20 text-gray-400">
                <h2 className="text-2xl font-semibold">Welcome to oneworld</h2>
                <p className="mt-2">Your portal to global video content. Search in any language.</p>
            </div>
        );
    }

    if (videos.length > 0) {
      return <VideoGrid videos={videos} />;
    }

    if (hasSearched && !isLoading) {
        return (
            <div className="text-center mt-20 text-gray-400">
                <h2 className="text-2xl font-semibold">No Results Found</h2>
                <p className="mt-2">Try a different search query.</p>
            </div>
        );
    }

    return null;
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="sticky top-0 z-10 grid grid-cols-3 items-center p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 gap-4">
        <div className="flex items-center gap-3">
            <YouTubeLogo className="w-8 h-8 text-red-600" />
            <h1 className="text-xl font-bold hidden sm:block">oneworld</h1>
        </div>
        <div className="flex flex-col items-center">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <SearchFilters onFiltersChange={() => {}} />
        </div>
        <div className="flex items-center justify-end">
          {/* Placeholder for future actions */}
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        {translatedQuery && !isLoading && (
          <p className="text-sm text-center text-gray-400 mb-6">
            Showing results for: <span className="font-semibold text-gray-300">"{translatedQuery}"</span>
          </p>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;