// Pages/HomeSample/homesample.js
// A copy of the homepage (Pages/HomePageV2/homev2.js) at /home-sample, for
// trying things out without touching the real one. Not linked from the menu.
// Class names start with "hs-" so its styles (homesample.css) never leak onto
// the real homepage. No intro and no ouroboros feature slot.
//
// Content: the homepage photos as "wallpaper" swatches (the preset picker
// style from evebouffard.com, see ~/Downloads/mini-image-spec.md), small 4:3
// tiles, each titled underneath. Click one and it grows into its full card,
// the photo and its quote as on the real homepage, while the others fade away;
// the back arrow (in the menu's place, as on a portfolio project) shrinks it
// back into the grid. The old list of quote cards is a feature
// (archive/home-sample-quotes), shown under the grid only while it's in
// src/features.
import { forwardRef, useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import FeatureSlot from "../../features/FeatureSlot";
import fishingThumb from "../../assets/thumbs/fishingstars.jpg";
import pinkTreeThumb from "../../assets/thumbs/pinktree.jpg";
import mollyBloomThumb from "../../assets/thumbs/mollybloom.jpg";
import museumCeilingThumb from "../../assets/thumbs/museumceiling.jpg";
import fishing from "../../assets/large/fishingstars.jpg";
import pinkTree from "../../assets/large/pinktree.jpg";
import mollyBloom from "../../assets/large/mollybloom.jpg";
import museumCeiling from "../../assets/large/museumceiling.jpg";
import "./homesample.css";

// The swatches, in order, with what each one opens into.
//   thumb:  the swatch (assets/thumbs, 128 × 96: about twice its size on screen)
//   src:    the card (assets/large, 1600px wide: sharp at the card's size on
//           retina screens, and quick enough to load for the grow animation)
//   layout: where the photo sits in the card, as on the real homepage:
//           "image-left", "image-right", "image-above" (text underneath)
//           or "image-below" (text on top)
const WALLPAPERS = [
  {
    name: "Star Fishing",
    thumb: fishingThumb,
    src: fishing,
    layout: "image-left",
    quote: (
      <>
        When he sacrifices himself, man for a moment is greater than God,{" "}
        <br /> for how can God, infinite and omnipotent, sacrifice himself?
      </>
    ),
  },
  {
    name: "Pink Tree",
    thumb: pinkTreeThumb,
    src: pinkTree,
    layout: "image-right",
    quote: (
      <>
        But man is not made for defeat. A man can be destroyed, but never
        defeated. <br /><br /> Beautiful pink trees stand tall beside dead people.
      </>
    ),
  },
  {
    name: "Permission",
    thumb: mollyBloomThumb,
    src: mollyBloom,
    layout: "image-right",
    quote: <>To see, we must forget the name of the thing we are looking at.</>,
  },
  {
    name: "Reflection",
    thumb: museumCeilingThumb,
    src: museumCeiling,
    layout: "image-above",
    quote: (
      <>
        Everyday that we don't look up at the sky, we are partaking in a
        punishment previously reserved for prisoners.
      </>
    ),
  },
];

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

// The grow and shrink: one smooth ease-out, the photo first, then the quote
const GROW = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };
const FADE = { duration: 0.3 };

// The portfolio's back arrow (PortfolioProject.js), as a button: it closes the
// open card rather than leaving the page. Uses the menu's own classes
// (navbartwo.css) so it sits where the menu does.
function BackArrow({ onBack }) {
  return (
    <nav className="sidebar">
      <button
        type="button"
        className="sidebar-item pf-back hs-back"
        aria-label="Back to all images"
        onClick={onBack}
      >
        ←
      </button>
    </nav>
  );
}

// The open card: the photo (which grows out of its swatch) and its quote.
// Takes a ref so AnimatePresence can lift it out of the layout as it leaves.
const OpenCard = forwardRef(function OpenCard({ wallpaper }, ref) {
  const { name, thumb, src, layout, quote } = wallpaper;
  return (
    <motion.div ref={ref} className={`hs-open ${layout}`}>
      {/* The thumbnail shows until the larger photo has loaded over it */}
      <motion.div
        layoutId={`hs-photo-${name}`}
        className="hs-open-photo"
        style={{ backgroundImage: `url(${thumb})`, borderRadius: 0 }}
        transition={GROW}
      >
        <img src={src} alt={name} />
      </motion.div>
      <motion.div
        className="hs-open-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ...FADE, duration: 0.5, delay: 0.45 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <p className="hs-open-quote">{quote}</p>
      </motion.div>
    </motion.div>
  );
});

export default function HomeSample() {
  const [open, setOpen] = useState(null);       // the open swatch's name
  const [lastOpen, setLastOpen] = useState(null); // marked in the grid on the way back
  const current = WALLPAPERS.find((w) => w.name === open);
  const close = useCallback(() => setOpen(null), []);

  // Fetch the card photos in the background, so they're ready when clicked
  useEffect(() => {
    WALLPAPERS.forEach(({ src }) => {
      new Image().src = src;
    });
  }, []);

  // Escape also goes back
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <PastelFrame
      palette={PALETTE}
      edge={EDGE}
      nav={current ? <BackArrow onBack={close} /> : undefined}
    >
      <div className="frame-media">
        {/* Follows the visitor's "reduce motion" setting */}
        <MotionConfig reducedMotion="user">
          {/* popLayout: whichever is leaving (grid or card) steps out of the
              way at once, so the arriving one takes the top spot */}
          <AnimatePresence initial={false} mode="popLayout">
            {current ? (
              <OpenCard key={current.name} wallpaper={current} />
            ) : (
              <motion.div
                key="grid"
                className="hs-wallpapers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: FADE }}
                exit={{ opacity: 0, transition: FADE }}
              >
                {WALLPAPERS.map(({ name, thumb }) => (
                  <div key={name} className="hs-wallpaper-item">
                    <button
                      type="button"
                      className={`hs-wallpaper${lastOpen === name ? " is-selected" : ""}`}
                      aria-label={`Open ${name}`}
                      onClick={() => {
                        setOpen(name);
                        setLastOpen(name);
                      }}
                    >
                      <motion.span
                        layoutId={`hs-photo-${name}`}
                        className="hs-wallpaper-photo"
                        style={{ backgroundImage: `url(${thumb})`, borderRadius: 6 }}
                        transition={GROW}
                      />
                    </button>
                    {/* the button already reads out the name */}
                    <span className="hs-wallpaper-title" aria-hidden="true">{name}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>

        {!current && <FeatureSlot name="home-sample-quotes" />}
      </div>
    </PastelFrame>
  );
}
