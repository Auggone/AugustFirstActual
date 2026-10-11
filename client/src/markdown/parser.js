// src/markdown/parser.js
// A small, dependency-free markdown parser.
// It turns markdown text into a plain-object tree; nothing here knows about
// React, so it can be tested on its own. See Markdown.js for the rendering.

const HR = /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
const FENCE = /^( {0,3})(`{3,}|~{3,})[ \t]*(\S*)[ \t]*$/;
const BLOCKQUOTE = /^ {0,3}>[ \t]?/;
const LIST_ITEM = /^([ \t]*)([-*+]|\d{1,9}[.)])([ \t]+|$)(.*)$/;
const TABLE_DELIM = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;

const ESCAPABLE = new Set('\\`*_{}[]()#+-.!>~|<>"\''.split(''));

const AUDIO_EXT = /\.(mp3|wav|m4a|ogg|aac|flac)$/i;

/* ------------------------------------------------------------------ */
/* front matter                                                        */
/* ------------------------------------------------------------------ */

// Parses the `---` block at the top of a file. Deliberately a small subset of
// YAML: `key: value`, quoted strings, [a, b] lists, booleans and numbers.
export function parseFrontMatter(text) {
  const normalized = String(text).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const match = /^---[ \t]*\n([\s\S]*?)\n?---[ \t]*(?:\n|$)/.exec(normalized);
  if (!match) return { data: {}, content: normalized };

  const data = {};
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (!key) continue;
    data[key] = parseScalar(line.slice(idx + 1).trim());
  }
  return { data, content: normalized.slice(match[0].length) };
}

function parseScalar(raw) {
  if (raw === '') return '';
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw
      .slice(1, -1)
      .split(',')
      .map((part) => parseScalar(part.trim()))
      .filter((part) => part !== '');
  }
  const quoted = /^(['"])([\s\S]*)\1$/.exec(raw);
  if (quoted) return quoted[2];
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null' || raw === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
}

/* ------------------------------------------------------------------ */
/* blocks                                                              */
/* ------------------------------------------------------------------ */

export function parseMarkdown(text) {
  return parseBlocks(String(text).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'));
}

export function parseBlocks(src) {
  const lines = src.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const marker = fence[2][0];
      const minLen = fence[2].length;
      const indent = fence[1].length;
      const body = [];
      i++;
      while (i < lines.length && !isClosingFence(lines[i], marker, minLen)) {
        body.push(stripIndent(lines[i], indent));
        i++;
      }
      if (i < lines.length) i++; // consume the closing fence
      blocks.push({ type: 'code', lang: fence[3] || '', value: body.join('\n') });
      continue;
    }

    // Checked before lists so that `---` and `* * *` stay horizontal rules.
    if (HR.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      const text = (heading[2] || '').replace(/[ \t]+#+[ \t]*$/, '');
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        children: parseInline(text),
      });
      i++;
      continue;
    }

    if (BLOCKQUOTE.test(line)) {
      const body = [];
      while (i < lines.length) {
        if (BLOCKQUOTE.test(lines[i])) {
          body.push(lines[i].replace(BLOCKQUOTE, ''));
          i++;
        } else if (lines[i].trim() && body.length && body[body.length - 1].trim()) {
          body.push(lines[i]); // lazy continuation
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'blockquote', children: parseBlocks(body.join('\n')) });
      continue;
    }

    if (isTableStart(lines, i)) {
      const table = parseTable(lines, i);
      if (table) {
        blocks.push(table.node);
        i = table.next;
        continue;
      }
    }

    if (LIST_ITEM.test(line)) {
      const list = parseList(lines, i);
      if (list.node.items.length) {
        blocks.push(list.node);
        i = list.next;
        continue;
      }
    }

    const paragraph = [lines[i]];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines, i)) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push({
      type: 'paragraph',
      children: parseInline(paragraph.map((l) => l.trim()).join('\n')),
    });
  }

  return blocks;
}

function isClosingFence(line, marker, minLen) {
  const m = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line);
  return Boolean(m) && m[1][0] === marker && m[1].length >= minLen;
}

function stripIndent(line, indent) {
  let removed = 0;
  let i = 0;
  while (i < line.length && removed < indent && (line[i] === ' ' || line[i] === '\t')) {
    removed += line[i] === '\t' ? 4 : 1;
    i++;
  }
  return line.slice(i);
}

function indentOf(line) {
  const m = /^[ \t]*/.exec(line)[0];
  let width = 0;
  for (const ch of m) width += ch === '\t' ? 4 : 1;
  return width;
}

// True when the line at `i` opens a new block, i.e. a paragraph must stop here.
function startsBlock(lines, i) {
  const line = lines[i];
  return (
    HR.test(line) ||
    HEADING.test(line) ||
    FENCE.test(line) ||
    BLOCKQUOTE.test(line) ||
    LIST_ITEM.test(line) ||
    isTableStart(lines, i)
  );
}

function isTableStart(lines, i) {
  return (
    lines[i].includes('|') &&
    i + 1 < lines.length &&
    lines[i + 1].includes('-') &&
    TABLE_DELIM.test(lines[i + 1])
  );
}

/* ------------------------------------------------------------------ */
/* lists                                                               */
/* ------------------------------------------------------------------ */

function parseList(lines, start) {
  const first = LIST_ITEM.exec(lines[start]);
  const baseIndent = indentOf(lines[start]);
  const ordered = /\d/.test(first[2]);
  const startNumber = ordered ? parseInt(first[2], 10) : null;

  const items = [];
  let current = null;
  let i = start;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      // A blank line only stays inside the list when what follows still
      // belongs to it — otherwise the list ends here.
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (j >= lines.length) break;

      const nextIndent = indentOf(lines[j]);
      const nextIsItem = LIST_ITEM.test(lines[j]) && !HR.test(lines[j]);
      const continues =
        (nextIsItem && nextIndent >= baseIndent) ||
        (current && nextIndent >= current.contentIndent);
      if (!continues) break;

      if (current) current.lines.push('');
      i = j;
      continue;
    }

    const match = LIST_ITEM.exec(line);
    const isItem = Boolean(match) && !HR.test(line);
    const indent = indentOf(line);

    // Deeper than the current item's text column: it belongs to that item and
    // is parsed recursively (this is how nested lists are handled).
    if (current && indent >= current.contentIndent) {
      current.lines.push(stripIndent(line, current.contentIndent));
      i++;
      continue;
    }

    if (isItem && indent >= baseIndent && indent <= baseIndent + 3) {
      if (items.length && /\d/.test(match[2]) !== ordered) break; // a different list
      const markerWidth = match[2].length;
      const spacing = match[3].length || 1;
      current = {
        lines: [match[4]],
        contentIndent: indent + markerWidth + spacing,
      };
      items.push(current);
      i++;
      continue;
    }

    if (isItem) break;

    // Lazy continuation of the item's paragraph.
    if (current && current.lines.length && current.lines[current.lines.length - 1].trim()) {
      current.lines.push(line.trim());
      i++;
      continue;
    }

    break;
  }

  return {
    node: {
      type: 'list',
      ordered,
      start: startNumber,
      items: items.map((item) => parseBlocks(item.lines.join('\n'))),
    },
    next: i,
  };
}

/* ------------------------------------------------------------------ */
/* tables                                                              */
/* ------------------------------------------------------------------ */

function parseTable(lines, start) {
  const header = splitRow(lines[start]);
  const delim = splitRow(lines[start + 1]);
  if (header.length !== delim.length) return null;

  const align = delim.map((cell) => {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    if (left) return 'left';
    return null;
  });

  const rows = [];
  let i = start + 2;
  while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
    const cells = splitRow(lines[i]);
    while (cells.length < header.length) cells.push('');
    rows.push(cells.slice(0, header.length).map(parseInline));
    i++;
  }

  return {
    node: { type: 'table', align, header: header.map(parseInline), rows },
    next: i,
  };
}

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);

  const cells = [];
  let cell = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '|') {
      cell += '|';
      i++;
    } else if (s[i] === '|') {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += s[i];
    }
  }
  cells.push(cell.trim());
  return cells;
}

/* ------------------------------------------------------------------ */
/* inline                                                              */
/* ------------------------------------------------------------------ */

export function parseInline(text) {
  const nodes = [];
  let buffer = '';
  let i = 0;

  const flush = () => {
    if (buffer) {
      nodes.push({ type: 'text', value: buffer });
      buffer = '';
    }
  };

  while (i < text.length) {
    const char = text[i];

    if (char === '\\' && ESCAPABLE.has(text[i + 1])) {
      buffer += text[i + 1];
      i += 2;
      continue;
    }

    // Single newlines become line breaks: this blog is written that way.
    if (char === '\n') {
      flush();
      nodes.push({ type: 'break' });
      i++;
      continue;
    }

    if (char === '<') {
      const rest = text.slice(i);
      const br = /^<br[ \t]*\/?>/i.exec(rest);
      if (br) {
        flush();
        nodes.push({ type: 'break' });
        i += br[0].length;
        continue;
      }
      const auto = /^<((?:https?|mailto):[^\s<>]+)>/i.exec(rest);
      if (auto) {
        flush();
        nodes.push({ type: 'link', href: auto[1], children: [{ type: 'text', value: auto[1] }] });
        i += auto[0].length;
        continue;
      }
      const email = /^<([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)>/.exec(rest);
      if (email) {
        flush();
        nodes.push({
          type: 'link',
          href: `mailto:${email[1]}`,
          children: [{ type: 'text', value: email[1] }],
        });
        i += email[0].length;
        continue;
      }
    }

    if (char === '`') {
      const run = /^`+/.exec(text.slice(i))[0];
      const close = findClosingRun(text, i + run.length, '`', run.length);
      if (close !== -1) {
        let value = text.slice(i + run.length, close).replace(/\n/g, ' ');
        if (value.length > 2 && value.startsWith(' ') && value.endsWith(' ')) {
          value = value.slice(1, -1);
        }
        flush();
        nodes.push({ type: 'codeSpan', value });
        i = close + run.length;
        continue;
      }
    }

    if (char === '!' && text[i + 1] === '[') {
      const res = parseLinkLike(text, i + 1);
      if (res) {
        flush();
        nodes.push({
          type: AUDIO_EXT.test(res.href) ? 'audio' : 'image',
          src: res.href,
          title: res.title,
          alt: res.label.replace(/\\(.)/g, '$1'),
        });
        i = res.next;
        continue;
      }
    }

    if (char === '[') {
      const res = parseLinkLike(text, i);
      if (res) {
        flush();
        nodes.push({
          type: 'link',
          href: res.href,
          title: res.title,
          children: parseInline(res.label),
        });
        i = res.next;
        continue;
      }
    }

    if (char === '~' && text[i + 1] === '~') {
      const close = text.indexOf('~~', i + 2);
      if (close !== -1) {
        flush();
        nodes.push({ type: 'del', children: parseInline(text.slice(i + 2, close)) });
        i = close + 2;
        continue;
      }
    }

    if (char === '*' || char === '_') {
      const res = parseEmphasis(text, i);
      if (res) {
        flush();
        nodes.push(res.node);
        i = res.next;
        continue;
      }
    }

    if (char === 'h' || char === 'w') {
      const before = i === 0 ? '' : text[i - 1];
      if (!before || /[\s(]/.test(before)) {
        const m = /^(?:https?:\/\/|www\.)[^\s<>]*[^\s<>().,;:!?'"]/.exec(text.slice(i));
        if (m) {
          const href = m[0].startsWith('www.') ? `https://${m[0]}` : m[0];
          flush();
          nodes.push({ type: 'link', href, children: [{ type: 'text', value: m[0] }] });
          i += m[0].length;
          continue;
        }
      }
    }

    buffer += char;
    i++;
  }

  flush();
  return nodes;
}

function findClosingRun(text, from, char, length) {
  let i = from;
  while (i < text.length) {
    if (text[i] !== char) {
      i++;
      continue;
    }
    const run = /^`+|^~+|^\*+|^_+/.exec(text.slice(i))[0].length;
    if (run === length) return i;
    i += run;
  }
  return -1;
}

function parseLinkLike(text, start) {
  let depth = 0;
  let i = start;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\\') {
      i++;
    } else if (ch === '[') {
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (i >= text.length || depth !== 0) return null;

  const label = text.slice(start + 1, i);
  const open = i + 1;
  if (text[open] !== '(') return null;

  let parens = 0;
  let j = open;
  for (; j < text.length; j++) {
    const ch = text[j];
    if (ch === '\\') {
      j++;
    } else if (ch === '(') {
      parens++;
    } else if (ch === ')') {
      parens--;
      if (parens === 0) break;
    }
  }
  if (j >= text.length || parens !== 0) return null;

  const dest = text.slice(open + 1, j).trim();
  let href = dest;
  let title = null;
  const withTitle = /^([\s\S]*?)[ \t]+["'(]([\s\S]*)["')]$/.exec(dest);
  if (withTitle) {
    href = withTitle[1].trim();
    title = withTitle[2];
  }
  href = href.replace(/^<([\s\S]*)>$/, '$1').replace(/\\(.)/g, '$1');

  return { label, href, title, next: j + 1 };
}

function parseEmphasis(text, start) {
  const char = text[start];
  const run = /^\*+|^_+/.exec(text.slice(start))[0].length;

  // `snake_case` should not turn into emphasis.
  if (char === '_' && start > 0 && /\w/.test(text[start - 1])) return null;

  for (let length = Math.min(run, 3); length >= 1; length--) {
    const after = text[start + length];
    if (after === undefined || /\s/.test(after)) continue;

    const close = findEmphasisClose(text, start + length, char, length);
    if (close === -1) continue;

    const children = parseInline(text.slice(start + length, close));
    let node;
    if (length === 3) node = { type: 'strong', children: [{ type: 'em', children }] };
    else if (length === 2) node = { type: 'strong', children };
    else node = { type: 'em', children };

    return { node, next: close + length };
  }

  return null;
}

function findEmphasisClose(text, from, char, length) {
  let i = from;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] !== char) {
      i++;
      continue;
    }
    const run = /^\*+|^_+/.exec(text.slice(i))[0].length;
    const previous = text[i - 1];
    const next = text[i + run];
    const closes =
      run >= length &&
      previous !== undefined &&
      !/\s/.test(previous) &&
      !(char === '_' && next !== undefined && /\w/.test(next));
    if (closes) return i;
    i += run;
  }
  return -1;
}
