// src/App.js
import './App.css';
import './Pages/Articles/articles.css';
import ArticlePage from './Pages/Articles/articlepage';
import ArticlePage2 from './Pages/Articles/article2page';
import ArticlePage3 from './Pages/Articles/article3page';
import Jan06 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan06';
import Jan13 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan13';
import Jan21 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan21';
import Jan26 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan26';
import WritingPage from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan26';
import MarkdownPost from './Pages/Articles/NewSubPages/writing/MarkdownPost';
import { GridProvider } from './animation'; 
import ArticleStyle from './components/articlestyle/article';


import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePageV2 from './Pages/HomePageV2/homev2';
import GalleryV2 from './Pages/V2/GalleryV2';
import WritingV2, { WritingArchiveV2 } from './Pages/V2/WritingV2';
import MusicV2 from './Pages/V2/MusicV2';
import PortfolioV2 from './Pages/V2/PortfolioV2';
import PortfolioProject from './Pages/V2/PortfolioProject';

// The pages used to be built at /v2/...; those links now go to the real addresses
function FromV2() {
  const { pathname } = useLocation();
  return <Navigate to={pathname.replace(/^\/v2/, "") || "/"} replace />;
}

function App() {
  return (
    <GridProvider>                     {/* ← NOW AT THE TOP */}
      <Routes>
        {/* The site: each page has its own colors in the shared pastel frame
            (components/pastelFrame) */}
        <Route path="/" element={<HomePageV2 />} />
        <Route path="gallery" element={<GalleryV2 />} />
        {/* Video page archived (src/archive/video-page); old links go home */}
        <Route path="video" element={<Navigate to="/" replace />} />
        <Route path="writing" element={<WritingV2 />} />
        <Route path="writing/archive" element={<WritingArchiveV2 />} />
        <Route path="music" element={<MusicV2 />} />
        <Route path="portfolio" element={<PortfolioV2 />} />
        <Route path="portfolio/:slug" element={<PortfolioProject />} />
        <Route path="v2/*" element={<FromV2 />} />
        <Route path="v2" element={<FromV2 />} />

        {/* Articles keep their own reading layout for now */}
        <Route path = "/" element={<ArticleStyle />}>
              <Route path = "articles/jan13" element = {<Jan13/>} />
              <Route path = "articles/jan20" element = {<Jan21/>} />
              <Route path ="articles/jan06" element = {<Jan06/>} />
              <Route path = "articles/jan26" element = {<Jan26/>} />
              <Route path="articles/article1" element={<ArticlePage />} />
              <Route path="articles/article2" element={<ArticlePage2 />} />
              <Route path="articles/article3" element={<ArticlePage3 />} />
              {/* Anything else under /articles is a markdown file in src/posts.
                  The routes above still win, they are more specific. */}
              <Route path="articles/:slug" element={<MarkdownPost />} />
        </Route>
      </Routes>
    </GridProvider>
  );
}

export default App;