// src/homePage.js
import { useNavigate } from "react-router-dom";
import "./homePage.css";
import seereal from './assets/seeEYES.png';
import iamme from './assets/iamme.jpg';
import PostGrid from "./components/postgrid/postGrid";

// Cards are listed by hand, newest first. The `slug` here must match the `slug` in the
// matching markdown file's front matter — that is what links a card to an essay.
// Everything older lives in archivePage.js. Shared with the v2 Writing page.
export const WRITING_POSTS = [
  // fill: the painting is shown whole and centred on #fefefe, sampled from
  // the white around the Seeing Real eyes; ratio is the image's width / height
  { slug: 'i-am-me', className: 'box center-tall', aria: 'Center tall', category:  ["All New", "New Blogs"], src: iamme, alt: 'I am me', subtitle: "I am me", fill: '#fefefe', ratio: '682 / 900' },
  { slug: 'aug13th', className: 'box center-tall', aria: 'Center tall', category:  ["All New", "New Blogs"], src: seereal, alt: 'Cover Image', subtitle: "Seeing Real" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PostGrid boxes={WRITING_POSTS}>
      <button className="archive-button" onClick={() => navigate('/writing/archive')}>
        Archive
      </button>
    </PostGrid>
  );
}
