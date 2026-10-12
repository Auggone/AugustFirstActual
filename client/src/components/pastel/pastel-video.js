// components/pastel/pastel-video.js
// Redraws a video live as a smudged pastel drawing, using the graphics card (WebGL).
//
// How each frame is made:
//   1. Soak: the frame is averaged down to a tiny image, so small details
//      (eyes, hair strands, seams) melt away before any painting happens.
//   2. Patches: that tiny image becomes flat blobs of color (a Kuwahara filter),
//      with neighboring colors bleeding into each other (blend).
//   3. Strokes: those patches are dragged along the shapes in the image,
//      like a finger smudging pastel along a cloud or a flame.
//   4. Finish: paper grain, drag marks, chalky specks where the pastel skipped
//      the paper, and creamy highlights (shared with the background, see pastel-gl.js).
//
// Melt: set melting to true and over meltDuration seconds the figures soften
// (blobs swell and run together) and the paint sags downward, while a soft fade
// spreads from the middle outward, showing whatever is behind it.
//
// The video must be hosted on the same site as the page (browsers block reading
// pixels from other sites). If the browser has no WebGL, the plain video shows instead.

import {
  FINISH_DEFAULTS, PRECISION, compile, makeTexture, makeTarget, bindQuad, fitCanvas, createFinish,
} from "./pastel-gl";

export const DEFAULTS = {
  ...FINISH_DEFAULTS,
  src: "",
  detail: 0.12,       // how much of the picture survives; lower = blobbier (0.05–0.5)
  smudge: 60,         // size of the color blobs, in screen pixels (10–120)
  blend: 0.45,        // how much neighboring colors bleed together (0 = crisp blob edges, 1 = soft mush)
  fps: 24,            // max frames drawn per second (the clip is 24fps)
  melting: false,     // true starts the melt
  meltDuration: 4,    // seconds the melt takes
  meltSpread: 4,      // how many times bigger the blobs swell by the end of the melt
  meltDrip: 0.08,     // how far the paint sags by the end, as a share of the screen height
};

const MAX_RADIUS = 8; // largest blob radius the shader supports, in tiny-image pixels

// Pass 1: soak. Each pixel of the tiny image is the average of the whole patch of
// video it covers, so details are averaged away instead of flickering in and out.
const SOAK = PRECISION + `
uniform sampler2D uVideo;
uniform vec2 uTexel;      // one tiny-image pixel, in uv units
uniform vec2 uCropScale;  // crop the video to fill the box (object-fit: cover)
uniform vec2 uCropOffset;
varying vec2 vUv;

void main() {
  vec3 sum = vec3(0.0);
  for (int j = 0; j < 6; j++) {
    for (int i = 0; i < 6; i++) {
      vec2 uv = vUv + (vec2(float(i), float(j)) / 5.0 - 0.5) * uTexel * 1.6;
      sum += texture2D(uVideo, uCropOffset + clamp(uv, 0.0, 1.0) * uCropScale).rgb;
    }
  }
  gl_FragColor = vec4(sum / 36.0, 1.0);
}`;

// Pass 2: Kuwahara filter. Looks at the four corners around each pixel and keeps
// the average color of the calmest one, which gives flat blobs of color.
// Blend mixes in the plain average of all four, so neighboring blobs bleed together.
const PATCHES = PRECISION + `
uniform sampler2D uSoak;
uniform vec2 uTexel;      // one tiny-image pixel, in uv units
uniform float uRadius;
uniform float uSpread;    // spaces the samples out, so blobs swell smoothly
uniform float uBlend;
varying vec2 vUv;

vec3 tap(float x, float y) {
  return texture2D(uSoak, clamp(vUv + vec2(x, y) * uTexel * uSpread, 0.0, 1.0)).rgb;
}

void main() {
  vec3 m0 = vec3(0.0), m1 = vec3(0.0), m2 = vec3(0.0), m3 = vec3(0.0);
  vec3 s0 = vec3(0.0), s1 = vec3(0.0), s2 = vec3(0.0), s3 = vec3(0.0);
  float n = 0.0;
  for (int j = 0; j <= ${MAX_RADIUS}; j++) {
    if (float(j) > uRadius) break;
    for (int i = 0; i <= ${MAX_RADIUS}; i++) {
      if (float(i) > uRadius) break;
      float x = float(i), y = float(j);
      vec3 c;
      c = tap(-x, -y); m0 += c; s0 += c * c;
      c = tap( x, -y); m1 += c; s1 += c * c;
      c = tap( x,  y); m2 += c; s2 += c * c;
      c = tap(-x,  y); m3 += c; s3 += c * c;
      n += 1.0;
    }
  }
  m0 /= n; m1 /= n; m2 /= n; m3 /= n;
  float v0 = dot(abs(s0 / n - m0 * m0), vec3(1.0));
  float v1 = dot(abs(s1 / n - m1 * m1), vec3(1.0));
  float v2 = dot(abs(s2 / n - m2 * m2), vec3(1.0));
  float v3 = dot(abs(s3 / n - m3 * m3), vec3(1.0));
  vec3 color = m0; float best = v0;
  if (v1 < best) { best = v1; color = m1; }
  if (v2 < best) { best = v2; color = m2; }
  if (v3 < best) { color = m3; }
  color = mix(color, (m0 + m1 + m2 + m3) * 0.25, uBlend);
  gl_FragColor = vec4(color, 1.0);
}`;

export function mount(container, options) {
  if (!container) throw new Error("PastelVideo: no container element given");
  const S = { ...DEFAULTS };
  Object.keys(options || {}).forEach((k) => { if (options[k] !== undefined) S[k] = options[k]; });

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (getComputedStyle(container).position === "static") container.style.position = "relative";
  container.style.overflow = "hidden";

  const video = document.createElement("video");
  video.muted = true; video.loop = true; video.playsInline = true; video.autoplay = !reduced;
  video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
  video.preload = "auto";
  // the video stays in the page but invisible; some phones refuse to play detached videos
  video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;pointer-events:none;";
  container.appendChild(video);

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "display:block;position:absolute;inset:0;width:100%;height:100%;";
  container.appendChild(canvas);

  // alpha so the melt can dissolve to whatever is behind it
  const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: false });
  let soak, patches, finish;
  try {
    if (!gl) throw new Error("no WebGL");
    soak = compile(gl, SOAK);
    patches = compile(gl, PATCHES);
    finish = createFinish(gl);
  } catch (e) {
    // no effect available: show the plain video instead
    console.warn("PastelVideo: falling back to the plain video.", e.message);
    canvas.remove();
    video.style.opacity = "1";
    video.src = S.src;
    return {
      set(o) { if (o.src && o.src !== S.src) { S.src = o.src; video.src = o.src; } },
      destroy() { video.pause(); video.removeAttribute("src"); video.load(); video.remove(); },
      video,
      canvas: null,
    };
  }

  bindQuad(gl, [soak, patches, finish.program]);

  const videoTex = makeTexture(gl);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const soakTarget = makeTarget(gl);
  const paint = makeTarget(gl);

  let running = true, visible = true, lastDraw = 0, raf = 0, meltStart = 0;

  // 0 before the melt, easing to 1 at the end of it
  function meltAmount() {
    if (!S.melting) { meltStart = 0; return 0; }
    const now = performance.now();
    if (!meltStart) meltStart = now;
    const t = Math.min(1, (now - meltStart) / 1000 / S.meltDuration);
    return t * t * (3 - 2 * t);
  }

  function draw() {
    const vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh || video.readyState < 2) return;

    const box = fitCanvas(canvas, container);
    if (!box) return;
    const { W, H } = box;

    // melting: blobs swell and run together and the paint sags, while it fades
    const melt = meltAmount();
    const spread = 1 + (S.meltSpread - 1) * melt;
    const blend = S.blend + (1 - S.blend) * melt;
    const drip = S.meltDrip * melt * melt;
    const dissolve = Math.max(0, (melt - 0.15) / 0.85);
    const finishSettings = melt ? { ...S, streak: S.streak * (1 + 2 * melt) } : S;

    // the tiny image the soak and blob passes work on
    const pw = Math.max(8, Math.round(W * S.detail)), ph = Math.max(8, Math.round(H * S.detail));
    soakTarget.size(pw, ph);
    paint.size(pw, ph);

    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    // crop the video to fill the container (like CSS object-fit: cover)
    const boxRatio = W / H, vidRatio = vw / vh;
    let sx = 1, sy = 1;
    if (boxRatio > vidRatio) sy = vidRatio / boxRatio; else sx = boxRatio / vidRatio;

    gl.activeTexture(gl.TEXTURE0);
    gl.viewport(0, 0, pw, ph);

    // pass 1: soak
    gl.bindFramebuffer(gl.FRAMEBUFFER, soakTarget.fbo);
    gl.useProgram(soak.program);
    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    const ku = soak.uniforms;
    gl.uniform1i(ku.uVideo, 0);
    gl.uniform2f(ku.uTexel, 1 / pw, 1 / ph);
    gl.uniform2f(ku.uCropScale, sx, sy);
    gl.uniform2f(ku.uCropOffset, (1 - sx) / 2, (1 - sy) / 2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // pass 2: blobs
    gl.bindFramebuffer(gl.FRAMEBUFFER, paint.fbo);
    gl.useProgram(patches.program);
    gl.bindTexture(gl.TEXTURE_2D, soakTarget.tex);
    const pu = patches.uniforms;
    gl.uniform1i(pu.uSoak, 0);
    gl.uniform2f(pu.uTexel, 1 / pw, 1 / ph);
    gl.uniform1f(pu.uRadius, Math.min(MAX_RADIUS, Math.max(1, Math.round((S.smudge * S.detail) / 2))));
    gl.uniform1f(pu.uSpread, spread);
    gl.uniform1f(pu.uBlend, blend);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // pass 3: strokes and finish, to the screen
    finish.draw(paint, box, finishSettings, dissolve, drip);
  }

  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    if (now - lastDraw < 1000 / S.fps) return;
    lastDraw = now;
    draw();
  }

  // pause work while the effect is scrolled out of view
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (reduced) return;
      if (visible) video.play().catch(() => {}); else video.pause();
    });
    io.observe(container);
  }

  function onVisibility() {
    if (reduced) return;
    if (document.hidden) video.pause();
    else if (visible) video.play().catch(() => {});
  }
  document.addEventListener("visibilitychange", onVisibility);

  let ro = null;
  if ("ResizeObserver" in window) {
    ro = new ResizeObserver(() => { lastDraw = 0; if (reduced) draw(); });
    ro.observe(container);
  }

  if (reduced) {
    // people who ask their device for less motion get one still frame instead
    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    }, { once: true });
    video.addEventListener("seeked", draw);
  } else {
    video.addEventListener("loadeddata", () => video.play().catch(() => {}));
    raf = requestAnimationFrame(loop);
  }

  let currentSrc = S.src;
  video.src = currentSrc;

  return {
    set(newOptions) {
      Object.keys(newOptions).forEach((k) => { if (newOptions[k] !== undefined) S[k] = newOptions[k]; });
      if (newOptions.src && newOptions.src !== currentSrc) { currentSrc = newOptions.src; video.src = currentSrc; }
      lastDraw = 0;
      if (reduced) draw();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause(); video.removeAttribute("src"); video.load();
      video.remove(); canvas.remove();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    },
    video,
    canvas,
  };
}
