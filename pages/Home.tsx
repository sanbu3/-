import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Novel, Category } from '../types';
import { BookCard } from '../components/BookCard';
import { Flame, Clock, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const [recentNovels, setRecentNovels] = useState<Novel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [novels, cats] = await Promise.all([
        api.getRecentNovels(),
        api.getCategories()
      ]);
      setRecentNovels(novels);
      setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20 text-gray-400 animate-pulse">加载书架...</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-serif mb-2">欢迎回来，阅读者</h1>
          <p className="text-blue-100 mb-6 max-w-lg">
            您的私人云端书库已准备就绪。目前共有 {recentNovels.length} 本藏书正在更新。
          </p>
          <div className="flex gap-3">
             {categories.slice(0, 3).map(cat => (
               <span key={cat.id} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                 {cat.name}
               </span>
             ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center mb-4 space-x-2">
           <Sparkles className="text-brand-500" size={20} />
           <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">热门分类</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer group">
              <div className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-600">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">{cat.novel_count} 本书</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Updates */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="text-brand-500" size={20} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">最近更新</h2>
          </div>
          <button className="text-sm text-brand-600 hover:text-brand-700">查看全部</button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recentNovels.map(novel => (
            <BookCard key={novel.id} novel={novel} />
          ))}
        </div>
      </section>
    </div>
  );
};