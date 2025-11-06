
import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      ></div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-md z-10 m-4 transform transition-all animate-fade-in-up flex flex-col text-center p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="mx-auto bg-red-500/10 p-4 rounded-full">
            <StarIcon className="w-12 h-12 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold mt-6">Upgrade to Pro</h2>
        <p className="text-gray-300 mt-2">You've used all your free searches.</p>

        <div className="mt-6 text-left bg-gray-900/50 p-4 rounded-lg">
            <ul className="space-y-3">
                <li className="flex items-center">
                    <StarIcon className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    <span>Unlimited global searches</span>
                </li>
                 <li className="flex items-center">
                    <StarIcon className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    <span>Access to all future pro features</span>
                </li>
            </ul>
        </div>

        <button 
            onClick={onUpgrade}
            className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
            Upgrade Now
        </button>

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

export default ProModal;