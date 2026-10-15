// Pages/V2/portfolioProjects.js
// The portfolio's categories and projects. /portfolio shows the categories
// (PortfolioV2.js); each category's page, /portfolio/<category slug>
// (PortfolioCategory.js), shows its projects in the order listed here; each
// project gets its own page at /portfolio/<slug> (PortfolioProject.js) showing
// its folders of links and videos. Links are numbered on the page (1., 2., ...),
// so their text leaves out "Ep." and numbers.
import cover1 from "../../assets/coverImage1.jpg";
import cover2 from "../../assets/coverImage2.jpg";
import cover3 from "../../assets/coverImage3.jpg";
import cover4 from "../../assets/coverImage4.JPG";
import cover5 from "../../assets/coverImage5.jpg";

// The categories, in the order they appear on /portfolio. A project joins one
// by naming its slug as its `category`. A category with no projects yet shows
// as "Coming soon" and doesn't open. A category with `project` set skips its
// own page: its card opens that one project's page directly.
export const CATEGORIES = [
  { slug: "engineering-design", title: "Engineering Design" },
  { slug: "video-editing", title: "Video Editing" },
  { slug: "verbal-essays", title: "Verbal Essays and Lectures", project: "verbal-essays-and-lectures" },
];

// The Waterloo Versus the World videos are archived for now, not on the site:
// src/archive/portfolio-videos (its README says how to bring them back).
const PROJECTS = [
  {
    slug: "docunison",
    category: "engineering-design",
    title: "DocUnison",
    kind: "Financial Tool",
    year: "June 2026 - Oct 2026",
    image: cover5,
    folders: [
      {
        title: "DocUnison",
        numbered: false, // the site link stands alone, no "1."
        links: [{ url: "https://docunison.com/", text: "docunison.com" }],
        videos: [],
      },
    ],
  },
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
        links: [
          { link: "Episode 1", text: "Waterloo VS the World 1" },
          { link: "Episode 2", text: "Waterloo VS the World 2" },
          { link: "Episode 3", text: "Waterloo VS the World 3" },
        ],
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
        title: "Podcasting",
        // { link: name in youtubeLinks.js, text: what the page shows }
        links: [
          { link: "Podcast Ep. 1", text: "Ryan Martel" },
          { link: "Podcast Ep. 2", text: "Sydney Wambua" },
          { link: "Podcast Ep. 3", text: "Jerry Jiang" },
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
        title: "Inception Studio",
        links: ["Boundless San Francisco Grant"],
        videos: [],
      },
    ],
  },
  {
    slug: "verbal-essays-and-lectures",
    category: "verbal-essays",
    title: "Verbal Essays and Lectures",
    kind: "Video",
    year: "2026",
    image: cover4,
    folders: [
      {
        title: "Verbal Essays and Lectures",
        links: [
          { link: "Verbal Essay Ep. 1", text: "The Importance of First Principles" },
        ],
        videos: [],
      },
    ],
  },
];

export default PROJECTS;
