// components/pastel/PastelBackground.js
// React wrapper for pastel-background.js. Fills whatever size you give it:
//   <PastelBackground palette={[...]} playing={started} className="my-box" />
// See DEFAULTS in pastel-background.js for every setting.
import { useEffect, useRef } from "react";
import { mount } from "./pastel-background";

export default function PastelBackground({ className, style, ...options }) {
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
