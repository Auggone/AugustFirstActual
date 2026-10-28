// Pages/V2/PortfolioProject.js
// One portfolio project, at /portfolio/<slug>: the frame with a back arrow (to
// the project's category) in place of the menu, and the project's sections of YouTube links
// (assets/youtubeLinks.js), photos (opening larger in a lightbox) and videos played on the page.
// Projects in a showcase category (Creative Work) get the fuller page instead:
// a header, a results band and big video thumbnails (interestingdesign/creative-work).
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
        <img src={photo.image} alt={photo.alt ?? photo.caption ?? ""} />
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

// ── Showcase pages (a category with `showcase`: Creative Work) ──

// The id in a YouTube link (youtu.be/<id> or watch?v=<id>)
function youtubeId(url) {
  return url?.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/)?.[1];
}

// A video's thumbnail at YouTube's largest size (1280 × 720), sharp at the
// showcase's size where our own 480 × 270 copies go soft. YouTube answers a
// video without one with a 120 × 90 grey stand-in, not an error, so that (or
// any failure) falls back to our copy, or with none, YouTube's 480 × 360.
function VideoImage({ url, image }) {
  const id = youtubeId(url);
  image ??= id && `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const [src, setSrc] = useState(id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : image);
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setSrc(image)}
      onError={() => setSrc(image)}
    />
  );
}

// A video: its thumbnail (the swatches' rounded corners and edge, with a play
// mark and running time) and, unless left out, its text with "YouTube ↗",
// together one link to the video in a new tab
function Video({ image, link, text, duration, caption = true }) {
  const url = YOUTUBE_LINKS[link];
  return (
    <a className="pf-video" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${text}, watch on YouTube`}>
      <span className="pf-video-frame">
        <VideoImage url={url} image={image} />
        <span className={`pf-pill${duration ? "" : " is-bare"}`}>
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 1l7 4-7 4z" fill="currentColor" />
          </svg>
          {duration}
        </span>
      </span>
      {caption && (
        <span className="pf-video-row">
          <span>{text}</span>
          <span className="pf-video-yt">YouTube ↗</span>
        </span>
      )}
    </a>
  );
}

// Snapshots: 4:5 tiles, each opening the whole image in the lightbox, with
// its caption (if any) beneath. One with no image yet is a plain tile showing
// its alt text, so the layout can be seen before the images arrive.
function Snapshots({ snapshots, label }) {
  const [open, setOpen] = useState(null);
  const ready = snapshots.filter((s) => s.image);
  return (
    <>
      <ul className="pf-snaps">
        {snapshots.map((s, i) => (
          <li key={s.image ?? i} className="pf-snap">
            {s.image ? (
              <button
                type="button"
                className="pf-snap-frame"
                onClick={() => setOpen(ready.indexOf(s))}
                aria-label={`${s.alt}, open larger`}
              >
                <img src={s.image} alt="" loading="lazy" />
              </button>
            ) : (
              <div className="pf-snap-frame is-empty"><span>{s.alt}</span></div>
            )}
            {s.caption && <span className="pf-snap-caption">{s.caption}</span>}
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox photos={ready} index={open} setIndex={setOpen} label={label} />}
    </>
  );
}

// The top of a showcase page: a link back to the category, the title, a row
// of facts (each shown only when set) and a short description
function ProjectHeader({ project, category }) {
  const facts = [
    ["Kind", project.kind],
    ["Dates", project.year],
    ["My role", project.role],
    ["Platforms", project.platforms?.join(" · ")],
  ].filter(([, value]) => value);

  return (
    <header className="pf-header">
      <Link to={`/portfolio/${category.slug}`} className="pf-crumb">{category.title}</Link>
      <h1 className="pf-title">{project.title}</h1>
      {facts.length > 0 && (
        <dl className="pf-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="pf-label">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {project.description && <p className="pf-description">{project.description}</p>}
    </header>
  );
}

// The results band: big numbers between hairlines, with where they came from
// beneath. Only shown when the project has metrics.
function Results({ metrics, note }) {
  if (!metrics?.length) return null;
  if (!note && process.env.NODE_ENV !== "production") {
    console.warn("Portfolio: a project's metrics need a metricsNote (platforms, dates, source)");
  }
  return (
    <section className="pf-results" aria-labelledby="pf-results-title">
      <h2 id="pf-results-title" className="pf-label">Results</h2>
      <dl className="pf-metrics">
        {metrics.map((m) => (
          // The label comes first for screen readers; CSS puts the number on top
          <div key={m.label} className="pf-metric">
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="pf-results-note">{note}</p>}
    </section>
  );
}

// A showcase section: what was done on it (a label), its title, then its
// videos (three across, or one large with its text beside) and snapshots
function ShowcaseFolder({ folder, projectTitle }) {
  const videos = folder.thumbnails ?? [];
  const single = videos.length === 1;
  return (
    <section className="pf-section">
      {folder.note && <p className="pf-label">{folder.note}</p>}
      {folder.title && <h2 className="pf-section-title">{folder.title}</h2>}
      {/* With one video, the description goes beside it instead */}
      {!single && folder.description && <p className="pf-section-desc">{folder.description}</p>}
      {single && (
        <div className="pf-single">
          <Video {...videos[0]} caption={false} />
          <div className="pf-single-text">
            <p className="pf-single-title">{videos[0].text}</p>
            {folder.description && <p className="pf-section-desc">{folder.description}</p>}
            <a className="pf-single-link" href={YOUTUBE_LINKS[videos[0].link]} target="_blank" rel="noopener noreferrer">
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      )}
      {videos.length > 1 && (
        <div className="pf-video-grid">
          {videos.map((v) => <Video key={v.link} {...v} />)}
        </div>
      )}
      {folder.snapshots?.length > 0 && (
        <Snapshots snapshots={folder.snapshots} label={`${projectTitle}: ${folder.title ?? "snapshots"}`} />
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
  const showcase = category?.showcase;

  return (
    <PastelFrame edge={EDGE} ink={INK} screens={1} nav={<BackArrow {...back} />}>
      <div className={`frame-media portfolio${showcase ? " is-showcase" : ""}`}>
        {showcase && (
          <>
            <ProjectHeader project={project} category={category} />
            <Results metrics={project.metrics} note={project.metricsNote} />
          </>
        )}
        {project.folders.map((f, i) =>
          showcase ? (
            <ShowcaseFolder key={f.title ?? i} folder={f} projectTitle={project.title} />
          ) : (
            <Folder key={f.title ?? i} folder={f} projectTitle={project.title} />
          )
        )}
      </div>
    </PastelFrame>
  );
}
