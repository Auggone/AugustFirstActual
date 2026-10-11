'use client';
// React wrapper for halftone-video.js.
// 1. Put halftone-video.js in your project (e.g. src/lib/halftone-video.js).
// 2. Use: <HalftoneVideo src="/clip.mp4" cols={140} className="w-full h-[600px]" />
//    The component fills whatever size you give it.

import { useEffect, useRef } from 'react';
import '../lib/halftone-video.js'; // adjust this path; the file registers window.HalftoneVideo

type Options = {
  src: string;
  cols?: number;
  threshold?: number;
  size?: number;
  shape?: 'diamond' | 'square' | 'circle';
  mode?: 'source' | 'grey' | 'tint';
  saturation?: number;
  tint?: string;
  background?: string;
  dark?: boolean;
  invert?: boolean;
  fps?: number;
  crossOrigin?: 'anonymous' | null;
};

type Instance = { set: (o: Partial<Options>) => void; destroy: () => void };

declare global {
  interface Window {
    HalftoneVideo: { mount: (el: HTMLElement, o: Options) => Instance };
  }
}

export default function HalftoneVideo({ className, style, ...options }: Options & { className?: string; style?: React.CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const fx = useRef<Instance | null>(null);

  // create once, remove on unmount
  useEffect(() => {
    if (!box.current) return;
    fx.current = window.HalftoneVideo.mount(box.current, options);
    return () => { fx.current?.destroy(); fx.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pass setting changes through without rebuilding
  useEffect(() => {
    fx.current?.set(options);
  }, [JSON.stringify(options)]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} className={className} style={style} />;
}
