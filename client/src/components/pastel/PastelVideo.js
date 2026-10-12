// components/pastel/PastelVideo.js
// React wrapper for pastel-video.js. Fills whatever size you give it:
//   <PastelVideo src={clip} smudge={14} streak={18} className="my-box" />
// See DEFAULTS in pastel-video.js for every setting.
import { useEffect, useRef } from "react";
import { mount } from "./pastel-video";

export default function PastelVideo({ className, style, ...options }) {
  const box = useRef(null);
  const fx = useRef(null);

  // create once, remove on unmount
  useEffect(() => {
    if (!box.current) return;
    fx.current = mount(box.current, options);
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
