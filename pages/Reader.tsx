import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Chapter, ReaderSettings, Novel } from '../types';
import { ArrowLeft, Settings, List, ChevronLeft, ChevronRight, Check, Bookmark as BookmarkIcon } from 'lucide-react';

export const Reader: React.FC = () => {
  const { novelId, chapterNum } = useParams<{ novelId: string, chapterNum: string }>();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [novel, setNovel] = useState<Novel | null>(null); // Need novel info for bookmark
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0); // Reading progress percentage
  
  // Settings State
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('reader-settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      fontSize: 18,
      lineHeight: 1.8,
      fontFamily: 'sans'
    };
  });

  useEffect(() => {
    localStorage.setItem('reader-settings', JSON.stringify(settings));
    // Apply body bg based on theme
    const colors: Record<string, string> = {
      light: '#f9fafb', // gray-50
      sepia: '#f4ecd8',
      dark: '#111827', // gray-900
      'dark-blue': '#0f172a' // slate-900
    };
    document.body.style.backgroundColor = colors[settings.theme];
    
    return () => {
       document.body.style.backgroundColor = '';
    };
  }, [settings]);

  useEffect(() => {
    if (novelId && chapterNum) {
      setLoading(true);
      window.scrollTo(0, 0);
      setReadingProgress(0);
      
      const loadData = async () => {
        const [c, n] = await Promise.all([
           api.getChapterContent(Number(novelId), Number(chapterNum)),
           api.getNovelById(Number(novelId))
        ]);
        setChapter(c);
        setNovel(n || null);
        
        if (c) {
           const bookmarked = await api.isBookmarked(`${novelId}_${chapterNum}`);
           setIsBookmarked(bookmarked);
        }
        setLoading(false);
      };
      
      loadData();
    }
  }, [novelId, chapterNum]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      if (!chapter) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;

      if (scrollable > 0) {
        const progress = (scrollTop / scrollable) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setReadingProgress(100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial calculation
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowSettings(false);
  };

  const handlePrev = () => {
    if (!chapter) return;
    const prev = chapter.chapter_number - 1;
    if (prev > 0) navigate(`/read/${novelId}/${prev}`);
  };

  const handleNext = () => {
    if (!chapter) return;
    const next = chapter.chapter_number + 1;
    navigate(`/read/${novelId}/${next}`);
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chapter || !novel) return;

    const bookmarkId = `${novel.id}_${chapter.chapter_number}`;
    if (isBookmarked) {
      await api.removeBookmark(bookmarkId);
      setIsBookmarked(false);
    } else {
      await api.addBookmark({
        id: bookmarkId,
        novelId: novel.id,
        novelTitle: novel.title,
        chapterNumber: chapter.chapter_number,
        chapterTitle: chapter.title,
        createdAt: new Date().toISOString()
      });
      setIsBookmarked(true);
    }
  };

  // Styles based on settings
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'dark': return 'bg-gray-900 text-gray-300';
      case 'sepia': return 'bg-[#f4ecd8] text-[#5b4636]';
      case 'dark-blue': return 'bg-slate-900 text-slate-300';
      default: return 'bg-white text-gray-800';
    }
  };

  const contentStyle = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    fontFamily: settings.fontFamily === 'serif' ? '"Noto Serif SC", serif' : '"Noto Sans SC", sans-serif'
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
  </div>;

  if (!chapter) return <div className="p-10 text-center">章节加载失败</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClass()} relative`} onClick={() => showMenu && setShowMenu(false)}>
      
      {/* Click zones for navigation (Desktop) */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-32 cursor-w-resize z-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={handlePrev} title="上一章"></div>
      <div className="hidden md:block fixed right-0 top-0 bottom-0 w-32 cursor-e-resize z-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={handleNext} title="下一章"></div>
      
      {/* Center click zone to toggle menu */}
      <div className="fixed inset-x-0 top-0 h-16 z-10 md:hidden" onClick={(e) => { e.stopPropagation(); toggleMenu(); }}></div>
      <div className="fixed inset-x-0 bottom-0 h-16 z-10 md:hidden" onClick={(e) => { e.stopPropagation(); toggleMenu(); }}></div>

      {/* Top Bar (Sticky/Floating) */}
      <div className={`fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm z-20 transform transition-transform duration-300 flex items-center justify-between px-4 ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => navigate(`/novel/${novelId}`)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <span className="font-medium truncate max-w-[150px] md:max-w-md text-gray-800 dark:text-gray-200">{chapter.title}</span>
        <div className="flex space-x-1">
           <button onClick={handleToggleBookmark} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
             <BookmarkIcon size={24} fill={isBookmarked ? "currentColor" : "none"} className={isBookmarked ? "text-brand-600" : ""} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
             <Settings size={24} />
           </button>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettings && showMenu && (
        <div className="fixed top-16 right-0 left-0 md:left-auto md:w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-xl border-b md:border-l border-gray-200 dark:border-gray-800 z-20 p-6 space-y-6 animate-fade-in" onClick={e => e.stopPropagation()}>
          
          {/* Theme */}
          <div className="space-y-2">
            <span className="text-xs text-gray-500 uppercase font-bold">主题颜色</span>
            <div className="flex gap-3">
              {[
                { id: 'light', bg: '#ffffff', border: '#e5e7eb' },
                { id: 'sepia', bg: '#f4ecd8', border: '#d6c4a0' },
                { id: 'dark', bg: '#1f2937', border: '#374151' },
                { id: 'dark-blue', bg: '#0f172a', border: '#1e293b' },
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSettings({...settings, theme: t.id as any})}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center`}
                  style={{ backgroundColor: t.bg, borderColor: settings.theme === t.id ? '#0ea5e9' : t.border }}
                >
                  {settings.theme === t.id && <Check size={16} className={t.id.includes('dark') ? 'text-white' : 'text-black'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 uppercase font-bold">字号</span>
              <span className="text-xs text-gray-500">{settings.fontSize}px</span>
            </div>
            <input 
              type="range" 
              min="14" max="32" step="2"
              value={settings.fontSize}
              onChange={(e) => setSettings({...settings, fontSize: Number(e.target.value)})}
              className="w-full accent-brand-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

           {/* Font Family */}
           <div className="space-y-2">
            <span className="text-xs text-gray-500 uppercase font-bold">字体</span>
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
               <button 
                 onClick={() => setSettings({...settings, fontFamily: 'sans'})}
                 className={`flex-1 py-1.5 rounded-md text-sm ${settings.fontFamily === 'sans' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600' : 'text-gray-500'}`}
               >
                 黑体
               </button>
               <button 
                 onClick={() => setSettings({...settings, fontFamily: 'serif'})}
                 className={`flex-1 py-1.5 rounded-md text-sm font-serif ${settings.fontFamily === 'serif' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-600' : 'text-gray-500'}`}
               >
                 宋体
               </button>
            </div>
          </div>

        </div>
      )}

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-6 py-24 md:py-20 min-h-screen cursor-text z-10 relative" onClick={() => setShowMenu(!showMenu)}>
        <h1 className="text-2xl md:text-3xl font-bold mb-10 mt-4">{chapter.title}</h1>
        <article style={contentStyle} className="whitespace-pre-wrap text-justify">
           {chapter.content}
        </article>
      </div>

      {/* Bottom Navigation (Fixed) */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-t border-t border-gray-100 dark:border-gray-800 z-20 transform transition-transform duration-300 flex flex-col ${showMenu ? 'translate-y-0' : 'translate-y-full'}`}>
         
         {/* Progress Bar Container */}
         <div className="w-full px-6 pt-3 pb-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                <span>{chapter?.title}</span>
                <span>{Math.round(readingProgress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-brand-600 rounded-full transition-all duration-150 ease-out" 
                 style={{ width: `${readingProgress}%` }} 
               />
            </div>
         </div>

         {/* Buttons Container */}
         <div className="flex items-center justify-around h-16">
            <button onClick={handlePrev} className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600">
                <ChevronLeft size={24} />
                <span className="text-[10px]">上一章</span>
            </button>
            
            <button onClick={() => navigate(`/novel/${novelId}`)} className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600">
                <List size={24} />
                <span className="text-[10px]">目录</span>
            </button>

            <button onClick={handleNext} className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600">
                <ChevronRight size={24} />
                <span className="text-[10px]">下一章</span>
            </button>
         </div>
      </div>
    </div>
  );
};