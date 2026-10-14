// Pages/V2/portfolioProjects.js
// The portfolio's categories and projects. /portfolio shows the categories
// (PortfolioV2.js); each category's page, /portfolio/<category slug>
// (PortfolioCategory.js), shows its projects in the order listed here; each
// project gets its own page at /portfolio/<slug> (PortfolioProject.js) showing
// its folders of links and videos.
import cover1 from "../../assets/coverImage1.jpg";
import cover2 from "../../assets/coverImage2.jpg";
import cover3 from "../../assets/coverImage3.jpg";

// The categories, in the order they appear on /portfolio. A project joins one
// by naming its slug as its `category`. A category with no projects yet shows
// as "Coming soon" and doesn't open.
export const CATEGORIES = [
  { slug: "engineering-design", title: "Engineering Design" },
  { slug: "video-editing", title: "Video Editing" },
];

// The Waterloo Versus the World videos are archived for now, not on the site:
// src/archive/portfolio-videos (its README says how to bring them back).
const PROJECTS = [
  {
    slug: "jerry-jiang-campaign",
    category: "video-editing",
    title: "Jerry Jiang Campaign",
    kind: "Mixed Media",
    year: "Oct 2026 - Ongoing",
    image: cover1,
    // Sections on the project's page, always open. Each has an optional title,
    // then YouTube links (names from assets/youtubeLinks.js, shown as is, or
    // { link, text } to show shorter text) and/or videos played on the page.
    folders: [
      {
        title: "Waterloo Versus the World",
        links: ["Episode 1", "Episode 2", "Episode 3"],
        videos: [],
      },
    ],
  },
  // Placeholder cover photos
  {
    slug: "podcasting",
    category: "video-editing",
    title: "Podcasting",
    kind: "Video/Audio",
    year: "May 2025 - Ongoing",
    image: cover2,
    folders: [
      {
        // { link: name in youtubeLinks.js, text: what the page shows }
        links: [
          { link: "Podcast Ep. 1", text: "Ep. 1 Ryan Martel" },
          { link: "Podcast Ep. 2", text: "Ep. 2 Sydney Wambua" },
          { link: "Podcast Ep. 3", text: "Ep. 3 Jerry Jiang" },
          { link: "Podcast Ep. 4", text: "Ep. 4 First Principles" },
        ],
        videos: [],
      },
    ],
  },
  {
    slug: "inception-studio",
    category: "video-editing",
    title: "Inception Studio",
    kind: "Video",
    year: "Oct 2026",
    image: cover3,
    folders: [
      {
        links: ["Boundless San Francisco Grant"],
        videos: [],
      },
    ],
  },
];

export default PROJECTS;
