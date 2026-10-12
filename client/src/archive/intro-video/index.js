// features/intro-video
// The opening for HomePage v2: the dragon dance clip plays full screen as a
// pastel painting. Click (or tap, or press Enter) and the people melt into the
// background: they soften, sag, and fade from the middle outward, while the
// homepage fades in.
//
// Fills the "v2-intro" slot. While this feature is active, v2 waits for the
// click; while it's archived, v2 opens straight onto the background.
//
// Props from the page:
//   entered  true once the visitor has clicked
//   onEnter  call to tell the page the visitor clicked
//   pastel   the page's pastel settings, so the video matches the background
import { useEffect, useState } from "react";
import HalftoneVideo from "../../components/halftone/HalftoneVideo";
import PastelVideo from "../../components/pastel/PastelVideo";
import dragonDance from "../../assets/dragondance.mp4";
import "./intro.css";

// Which look the video uses: "pastel", "halftone", or "plain"
const VIDEO_LOOK = "pastel";

// How long the melt takes after the click, in seconds
const MELT_SECONDS = 4;

const MOBILE_QUERY = "(max-width: 768px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function IntroVideo({ entered, onEnter, pastel }) {
  const isMobile = useIsMobile();
  const [videoGone, setVideoGone] = useState(false);

  // once the melt finishes, remove the video so it stops using the graphics card
  useEffect(() => {
    if (!entered) return;
    const timer = setTimeout(() => setVideoGone(true), MELT_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [entered]);

  if (videoGone) return null;

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <section
      // the pastel look melts itself; the other looks fade out with CSS
      className={`intro-video${entered ? (VIDEO_LOOK === "pastel" ? " is-melting" : " is-fading") : ""}`}
      onClick={onEnter}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Enter the site"
    >
      {VIDEO_LOOK === "pastel" && (
        <PastelVideo
          className="intro-video-effect"
          src={dragonDance}
          {...pastel}
          melting={entered}
          meltDuration={MELT_SECONDS}
        />
      )}
      {VIDEO_LOOK === "halftone" && (
        // Phones get fewer, larger shapes so the halftone keeps the same look
        <HalftoneVideo
          className="intro-video-effect"
          src={dragonDance}
          cols={isMobile ? 60 : 140}
          threshold={0.22}
          shape="diamond"
        />
      )}
      {VIDEO_LOOK === "plain" && (
        <video
          className="intro-video-plain"
          src={dragonDance}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </section>
  );
}

const feature = {
  name: "intro-video",
  slots: {
    "v2-intro": IntroVideo,
  },
};

export default feature;
