// Pages/HomePageV2/homev2.js
// The homepage, at /. The frame (background, pinned title, menu and social
// links) is shared with the other pages: components/pastelFrame.
//
// Colors: the fire behind Zuko and Aang in the dragon dance clip.
//
// Optional intro: the "intro-video" feature fills the v2-intro slot. While it's
// in src/features, the clip plays first and melts into this page on click;
// while it's in src/archive, the page opens straight onto the background.
import { useState } from "react";
import PastelFrame, { PASTEL } from "../../components/pastelFrame/PastelFrame";
import FeatureSlot from "../../features/FeatureSlot";
import { getSlotComponents } from "../../features/registry";

// Background colors, measured from the fire. The first one breathes in and out.
const PALETTE = [
  "#e6dbe4", // bone white
  "#e39dbf", // pink
  "#a37fe0", // violet
  "#c466a0", // magenta
  "#d75a6b", // rose red
  "#dc4335", // vermilion
  "#e27746", // orange
];

// Past the top and bottom of the background: the violet, softened about a third
// of the way toward the paper cream for a chalkier pastel
const EDGE = "#c7b2df";

// Is the intro feature active (in src/features)?
const HAS_INTRO = getSlotComponents("v2-intro").length > 0;

export default function HomePageV2() {
  // without the intro, the visitor is "in" from the start
  const [entered, setEntered] = useState(!HAS_INTRO);

  return (
    <PastelFrame
      palette={PALETTE}
      edge={EDGE}
      entered={entered}
      beforeContent={
        <FeatureSlot
          name="v2-intro"
          entered={entered}
          onEnter={() => setEntered(true)}
          pastel={PASTEL}
        />
      }
    >
      {/* Media goes here: it scrolls, with the background, underneath the
          pinned title, menu and social links */}
    </PastelFrame>
  );
}
