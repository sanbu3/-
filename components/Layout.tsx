import React from 'react';
import { HashRouter, Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Home, Library, Settings, Moon, Sun, Bookmark } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isReader = location.pathname.includes('/read/');

  if (isReader) {
    return <>{children}</>;
  }

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-all ${
          isActive 
            ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30' 
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-20">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            CloudReader
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
            <Home size={20} />
            <span className="font-medium">书架首页</span>
          </Link>
           <Link to="/library" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/library' ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
            <Library size={20} />
            <span className="font-medium">所有作品</span>
          </Link>
           <Link to="/bookmarks" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/bookmarks' ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
            <Bookmark size={20} />
            <span className="font-medium">我的书签</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
           <button 
             onClick={() => setIsDark(!isDark)}
             className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
           >
             {isDark ? <Sun size={20} /> : <Moon size={20} />}
             <span className="font-medium">{isDark ? '浅色模式' : '深色模式'}</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <header className="md:hidden sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between">
           <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <BookOpen size={18} />
              </div>
              <span className="font-bold text-lg">CloudReader</span>
           </div>
           <button 
             onClick={() => setIsDark(!isDark)}
             className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
           >
             {isDark ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center px-2 z-30 pb-safe">
        <NavItem to="/" icon={Home} label="首页" />
        <NavItem to="/library" icon={Library} label="书库" />
        <NavItem to="/bookmarks" icon={Bookmark} label="书签" />
      </nav>
    </div>
  );
};