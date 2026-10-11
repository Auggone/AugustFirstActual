import { useState } from "react";
import "./videopage.css";

const VIDEO_ID = "iZvTTAoTamU"; // Replace with your YouTube video ID

export default function VideoPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="page">
      <div className="video-wrapper">
        {!loaded && <div className="skeleton" />}
        <iframe
          className={`video-frame ${loaded ? "visible" : ""}`}
          src={`https://www.youtube.com/embed/${VIDEO_ID}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
