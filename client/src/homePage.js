// src/homePage.js
import { useNavigate } from "react-router-dom";
import "./homePage.css";
import seereal from './assets/fishingstars.jpeg';
import PostGrid from "./components/postgrid/postGrid";

export default function HomePage() {
  const navigate = useNavigate();

  // Cards are listed by hand. The `slug` here must match the `slug` in the
  // matching markdown file's front matter — that is what links a card to an essay.
  // Everything older lives in archivePage.js.
  const boxes = [
    { slug: 'aug13th', className: 'box center-tall', aria: 'Center tall', category:  ["All New", "New Blogs"], src: seereal, alt: 'Cover Image', subtitle: "Seeing Real" },
  ];

  return (
    <PostGrid boxes={boxes}>
      <button className="archive-button" onClick={() => navigate('/writing/archive')}>
        Archive
      </button>
    </PostGrid>
  );
}
