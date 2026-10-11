/*!
 * halftone-video.js
 * Redraws a video as a live grid of colored shapes, sized by how dark each spot is.
 * No dependencies. Works on plain HTML sites, Webflow, Squarespace, WordPress, React, etc.
 *
 * EASIEST USE (no JavaScript to write):
 *   <div data-halftone-video="/videos/clip.mp4" style="width:100%;height:500px"></div>
 *   <script src="/halftone-video.js"></script>
 *
 * Optional settings as attributes (all have defaults):
 *   data-cols="100"            number of columns in the grid (more = finer detail)
 *   data-threshold="0.22"      0–1, hides areas lighter than this (0 shows everything)
 *   data-size="0.85"           shape size multiplier
 *   data-shape="diamond"       diamond | square | circle
 *   data-mode="source"         source (video colors) | grey | tint
 *   data-saturation="6"        color boost, used in source mode
 *   data-tint="#1f6f5c"        color used in tint mode
 *   data-background="#ffffff"  canvas background color
 *   data-dark="false"          true for a dark background (changes how colors are mapped)
 *   data-invert="false"        true shows light areas instead of dark ones
 *   data-fps="25"              max frames drawn per second
 *
 * JAVASCRIPT USE:
 *   const fx = HalftoneVideo.mount(document.querySelector('#hero'), { src: '/clip.mp4', cols: 120 });
 *   fx.set({ shape: 'circle' });   // change settings later
 *   fx.destroy();                  // remove it
 *
 * IMPORTANT: the video must be hosted on the same website as the page, or on a server that
 * allows cross-origin access (CORS). Browsers refuse to let a page read the pixels of a
 * video from another site without permission, and the effect will draw nothing.
 */
(function (global) {
  'use strict';
  if (!global) return; // server rendering (e.g. Next.js): nothing to do until the browser loads it

  var DEFAULTS = {
    src: '',
    cols: 100,
    threshold: 0.22,
    size: 0.85,
    shape: 'diamond',
    mode: 'source',
    saturation: 6,
    tint: '#1f6f5c',
    background: null,      // null = white, or black when dark is true
    dark: false,
    invert: false,
    fps: 25,
    crossOrigin: null      // set to 'anonymous' if the video is on a CORS-enabled CDN
  };

  function hexToRgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function mount(container, options) {
    if (!container) throw new Error('HalftoneVideo: no container element given');
    var S = {};
    for (var k in DEFAULTS) S[k] = DEFAULTS[k];
    for (var o in options) if (options[o] !== undefined) S[o] = options[o];
    var tintRGB = hexToRgb(S.tint);

    var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    container.style.overflow = 'hidden';

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'display:block;position:absolute;inset:0;width:100%;height:100%;';
    var ctx = canvas.getContext('2d');

    var video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true; video.autoplay = !reduced;
    video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
    video.preload = 'auto';
    if (S.crossOrigin) video.crossOrigin = S.crossOrigin;
    // the video stays in the page but invisible; some phones refuse to play detached videos
    video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;pointer-events:none;';
    container.appendChild(video);
    container.appendChild(canvas);

    var small = document.createElement('canvas');
    var sctx = small.getContext('2d', { willReadFrequently: true });

    var running = true, visible = true, lastDraw = 0, raf = 0, warned = false;

    function sizeContainer() {
      // if the container has no height of its own, give it the video's shape
      if (container.clientHeight < 10 && video.videoWidth) {
        container.style.aspectRatio = video.videoWidth + ' / ' + video.videoHeight;
      }
    }

    function draw() {
      var vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh || video.readyState < 2) return;
      sizeContainer();

      var dpr = global.devicePixelRatio || 1;
      var W = container.clientWidth, H = container.clientHeight;
      if (!W || !H) return;
      var pw = Math.round(W * dpr), ph = Math.round(H * dpr);
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }

      var cols = Math.max(4, Math.round(S.cols));
      var cell = W / cols;
      var rows = Math.max(1, Math.round(H / cell));
      var cellH = H / rows;

      // crop the video to fill the container (like CSS object-fit: cover)
      var boxRatio = W / H, vidRatio = vw / vh;
      var sx = 0, sy = 0, sw = vw, sh = vh;
      if (boxRatio > vidRatio) { sh = vw / boxRatio; sy = (vh - sh) / 2; }
      else { sw = vh * boxRatio; sx = (vw - sw) / 2; }

      if (small.width !== cols || small.height !== rows) { small.width = cols; small.height = rows; }
      sctx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
      var px;
      try { px = sctx.getImageData(0, 0, cols, rows).data; }
      catch (e) {
        if (!warned) {
          warned = true;
          console.warn('HalftoneVideo: the browser blocked reading this video. Host the video on the same site as the page, or enable CORS on its server and pass crossOrigin: "anonymous".');
        }
        return;
      }

      var dark = !!S.dark;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = S.background || (dark ? '#000' : '#fff');
      ctx.fillRect(0, 0, W, H);

      var th = S.threshold, sat = S.saturation, sizeMul = S.size * 0.7, shape = S.shape, mode = S.mode;
      var groups = new Map();

      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = (y * cols + x) * 4;
          var r = px[i], g = px[i + 1], b = px[i + 2];
          var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (S.invert) lum = 1 - lum;
          var kk = 1 - lum;                         // darkness, 0..1
          if (kk < th) continue;
          var a = Math.min(1, (kk - th) / 0.12);    // fade in just above the cutoff

          var R, G, B;
          if (mode === 'grey') {
            R = G = B = dark ? 230 * kk : (1 - kk) * 140;
          } else if (mode === 'tint') {
            var f = dark ? 0.4 + 0.6 * kk : 0.55 + 0.45 * (1 - kk);
            R = tintRGB[0] * f; G = tintRGB[1] * f; B = tintRGB[2] * f;
          } else {
            var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
            if (mx - mn > 15) {
              var avg = (r + g + b) / 3;
              R = Math.max(0, Math.min(255, avg + (r - avg) * sat));
              G = Math.max(0, Math.min(255, avg + (g - avg) * sat));
              B = Math.max(0, Math.min(255, avg + (b - avg) * sat));
              var target = dark ? Math.max(150, 280 * kk) : Math.min(170, (1 - kk) * 250);
              var m = (R + G + B) / 3;
              if (m > 0) { var s2 = target / m; R = Math.min(255, R * s2); G = Math.min(255, G * s2); B = Math.min(255, B * s2); }
            } else {
              R = G = B = dark ? 220 * kk : (1 - kk) * 140;
            }
          }

          // group shapes by rounded color and opacity so each group is filled in one call
          var key = (((R | 0) >> 4) << 12) | (((G | 0) >> 4) << 8) | (((B | 0) >> 4) << 4) | Math.round(a * 15);
          var p = groups.get(key);
          if (!p) { p = new Path2D(); groups.set(key, p); }
          var cx = x * cell + cell / 2, cy = y * cellH + cellH / 2;
          var sz = Math.sqrt(kk) * cell * sizeMul;
          if (shape === 'square') {
            var q = sz * 0.75; p.rect(cx - q, cy - q, q * 2, q * 2);
          } else if (shape === 'circle') {
            p.moveTo(cx + sz * 0.8, cy); p.arc(cx, cy, sz * 0.8, 0, Math.PI * 2);
          } else {
            p.moveTo(cx, cy - sz); p.lineTo(cx + sz, cy); p.lineTo(cx, cy + sz); p.lineTo(cx - sz, cy); p.closePath();
          }
        }
      }

      groups.forEach(function (path, key) {
        ctx.globalAlpha = (key & 15) / 15;
        ctx.fillStyle = 'rgb(' + (((key >> 12) & 15) * 17) + ',' + (((key >> 8) & 15) * 17) + ',' + (((key >> 4) & 15) * 17) + ')';
        ctx.fill(path);
      });
      ctx.globalAlpha = 1;
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
    var io = null;
    if ('IntersectionObserver' in global) {
      io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (reduced) return;
        if (visible) video.play().catch(function () {}); else video.pause();
      });
      io.observe(container);
    }

    function onVisibility() {
      if (reduced) return;
      if (document.hidden) video.pause();
      else if (visible) video.play().catch(function () {});
    }
    document.addEventListener('visibilitychange', onVisibility);

    var ro = null;
    if ('ResizeObserver' in global) {
      ro = new ResizeObserver(function () { lastDraw = 0; if (reduced) draw(); });
      ro.observe(container);
    }

    if (reduced) {
      // people who ask their device for less motion get one still frame instead
      video.addEventListener('loadeddata', function () {
        var t = Math.min(1, (video.duration || 2) / 2);
        video.currentTime = t;
      }, { once: true });
      video.addEventListener('seeked', function () { draw(); });
    } else {
      video.addEventListener('loadeddata', function () { video.play().catch(function () {}); });
      raf = requestAnimationFrame(loop);
    }

    var currentSrc = S.src;
    video.src = currentSrc;

    return {
      set: function (newOptions) {
        for (var n in newOptions) S[n] = newOptions[n];
        if (newOptions.tint) tintRGB = hexToRgb(newOptions.tint);
        if (newOptions.src && newOptions.src !== currentSrc) { currentSrc = newOptions.src; video.src = currentSrc; }
        lastDraw = 0;
        if (reduced) draw();
      },
      destroy: function () {
        running = false;
        cancelAnimationFrame(raf);
        if (io) io.disconnect();
        if (ro) ro.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        video.pause(); video.removeAttribute('src'); video.load();
        container.removeChild(video); container.removeChild(canvas);
      },
      video: video,
      canvas: canvas
    };
  }

  function readAttrs(el) {
    var d = el.dataset, num = function (v) { return v === undefined ? undefined : parseFloat(v); };
    var bool = function (v) { return v === undefined ? undefined : v === 'true' || v === ''; };
    return {
      src: d.halftoneVideo,
      cols: num(d.cols), threshold: num(d.threshold), size: num(d.size),
      shape: d.shape, mode: d.mode, saturation: num(d.saturation), tint: d.tint,
      background: d.background, dark: bool(d.dark), invert: bool(d.invert), fps: num(d.fps),
      crossOrigin: d.crossorigin
    };
  }

  function autoInit() {
    var els = document.querySelectorAll('[data-halftone-video]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].__halftone) continue;
      els[i].__halftone = mount(els[i], readAttrs(els[i]));
    }
  }

  global.HalftoneVideo = { mount: mount, init: autoInit };
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
    else autoInit();
  }
})(typeof window !== 'undefined' ? window : null);
