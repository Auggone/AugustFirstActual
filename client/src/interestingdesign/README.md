# interestingdesign

Design references and briefs for the site. These are specs to build from, not code: nothing in the app imports from this folder.

| File | What it is | Status |
|---|---|---|
| `mini-image-spec.md` | Mini image thumbnails (book cards and preset swatches), measured from evebouffard.com | In use: the homepage swatches and the portfolio thumbnails follow it |
| `creative-work/README.md` | The brief for redesigning the portfolio project pages (Creative Work, "Direction A") | Built (see its §11) |
| `creative-work/reference.html` | A static mockup of that design. Open it in a browser and narrow the window below 768px to see the phone layout. | Reference only |
| `creative-work/project-data-example.json` | The Jerry Jiang project with the brief's new fields. Values in [brackets] are placeholders. | Reference only |

Where they conflict, `mini-image-spec.md` wins: the brief dropped the swatches' rounded corners and edge on project pages, but they were kept so the site stays consistent.
