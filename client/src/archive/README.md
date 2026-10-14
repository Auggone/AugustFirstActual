# Archive

Features and pages that are put away. Nothing in here is loaded by the site.

To bring one back, drag its folder into `src/features/`. See `src/features/README.md`.

## Pages

### Video page (`video-page/`)

The Video page (`/video`, charcoal pastel background, YouTube embed), archived
2026-10-14. While it's away, "Video" is out of the menu and `/video` sends
visitors to the homepage.

To bring it back:
1. Move `video-page/VideoV2.js` to `src/Pages/V2/VideoV2.js` and
   `video-page/videos/` to `src/Pages/Articles/NewSubPages/videos/`.
2. In `VideoV2.js`, change the import back to
   `../Articles/NewSubPages/videos/videopage`.
3. In `src/App.js`, import `VideoV2` from `./Pages/V2/VideoV2` and set the
   `video` route's element back to `<VideoV2 />`.
4. In `src/Pages/Articles/NewHomePage/navbartwo.js`, put `"Video"` back in
   `NAV_ITEMS` after `"Gallery"`.
