# Features

Optional, self-contained pieces of the site (like the music button) that can be
put away and brought back without touching any page code.

- **Live:** every folder in `src/features/` with an `index.js` shows up on the site.
- **Put away:** drag the folder into `src/archive/`. It vanishes from the site; the code is kept.
- **Bring back:** drag it back into `src/features/`.

`src/features` and `src/archive` sit at the same depth, so a feature's imports
(`../../components/...`, `../../assets/...`) keep working in either place.

## How it works

Pages mark spots with `<FeatureSlot name="home-corner" />`. Each feature's
`index.js` says which slots it fills:

```js
export default {
  name: "music-button",
  slots: {
    "home-corner": CornerPlayer,      // desktop, top-right corner
    "home-mobile-nav": MobilePlayer,  // mobile nav stack
  },
};
```

Current slots:

| Slot              | Page                                  | Where                            |
| ----------------- | ------------------------------------- | -------------------------------- |
| `home-corner`     | Homepage (`NewHomePage/newhome.js`)   | Fixed top-right corner (desktop) |
| `home-mobile-nav` | Homepage (`NewHomePage/newhome.js`)   | Bottom of the mobile nav stack   |
| `v2-intro`        | HomePage v2 (`HomePageV2/homev2.js`)  | Full-screen opening before the page |
| `v2-writing-links`| Writing (`V2/WritingV2.js`)           | Above the post cards |

To add a new slot, drop `<FeatureSlot name="your-slot" />` into any page.
Any extra props on the slot are passed to the feature, so a page can share
settings with it or hear back from it:

```jsx
<FeatureSlot name="v2-intro" entered={entered} onEnter={() => setEntered(true)} />
```

A page can also check whether anything fills a slot, and behave differently
when it's empty: `getSlotComponents("v2-intro").length > 0`.

## In the archive

| Feature        | Slots                            | What it is |
| -------------- | -------------------------------- | ---------- |
| `music-button` | `home-corner`, `home-mobile-nav` | "Let It All Work Out" player |
| `intro-video`  | `v2-intro`                       | Dragon dance clip as a pastel painting; click and it melts into v2 |
| `writing-archive-link` | `v2-writing-links`       | "Archive" link to the older posts |
