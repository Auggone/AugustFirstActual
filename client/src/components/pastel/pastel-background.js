// components/pastel/pastel-background.js
// A living pastel background: a slow swirl of colors, painted with the same
// pastel finish as the video (see pastel-gl.js).
//
// When it starts it churns fast like the fire in the clip, in place (rise: 0) or
// rising like flames (rise: 1). Over a few seconds it slows into a calm swirl
// that pulses, with the bone white swelling and fading like breathing.
//
// How each frame is made:
//   1. Field: layered, warped noise makes soft, swirling shapes; each spot picks
//      its color from the palette, walking around it slowly over time.
//   2. Finish: smudged into strokes with paper grain and chalk, like the video.
//
// Tall pages: the background can be as tall as the page and scrolls with it,
// but each frame only the part on screen (plus half a screen above and below)
// is repainted, so a long page costs about the same as a short one. Swirl size
// is measured against the screen height, not the page height, so it doesn't
// change with page length.

import {
  FINISH_DEFAULTS, PRECISION, NOISE, compile, makeTarget, bindQuad, fitCanvas, createFinish, hexToRgb,
} from "./pastel-gl";

export const DEFAULTS = {
  ...FINISH_DEFAULTS,
  // Colors to swirl through; the first one is the light that breathes in and out
  palette: ["#e6dbe4", "#e39dbf", "#a37fe0", "#c466a0", "#d75a6b", "#dc4335", "#e27746"],
  playing: true,      // false = mounted but waiting (no drawing)
  scale: 2.2,         // swirl size: higher = more, smaller swirls
  fireSpeed: 1.0,     // speed at the start, like the fire
  rise: 1,            // 1 = flames stretch tall and rise at the start, 0 = churn in place
  calmSpeed: 0.07,    // speed once it settles
  settle: 5,          // seconds to slow from fire to calm (0 = start calm, no fire)
  pulse: 7,           // seconds per breath once calm
  detail: 0.15,       // resolution of the swirl before the finish (it's soft, so low is fine)
  fps: 30,
};

const MAX_COLORS = 8;
const MAX_CANVAS_PIXELS = 12e6;  // stays under phone canvas limits on very tall pages
const REPAINT_MARGIN = 0.5;      // screens above and below the visible part kept repainted

const FIELD = PRECISION + `
uniform float uTime;       // advances with the speed, so slowing down never jumps
uniform float uClock;      // real seconds since start, for the breathing
uniform float uFire;       // 1 = fire (fast), 0 = calm
uniform float uRise;       // how much the fire stretches tall and rises
uniform float uPulse;      // seconds per breath
uniform float uScale;
uniform vec2 uAspect;
uniform vec3 uPalette[${MAX_COLORS}];
uniform float uCount;      // how many palette colors are used
varying vec2 vUv;
` + NOISE + `
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// Smoothly walk around the palette like a color wheel; t is 0..1
vec3 palette(float t) {
  float pos = fract(t) * uCount;
  vec3 c = vec3(0.0);
  float total = 0.0;
  for (int i = 0; i < ${MAX_COLORS}; i++) {
    if (float(i) >= uCount) break;
    float d = abs(pos - float(i));
    d = min(d, uCount - d);                 // wrap around the wheel
    float w = 1.0 - smoothstep(0.0, 1.0, d);
    c += uPalette[i] * w;
    total += w;
  }
  return c / max(total, 1e-4);
}

void main() {
  vec2 p = vUv * uAspect * uScale;
  // flames: stretched tall and rising while the fire lasts
  p.y *= mix(1.0, 0.55, uFire * uRise);
  p.y -= uTime * 1.2 * uFire * uRise;

  vec2 q = vec2(fbm(p + vec2(0.0, uTime * 0.3)), fbm(p + vec2(5.2, 1.3) - uTime * 0.25));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + uTime * 0.15),
                fbm(p + 3.0 * q + vec2(8.3, 2.8) - uTime * 0.12));
  float f = fbm(p + 3.0 * r);

  // breathing, which grows in as the fire calms down
  float breath = sin(uClock * 6.2831 / uPulse) * 0.5 + 0.5;
  float calm = 1.0 - uFire;

  vec3 c = palette(f * 1.6 + r.x * 0.4 + uTime * 0.04);
  // the light swells over the swirl with each breath
  float light = smoothstep(0.5, 0.85, f + (breath - 0.5) * 0.18 * calm);
  c = mix(c, uPalette[0], light * (0.45 + 0.25 * breath * calm));
  c *= 0.94 + 0.08 * breath * calm;

  gl_FragColor = vec4(c, 1.0);
}`;

export function mount(container, options) {
  if (!container) throw new Error("PastelBackground: no container element given");
  const S = { ...DEFAULTS };
  Object.keys(options || {}).forEach((k) => { if (options[k] !== undefined) S[k] = options[k]; });

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (getComputedStyle(container).position === "static") container.style.position = "relative";
  container.style.overflow = "hidden";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "display:block;position:absolute;inset:0;width:100%;height:100%;";
  // hidden while waiting, so a blank canvas never shows
  canvas.style.visibility = S.playing ? "visible" : "hidden";
  container.appendChild(canvas);

  // preserveDrawingBuffer: parts off screen keep their last painting between frames
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true });
  let field, finish;
  try {
    if (!gl) throw new Error("no WebGL");
    field = compile(gl, FIELD);
    finish = createFinish(gl);
  } catch (e) {
    // no effect available: a still gradient in the same colors
    console.warn("PastelBackground: falling back to a still gradient.", e.message);
    canvas.remove();
    container.style.background = `linear-gradient(135deg, ${S.palette.join(", ")})`;
    return { set() {}, destroy() { container.style.background = ""; } };
  }

  bindQuad(gl, [field, finish.program]);
  const paint = makeTarget(gl);

  let running = true, visible = true, raf = 0;

  let startedAt = 0, lastFrame = 0, lastDraw = 0, time = 0;
  let paintedW = 0, paintedH = 0;

  // Swirl size is measured against this; it only changes when the width does
  // (rotating a phone), not when the phone's toolbars slide in and out
  let screenH = window.innerHeight, screenW = window.innerWidth;
  function referenceHeight() {
    if (window.innerWidth !== screenW) { screenW = window.innerWidth; screenH = window.innerHeight; }
    return screenH;
  }

  // The rows of the canvas on screen, plus a margin, in canvas pixels
  // (canvas rows count up from the bottom); null if none are on screen
  function visibleBand(box) {
    const rect = container.getBoundingClientRect();
    const margin = window.innerHeight * REPAINT_MARGIN;
    const top = Math.max(0, -rect.top - margin);
    const bottom = Math.min(box.H, window.innerHeight - rect.top + margin);
    if (bottom <= top) return null;
    return { y: Math.floor((box.H - bottom) * box.dpr), h: Math.ceil((bottom - top) * box.dpr) };
  }

  // 1 at the start (fire), easing to 0 (calm) over `settle` seconds
  function fireAmount(seconds) {
    if (reduced || S.settle <= 0) return 0;
    const t = Math.min(1, seconds / S.settle);
    return 1 - t * t * (3 - 2 * t);
  }

  function draw(clock) {
    const box = fitCanvas(canvas, container, MAX_CANVAS_PIXELS);
    if (!box) return;

    // Repaint everything after a resize (resizing wipes the canvas), otherwise
    // just the part on screen
    const full = reduced || box.cw !== paintedW || box.ch !== paintedH;
    const band = full ? null : visibleBand(box);
    if (!full && !band) return;
    const pw = Math.max(8, Math.round(box.W * S.detail)), ph = Math.max(8, Math.round(box.H * S.detail));
    paint.size(pw, ph);

    const colors = S.palette.slice(0, MAX_COLORS);
    const flat = new Float32Array(MAX_COLORS * 3);
    colors.forEach((hex, i) => flat.set(hexToRgb(hex), i * 3));

    gl.bindFramebuffer(gl.FRAMEBUFFER, paint.fbo);
    gl.viewport(0, 0, pw, ph);
    gl.useProgram(field.program);
    const u = field.uniforms;
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uClock, clock);
    gl.uniform1f(u.uFire, fireAmount(clock));
    gl.uniform1f(u.uRise, S.rise);
    gl.uniform1f(u.uPulse, S.pulse);
    gl.uniform1f(u.uScale, S.scale);
    const refH = referenceHeight();
    gl.uniform2f(u.uAspect, box.W / refH, box.H / refH);
    gl.uniform3fv(u["uPalette[0]"], flat);
    gl.uniform1f(u.uCount, colors.length);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (band) {
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(0, band.y, box.cw, band.h);
    }
    finish.draw(paint, box, S);
    gl.disable(gl.SCISSOR_TEST);
    paintedW = box.cw; paintedH = box.ch;
  }

  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (!S.playing) { startedAt = 0; return; }
    if (!startedAt) { startedAt = now; lastFrame = now; }
    const clock = (now - startedAt) / 1000;
    // time moves at the current speed, so easing from fire to calm is smooth
    const dt = Math.min(0.1, (now - lastFrame) / 1000);
    lastFrame = now;
    const fire = fireAmount(clock);
    time += dt * (S.calmSpeed + (S.fireSpeed - S.calmSpeed) * fire);
    if (!visible || document.hidden) return;
    if (now - lastDraw < 1000 / S.fps) return;
    lastDraw = now;
    draw(clock);
  }

  // pause work while scrolled out of view
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; });
    io.observe(container);
  }

  let ro = null;
  if ("ResizeObserver" in window) {
    ro = new ResizeObserver(() => { lastDraw = 0; if (reduced && S.playing) draw(0); });
    ro.observe(container);
  }

  if (reduced) {
    // people who ask their device for less motion get a still, calm frame
    if (S.playing) draw(0);
  } else {
    raf = requestAnimationFrame(loop);
  }

  return {
    set(newOptions) {
      const wasPlaying = S.playing;
      Object.keys(newOptions).forEach((k) => { if (newOptions[k] !== undefined) S[k] = newOptions[k]; });
      canvas.style.visibility = S.playing ? "visible" : "hidden";
      lastDraw = 0;
      if (reduced && S.playing && !wasPlaying) draw(0);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      canvas.remove();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    },
  };
}
