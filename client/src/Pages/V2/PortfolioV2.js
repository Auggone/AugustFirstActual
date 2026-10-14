// Pages/V2/PortfolioV2.js
// Portfolio, at /portfolio. Frame shared with the other pages: components/pastelFrame.
// Content: a grid of categories (CATEGORIES in portfolioProjects.js); each one
// opens its own page listing its projects (PortfolioCategory.js), titles only
// for now (the cover images are still listed there, just not shown); each
// project title opens the project's page (PortfolioProject.js).
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import { Link } from "react-router-dom";
import PROJECTS, { CATEGORIES } from "./portfolioProjects";
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
          {CATEGORIES.map((c) => {
            const count = PROJECTS.filter((p) => p.category === c.slug).length;
            const meta = count ? `${count} project${count === 1 ? "" : "s"}` : "Coming soon";
            // Empty categories show but don't open yet
            return count ? (
              <Link key={c.slug} to={`/portfolio/${c.slug}`} className="pf-card">
                <h3>{c.title}</h3>
                <p className="pf-meta">{meta}</p>
              </Link>
            ) : (
              <div key={c.slug} className="pf-card is-empty">
                <h3>{c.title}</h3>
                <p className="pf-meta">{meta}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PastelFrame>
  );
}
