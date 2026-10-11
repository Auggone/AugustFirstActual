import { useState } from "react";
import "./musicpage.css";

// --- HOW TO ADD YOUR MUSIC ---------------------------------------------
// 1. Drop your .mp4 file into this folder:
//      src/Pages/Articles/NewSubPages/music/
// 2. Uncomment the import below and point it at your file name:
//      import musicSrc from "./my-track.mp4";
// 3. Delete the `null` line right under it.
// -----------------------------------------------------------------------
// import musicSrc from "./my-track.mp4";
const musicSrc = null; // ← replace with the imported mp4 above

export default function MusicPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="music-page">
      <div className="music-wrapper">
        {!loaded && musicSrc && <div className="skeleton" />}
        {musicSrc ? (
          <video
            className={`music-frame ${loaded ? "visible" : ""}`}
            src={musicSrc}
            controls
            playsInline
            onLoadedData={() => setLoaded(true)}
          />
        ) : (
          <div className="music-placeholder">
            mp4 coming soon
          </div>
        )}
      </div>
    </div>
  );
}
