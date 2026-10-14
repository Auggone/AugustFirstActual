// Pages/V2/PortfolioProject.js
// One portfolio project, at /portfolio/<slug>: the frame with a back arrow in
// place of the menu, and the project's sections of YouTube links
// (assets/youtubeLinks.js) and videos played on the page.
import { Link, Navigate, useParams } from "react-router-dom";
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import PROJECTS from "./portfolioProjects";
import YOUTUBE_LINKS from "../../assets/youtubeLinks";
import { EDGE, INK } from "./PortfolioV2";
import "./PortfolioV2.css";

// Uses the menu's own classes (navbartwo.css) so the arrow sits where the menu does
function BackArrow() {
  return (
    <nav className="sidebar">
      <Link to="/portfolio" className="sidebar-item pf-back" aria-label="Back to Portfolio">
        ←
      </Link>
    </nav>
  );
}

// A section: its title (if it has one), then its links and videos, all shown
function Folder({ folder, projectTitle }) {
  return (
    <section className="pf-folder">
      {folder.title && <h2 className="pf-folder-title">{folder.title}</h2>}
      {folder.links?.length > 0 && (
        <ul className="pf-links">
          {folder.links.map((item) => {
            const { link, text } = typeof item === "string" ? { link: item, text: item } : item;
            return (
              <li key={link}>
                <a href={YOUTUBE_LINKS[link]} target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      {folder.videos?.length > 0 && (
        <div className="pf-videos">
          {folder.videos.map((v, i) => (
            <video
              key={v.src}
              src={v.src}
              poster={v.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={`${projectTitle}${folder.title ? `: ${folder.title}` : ""}, video ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function PortfolioProject() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/portfolio" replace />;

  return (
    <PastelFrame edge={EDGE} ink={INK} screens={1} nav={<BackArrow />}>
      <div className="frame-media portfolio">
        {project.folders.map((f, i) => (
          <Folder key={f.title ?? i} folder={f} projectTitle={project.title} />
        ))}
      </div>
    </PastelFrame>
  );
}
