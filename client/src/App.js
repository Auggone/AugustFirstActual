// src/App.js
import './App.css';
import './Pages/Articles/articles.css';
import Layout from './layout';
import HomePage from './homePage';
import ArticlePage from './Pages/Articles/articlepage';
import ArticlePage2 from './Pages/Articles/article2page';
import ArticlePage3 from './Pages/Articles/article3page';
import Jan06 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan06';
import Jan13 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan13';
import Jan21 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan21';
import Jan26 from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan26';
import WritingPage from './Pages/Articles/NewSubPages/writing/archive/jan2026/jan26';
import MarkdownPost from './Pages/Articles/NewSubPages/writing/MarkdownPost';
import ArchivePage from './Pages/Articles/NewSubPages/writing/archive/archivePage';
import { GridProvider } from './animation'; 
import ArticleStyle from './components/articlestyle/article';


import { Route, Routes } from 'react-router-dom';
import NewHomePage from './Pages/Articles/NewHomePage/newhome';
import GalleryPage from './components/gallarydesigns/gallaryD';
import VideoPage from './Pages/Articles/NewSubPages/videos/videopage';
import MusicPage from './Pages/Articles/NewSubPages/music/musicpage';

function App() {
  return (
    <GridProvider>                     {/* ← NOW AT THE TOP */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NewHomePage/>} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="video" element={<VideoPage />} />
          <Route path="music" element={<MusicPage />} />
        </Route>
        <Route path = "/" element={<ArticleStyle />}>
              <Route path="writing" element={<HomePage /> }/>
              <Route path="writing/archive" element={<ArchivePage />} />
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