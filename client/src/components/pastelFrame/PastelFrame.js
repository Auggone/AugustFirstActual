// components/pastelFrame/PastelFrame.js
// The shared frame for the v2 pages: a pulsing pastel background in the page's
// own colors, with the title, menu and social links pinned on top. The page's
// content (children) scrolls, with the background, underneath them.
//
//   <PastelFrame palette={[...]} edge="#c7b2df">
//     {page content}
//   </PastelFrame>
//
// Phones run edge to edge: the background shows behind the clock and behind
// Safari's toolbar (see the runway and bleed notes below and in PastelFrame.css).
import { useEffect, useRef } from "react";
import PastelBackground from "../pastel/PastelBackground";
import Header from "../header/header";
import NavBarTwo from "../../Pages/Articles/NewHomePage/navbartwo";
import SocialLinks from "../links/links";
import "./PastelFrame.css";

// Pastel look, shared by every page's background (and the home intro video) so
// they match. Every setting is explained in components/pastel/pastel-video.js
// and pastel-gl.js (DEFAULTS). Sizes are in screen pixels.
export const PASTEL = {
  detail: 0.12,      // how much of the picture survives; lower = blobbier
  smudge: 60,        // size of the color blobs
  blend: 0.45,       // how much neighboring colors bleed together (0–1)
  streak: 36,        // length of the smudge strokes
  strokeAngle: -35,  // direction strokes sweep in flat areas (degrees)
  grain: 0.6,        // paper texture and drag marks (0–1)
  chalk: 0.45,       // chalky paper specks (0–1)
  saturation: 1.15,  // color strength (1 = original colors)
  haze: 0.12,        // chalky film over everything (0–1)
  paper: "#f2ebdd",  // paper color
};

// How the background moves, the same on every page. Every setting is explained
// in components/pastel/pastel-background.js (DEFAULTS).
const MOTION = {
  settle: 5,         // seconds the fast churn takes to settle into the pulse (0 = start calm)
  rise: 0,           // 0 = churn in place, 1 = flames stretch tall and slide upward
  calmSpeed: 0.07,   // swirl speed once calm
  pulse: 7,          // seconds per breath
  scale: 2.2,        // swirl size: higher = more, smaller swirls
};

// Phones: iPhone Safari only shows the page behind the clock once the page is
// scrolled, so pages open scrolled down onto a strip of background (the runway)
// that sits behind the clock, with the title just below.
//   RUNWAY_PX: background above the opening point; scroll up this far to reach
//              the edge color at the top
//   BLEED_PX:  background past the bottom of the screen; scroll down this far
//              to reach the edge color at the bottom
const RUNWAY_PX = 160;
const BLEED_PX = 320;
const PHONE_QUERY = "(max-width: 768px)";

// Where the frame's pages live; the title and menu link within them
const BASE = "";

// Each page opens at its top: on phones, just past the runway
function useOpenAtTop() {
  useEffect(() => {
    window.scrollTo(0, window.matchMedia(PHONE_QUERY).matches ? RUNWAY_PX : 0);
  }, []);
}

// What shows past the top and bottom of the background if you scroll that far
function useEdgeColor(edge) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = edge;
    return () => { document.documentElement.style.backgroundColor = ""; };
  }, [edge]);
}

// Measures the title (and its underline) and shares its width with the page as
// --frame-title-width, so content can line up with it
function useTitleWidth(page) {
  useEffect(() => {
    const title = page.current?.querySelector(".frame-top a.logo");
    if (!title || !("ResizeObserver" in window)) return;
    let raf = 0;
    // applied on the next frame: changing layout while sizes are being reported
    // makes the browser complain (a "ResizeObserver loop" error)
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const width = `${title.getBoundingClientRect().width}px`;
        if (page.current && page.current.style.getPropertyValue("--frame-title-width") !== width) {
          page.current.style.setProperty("--frame-title-width", width);
        }
      });
    });
    ro.observe(title);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [page]);
}

export default function PastelFrame({
  palette,           // background colors; the first one breathes in and out
  edge,              // color past the top and bottom of the background
  ink = "#000",      // color of the title, menu and social icons
  inkShadow = "none", // soft shadow behind them, for dark or busy backgrounds
  screens = 3,       // how long the page is, in screens
  entered = true,    // false = background waits and the frame stays hidden (home intro)
  beforeContent,     // rendered between the background and the frame (home intro)
  children,          // the page's content; scrolls under the pinned pieces
}) {
  const page = useRef(null);
  useOpenAtTop();
  useEdgeColor(edge);
  useTitleWidth(page);

  return (
    <main
      ref={page}
      className="frame-page"
      style={{
        "--frame-runway": `${RUNWAY_PX}px`,
        "--frame-bleed": `${BLEED_PX}px`,
        "--frame-screens": screens,
        "--frame-edge": edge,
        "--frame-ink": ink,
        "--frame-ink-shadow": inkShadow,
      }}
    >
      <PastelBackground
        className="frame-background"
        {...PASTEL}
        {...MOTION}
        palette={palette}
        playing={entered}
      />

      {beforeContent}

      {/* With the home intro, invisible and unclickable until the click */}
      <div className={`frame-content${entered ? " is-visible" : ""}`} inert={!entered}>
        {/* Pinned to the screen, always visible and clickable: the title and menu
            at the top (desktop: navbartwo.css pins the menu to the left edge;
            phones: a row under the title), the social links at the bottom left */}
        <div className="frame-top">
          <Header to={BASE || "/"} />
          <div className="frame-nav">
            <NavBarTwo base={BASE} />
          </div>
        </div>
        <div className="frame-social">
          <SocialLinks />
        </div>

        {children}
      </div>
    </main>
  );
}
