import React from "react";
import "./gallaryD.css";
import featuredImage from "../../assets/AugustFirstWaitingForPhotos.jpeg";

/* =====================================================================
   OLD 3-PANEL FAN GALLERY VIEW — kept for reference, not rendered.
   To restore: uncomment this block, delete the featured-image component
   below, and add `useState` back to the React import.
   ---------------------------------------------------------------------
import { useState } from "react";

const context = require.context("../../assets/Halftones", false, /\.(png|jpe?g|svg|webp)$/);
const images = Object.fromEntries(
  context.keys().map((path) => [
    path.replace(/^\.\//, "").replace(/\.[^.]+$/, ""),
    context(path)
  ])
);

const FANS = [
  {
    preview: [
      { label: "Photo 1", src: images.red },
      { label: "Photo 2", src: images.orange },
      { label: "Photo 3", src: images.rose },
      { label: "Photo 4", src: images.pink },
    ],
    expanded: [
      { label: "Photo 1", src: images.red },
      { label: "Photo 2", src: images.orange },
      { label: "Photo 3", src: images.rose },
      { label: "Photo 4", src: images.pink },
    ],
  },
];

const POSITIONS = ["fc-l", "fc-m", "fc-r"];

function FanGalleryPage() {
  const [selectedFan, setSelectedFan] = useState(null);

  return (
    <main className="gallery-page">
      <div className="gallery">
        {FANS.map((fan, fi) => (
          <div key={fi} className="fan" onClick={() => setSelectedFan(fi)}>
            {fan.preview.map((card, ci) => (
              <div key={ci} className={`fan-card ${POSITIONS[ci]}`}>
                {card.src
                  ? <img src={card.src} alt={card.label} />
                  : <span className="card-placeholder">{card.label}</span>
                }
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedFan !== null && (
        <div className="overlay" onClick={() => setSelectedFan(null)}>
          <div className="expanded-row" onClick={(e) => e.stopPropagation()}>
            {FANS[selectedFan].expanded.map((card, ci) => (
              <div
                key={ci}
                className="expanded-card"
                style={{ animationDelay: `${ci * 0.07}s` }}
              >
                {card.src
                  ? <img src={card.src} alt={card.label} />
                  : <span className="card-placeholder">{card.label}</span>
                }
              </div>
            ))}
          </div>
          <span className="close-hint">click anywhere to close</span>
        </div>
      )}
    </main>
  );
}
   ===================================================================== */

// The featured photo and caption, on their own (the v2 Gallery uses this inside its frame)
export function GalleryFeatured() {
  return (
    <figure className="gallery-figure">
      <img
        className="gallery-featured"
        src={featuredImage}
        alt="August"
      />
      <figcaption className="gallery-caption">film being processed atm</figcaption>
    </figure>
  );
}

export default function GalleryPage() {
  return (
    <main className="gallery-page">
      <GalleryFeatured />
    </main>
  );
}
