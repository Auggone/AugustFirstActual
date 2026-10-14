// Pages/V2/MusicV2.js
// Music, at /music. Frame shared with the other pages: components/pastelFrame.
// Content: a numbered list of songs under the title. (The old music page,
// Pages/Articles/NewSubPages/music, with its "mp3 coming soon" placeholder, is
// no longer shown; it's kept for its mp4 player.)
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import YOUTUBE_LINKS from "../../assets/youtubeLinks";
import "./MusicV2.css";

// The songs, in order; the list numbers them. Each name is a line in
// assets/youtubeLinks.js. To add a song, add its link there, then its name here.
const SONGS = ["I'm No God"];

// Background colors, measured from the fire pastel (peach, gold, terracotta).
// The first one breathes in and out.
const PALETTE = [
  "#efdaba", // bone
  "#e3a771", // peach
  "#eec88b", // gold
  "#f3de91", // butter
  "#bf8b68", // terracotta
  "#d7ab86", // sand
  "#a67a5e", // ember
];

// Past the top and bottom of the background: the peach, softened toward the paper cream
const EDGE = "#e8be95";

export default function MusicV2() {
  return (
    <PastelFrame palette={PALETTE} edge={EDGE} screens={1}>
      <div className="frame-media">
        <ol className="music-list">
          {SONGS.map((name) => (
            <li key={name}>
              <a href={YOUTUBE_LINKS[name]} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </PastelFrame>
  );
}
