// src/Pages/Articles/NewSubPages/writing/archive/archivePage.js
// Everything that has rolled off the writing page. Same grid, same cards —
// only the list differs.
import { Link } from "react-router-dom";
import PostGrid from "../../../../../components/postgrid/postGrid";
import coverImage1 from '../../../../../assets/coverImage1.jpg';
import oroborus from '../../../../../assets/oroborus.jpg';
import augbencam from '../../../../../assets/augbencam.jpg';
import mollybloom from '../../../../../assets/mollybloom.jpg';
import augdowntown6 from '../../../../../assets/augdowntown6.JPG';
import pianorecording from '../../../../../assets/Pianorecording.jpg';

export default function ArchivePage() {
  const boxes = [
    { slug: 'article1', className: 'box left-top',    aria: 'Left column top', category: "All Old",    src: coverImage1, alt: 'Cover Image', subtitle: "6 Degrees of Separation"  },
    { slug: 'article2', className: 'box left-bottom', aria: 'Left column bottom', category: "All Old", src: oroborus,    alt: 'Cover Image',subtitle: "The Gift Vs. The Slave" },

    {slug: 'jan26', className: 'box right-bottom-n', aria: 'Right column narrow bottom', category: ["All New", "New Blogs"], src: pianorecording, alt: 'Cover Image', subtitle: "Jan 26th: Music samples " },

    {slug: 'jan20', className: 'box right-bottom-n', aria: 'Right column narrow bottom', category: ["All New", "New Blogs"], src: augdowntown6, alt: 'Cover Image', subtitle: "Jan 20th: The difference between us " },

    {slug: 'jan13', className: 'box right-top-n', aria: 'Right column narrow top', category: ["All New", "New Blogs"], src: mollybloom, alt: 'Cover Image', subtitle: "Jan 13th: Inspiration is abundant, its our inspiration receptors that are fried. " },

    { slug: 'jan06', className: 'box right-top-n', aria: 'Right column narrow top', category: ["All New", "New Music"], src: augbencam, alt: 'Cover Image', subtitle: "Jan 06: Click for samples \n Yeah happy new year. \n Last year was good, this year is better. " },

  ];

  // Filtering is off here: the default filter is "All New", which would hide
  // the older posts on the one page that exists to show them.
  return (
    <PostGrid boxes={boxes} applyFilter={false} variant="archive">
      <Link to="/writing" className="archive-back">← Writing</Link>
    </PostGrid>
  );
}
