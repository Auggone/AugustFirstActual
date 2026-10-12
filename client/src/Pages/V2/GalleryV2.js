// Pages/V2/GalleryV2.js
// Gallery, at /gallery. Frame shared with the other pages: components/pastelFrame.
// Content: the existing gallery's featured photo (components/gallarydesigns).
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import { GalleryFeatured } from "../../components/gallarydesigns/gallaryD";
import "./GalleryV2.css";

// Background colors: shades of green, built around the moss and olive measured
// from the four abstract canvases. The first one breathes in and out.
const PALETTE = [
  "#e2e8c8", // pale green (the light)
  "#c5d98a", // spring
  "#b4c878", // leaf
  "#afab6f", // olive
  "#8fa146", // moss
  "#9fb38a", // sage
  "#6f8f4a", // fern
  "#4f7146", // forest (lifted a little so text stays readable)
];

// Past the top and bottom of the background: the moss, softened toward the paper cream
const EDGE = "#b0ba78";

export default function GalleryV2() {
  return (
    <PastelFrame palette={PALETTE} edge={EDGE} screens={1}>
      <div className="frame-media">
        <GalleryFeatured />
      </div>
    </PastelFrame>
  );
}
