// Pages/V2/PortfolioProject.js
// One portfolio project, at /portfolio/<slug>: the frame with a back arrow (to
// the project's category) in place of the menu, and the project's sections of YouTube links
// (assets/youtubeLinks.js), photos (opening larger in a lightbox) and videos played on the page.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useParams } from "react-router-dom";
import PastelFrame from "../../components/pastelFrame/PastelFrame";
import PROJECTS, { CATEGORIES } from "./portfolioProjects";
import YOUTUBE_LINKS from "../../assets/youtubeLinks";
import { EDGE, INK } from "./PortfolioV2";
import "./PortfolioV2.css";

// Uses the menu's own classes (navbartwo.css) so the arrow sits where the menu
// does. Shared with the category pages (PortfolioCategory.js).
export function BackArrow({ to, label }) {
  return (
    <nav className="sidebar">
      <Link to={to} className="sidebar-item pf-back" aria-label={`Back to ${label}`}>
        ←
      </Link>
    </nav>
  );
}

// A photo opened over the page, whole (uncropped), on dimmed black. Arrows
// (buttons, keyboard, or a swipe on phones) step through the section's
// photos; Escape, the ×, or a click on the backdrop closes it. Rendered into
// <body> so the frame's own layout can't clip or offset it.
function Lightbox({ photos, index, setIndex, label }) {
  const close = useCallback(() => setIndex(null), [setIndex]);
  const step = useCallback(
    (d) => setIndex((i) => (i + d + photos.length) % photos.length),
    [setIndex, photos.length]
  );
  const touchX = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // The page behind doesn't scroll while a photo is open
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [close, step]);

  const photo = photos[index];
  const many = photos.length > 1;

  return createPortal(
    <div
      className="pf-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || !many) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <figure className="pf-lightbox-figure">
        <img src={photo.image} alt={photo.caption ?? ""} />
        {(photo.caption || many) && (
          <figcaption>
            {photo.caption}
            {many && <span className="pf-lightbox-count">{index + 1} / {photos.length}</span>}
          </figcaption>
        )}
      </figure>
      <button type="button" className="pf-lightbox-close" onClick={close} aria-label="Close">×</button>
      {many && (
        <>
          <button type="button" className="pf-lightbox-prev" onClick={() => step(-1)} aria-label="Previous photo">‹</button>
          <button type="button" className="pf-lightbox-next" onClick={() => step(1)} aria-label="Next photo">›</button>
        </>
      )}
    </div>,
    document.body
  );
}

// A section's photos: swatches the size of the thumbnails (same grid), but in
// the swatches' 4:3 shape (mini-image-spec.md), each opening the whole photo
// in the lightbox, with its caption (if any) beneath.
function Photos({ photos, label }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <ul className="pf-thumbs">
        {photos.map((p, i) => (
          <li key={p.image}>
            <button
              type="button"
              className="pf-thumb pf-photo"
              onClick={() => setOpen(i)}
              aria-label={`${p.caption ?? `Photo ${i + 1}`}, open larger`}
              style={{ backgroundImage: `url(${p.image})` }}
            />
            {p.caption && <span className="pf-thumb-text" aria-hidden="true">{p.caption}</span>}
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox photos={photos} index={open} setIndex={setOpen} label={label} />}
    </>
  );
}

// A section: its title (if it has one), then its row of thumbnails, photos,
// links and videos, all shown.
function Folder({ folder, projectTitle }) {
  return (
    <section className="pf-folder">
      {folder.title && (
        <h2 className="pf-folder-title">
          {folder.title}
          {folder.note && <span className="pf-folder-note"> ({folder.note})</span>}
        </h2>
      )}
      {/* A paragraph, or a list of points (an array) shown as bullets */}
      {Array.isArray(folder.description) ? (
        <ul className="pf-folder-desc is-bullets">
          {folder.description.map((point) => <li key={point}>{point}</li>)}
        </ul>
      ) : (
        folder.description && <p className="pf-folder-desc">{folder.description}</p>
      )}
      {folder.thumbnails?.length > 0 && (
        <ul className="pf-thumbs">
          {folder.thumbnails.map(({ image, link, text }) => (
            <li key={link}>
              <a
                className="pf-thumb"
                href={YOUTUBE_LINKS[link]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${text}, watch on YouTube`}
                style={{ backgroundImage: `url(${image})` }}
              />
              <span className="pf-thumb-text" aria-hidden="true">{text}</span>
            </li>
          ))}
        </ul>
      )}
      {folder.photos?.length > 0 && (
        <Photos
          photos={folder.photos}
          label={`${projectTitle}${folder.title && folder.title !== projectTitle ? `: ${folder.title}` : ""}, photos`}
        />
      )}
      {folder.links?.length > 0 && (
        <ul className="pf-links">
          {folder.links.map((item, i) => {
            // A YouTube name from youtubeLinks.js, or { url, text } for any other site
            const { link, url, text } = typeof item === "string" ? { link: item, text: item } : item;
            return (
              <li key={url ?? link}>
                <a href={url ?? YOUTUBE_LINKS[link]} target="_blank" rel="noopener noreferrer">
                  {folder.numbered === false ? text : <>{i + 1}.{text && ` ${text}`}</>}
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
  const category = CATEGORIES.find((c) => c.slug === project.category);
  // A category that opens straight to this project has no page of its own to go back to
  const back = category && !category.project
    ? { to: `/portfolio/${category.slug}`, label: category.title }
    : { to: "/portfolio", label: "Portfolio" };

  return (
    <PastelFrame edge={EDGE} ink={INK} screens={1} nav={<BackArrow {...back} />}>
      <div className="frame-media portfolio">
        {project.folders.map((f, i) => (
          <Folder key={f.title ?? i} folder={f} projectTitle={project.title} />
        ))}
      </div>
    </PastelFrame>
  );
}
