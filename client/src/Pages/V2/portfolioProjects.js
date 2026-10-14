// Pages/V2/portfolioProjects.js
// The portfolio's projects, in the order they appear on /portfolio. Each one
// gets its own page at /portfolio/<slug> (PortfolioProject.js) showing its
// folders of links and videos.
import cover1 from "../../assets/coverImage1.jpg";
import cover2 from "../../assets/coverImage2.jpg";
import cover3 from "../../assets/coverImage3.jpg";

// The Waterloo Versus the World videos are archived for now, not on the site:
// src/archive/portfolio-videos (its README says how to bring them back).
const PROJECTS = [
  {
    slug: "jerry-jiang-campaign",
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
