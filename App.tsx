import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BookDetail } from './pages/BookDetail';
import { Reader } from './pages/Reader';
import { Bookmarks } from './pages/Bookmarks';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Home />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/novel/:id" element={<BookDetail />} />
          <Route path="/read/:novelId/:chapterNum" element={<Reader />} />
          {/* Fallback routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;