// src/markdown/Markdown.js
// Renders the tree from parser.js as React elements.
// Nothing is passed through dangerouslySetInnerHTML, so raw HTML written in a
// post shows up as plain text instead of running.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { parseMarkdown } from './parser';
import './markdown.css';

const PUBLIC = process.env.PUBLIC_URL || '';
const AUDIO_EXT = /\.(mp3|wav|m4a|ogg|aac|flac)$/i;

export default function Markdown({ source, className = '' }) {
  const blocks = useMemo(() => parseMarkdown(source || ''), [source]);
  return <div className={`md-body ${className}`.trim()}>{renderBlocks(blocks)}</div>;
}

/* ------------------------------------------------------------------ */
/* urls                                                                */
/* ------------------------------------------------------------------ */

function isAbsolute(url) {
  return /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url);
}

// A bare filename in a post ("cover.jpg", "song.mp3") points at the matching
// folder in `public/`, so images and audio can be dropped in next to the file.
function resolveAsset(url, folder) {
  if (!url) return url;
  if (isAbsolute(url)) return url;
  if (url.startsWith('/')) return PUBLIC + url;
  return `${PUBLIC}/${folder}/${url.replace(/^\.?\/*/, '')}`;
}

// Links to other pages of the site go through the router; everything else is a
// plain anchor. A path ending in a file extension is a file, not a page.
function isRoute(href) {
  return href.startsWith('/') && !href.startsWith('//') && !/\.[a-z0-9]{2,5}$/i.test(href);
}

/* ------------------------------------------------------------------ */
/* blocks                                                              */
/* ------------------------------------------------------------------ */

function renderBlocks(blocks) {
  return blocks.map((block, i) => renderBlock(block, i));
}

function renderBlock(block, key) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}`;
      return (
        <Tag key={key} className="md-heading">
          {renderInline(block.children)}
        </Tag>
      );
    }

    case 'paragraph': {
      // A paragraph holding nothing but media should not be wrapped in <p>,
      // which would leave an empty text line under the image.
      const media = block.children.filter((c) => c.type !== 'break');
      if (media.length && media.every((c) => c.type === 'image' || c.type === 'audio')) {
        return (
          <div key={key} className="md-media-row">
            {media.map((child, i) => renderInline([child], i))}
          </div>
        );
      }
      // An image with words after it is a figure: the words are its caption,
      // so they get centred under the picture rather than run as body text.
      const isFigure = block.children.some((c) => c.type === 'image' || c.type === 'audio');
      return (
        <p key={key} className={isFigure ? 'md-paragraph md-figure' : 'md-paragraph'}>
          {renderInline(block.children)}
        </p>
      );
    }

    case 'code':
      return (
        <pre key={key} className="md-pre">
          <code className={block.lang ? `language-${block.lang}` : undefined}>{block.value}</code>
        </pre>
      );

    case 'blockquote':
      return (
        <blockquote key={key} className="md-quote">
          {renderBlocks(block.children)}
        </blockquote>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      const start = block.ordered && block.start !== 1 ? block.start : undefined;
      return (
        <Tag key={key} className="md-list" start={start}>
          {block.items.map((item, i) => (
            <li key={i} className="md-list-item">
              {/* A single-paragraph item renders inline so tight lists stay tight. */}
              {item.length === 1 && item[0].type === 'paragraph'
                ? renderInline(item[0].children)
                : renderBlocks(item)}
            </li>
          ))}
        </Tag>
      );
    }

    case 'table':
      return (
        <div key={key} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                {block.header.map((cell, i) => (
                  <th key={i} style={{ textAlign: block.align[i] || undefined }}>
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} style={{ textAlign: block.align[c] || undefined }}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'hr':
      return <hr key={key} className="md-hr" />;

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* inline                                                              */
/* ------------------------------------------------------------------ */

function renderInline(nodes, keyOffset = 0) {
  return nodes.map((node, i) => renderNode(node, `${keyOffset}-${i}`));
}

function renderNode(node, key) {
  switch (node.type) {
    case 'text':
      return node.value;

    case 'break':
      return <br key={key} />;

    case 'strong':
      return <strong key={key}>{renderInline(node.children)}</strong>;

    case 'em':
      return <em key={key}>{renderInline(node.children)}</em>;

    case 'del':
      return <del key={key}>{renderInline(node.children)}</del>;

    case 'codeSpan':
      return (
        <code key={key} className="md-code">
          {node.value}
        </code>
      );

    case 'image':
      return (
        <img
          key={key}
          src={resolveAsset(node.src, 'Images')}
          alt={node.alt || ''}
          title={node.title || undefined}
          className="md-image"
          loading="lazy"
        />
      );

    case 'audio':
      return (
        <span key={key} className="md-audio">
          {node.alt ? <span className="md-audio-title">{node.alt}</span> : null}
          <audio controls preload="none" src={resolveAsset(node.src, 'audio')}>
            Your browser cannot play this audio.
          </audio>
        </span>
      );

    case 'link': {
      const href = AUDIO_EXT.test(node.href) ? resolveAsset(node.href, 'audio') : node.href;
      if (isRoute(href)) {
        return (
          <Link key={key} to={href} title={node.title || undefined}>
            {renderInline(node.children)}
          </Link>
        );
      }
      const external = /^https?:/i.test(href);
      return (
        <a
          key={key}
          href={href}
          title={node.title || undefined}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {renderInline(node.children)}
        </a>
      );
    }

    default:
      return null;
  }
}
