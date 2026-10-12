// Pages/V2/WritingV2.js
// Writing, at /writing, and its archive, at /writing/archive.
// Frame shared with the other v2 pages: components/pastelFrame.
// Content: the same post cards as the current writing pages (the lists live in
// homePage.js and archivePage.js, so adding a post updates both).
import { Link } from "react-router-dom";
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import PostGrid from "../../components/postgrid/postGrid";
import FeatureSlot from "../../features/FeatureSlot";
import { WRITING_POSTS } from "../../homePage";
import { ARCHIVE_POSTS } from "../Articles/NewSubPages/writing/archive/archivePage";
import "./WritingV2.css";

// Background colors, measured from the blue fire shield (Blue_fire_shield.webp).
// The first one breathes in and out.
const PALETTE = [
  "#d9f4f6", // ice glow (the shield's palest aqua, softened toward the paper cream)
  "#9cfcf9", // aqua
  "#67e2f4", // bright cyan
  "#20c5f7", // azure
  "#3c95cc", // cerulean
  "#4a7f92", // deep teal (the shadows, lifted a little so text stays readable)
];

// Past the top and bottom of the background: the azure, softened toward the paper cream
const EDGE = "#80cde2";

export default function WritingV2() {
  return (
    <PastelFrame palette={PALETTE} edge={EDGE} screens={1}>
      <div className="frame-media">
        {/* The "Archive" link: the writing-archive-link feature (in src/archive for now) */}
        <FeatureSlot name="v2-writing-links" />
        <PostGrid boxes={WRITING_POSTS} withNav={false} />
      </div>
    </PastelFrame>
  );
}

// Filtering is off here: the default filter is "All New", which would hide the
// older posts on the one page that exists to show them
export function WritingArchiveV2() {
  return (
    <PastelFrame palette={PALETTE} edge={EDGE} screens={1}>
      <div className="frame-media">
        <Link to="/writing" className="writing-link">← Writing</Link>
        <PostGrid boxes={ARCHIVE_POSTS} applyFilter={false} variant="archive" withNav={false} />
      </div>
    </PastelFrame>
  );
}
