// components/halftone/HalftoneVideo.js
// React wrapper for halftone-video.js. Fills whatever size you give it:
//   <HalftoneVideo src={clip} cols={140} className="my-box" />
import { useEffect, useRef } from "react";
import "./halftone-video.js"; // registers window.HalftoneVideo

export default function HalftoneVideo({ className, style, ...options }) {
  const box = useRef(null);
  const fx = useRef(null);

  // create once, remove on unmount
  useEffect(() => {
    if (!box.current) return;
    fx.current = window.HalftoneVideo.mount(box.current, options);
    return () => {
      fx.current?.destroy();
      fx.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pass setting changes through without rebuilding
  useEffect(() => {
    fx.current?.set(options);
  }, [JSON.stringify(options)]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} className={className} style={style} />;
}
