// src/components/postgrid/postGrid.js
// The card grid shared by the writing page and the archive, so both stay
// identical by construction. Styles live in homePage.css.
import { Link } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";
import { useGridControls } from "../../animation";
import Links from "../links/links";
import NavBarTwo from "../../Pages/Articles/NewHomePage/navbartwo";
import "../../homePage.css";

// withNav: the old pages draw the menu and social links here; the v2 pages
// already have them in their frame, so they pass withNav={false}
export default function PostGrid({ boxes, applyFilter = true, variant, withNav = true, children }) {
  const { filter } = useGridControls(); // Read filter from context
  const isColumnMode = filter !== "all";

  // The archive shows everything it is given; the writing page respects the
  // category filter.
  const visible = applyFilter
    ? boxes.filter(b => filter === "all" || b.category.includes(filter))
    : boxes;

  return (
    <div className="parent-grid">

      {children}

      <LayoutGroup>
      {withNav && <NavBarTwo />}
      {withNav && <Links />}
        <div
          layout
          className={`content-grid ${isColumnMode ? "column-mode" : ""} ${variant ? `content-grid--${variant}` : ""}`}
        >

            {visible.map((b, i) => (
                <motion.div

                  layout
                  key={b.src + i} // stable key
                  className={`box ${isColumnMode ? "uniform-box" : b.className} ${b.category}`}

                >

                 <Link to={`/articles/${b.slug}`}
                    className="block-link"
                    style={{ display: 'block', width: '100%', height: '218px', }}
                >
                  <div
                    className={`box-bg ${b.src ? "" : "box-bg-empty"}`}
                    style={b.src ? { backgroundImage: `url(${b.src})` } : undefined}
                    aria-label={b.alt}
                  />

                </Link>
                <div className="subtitle">
                  {b.subtitle}
                </div>

                </motion.div>

              ))}


        </div>
      </LayoutGroup>

      <div>

      </div>

      </div>
  );
}
