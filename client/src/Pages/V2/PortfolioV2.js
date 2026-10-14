// Pages/V2/PortfolioV2.js
// Portfolio, at /portfolio. Frame shared with the other pages: components/pastelFrame.
// Content: a grid of projects (portfolioProjects.js), titles only for now (the
// cover images are still listed there, just not shown); each title opens its
// project's page (PortfolioProject.js).
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import { Link } from "react-router-dom";
import PROJECTS from "./portfolioProjects";
import "./PortfolioV2.css";

// A plain black background, no pastel (PastelFrame with no palette)
export const EDGE = "#080B0F";

// On black, the title, menu and icons are paper cream
export const INK = "#f2ebdd";

export default function PortfolioV2() {
  return (
    <PastelFrame edge={EDGE} ink={INK} screens={1}>
      <div className="frame-media portfolio">
        <div className="pf-grid">
          {PROJECTS.map((p) => (
            <Link key={p.slug} to={`/portfolio/${p.slug}`} className="pf-card">
              <h3>{p.title}</h3>
              {p.kind && <p className="pf-meta">{p.kind} · {p.year}</p>}
            </Link>
          ))}
        </div>
      </div>
    </PastelFrame>
  );
}
