import React from 'react';
import { Link } from 'react-router-dom';
import { Novel } from '../types';
import { User, AlignJustify } from 'lucide-react';

export const BookCard: React.FC<{ novel: Novel }> = ({ novel }) => {
  // Generate a deterministic gradient based on id
  const gradients = [
    'from-blue-400 to-indigo-600',
    'from-purple-400 to-pink-600',
    'from-emerald-400 to-cyan-600',
    'from-orange-400 to-red-600',
  ];
  const bgGradient = gradients[novel.id % gradients.length];

  return (
    <Link to={`/novel/${novel.id}`} className="group relative flex flex-col space-y-3">
      <div className={`aspect-[2/3] w-full rounded-lg shadow-lg overflow-hidden relative bg-gradient-to-br ${bgGradient} p-4 flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        
        {/* Mock Cover Design */}
        <div className="relative z-10 border-2 border-white/30 h-full p-3 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-serif font-bold text-xl drop-shadow-md line-clamp-2">{novel.title}</h3>
            <p className="text-white/80 text-xs mt-2 font-sans">{novel.author}</p>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-brand-600 transition-colors">{novel.title}</h3>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
          <span className="flex items-center"><User size={10} className="mr-1"/> {novel.author}</span>
          <span>•</span>
          <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">{novel.category}</span>
        </div>
      </div>
    </Link>
  );
};