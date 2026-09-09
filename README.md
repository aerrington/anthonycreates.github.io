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
entry. Set `draft: false` to publish. Entry length follows the material, with a
hard ceiling of 1,500 words.

Longer entries can include a model-written stream preview:

```yaml
modelPreview: >
  A short preview of what the full entry contains.
```

It is labelled as model-written on the Live stream. Add an author-written
`preview` field to override it; entries without either field appear in full.

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

The Live implementation is ready to merge. Two entries are published, longer
entries support compact previews, the main site links prominently to Live, and
the GitHub Pages workflow builds the complete Eleventy output.

After merging:

1. Confirm that the repository’s Pages source is set to **GitHub Actions**.
2. Verify the first deployment at `/live/`, including its feed and both entries.
3. Run final responsive and accessibility checks on the deployed site.
4. Connect Buttondown to `/live/feed.xml`, creating newsletter drafts rather
   than sending automatically.
5. Time the end-to-end publishing flow; the target is under five minutes.
