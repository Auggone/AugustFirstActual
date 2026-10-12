// components/pastel/pastel-gl.js
// The shared pastel finish: anything that can paint a small image of color
// (a video, a moving background) hands it here to be smudged into strokes and
// given paper grain, drag marks, chalky specks and creamy highlights.
// Used by pastel-video.js and pastel-background.js so both look like the same drawing.

// Finish settings both effects share
export const FINISH_DEFAULTS = {
  streak: 36,         // length of the smudge strokes, in screen pixels (0–80)
  strokeAngle: -35,   // direction strokes sweep in flat areas, in degrees
  grain: 0.6,         // paper texture and drag marks (0–1)
  chalk: 0.45,        // chalky specks where pastel skipped the paper (0–1)
  saturation: 1.15,   // color strength (1 = original colors)
  haze: 0.12,         // chalky film over everything (0–1)
  paper: "#f2ebdd",   // paper color: shows in specks and highlights
};

export const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export const PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

export const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(0.1031, 0.1030));
  p += dot(p, p.yx + 33.33);
  return fract((p.x + p.y) * p.x);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
`;

// Smudge the painted image along its shapes, then add the pastel finish.
const STROKES = PRECISION + `
uniform sampler2D uPaint;
uniform vec2 uPaintTexel;  // one painted-image pixel, in uv units
uniform vec2 uScreen;      // canvas size in device pixels
uniform float uPixelRatio;
uniform float uStreak;     // device pixels
uniform vec2 uFlatDir;     // stroke direction in flat areas
uniform float uGrain;
uniform float uChalk;
uniform float uSaturation;
uniform float uHaze;
uniform vec3 uPaper;
uniform float uDissolve;   // 0 = solid, 1 = fully faded (see the end of main)
uniform float uDrip;       // how far the paint has sagged downward, in uv units
varying vec2 vUv;
vec2 uv;                   // where to read the paint (vUv, sagged by the drip)

float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
` + NOISE + `
float paintLum(vec2 offset) {
  return lum(texture2D(uPaint, uv + offset * uPaintTexel).rgb);
}

void main() {
  vec2 px = gl_FragCoord.xy / uPixelRatio; // screen pixels, so texture size matches on every display

  // Drip: read the paint from higher up, so it slides down the screen; some
  // columns run further than others, like wet paint
  uv = vUv + vec2(0.0, uDrip * (0.55 + 0.45 * noise(vec2(px.x / 70.0, 0.5))));

  // Stroke direction: along edges (across the brightness change), wobbling by hand in flat areas
  vec2 grad = vec2(paintLum(vec2(1.5, 0.0)) - paintLum(vec2(-1.5, 0.0)),
                   paintLum(vec2(0.0, 1.5)) - paintLum(vec2(0.0, -1.5)));
  float wobble = (noise(px / 220.0) - 0.5) * 1.4;
  vec2 flatDir = vec2(uFlatDir.x * cos(wobble) - uFlatDir.y * sin(wobble),
                      uFlatDir.x * sin(wobble) + uFlatDir.y * cos(wobble));
  vec2 along = vec2(-grad.y, grad.x);
  float edge = smoothstep(0.015, 0.08, length(grad));
  if (dot(along, flatDir) < 0.0) along = -along;
  vec2 dir = normalize(mix(flatDir, normalize(along + 1e-5), edge));

  // Smudge: average the paint along the stroke, heaviest in the middle
  vec3 sum = vec3(0.0);
  float total = 0.0;
  for (int k = -12; k <= 12; k++) {
    float t = float(k) / 12.0;
    float w = 1.0 - abs(t);
    sum += texture2D(uPaint, uv + dir * t * uStreak / uScreen).rgb * w;
    total += w;
  }
  vec3 c = sum / total;

  // Color: stronger saturation, a chalky film, creamy highlights
  float L = lum(c);
  c = clamp(mix(vec3(L), c, uSaturation), 0.0, 1.0);
  c = mix(c, c * 0.8 + uPaper * 0.2, uHaze);
  c = mix(c, uPaper, smoothstep(0.72, 1.0, L) * 0.45);

  // Texture dragged along the stroke: fine noise averaged along the stroke
  // direction, so it streaks with the smudge (without rings where strokes curve)
  float drag = 0.0, fleck = 0.0;
  for (int k = -6; k <= 6; k++) {
    drag += noise((px + dir * float(k) * 3.0) / 2.2);
  }
  for (int k = -2; k <= 2; k++) {
    fleck += noise((px + dir * float(k) * 1.6) / 1.3);
  }
  drag = (drag / 13.0 - 0.5) * 3.0 + 0.5;  // averaging flattens it; restore contrast
  fleck = (fleck / 5.0 - 0.5) * 1.8 + 0.5;
  float tooth = noise(px / 1.4) * 0.55 + noise(px / 4.5) * 0.45;
  c *= 1.0 + (drag - 0.5) * uGrain * 0.35 + (tooth - 0.5) * uGrain * 0.22;

  // Chalk: specks of paper where the pastel skipped, most visible in dark strokes
  float skip = fleck * 0.6 + tooth * 0.4;
  float cutoff = 1.0 - uChalk * 0.42;
  float speck = smoothstep(cutoff, cutoff + 0.06, skip);
  c = mix(c, uPaper, speck * (0.35 + 0.5 * (1.0 - L)));
  c = clamp(c, 0.0, 1.0);

  // Fade: a soft, wide fade that starts in the middle of the screen and spreads
  // out to the edges, its outline gently uneven
  float a = 1.0;
  if (uDissolve > 0.0) {
    vec2 fromCenter = vUv - 0.5;
    fromCenter.x *= uScreen.x / uScreen.y;
    float corner = length(vec2(0.5 * uScreen.x / uScreen.y, 0.5));
    float holdOn = (length(fromCenter) / corner) * 0.8 + noise(px / 260.0) * 0.2;
    float cut = uDissolve * 1.6 - 0.3;
    a = smoothstep(cut - 0.25, cut + 0.25, holdOn);
  }
  gl_FragColor = vec4(c * a, a);
}`;

export function hexToRgb(h) {
  h = String(h).replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function compile(gl, fragmentSrc) {
  const program = gl.createProgram();
  [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, fragmentSrc]].forEach(([type, src]) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("pastel shader: " + gl.getShaderInfoLog(shader));
    }
    gl.attachShader(program, shader);
  });
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("pastel link: " + gl.getProgramInfoLog(program));
  }
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i).name;
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
}

export function makeTexture(gl) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

// A texture you can draw into, resized on demand
export function makeTarget(gl) {
  const target = { tex: makeTexture(gl), fbo: gl.createFramebuffer(), w: 0, h: 0 };
  target.size = (w, h) => {
    if (w === target.w && h === target.h) return;
    target.w = w; target.h = h;
    gl.bindTexture(gl.TEXTURE_2D, target.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.tex, 0);
  };
  return target;
}

// One triangle that covers the whole screen, shared by every program
export function bindQuad(gl, programs) {
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  programs.forEach(({ program }) => {
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  });
}

// Size the canvas to its box; returns the box and pixel sizes, or null if hidden.
// maxPixels lowers the sharpness for very tall boxes, so the canvas stays under
// the size phones allow (iPhone Safari's limit is about 16.7 million pixels).
export function fitCanvas(canvas, container, maxPixels = Infinity) {
  const W = container.clientWidth, H = container.clientHeight;
  if (!W || !H) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(maxPixels / (W * H)));
  const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
  if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
  return { W, H, dpr, cw, ch };
}

export function createFinish(gl) {
  const strokes = compile(gl, STROKES);
  return {
    program: strokes,
    // paint: a target holding the image to finish; S: finish settings;
    // dissolve: 0 = solid, 1 = gone (needs a canvas made with alpha: true);
    // drip: how far the paint has sagged downward, in uv units
    draw(paint, box, S, dissolve = 0, drip = 0) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, box.cw, box.ch);
      gl.useProgram(strokes.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, paint.tex);
      const u = strokes.uniforms;
      const angle = (S.strokeAngle * Math.PI) / 180;
      gl.uniform1i(u.uPaint, 0);
      gl.uniform2f(u.uPaintTexel, 1 / paint.w, 1 / paint.h);
      gl.uniform2f(u.uScreen, box.cw, box.ch);
      gl.uniform1f(u.uPixelRatio, box.dpr);
      gl.uniform1f(u.uStreak, S.streak * box.dpr);
      gl.uniform2f(u.uFlatDir, Math.cos(angle), Math.sin(angle));
      gl.uniform1f(u.uGrain, S.grain);
      gl.uniform1f(u.uChalk, S.chalk);
      gl.uniform1f(u.uSaturation, S.saturation);
      gl.uniform1f(u.uHaze, S.haze);
      gl.uniform3fv(u.uPaper, hexToRgb(S.paper));
      gl.uniform1f(u.uDissolve, dissolve);
      gl.uniform1f(u.uDrip, drip);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}
