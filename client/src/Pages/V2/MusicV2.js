// Pages/V2/MusicV2.js
// Music, at /music. Frame shared with the other pages: components/pastelFrame.
// Content: the existing music page (Pages/Articles/NewSubPages/music).
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import MusicPage from "../Articles/NewSubPages/music/musicpage";

// Background colors, measured from the fire pastel (peach, gold, terracotta).
// The first one breathes in and out.
const PALETTE = [
  "#efdaba", // bone
  "#e3a771", // peach
  "#eec88b", // gold
  "#f3de91", // butter
  "#bf8b68", // terracotta
  "#d7ab86", // sand
  "#a67a5e", // ember
];

// Past the top and bottom of the background: the peach, softened toward the paper cream
const EDGE = "#e8be95";

export default function MusicV2() {
  return (
    <PastelFrame palette={PALETTE} edge={EDGE} screens={1}>
      <div className="frame-media">
        <MusicPage />
      </div>
    </PastelFrame>
  );
}
