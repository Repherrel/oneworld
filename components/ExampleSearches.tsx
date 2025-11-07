
import React from 'react';

interface ExampleSearchesProps {
  onSearch: (query: string) => void;
}

const examples = [
  { original: 'भारत में सबसे अच्छा स्ट्रीट फूड', translated: 'Best street food in India', lang: 'Hindi' },
  { original: 'recetas de paella fáciles', translated: 'Easy paella recipes', lang: 'Spanish' },
  { original: 'comment faire des crêpes', translated: 'How to make crepes', lang: 'French' },
  { original: '日本の観光地', translated: 'Japanese tourist spots', lang: 'Japanese' },
];

const ExampleSearches: React.FC<ExampleSearchesProps> = ({ onSearch }) => {
  return (
    <div className="mt-8 w-full max-w-lg space-y-3">
      {examples.map((example, index) => (
        <button
          key={index}
          onClick={() => onSearch(example.original)}
          className="w-full text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex flex-col">
             <span className="text-gray-200 text-base">{example.original}</span>
             <span className="text-gray-400 text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">({example.lang})</span>
          </div>
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-gray-300 hidden sm:inline text-sm">{example.translated}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ExampleSearches;
