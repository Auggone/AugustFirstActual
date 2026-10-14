# Portfolio videos (archived)

Web copies of the Jerry Jiang Campaign videos, "Waterloo Versus the World"
(1080p H.264, compressed with ffmpeg from the originals in
`src/assets/videoportfolio/`). Archived 2026-10-14 while deciding whether to
host videos on the site itself. Nothing in here is loaded by the site, and the
video files are kept out of git (see client/.gitignore), so they live only on
this disk.

To bring them back:
1. Move `jerry-jiang/` back to `src/assets/portfolio/jerry-jiang/`.
2. In `src/Pages/V2/portfolioProjects.js`, import the six files again and list
   them in the folder's `videos`:
   ```js
   import wvw1 from "../../assets/portfolio/jerry-jiang/wvw1.mp4";
   import wvw1Poster from "../../assets/portfolio/jerry-jiang/wvw1-poster.jpg";
   // ...same for wvw2 and wvw3
   videos: [
     { src: wvw1, poster: wvw1Poster },
     { src: wvw2, poster: wvw2Poster },
     { src: wvw3, poster: wvw3Poster },
   ],
   ```
