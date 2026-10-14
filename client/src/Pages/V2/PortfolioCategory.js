// Pages/V2/PortfolioCategory.js
// One portfolio category, at /portfolio/<category slug>: the frame with a back
// arrow (to /portfolio) in place of the menu, and the category's projects
// (portfolioProjects.js) as a grid of titles, each opening its project's page
// (PortfolioProject.js).
import { Link } from "react-router-dom";
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import PROJECTS from "./portfolioProjects";
import { EDGE, INK } from "./PortfolioV2";
import { BackArrow } from "./PortfolioProject";
import "./PortfolioV2.css";

export default function PortfolioCategory({ category }) {
  const projects = PROJECTS.filter((p) => p.category === category.slug);

  return (
    <PastelFrame
      edge={EDGE}
      ink={INK}
      screens={1}
      nav={<BackArrow to="/portfolio" label="Portfolio" />}
    >
      <div className="frame-media portfolio">
        <h2 className="pf-category-title">{category.title}</h2>
        {projects.length ? (
          <div className="pf-grid">
            {projects.map((p) => (
              <Link key={p.slug} to={`/portfolio/${p.slug}`} className="pf-card">
                <h3>{p.title}</h3>
                {p.kind && <p className="pf-meta">{p.kind} · {p.year}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="pf-meta">Coming soon</p>
        )}
      </div>
    </PastelFrame>
  );
}
