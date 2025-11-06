import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
  error?: string | null;
  isLoading: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit, error, isLoading }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() && !isLoading) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl max-w-md w-full m-4 text-white transform transition-all animate-fade-in-up">
        <div className="p-6 border-b border-gray-700 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <KeyIcon className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">Enter Your API Key</h2>
          </div>
          <p className="text-sm text-gray-400">
            To use <strong>oneworld</strong>, please provide your Google Gemini API key.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder="Enter your secret key here"
              required
              disabled={isLoading}
            />
            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
             <p className="text-xs text-gray-500 mt-3">
                Your key is stored only in your browser session and is never shared. You can get a free key from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                    Google AI Studio
                </a>.
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-b-2xl">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!apiKey.trim() || isLoading}
            >
              {isLoading ? <SpinnerIcon className="w-6 h-6" /> : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;