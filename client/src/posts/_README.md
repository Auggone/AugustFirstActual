# Writing posts in markdown

Drop a `.md` file in this folder and it becomes a post. Nothing else to wire up:
it gets a page at `/articles/<slug>` and a card on `/writing` automatically.

Files starting with `_` (like this one) or `.` are ignored, so `_notes.md` is a
safe scratch pad.

> After adding a file, restart `npm start`. The dev server only scans this
> folder when it boots, so a brand new file will not appear until it restarts.
> Editing an existing post hot-reloads normally.

## Naming

Name the file `YYYY-MM-DD-some-title.md`. The date sets the post's date and the
rest becomes the URL:

    2026-08-12-the-difference-between-us.md  ->  /articles/the-difference-between-us

A plain name like `aug12.md` works too, it just has no date until you set one in
the front matter.

## Front matter

The block between `---` lines at the top. Every field is optional.

```
---
title: The difference between us
date: 2026-08-12
subtitle: Jan 20th: what I keep coming back to
cover: /Images/augdowntown6.jpg
category: [All New, New Blogs]
align: center
draft: false
hidden: false
slug: custom-url
---
```

| Field | What it does |
| --- | --- |
| `title` | Heading at the top of the post. Defaults to the file name. |
| `date` | `YYYY-MM-DD`. Sorts the posts, newest first. Falls back to the date in the file name. |
| `subtitle` | The caption under the card on `/writing`. Falls back to the title. |
| `cover` | The card's image. Put the file in `public/Images/` and write `/Images/name.jpg`. |
| `category` | Which filter buttons show the post. Defaults to `[All New, New Blogs]`. |
| `align` | `left` (default) or `center` to match the older hand-written posts. |
| `draft` | `true` hides the post everywhere, including its URL. |
| `hidden` | `true` keeps it off `/writing` but the URL still works. Good for sharing something quietly. |
| `slug` | Overrides the URL taken from the file name. |

## Writing

The usual markdown: `#` headings, `**bold**`, `*italic*`, `~~strike~~`,
`` `code` ``, `> quotes`, `-` and `1.` lists, `---` rules, tables, fenced code
blocks, and `[links](https://example.com)`.

A single line break is a line break, the way it looks in the file. You do not
need `<br>` or two trailing spaces.

### Images and audio

Put images in `public/Images/` and audio in `public/audio/`, then use just the
file name:

```
![A penguin](adventurepenguin.jpg)
![Zombie World Giant](zbworldgiant.mp3)
```

An audio file renders as a player instead of an image. Paths starting with `/`
are used as written, so `/Images/deeper/photo.jpg` works too.

### Links

A link starting with `/` stays inside the site and does not reload the page:
`[older writing](/writing)`. Everything else opens in a new tab.

## One thing to know

Raw HTML is printed as text, not rendered — writing `<div>` in a post shows the
word `<div>`. That is deliberate: it keeps a post from breaking the page layout.
`<br>` is the exception and still works, since the older posts are full of them.
