import { Novel, Chapter, Category, Bookmark } from '../types';
import { MOCK_NOVELS, MOCK_CHAPTERS, MOCK_CATEGORIES } from './mockData';

// Simulation delay to feel like a real network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BOOKMARK_KEY = 'cloudreader_bookmarks';

export const api = {
  getRecentNovels: async (): Promise<Novel[]> => {
    await delay(300);
    return MOCK_NOVELS.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  getAllNovels: async (): Promise<Novel[]> => {
    await delay(300);
    return MOCK_NOVELS;
  },

  getNovelById: async (id: number): Promise<Novel | undefined> => {
    await delay(200);
    return MOCK_NOVELS.find(n => n.id === id);
  },

  getCategories: async (): Promise<Category[]> => {
    await delay(200);
    return MOCK_CATEGORIES;
  },

  getChapters: async (novelId: number): Promise<Chapter[]> => {
    await delay(300);
    return MOCK_CHAPTERS[novelId] || [];
  },

  getChapterContent: async (novelId: number, chapterNumber: number): Promise<Chapter | null> => {
    await delay(200);
    const chapters = MOCK_CHAPTERS[novelId];
    if (!chapters) return null;
    return chapters.find(c => c.chapter_number === chapterNumber) || null;
  },
  
  searchNovels: async (query: string): Promise<Novel[]> => {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return MOCK_NOVELS.filter(n => 
      n.title.toLowerCase().includes(lowerQuery) || 
      n.author.toLowerCase().includes(lowerQuery)
    );
  },

  // Bookmark Methods
  getBookmarks: async (): Promise<Bookmark[]> => {
    // No delay needed for local storage, but keeping async signature
    const data = localStorage.getItem(BOOKMARK_KEY);
    return data ? JSON.parse(data) : [];
  },

  getNovelBookmarks: async (novelId: number): Promise<Bookmark[]> => {
    const data = localStorage.getItem(BOOKMARK_KEY);
    const all: Bookmark[] = data ? JSON.parse(data) : [];
    return all.filter(b => b.novelId === novelId).sort((a, b) => b.chapterNumber - a.chapterNumber);
  },

  addBookmark: async (bookmark: Bookmark): Promise<void> => {
    const data = localStorage.getItem(BOOKMARK_KEY);
    const all: Bookmark[] = data ? JSON.parse(data) : [];
    // Prevent duplicates
    if (!all.some(b => b.id === bookmark.id)) {
      const newBookmarks = [bookmark, ...all];
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(newBookmarks));
    }
  },

  removeBookmark: async (bookmarkId: string): Promise<void> => {
    const data = localStorage.getItem(BOOKMARK_KEY);
    if (!data) return;
    const all: Bookmark[] = JSON.parse(data);
    const newBookmarks = all.filter(b => b.id !== bookmarkId);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(newBookmarks));
  },
  
  isBookmarked: async (bookmarkId: string): Promise<boolean> => {
    const data = localStorage.getItem(BOOKMARK_KEY);
    if (!data) return false;
    const all: Bookmark[] = JSON.parse(data);
    return all.some(b => b.id === bookmarkId);
  }
};