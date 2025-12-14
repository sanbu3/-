import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Novel, Chapter, Bookmark } from '../types';
import { Clock, AlignLeft, Tag, Play, ChevronRight, MessageSquareMore, Send, X, Bot, Bookmark as BookmarkIcon, Trash2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Chat State
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const [n, c, b] = await Promise.all([
          api.getNovelById(Number(id)),
          api.getChapters(Number(id)),
          api.getNovelBookmarks(Number(id))
        ]);
        if (n) setNovel(n);
        setChapters(c);
        setBookmarks(b);
        setLoading(false);
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (showAiChat && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, showAiChat]);

  const handleAiSend = async () => {
    if (!chatInput.trim() || !process.env.API_KEY || !novel) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一个熟悉小说《${novel.title}》的AI助手。作者是${novel.author}。简介：${novel.summary}。请回答读者的问题：${userMsg}`;
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setChatHistory(prev => [...prev, { role: 'model', text: response.text || "抱歉，我无法回答。" }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "AI服务暂时不可用，请检查API Key配置。" }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    await api.removeBookmark(bookmarkId);
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  };

  if (loading) return <div className="p-10 text-center">载入详情...</div>;
  if (!novel) return <div className="p-10 text-center">找不到该小说</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative pb-10">
      
      {/* AI Chat Floating Button / Window */}
      {!showAiChat && (
        <button 
          onClick={() => setShowAiChat(true)}
          className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-40 bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-full shadow-lg shadow-brand-500/40 transition-transform hover:scale-105 flex items-center gap-2"
        >
          <Bot size={24} />
          <span className="hidden md:inline font-bold">询问 AI</span>
        </button>
      )}

      {showAiChat && (
        <div className="fixed bottom-20 right-4 md:bottom-10 md:right-10 w-[90vw] md:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700">
           <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-brand-50 dark:bg-gray-900 rounded-t-2xl">
             <div className="flex items-center gap-2">
               <Bot size={20} className="text-brand-600" />
               <span className="font-bold text-gray-800 dark:text-gray-100">AI 书籍助手</span>
             </div>
             <button onClick={() => setShowAiChat(false)} className="text-gray-500 hover:text-gray-800"><X size={20}/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                  <p>你好！我是关于《{novel.title}》的助手。</p>
                  <p className="mt-2">你可以问我关于剧情、人物或设定的问题。</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                 <div className="flex justify-start">
                   <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none text-xs text-gray-500 animate-pulse">
                     思考中...
                   </div>
                 </div>
              )}
              <div ref={chatEndRef} />
           </div>

           <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
             <input 
               type="text" 
               className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
               placeholder="问点什么..."
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
             />
             <button 
              onClick={handleAiSend}
              disabled={!process.env.API_KEY || isAiThinking}
              className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50"
             >
               <Send size={18} />
             </button>
           </div>
        </div>
      )}

      {/* Book Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-48 mx-auto md:mx-0 shrink-0">
          <div className={`aspect-[2/3] rounded-lg shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-6 flex flex-col justify-center text-center items-center text-white border-4 border-white dark:border-gray-800`}>
             <h1 className="font-serif font-bold text-2xl mb-2">{novel.title}</h1>
             <p className="text-sm opacity-80">{novel.author}</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{novel.title}</h1>
            <p className="text-xl text-brand-600 dark:text-brand-400 font-medium">{novel.author}</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center"><Tag size={16} className="mr-1"/> {novel.category}</div>
            <div className="flex items-center"><AlignLeft size={16} className="mr-1"/> {(novel.word_count / 10000).toFixed(1)}万字</div>
            <div className="flex items-center"><Clock size={16} className="mr-1"/> {novel.is_corrupted ? '文件损坏' : '状态正常'}</div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            {novel.summary || "暂无简介"}
          </div>

          <div className="flex justify-center md:justify-start pt-4">
             {chapters.length > 0 && (
               <Link to={`/read/${novel.id}/${chapters[0].chapter_number}`} className="flex items-center px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold shadow-lg shadow-brand-500/30 transition-all hover:scale-105">
                 <Play size={20} fill="currentColor" className="mr-2" />
                 开始阅读
               </Link>
             )}
          </div>
        </div>
      </div>

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
           <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
             <BookmarkIcon size={20} className="text-brand-600" />
             <h3 className="font-bold text-lg">我的书签</h3>
           </div>
           <div className="divide-y divide-gray-100 dark:divide-gray-800">
             {bookmarks.map(bm => (
               <div key={bm.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center group">
                 <Link to={`/read/${novel.id}/${bm.chapterNumber}`} className="flex-1">
                   <div className="font-medium text-gray-800 dark:text-gray-200">{bm.chapterTitle}</div>
                   <div className="text-xs text-gray-400 mt-1">保存于 {new Date(bm.createdAt).toLocaleDateString()}</div>
                 </Link>
                 <button 
                  onClick={() => deleteBookmark(bm.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
           <h3 className="font-bold text-lg">目录 ({chapters.length} 章)</h3>
           <button className="text-sm text-brand-600 font-medium">倒序</button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
          {chapters.map(chapter => (
            <Link 
              key={chapter.id} 
              to={`/read/${novel.id}/${chapter.chapter_number}`}
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between group"
            >
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors text-sm">
                {chapter.title}
              </span>
              <span className="text-xs text-gray-400 flex items-center">
                {(chapter.word_count).toLocaleString()} 字
                <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Link>
          ))}
          {chapters.length === 0 && (
            <div className="p-8 text-center text-gray-400">暂无章节</div>
          )}
        </div>
      </div>
    </div>
  );
};