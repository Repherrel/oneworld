
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import type { User } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  user: User | null;
  searchCount: number;
}

// Fix: Add minimal interfaces for Web Speech API events to solve TypeScript errors.
// These types are not available in the default DOM typings.
interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError extends Event {
  error: string;
}


// Check for SpeechRecognition API
// Fix: Cast `window` to `any` to access non-standard `SpeechRecognition` properties.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, user, searchCount }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(recognition);

  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    // Fix: The `SpeechRecognitionEvent` type is now defined, resolving the error.
    const handleResult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setQuery(transcript);
      onSearch(transcript); 
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    // Fix: The `SpeechRecognitionError` type is now defined, resolving the error.
    const handleError = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    rec.addEventListener('result', handleResult);
    rec.addEventListener('end', handleEnd);
    rec.addEventListener('error', handleError);

    return () => {
      rec.removeEventListener('result', handleResult);
      rec.removeEventListener('end', handleEnd);
      rec.removeEventListener('error', handleError);
    };
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center w-full bg-gray-800 border border-gray-600 rounded-full focus-within:ring-2 focus-within:ring-red-500 transition-all duration-200">
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in any language..."
            className="w-full pl-5 pr-3 py-2 text-gray-200 bg-transparent focus:outline-none"
            disabled={isLoading}
            />
            {recognitionRef.current && (
            <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-2 rounded-full hover:bg-gray-700/60 disabled:cursor-not-allowed flex items-center justify-center transition-colors ${isListening ? 'text-red-500' : 'text-gray-300'}`}
                disabled={isLoading}
                title="Search by voice"
            >
                <MicrophoneIcon className="w-6 h-6" />
            </button>
            )}
             <div className="h-6 w-px bg-gray-600 mx-1"></div>
            <button
            type="submit"
            className="p-2 mr-2 rounded-full hover:bg-gray-700/60 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            disabled={isLoading}
            title="Search"
            >
            {isLoading ? (
                <SpinnerIcon className="w-6 h-6" />
            ) : (
                <SearchIcon className="w-6 h-6 text-gray-300" />
            )}
            </button>
        </div>
      </form>
       {!user?.isPro && (
        <p className="text-center text-xs text-gray-400 mt-2">
            You have {Math.max(0, searchCount)} free {searchCount === 1 ? 'search' : 'searches'} remaining.
        </p>
       )}
    </div>
  );
};

export default SearchBar;