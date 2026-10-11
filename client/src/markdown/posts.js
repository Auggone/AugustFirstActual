// src/markdown/posts.js
// Finds every markdown file in src/posts and turns it into a post.
//
// Webpack picks the files up at build time, so dropping a new `.md` file into
// src/posts is all it takes for a post to exist: it gets a page at
// /articles/<slug> and a card on /writing. Files whose name starts with `_`
// or `.` are skipped, which is a handy place to keep drafts.
import { useEffect, useState } from 'react';
import { parseFrontMatter } from './parser';

const context = require.context('../posts', false, /^\.\/[^_.][^/]*\.md$/);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Each file becomes a URL; the text itself is fetched when a page needs it.
const files = context.keys().map((key) => {
  const mod = context(key);
  return {
    key,
    url: mod && mod.default ? mod.default : mod,
    name: key.replace(/^\.\//, '').replace(/\.md$/i, ''),
  };
});

function defaultsFromName(name) {
  const dated = /^(\d{4}-\d{2}-\d{2})[-_ ]+(.*)$/.exec(name);
  if (dated) return { date: dated[1], slug: slugify(dated[2]) };
  return { date: '', slug: slugify(name) };
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toList(value) {
  if (value == null || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

// "2026-08-12" -> "August 12, 2026", built by hand so the date does not shift
// a day in timezones behind UTC.
export function formatDate(value) {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!m) return String(value);
  const month = MONTHS[Number(m[2]) - 1];
  if (!month) return String(value);
  return `${month} ${Number(m[3])}, ${m[1]}`;
}

function buildPost(file, text) {
  const { data, content } = parseFrontMatter(text);
  const fallback = defaultsFromName(file.name);

  return {
    slug: data.slug ? slugify(data.slug) : fallback.slug,
    title: data.title || file.name,
    subtitle: data.subtitle || '',
    date: data.date ? String(data.date) : fallback.date,
    cover: data.cover || '',
    categories: toList(data.category || data.categories),
    align: data.align === 'center' ? 'center' : 'left',
    draft: data.draft === true,
    hidden: data.hidden === true,
    content,
    file: file.key,
  };
}

function byNewest(a, b) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.slug < b.slug ? 1 : -1;
}

let cache = null;

// Loads and parses every post once per page load.
export function loadPosts() {
  if (!cache) {
    cache = Promise.all(
      files.map(async (file) => {
        const response = await fetch(file.url);
        if (!response.ok) {
          throw new Error(`Could not load ${file.key} (${response.status})`);
        }
        return buildPost(file, await response.text());
      })
    ).then((posts) => posts.filter((post) => !post.draft).sort(byNewest));

    // A failed load should not be cached, so a later render can try again.
    cache.catch(() => {
      cache = null;
    });
  }
  return cache;
}

export function usePosts() {
  const [state, setState] = useState({ posts: [], loading: files.length > 0, error: null });

  useEffect(() => {
    let active = true;
    loadPosts().then(
      (posts) => active && setState({ posts, loading: false, error: null }),
      (error) => active && setState({ posts: [], loading: false, error })
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
