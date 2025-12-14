export interface Author {
  id: number;
  name: string;
  novel_count: number;
  total_words: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  novel_count: number;
  created_at?: string;
}

export interface Novel {
  id: number;
  title: string;
  clean_title: string;
  author: string; // Stored as string in novels table per schema, though relation exists
  category: string; // Stored as string in novels table
  word_count: number;
  chapter_count: number;
  file_path: string;
  file_size: number;
  encoding: string;
  is_corrupted: boolean;
  summary: string;
  tags: string; // CSV string
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  novel_id: number;
  chapter_number: number;
  title: string;
  content: string;
  word_count: number;
  created_at: string;
}

export interface Bookmark {
  id: string; // Composite key: novelId_chapterNumber
  novelId: number;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  createdAt: string;
}

// UI State Types
export type ReaderTheme = 'light' | 'dark' | 'sepia' | 'dark-blue';
export type FontFamily = 'sans' | 'serif';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number;
  lineHeight: number;
  fontFamily: FontFamily;
}