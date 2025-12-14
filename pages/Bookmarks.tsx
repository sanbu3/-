import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Bookmark as BookmarkType } from '../types';
import { Bookmark, ChevronRight, Trash2, BookOpen } from 'lucide-react';

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getBookmarks();
      setBookmarks(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await api.removeBookmark(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  if (loading) return <div className="p-10 text-center text-gray-500">加载书签...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <Bookmark className="text-brand-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">我的书签</h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <BookOpen className="text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400 mb-4">暂无书签记录</p>
          <Link to="/library" className="px-6 py-2 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition-colors">
            去阅读
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((bm) => (
            <Link 
              key={bm.id} 
              to={`/read/${bm.novelId}/${bm.chapterNumber}`}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-all group relative flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-brand-600 uppercase tracking-wide">{bm.novelTitle}</div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg group-hover:text-brand-600 transition-colors">{bm.chapterTitle}</h3>
                <div className="text-xs text-gray-400 flex items-center">
                   <ClockIcon /> 
                   <span className="ml-1.5">{new Date(bm.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                 <button 
                   onClick={(e) => handleDelete(e, bm.id)}
                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                   title="删除书签"
                 >
                   <Trash2 size={18} />
                 </button>
                 <ChevronRight className="text-gray-300 group-hover:text-brand-500 transition-colors" size={20} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);