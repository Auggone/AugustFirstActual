// Pages/V2/VideoV2.js
// Video, at /video. Frame shared with the other pages: components/pastelFrame.
// Content: the existing video page (Pages/Articles/NewSubPages/videos), unchanged.
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import VideoPage from "../Articles/NewSubPages/videos/videopage";

// Background colors: greys and blacks, mostly dark, like charcoal on paper.
// Neutral (no blue in them). The first one breathes in and out.
const PALETTE = [
  "#cfcdc9", // pale grey (the light)
  "#9a9894", // ash
  "#74726e", // stone
  "#55534f", // graphite
  "#3a3936", // charcoal
  "#262523", // coal
  "#141413", // black
];

// Past the top and bottom of the background: a soft graphite
const EDGE = "#4a4846";

// The background is mostly dark, so the title, menu and icons are paper cream,
// with a soft dark shadow to stay readable over the lighter greys
const INK = "#f2ebdd";
const INK_SHADOW = "0 0 10px rgba(0, 0, 0, 0.55)";

export default function VideoV2() {
  return (
    <PastelFrame palette={PALETTE} edge={EDGE} ink={INK} inkShadow={INK_SHADOW} screens={1}>
      <div className="frame-media">
        <VideoPage />
      </div>
    </PastelFrame>
  );
}
