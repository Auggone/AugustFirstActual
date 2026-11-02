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
import maisonKooKooThumb from "../../assets/thumbs/maisonkookoo.jpg";
import wvw1Thumb from "../../assets/thumbs/wvw1.jpg";
import wvw2Thumb from "../../assets/thumbs/wvw2.jpg";
import wvw3Thumb from "../../assets/thumbs/wvw3.jpg";
import podcast1Thumb from "../../assets/thumbs/podcast1.jpg";
import podcast2Thumb from "../../assets/thumbs/podcast2.jpg";
import podcast3Thumb from "../../assets/thumbs/podcast3.jpg";
import boundlessThumb from "../../assets/thumbs/boundless.jpg";
import verbalEssay1Thumb from "../../assets/thumbs/verbalessay1.jpg";
import ball2 from "../../assets/woodworking/ball2.jpg";
import piano8125 from "../../assets/woodworking/img_8125.jpg";
import piano8226 from "../../assets/woodworking/img_8226.jpg";
import piano8323 from "../../assets/woodworking/img_8323.jpg";
import piano8413 from "../../assets/woodworking/img_8413.jpg";
import piano8474 from "../../assets/woodworking/img_8474.jpg";
import piano9340 from "../../assets/woodworking/img_9340.jpg";
import piano9341 from "../../assets/woodworking/img_9341.jpg";

// The categories, in the order they appear on /portfolio. A project joins one
// by naming its slug as its `category`. A category with no projects yet shows
// as "Coming soon" and doesn't open. A category with `project` set skips its
// own page: its card opens that one project's page directly. A category with
// `showcase` set gives its projects the fuller page (PortfolioProject.js;
// brief in interestingdesign/creative-work): a header, a results band, and
// big video thumbnails.
export const CATEGORIES = [
  { slug: "engineering-design", title: "Engineering Design" },
  { slug: "video-editing", title: "Creative Work", showcase: true },
  { slug: "verbal-essays", title: "Verbal Essays and Lectures", project: "verbal-essays-and-lectures" },
  { slug: "woodworking", title: "Woodworking" },
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
        description: [
          "A financial tool designed for businesses with large contract, purchase order and invoice databases",
          "Integrates with your accounting software (SAP B1, Sage, QuickBooks, etc.) to provide invoice validation against purchase orders, contracts and other documentation",
          "Currently servicing 2 enterprise-level customers and various individuals",
        ],
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
    year: "Oct 8 - Oct 26, 2026",
    image: cover1,
    // Showcase projects (their category's `showcase`) also have, all optional:
    // `role`, `platforms` (a list), a `description`, and `metrics`
    // ({ value, label }, values as shown, e.g. "1.2M") with `metricsNote`
    // (platforms, dates and source; needed whenever there are metrics).
    // Anything in [brackets] is a placeholder, there to show the layout:
    // replace it with the real thing, or delete the line to hide that part.
    role: "Creative Direction",
    platforms: ["Instagram", "YouTube"],
    description: "The goal of our campaign was to increase voter turnout, primarily through increased student engagement with municipal elections.",
    metrics: [
      { value: "210K+", label: "Video views" },
      { value: "+430", label: "Followers gained (100 → 530)" },
      { value: "25", label: "Posts published" },
    ],
    metricsNote: "Instagram + YouTube · Views and followers Oct 14 – Oct 26, 2026 · Source: [platform analytics, as of date]",
    // Sections on the project's page, always open. Each has an optional title
    // (and a `note` shown in brackets beside it, e.g. what was done on it;
    // on showcase pages, a label above it instead), then YouTube links (names
    // from assets/youtubeLinks.js, shown as is, or { link, text } to show
    // shorter text) and/or videos played on the page.
    // A section with `thumbnails` shows them as swatches (the homepage's) in a
    // row of three under its title, each linking to its YouTube video with its
    // own text beneath ({ image, link, text }, plus `duration` on showcase
    // pages). A showcase section with just one shows it large, its text beside.
    // A showcase section's `snapshots` ({ image, alt, caption? }) show as 4:5
    // tiles opening larger; one with no image yet shows its alt as a stand-in.
    // Thumbnails are 480 × 270, about twice their size on screen.
    folders: [
      {
        title: "It's Time to Invest in Waterloo",
        note: "Creatively Directed, in Collaboration with AQRedited",
        thumbnails: [
          { link: "It's Time to Invest in Waterloo", text: "It's Time to Invest in Waterloo", duration: "[0:00]" },
        ],
      },
      {
        title: "Waterloo Versus the World",
        note: "Edited",
        thumbnails: [
          { image: wvw1Thumb, link: "Episode 1", text: "Waterloo VS the World 1", duration: "[0:00]" },
          { image: wvw2Thumb, link: "Episode 2", text: "Waterloo VS the World 2", duration: "[0:00]" },
          { image: wvw3Thumb, link: "Episode 3", text: "Waterloo VS the World 3", duration: "[0:00]" },
        ],
      },
      {
        title: "Maison KooKoo Interview",
        note: "Filmed and Edited",
        description: "[One or two lines: the setup, how it was shot, what you cut it down from.]",
        thumbnails: [
          { image: maisonKooKooThumb, link: "Maison KooKoo Interview", text: "Head Chef Interview", duration: "[0:00]" },
        ],
      },
      {
        title: "Campaign snapshots",
        note: "[Role]",
        description: "[One line: what these are, e.g. feed posts, stories, behind-the-scenes stills.]",
        snapshots: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ alt: `[Post ${n}]`, caption: "[Caption or date]" })),
      },
    ],
  },
  // Placeholder cover photos
  {
    slug: "podcasting",
    category: "video-editing",
    title: "Podcasting",
    kind: "Video",
    year: "May 2025 - Ongoing",
    image: cover2,
    role: "Host",
    platforms: ["YouTube", "X"],
    description:
      "I enjoy talking to people and learning about what they're doing and why they're doing it. I think those conversations are worth sharing with the world, too.",
    folders: [
      {
        title: "Podcasting",
        thumbnails: [
          { image: podcast3Thumb, link: "Podcast Ep. 3", text: "Jerry Jiang", duration: "[0:00]" },
          { image: podcast2Thumb, link: "Podcast Ep. 2", text: "Sydney Wambua", duration: "[0:00]" },
          { image: podcast1Thumb, link: "Podcast Ep. 1", text: "Ryan Martel", duration: "[0:00]" },
        ],
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
    role: "Editor",
    platforms: ["Private"],
    description: "Application video for a very large grant.",
    folders: [
      {
        title: "Inception Studio",
        note: "Edited",
        thumbnails: [
          { image: boundlessThumb, link: "Boundless San Francisco Grant", text: "Boundless San Francisco Grant", duration: "[0:00]" },
        ],
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
        note: "Written, Recorded and Edited",
        thumbnails: [
          { image: verbalEssay1Thumb, link: "Verbal Essay Ep. 1", text: "The Importance of First Principles" },
        ],
      },
    ],
  },
  // Kind and year still to come. A section's `photos` ({ image, caption? },
  // images imported from assets/) show as swatches the thumbnails' size, in 4:3,
  // each opening the whole photo larger. Any section can have a `description`:
  // a short paragraph under its title (left out while empty).
  {
    slug: "shapes",
    category: "woodworking",
    title: "Shapes",
    folders: [
      {
        title: "Shapes",
        description:
          "Growing up I would spend my summers in Calgary, Alberta. My dad is a major hobbyist, and one of the things he does is carpentry, so he's got a fully kitted out wood work shop. I would spend a lot of my summers building stuff in there, mostly wooden swords, armour, bows and other weapon sort of things... not sure why that was my fixation but whatever lol. Now, when I visit him and have time to get into the workshop, I like to make random stuff. So far I have made this wooden ball, and this wooden cup. They were both cut from the same wood block and I made them on a lathe. If I ever do a GQ \"10 things I can't live without\", the ball will DEFINITELY be on my list lmao.",
        photos: [{ image: ball2 }],
      },
    ],
  },
  {
    slug: "piano-tech-work",
    category: "woodworking",
    title: "Piano Tech Work",
    folders: [
      {
        title: "Piano Tech Work",
        description:
          "I worked at two different piano stores in Toronto. The first was called the Piano Boutique, where I was a piano technician apprentice. The second place I worked at was a store called Paul Hahn, where I spent half my time doing admin work, and the other half of my time in the workshop. All of the photos here are from Paul Hahn, I have none from the Piano Boutique. Honestly, this work is so enjoyable and really one of the most fun things that I've been fortunate enough to do! It is an awesome feeling to make something beautiful.",
        photos: [
          { image: piano8125 },
          { image: piano8226 },
          { image: piano8323 },
          { image: piano8413 },
          { image: piano8474 },
          { image: piano9340 },
          { image: piano9341 },
        ],
      },
    ],
  },
];

export default PROJECTS;
