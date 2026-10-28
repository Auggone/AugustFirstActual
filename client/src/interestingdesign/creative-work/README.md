# Creative Work: project page redesign (Direction A)

Implementation brief for Claude Code. It covers the project pages under `/portfolio/<project>`, starting with `/portfolio/jerry-jiang-campaign`.

The files in this pack:

| File | What it is |
|---|---|
| `README.md` | This brief: what to build, exact values, data changes, checks. |
| `reference.html` | A static, responsive page showing the target layout. Open it in a browser and resize it below 768px to see the phone layout. It's a visual reference, not code to paste in. |
| `project-data-example.json` | The Jerry Jiang project with the new fields filled in where known and marked where not. |

---

## 1. Scope

**Build**
- A project header: breadcrumb, title, a meta row (kind, dates, role, platforms) and a short description.
- A results band (metrics), shown only when the project has metrics.
- New section styling: the role note becomes a label above the section title.
- Larger video thumbnails that fill the content column, with a play mark, duration, and a "YouTube ↗" label.
- A layout for sections that have exactly one video: large thumbnail with the text beside it.
- A new section type for campaign snapshots: a grid of 4:5 images that open in the existing lightbox.

**Don't change**
- The site frame: black background `#080B0F`, cream ink `#f2ebdd`, the pinned "August First" title, the left-edge back arrow, the social icons, and the content area padding and 1100px max width.
- Acumin Pro as the body font. The reference uses Archivo only because Acumin can't load outside the site. Use Acumin in the real build.
- The `/portfolio` category grid. Rule 1 in `portfolio-design.md` (bare 4:3 thumbnails) applies there only. This brief doesn't touch it.
- The Creative Work category page (`/portfolio/video-editing`). That's a separate job.

**Applies to all three projects.** Podcasting and Inception Studio use the same template. They have no metrics or snapshots yet, so those blocks must simply not render.

---

## 2. Before you start

1. Read the existing project page component, the portfolio data file and the site's CSS.
2. If `portfolio-design.md` or `design.md` is in the repo, read it. Follow its rules where they apply.
3. Put every value in Section 4 into CSS custom properties or the site's existing token system, never inline. The owner plans to restyle this page later to make it more personal. Centralized tokens make that a small change instead of a rewrite.
4. Don't add new colors. Every color on this page is cream, the black background, or cream at a lower opacity.

---

## 3. Page structure (top to bottom)

```
[pinned site frame: title, back arrow, social icons]

Creative Work                      ← breadcrumb link to /portfolio/video-editing
Jerry Jiang Campaign               ← h1
KIND        DATES              MY ROLE          PLATFORMS      ← meta row
Mixed Media Oct 2026 – Ongoing  [role]           [platforms]
[Description, max 768px wide]

──────────────────────────────────────────────── hairline
RESULTS
[0.0M]     │ [+0.0K]          │ [0.0%]               │ [00]
Video views│ Followers gained │ Avg. engagement rate │ Posts published
[Platforms] · Oct 2026 – [date] · Source: [...]
──────────────────────────────────────────────── hairline

EDITED                             ← role label
Waterloo Versus the World          ← h2
[thumb 16:9] [thumb 16:9] [thumb 16:9]   3 columns
Caption 1    YouTube ↗  ...

FILMED AND EDITED
Maison KooKoo Interview
[ large thumb, 2/3 width ]  Head Chef Interview      ← single-video layout
                            [description]
                            Watch on YouTube ↗

[ROLE]
Campaign snapshots
[one-line description]
[4:5] [4:5] [4:5] [4:5]            4 columns, opens lightbox
[4:5] [4:5] [4:5] [4:5]
```

---

## 4. Exact values

### Tokens

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#f2ebdd` | All text, icons, play mark |
| `--bg` | `#080B0F` | Page background |
| `--hairline` | `rgba(242,235,221,0.18)` | Results band borders and column dividers |
| `--placeholder` | `rgba(242,235,221,0.07)` | Image background while loading, or when an image is missing |
| `--badge-bg` | `rgba(8,11,15,0.75)` | Play/duration pill on thumbnails |
| `--muted` | `opacity: 0.7` | Secondary text: breadcrumb, meta labels, metric labels, "YouTube ↗", captions |
| `--body-dim` | `opacity: 0.85` (description), `0.8` (section descriptions) | Long text |
| `--label` | `0.7rem` desktop / `0.68rem` phone, uppercase, `letter-spacing: 0.16em` | Meta labels, "RESULTS", role labels |

Opacity is applied to the text, not to its color, because the site already uses opacity for secondary text. Keep secondary text at 0.7 or higher. Lower than that drops contrast below 4.5:1 on the black background.

### Type

| Element | Desktop | Phone (≤768px) |
|---|---|---|
| Breadcrumb | 0.85rem, 0.04em spacing, 0.7 opacity | 0.8rem |
| Project title (h1) | 3.25rem / 600 / line-height 1.05 / −0.01em | 2.25rem |
| Meta label (dt) | `--label` at 0.7 opacity | same |
| Meta value (dd) | 1rem | 0.95rem |
| Description | 1.1rem / line-height 1.55 / 0.85 opacity / max-width 768px | 1rem, full width |
| Metric number | 3rem / 600 / line-height 1 | 2.1rem |
| Metric label | 0.85rem / 0.7 opacity | 0.8rem |
| Metrics source line | 0.8rem / 0.04em / 0.7 opacity | 0.75rem |
| Role label | `--label` at **full opacity** (it's the point of the section) | same |
| Section title (h2) | 1.6rem / 600 | 1.35rem |
| Video caption | 1rem | same |
| "YouTube ↗" | 0.75rem / 0.7 opacity / no wrap | same |
| Single-video title | 1.15rem | 1.05rem |
| Snapshot caption | 0.85rem / 0.7 opacity | 0.78rem |

### Spacing

| Gap | Desktop | Phone |
|---|---|---|
| Header items | 20px | 16px |
| Header → results band | 72px | 48px |
| Results band padding (top/bottom) | 28px | 24px |
| Metric columns | 24px each side of the divider | 16px |
| Between sections | 96px | 64px |
| Role label → title → content | 10px, then 18px before the grid | 8px, then 14px |
| Video grid gap | 24px | 28px between stacked videos |
| Snapshot grid gap | 24px | 20px rows, 12px columns |

### Layout by width

| Block | Above 1100px | 769–1100px | ≤768px |
|---|---|---|---|
| Meta row | Flex, wraps, 48px apart | same | 2-column grid |
| Metrics | 4 columns, a hairline between each | 4 columns (or 2 if numbers get cramped) | 2 × 2, hairline on the left of columns 2 and 4 |
| Video grid | 3 columns | 2 columns | 1 column, full width |
| Single-video section | 2fr thumbnail / 1fr text, text aligned to the bottom | same | Stacked: thumbnail, then text |
| Snapshot grid | 4 columns | 3 columns | 2 columns |

On phones, everything is **left-aligned and full content width (viewport minus 40px)**. That replaces the current centered 280px thumbnails and centered captions.

---

## 5. Components

### Thumbnail (video)
- Whole thumbnail plus caption row is one link to the YouTube URL. It opens in a new tab: `target="_blank" rel="noopener"`.
- Image: `aspect-ratio: 16/9; width: 100%; object-fit: cover`. **No border, no corner radius, no shadow.** This deliberately replaces the current 8px radius and 2px border, to match the no-cards rule in `portfolio-design.md`. Log that change in the doc.
- Pill in the bottom-left corner, 12px in (10px on phones): play triangle plus duration, `--badge-bg` background, fully rounded, 0.72rem. If a video has no `duration`, show the triangle alone.
- Caption row below the image, 12px gap: caption on the left, "YouTube ↗" on the right, baseline-aligned.
- Hover: keep the existing slight lighten on the image. Nothing moves or changes size.
- `aria-label` on the link: "<caption>, watch on YouTube".
- Use the larger YouTube thumbnail (`maxresdefault.jpg`, falling back to `hqdefault.jpg`). At the new size, the current 480×270 images will look soft on high-resolution screens.

### Single-video section
Used automatically when a section has exactly one video. Desktop: thumbnail on the left (2/3), and on the right the caption, the section or video description, and a "Watch on YouTube ↗" text link. Phone: stacked.

### Results band
- Rendered only when `project.metrics` has at least one item.
- Store values as **display strings** (`"1.2M"`, `"+3.4K"`, `"6.1%"`), not numbers, so the owner controls rounding and units.
- The source line (`metricsNote`) is required when metrics exist. Results with no date or source read as unsupported claims. If it's missing, log a console warning in dev.
- Use `font-variant-numeric: tabular-nums` on the numbers.
- Markup: a `<section>` with an `<h2>` reading "Results" and a `<dl>` or list of metric items. Don't use a table.

### Role label
- Moves from `(Edited)` after the title to a small-caps label above the title, full opacity.
- Values in use: Edited, Filmed and Edited, Written, Recorded and Edited.

### Snapshot grid (new section type)
- 4:5 images, `object-fit: cover`, no border, radius or shadow.
- Clicking an image opens the **existing** photo lightbox. Don't build a new one.
- Optional caption under each image.
- `alt` text is required for each image. Don't fall back to an empty string.

---

## 6. Data changes

The current shape: a project has `title`, `kind`, `dates`, `cover`, `sections`; a section has `title`, `role`, an optional `description`, and `thumbnails` (`image`, `youtube`, `caption`).

Add these. Every new field is optional, so the other projects keep working unchanged:

```
project.role          string    "Filming, editing, social"
project.platforms     string[]  ["Instagram", "TikTok"]
project.description   string    2–3 sentences
project.metrics       { value: string, label: string }[]
project.metricsNote   string    "Instagram + TikTok · Oct 2026 – Nov 2026 · Source: platform analytics, as of Nov 3"

section.type          "videos" (default) | "snapshots"
thumbnail.duration    string    "4:12"

// for type: "snapshots"
section.images        { src: string, alt: string, caption?: string }[]
```

Fit this into the existing data file's format and naming. If the file uses different key names, follow the file. See `project-data-example.json`.

---

## 7. Placeholders

Copy in square brackets in `reference.html` and the example data is a placeholder. **Do not ship any bracketed text and do not invent values.** If real values aren't in the data yet, leave the field out so the block doesn't render. Still missing:

- Project description, role and platforms
- All four metric values, which metrics to show, and the source line
- Snapshot images, alt text and captions
- Video durations
- The role label for the snapshots section

---

## 8. Checks before calling it done

- [ ] Jerry Jiang page matches `reference.html` at 1440px, 1024px and 390px wide.
- [ ] Podcasting and Inception Studio render with the header and videos only. No empty results band or snapshot section.
- [ ] No horizontal scroll at 375px.
- [ ] Every thumbnail opens the right YouTube video in a new tab. Every snapshot opens the lightbox.
- [ ] Tab order runs breadcrumb → videos → snapshots, with a visible focus outline on each link.
- [ ] No bracketed placeholder text on any live page.
- [ ] New values are in tokens, not inline styles.
- [ ] `portfolio-design.md`, if present, gets a new numbered rule or component entry for the project page. It records the thumbnail border/radius removal, the results band, the role label and the snapshot grid, each stating which pages it applies to.

---

## 9. Known generic parts (to customize later, not now)

The owner wants this page made more personal in a later pass. These are the parts most likely to change, so keep them easy to edit:

- The results band (four equal columns of big numbers) is a common pattern. It may become a sentence, a single headline number, or something else.
- The small-caps label style is used in three places (meta labels, "RESULTS", role labels). Keep it one shared class so it can be restyled once.
- The play pill on thumbnails.
- The type sizes, which were chosen as safe defaults.

Build these cleanly. Don't add extra polish to them.

---

## 10. Notes for this repo (added on filing)

This brief was written from a description of the site, not from the code, so some names differ from the real files.

**Field names.** The real data file is `Pages/V2/portfolioProjects.js`, and §6 says to follow it. Its names compared with the brief's:

| Brief | `portfolioProjects.js` |
|---|---|
| `dates` | `year` |
| `cover` | `image` |
| `sections` | `folders` |
| `section.role` | `folder.note` (shown as "(Edited)" today) |
| `thumbnail.youtube` | `thumbnail.link`, a name looked up in `assets/youtubeLinks.js` |
| `thumbnail.caption` | `thumbnail.text` |
| `section.images` `{ src, alt, caption }` | closest existing: `folder.photos` `{ image, caption }`, which already opens the lightbox |

**Components.** The project page is `Pages/V2/PortfolioProject.js`, styled in `Pages/V2/PortfolioV2.css`. The category page is `Pages/V2/PortfolioCategory.js`, and the shared frame is `components/pastelFrame/`.

**Design docs.** There's no `portfolio-design.md` or `design.md` in the repo. The only other design reference is `../mini-image-spec.md`. The project thumbnails currently follow its "preset swatches" pattern (8px radius, 2px edge). This brief removes that on project pages (§5), so record the change there or in a new `portfolio-design.md`.

## 11. As built (Oct 28, 2026)

Built in `Pages/V2/PortfolioProject.js` and `PortfolioV2.css` (the "Showcase project pages" section, all values as `--sc-*` tokens). It applies to categories with `showcase: true` in `portfolioProjects.js`, which is only Creative Work. Other projects keep the old layout.

Changes from the brief:
- **Rounded corners kept.** Video thumbnails and snapshots keep the 8px radius, faint 2px edge and hover lighten from `../mini-image-spec.md`, for consistency across the site. This overrides §5's "no border, no corner radius".
- **Placeholders shown for now.** The owner asked to see the layout, so the [bracketed] placeholders from §7 are in the data. Replace each one, or delete its line to hide that part. `grep -n "\[" Pages/V2/portfolioProjects.js` finds them.
- **Snapshots** are a section's `snapshots: [{ image, alt, caption? }]`. One with no `image` shows a plain tile with its alt text.
- **Metrics** switch to 2 × 2 below 960px, not 768px, because four 3rem numbers don't fit the column between those widths.
- **Thumbnails** load YouTube's `maxresdefault.jpg`. If it's missing, they fall back to the local 480×270 copy rather than `hqdefault.jpg`, because `hqdefault` is the same size.
