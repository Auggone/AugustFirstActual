# Mini image thumbnails: implementation spec

Reference: evebouffard.com, measured from the live page's computed styles at a 1054×741 viewport.
There are two patterns. **Book cards** use a fixed-size tile with the image centred inside it, and work for covers, posters, or anything else with mixed aspect ratios. **Preset swatches** are a fluid 3-column grid of 4:3 thumbnails that you can select, and work for wallpapers, themes, or photo pickers.

Do not reuse her image files. Copy the styling only and use our own assets.

---

## 1. Book cards ("Books that made me see life differently")

### Layout
- A grid with **5 fixed columns of 88px** and an **8px gap** (472px wide in total).
- Each tile is an `<a>` linking out, with `target="_blank" rel="noopener"` and a `title` set to the book's title.

### Tile (`.book-card`)
| Property | Value |
|---|---|
| size | `88px × 118px` |
| padding | `10px` (leaves a 68 × 98 area for the image) |
| display | `flex`, centred on both axes |
| background | `rgba(0,0,0,0.043)` (a faint grey well) |
| border-radius | `8px` |
| border | none |
| transition | `background-color 0.15s` |
| hover | background becomes `rgba(0,0,0,0.09)` |
| cursor | `pointer` |

### Image inside the tile
| Property | Value |
|---|---|
| max size | `max-width: 100%; max-height: 100%` (fits within 68 × 98) |
| object-fit | `contain`, so the cover is never cropped. Narrow covers get grey well space on each side. |
| border-radius | `3px` |
| box-shadow | `0 1px 4px rgba(0,0,0,0.22)` |
| display | `block` |
| loading | `lazy` |
| alt | the book's title |

Source images are about **200 × 330px**, roughly 2× the display size, so they stay sharp on retina screens. Use the same size for ours.

### Reference CSS
```css
.book-grid {
  display: grid;
  grid-template-columns: repeat(5, 88px);
  gap: 8px;
}
.book-card {
  width: 88px;
  height: 118px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.043);
  border-radius: 8px;
  transition: background-color 0.15s;
}
.book-card:hover { background: rgba(0, 0, 0, 0.09); }
.book-card img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 3px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.22);
}
```

---

## 2. Preset swatches (the "Wallpaper" selector in the right panel)

### Layout
- A grid with **3 equal columns** (`repeat(3, 1fr)`) and an **8px gap**. On her site the grid is 206px wide, which makes each swatch about **63 × 47.5px**.
- Each swatch is a `<button>` with an `aria-label` naming the image. The image is a CSS `background-image`, not an `<img>`.

### Swatch (`.wallpaper-preset`)
| Property | Value |
|---|---|
| aspect-ratio | `4 / 3` |
| background | `cover`, centred; placeholder colour `rgba(0,0,0,0.04)` while loading |
| border | `2px solid rgba(0,0,0,0.12)` |
| border-radius | `8px` |
| overflow | `hidden` |
| position | `relative` (for the hover overlay) |
| cursor | `pointer` |
| **selected** (`.is-selected`) | border becomes `2px solid rgba(0,0,0,0.6)`. Nothing else changes. |
| hover | a `::after` overlay of `rgba(255,255,255,0.1)` fades in, giving a slight lighten |

### The panel it sits in
- Background `rgba(255,255,255,0.55)` with `backdrop-filter: blur(8px)` (frosted glass)
- Left border `1px solid rgba(0,0,0,0.08)`, square corners, no shadow
- About 255px wide with 20px padding

### Reference CSS
```css
.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.preset {
  position: relative;
  aspect-ratio: 4 / 3;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.04);
  background-size: cover;
  background-position: center;
}
.preset.is-selected { border-color: rgba(0, 0, 0, 0.6); }
.preset::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  pointer-events: none;
}
.preset:hover::after { opacity: 1; }
```

---

## Shared design rules
- **Radii:** 8px on containers and tiles, 3px on the image itself (the book cards nest the two).
- **Spacing:** 8px gap in every grid.
- **Colour:** only black and white at low alpha, no accent colours. Wells are about 4% black, hover about 9% black, borders 12% black, and the selected border 60% black.
- **Motion:** only `0.15s` background transitions. No scaling or lifting on hover.
- **Depth:** the only shadow is the one under book covers. Everything else is flat.

## Notes for implementation
- The book grid uses a fixed 88px column. On phones, 5 × 88 + gaps = 472px will overflow, so drop to `repeat(auto-fill, 88px)` or fewer columns below about 500px. (Her site wasn't checked at mobile width.)
- If our covers have very different aspect ratios, keep `object-fit: contain`. `cover` would crop titles off.
- The preset swatches need keyboard focus styles. Her site's focus state wasn't checked, so add `:focus-visible { outline: 2px solid rgba(0,0,0,0.6); outline-offset: 2px; }`.
