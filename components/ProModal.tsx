import React from 'react';
import { StarIcon } from './icons/StarIcon';
import { XIcon } from './icons/XIcon';

interface ProModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const ProModal: React.FC<ProModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl max-w-md w-full m-4 text-white transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <StarIcon className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">Go Pro</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-center text-gray-300 mb-6">Unlock the full power of <strong>oneworld</strong> and enhance your global content discovery.</p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1" aria-hidden="true">✓</span>
              <div>
                <h4 className="font-semibold">Unlimited Searches</h4>
                <p className="text-sm text-gray-400">Translate and search for any video without daily limits.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1" aria-hidden="true">✓</span>
              <div>
                <h4 className="font-semibold">Advanced Search Filters</h4>
                <p className="text-sm text-gray-400">Sort results by relevance, upload date, or view count to find exactly what you're looking for.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1" aria-hidden="true">✓</span>
              <div>
                <h4 className="font-semibold">Highest Quality Translations</h4>
                <p className="text-sm text-gray-400">Utilize our most advanced AI model for the most accurate translations.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="p-6 bg-gray-900/50 rounded-b-2xl flex flex-col items-center gap-3">
          <button 
            onClick={onUpgrade}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
          >
            Upgrade Now
          </button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-200">
            Maybe later
          </button>
        </div>
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

export default ProModal;
