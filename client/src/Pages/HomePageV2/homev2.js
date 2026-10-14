// Pages/HomePageV2/homev2.js
// The homepage, at /. The frame (background, pinned title, menu and social
// links) is shared with the other pages: components/pastelFrame.
//
// Colors: the fire behind Zuko and Aang in the dragon dance clip.
//
// Optional intro: the "intro-video" feature fills the v2-intro slot. While it's
// in src/features, the clip plays first and melts into this page on click;
// while it's in src/archive, the page opens straight onto the background.
//
// Content: the photos as "wallpaper" swatches (the preset picker style from
// evebouffard.com), small 4:3 tiles, each titled underneath. Click one and it
// grows into its full card, the photo and its quote, while the others fade
// away; the back arrow (in the menu's place, as on a portfolio project)
// shrinks it back into the grid. Styles in homev2.css.
// Worked out first on the sample homepage (Pages/HomeSample), which stays as
// a place to try things.
import { forwardRef, useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import PastelFrame, { PASTEL } from "../../components/pastelFrame/PastelFrame";
import FeatureSlot from "../../features/FeatureSlot";
import { getSlotComponents } from "../../features/registry";
import noGodThumb from "../../assets/thumbs/nogod.jpg";
import fishingThumb from "../../assets/thumbs/fishingstars.jpg";
import pinkTreeThumb from "../../assets/thumbs/pinktree.jpg";
import mollyBloomThumb from "../../assets/thumbs/mollybloom.jpg";
import museumCeilingThumb from "../../assets/thumbs/museumceiling.jpg";
import noGod from "../../assets/large/nogod.jpg";
import fishing from "../../assets/large/fishingstars.jpg";
import pinkTree from "../../assets/large/pinktree.jpg";
import mollyBloom from "../../assets/large/mollybloom.jpg";
import museumCeiling from "../../assets/large/museumceiling.jpg";
import "./homev2.css";

// The swatches, newest first, with what each one opens into.
//   thumb:  the swatch (assets/thumbs, 128 × 96: about twice its size on screen)
//   src:    the card (assets/large, about 1600px wide, or 1100px tall for wide
//           photos: sharp at the card's size on retina screens, and quick
//           enough to load for the grow animation)
//   layout: where the photo sits in the card:
//           "image-left", "image-right", "image-above" (text underneath)
//           or "image-below" (text on top)
//   quote:  optional; without one, the quote's half of the card stays empty
//   credit: optional { text, href }: who said it, small and in italics under
//           the quote, linking out (opens in a new tab)
const WALLPAPERS = [
  {
    name: "Memory",
    thumb: noGodThumb,
    src: noGod,
    layout: "image-right",
    quote: (
      <>
        See that, sir. It is a relic of the Imperium. The ornament benches, built
        for lovers, linger on, fresh and useful, while the factories and palaces
        collapse into unremembered ruin
      </>
    ),
    credit: {
      text: "Foundation and Empire",
      href: "https://www.goodreads.com/en/book/show/29581.Foundation_and_Empire",
    },
  },
  {
    name: "Star Fishing",
    thumb: fishingThumb,
    src: fishing,
    layout: "image-right",
    quote: (
      <>
        When he sacrifices himself, man for a moment is greater than God,{" "}
        <br /> for how can God, infinite and omnipotent, sacrifice himself?
      </>
    ),
    credit: {
      text: "The Razor's Edge",
      href: "https://en.wikipedia.org/wiki/The_Razor%27s_Edge",
    },
  },
  {
    name: "Contrastic",
    thumb: pinkTreeThumb,
    src: pinkTree,
    layout: "image-right",
    quote: (
      <>
        But man is not made for defeat. A man can be destroyed, but never
        defeated. <br /><br /> Beautiful pink trees stand tall beside dead people.
      </>
    ),
    credit: {
      text: "The Old Man and the Sea",
      href: "https://ca.pinterest.com/search/pins/?q=the%20old%20man%20and%20the%20sea&rs=typed",
    },
  },
  {
    name: "Permission",
    thumb: mollyBloomThumb,
    src: mollyBloom,
    layout: "image-right",
    quote: <>To see, we must forget the name of the thing we are looking at.</>,
    credit: {
      text: "Claude Monet",
      href: "https://ca.pinterest.com/search/pins/?q=claude%20monet&rs=typed",
    },
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
    credit: {
      text: "Light Dark Light",
      href: "https://www.youtube.com/watch?v=14NvwgZhzSI",
    },
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

// Is the intro feature active (in src/features)?
const HAS_INTRO = getSlotComponents("v2-intro").length > 0;

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
        className="sidebar-item pf-back home-back"
        aria-label="Back to all images"
        onClick={onBack}
      >
        ←
      </button>
    </nav>
  );
}

// The open card: the photo (which grows out of its swatch) and its quote,
// then (phones only) the back arrow underneath; on desktop the arrow is in
// the menu's place instead. Takes a ref so AnimatePresence can lift it out of
// the layout as it leaves.
const OpenCard = forwardRef(function OpenCard({ wallpaper, onBack }, ref) {
  const { name, thumb, src, layout, quote, credit } = wallpaper;
  return (
    <motion.div ref={ref} className="home-open-wrap">
      <div className={`home-open ${layout}`}>
        {/* The thumbnail shows until the larger photo has loaded over it */}
        <motion.div
          layoutId={`home-photo-${name}`}
          className="home-open-photo"
          style={{ backgroundImage: `url(${thumb})`, borderRadius: 0 }}
          transition={GROW}
        >
          <img src={src} alt={name} />
        </motion.div>
        {quote && (
          <motion.div
            className="home-open-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { ...FADE, duration: 0.5, delay: 0.45 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <p className="home-open-quote">{quote}</p>
            {credit && (
              <a
                className="home-open-credit"
                href={credit.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {credit.text}
              </a>
            )}
          </motion.div>
        )}
      </div>
      <motion.div
        className="home-back-below"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ...FADE, duration: 0.5, delay: 0.45 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <button
          type="button"
          className="sidebar-item pf-back home-back"
          aria-label="Back to all images"
          onClick={onBack}
        >
          ←
        </button>
      </motion.div>
    </motion.div>
  );
});

export default function HomePageV2() {
  // without the intro, the visitor is "in" from the start
  const [entered, setEntered] = useState(!HAS_INTRO);
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
      entered={entered}
      beforeContent={
        <FeatureSlot
          name="v2-intro"
          entered={entered}
          onEnter={() => setEntered(true)}
          pastel={PASTEL}
        />
      }
      nav={current ? <BackArrow onBack={close} /> : undefined}
    >
      {/* Scrolls, with the background, underneath the pinned title, menu and
          social links */}
      <div className="frame-media">
        {/* Follows the visitor's "reduce motion" setting */}
        <MotionConfig reducedMotion="user">
          {/* popLayout: whichever is leaving (grid or card) steps out of the
              way at once, so the arriving one takes the top spot */}
          <AnimatePresence initial={false} mode="popLayout">
            {current ? (
              <OpenCard key={current.name} wallpaper={current} onBack={close} />
            ) : (
              <motion.div
                key="grid"
                className="home-wallpapers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: FADE }}
                exit={{ opacity: 0, transition: FADE }}
              >
                {WALLPAPERS.map(({ name, thumb }) => (
                  <div key={name} className="home-wallpaper-item">
                    <button
                      type="button"
                      className={`home-wallpaper${lastOpen === name ? " is-selected" : ""}`}
                      aria-label={`Open ${name}`}
                      onClick={() => {
                        setOpen(name);
                        setLastOpen(name);
                      }}
                    >
                      <motion.span
                        layoutId={`home-photo-${name}`}
                        className="home-wallpaper-photo"
                        style={{ backgroundImage: `url(${thumb})`, borderRadius: 6 }}
                        transition={GROW}
                      />
                    </button>
                    {/* the button already reads out the name */}
                    <span className="home-wallpaper-title" aria-hidden="true">{name}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </PastelFrame>
  );
}
