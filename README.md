# Anthony Creates

Source for [anthonycreates.com](https://anthonycreates.com), including the
Eleventy-powered **Live** working notebook at `/live/`.

The established portfolio remains hand-authored static HTML. Eleventy passes
those files through unchanged and generates only the Live routes, feed and
sitemap into `dist/`.

## Start work on a new machine

Requirements: Node.js 18 or newer and npm.

```sh
npm ci
npm run dev
```

The development build includes draft Live entries. Eleventy prints the local
preview address when the server starts.

## Commands

```sh
npm run dev            # local server, including drafts
npm run build:preview  # one-off build, including drafts
npm run build          # production build, excluding drafts
```

All builds write to `dist/`. The directory is generated and is not committed.
Eleventy does not clean it before building, so remove `dist/` before a final
production check if a preview build has already put draft pages there.

## Add a Live entry

Create `content/live/YYYY-MM-DD-slug.md`:

```yaml
---
title: A specific sentence-case title
date: 2026-08-01
kind: made
projects: [haikucraft]
draft: true
---
```

Valid kinds are `made`, `learned`, `scrapped` and `wondering`. Omit `projects`
for an entry about the practice rather than a particular project. Project slugs
must exist in `src/live/_data/projectCatalog.json`.

Drafts appear locally but generate no production page, feed item or sitemap
entry. Set `draft: false` to publish. The current implementation targets
100–300 words and rejects entries over 500 words.

Images can sit beside the Markdown entry and be referenced with a relative path.
Add useful alternative text with `imageAlt` when using the front-matter `image`
field.

## Live structure

- `content/live/` — entry Markdown and validation/computed data
- `src/live/` — templates, data, stylesheet and production artwork
- `src/live/_data/current.json` — the editable masthead “Now” line
- `src/live/_data/projectCatalog.json` — expandable project catalogue
- `live-design/` — specification, source photographs and design working files
- `eleventy.config.js` — collections, filters, validation and passthrough rules

The project catalogue is not limited to the projects on the portfolio. A
project appears in the Live margin only after it has a published entry. Glyphs
are optional; projects without one use a colour mark and text label.

## Newsletter

Creative Rehab is hosted by Buttondown under the username `creativerehab`. The
signup form is wired into all Live pages and tags website signups with
`live-site`.

The managed sending domain, confirmation flow, welcome email, tagging, sending,
reply tracking and forwarding were configured and successfully tested in July
2026. The public RSS-to-email connection should be configured only after Live
is deployed and `/live/feed.xml` is publicly available. It should create drafts,
not send automatically.

## Current launch status

The first implementation slice is complete locally. Before launch:

1. Write two more launch entries, including at least one project entry.
2. Test entries with zero, one and multiple projects.
3. Add a prominent route into Live from the main site.
4. Add and verify the GitHub Pages build/deployment workflow.
5. Run a clean production build and final responsive/accessibility QA.
6. Time the end-to-end publishing flow; the target is under five minutes.

The only current entry is a draft Practice entry, so a clean production build
correctly has an empty Live stream.
