# Anthony Creates **Live** — Build Spec

_Final design direction: July 2026. Implementation status updated 1 August 2026._

## Implementation status

The first slice is implemented locally but not yet deployed. It includes the
Eleventy foundation, draft-aware entry routes, stream, Practice and About pages,
RSS, sitemap, responsive styling, real photographed-and-cleaned drawn marks, an
expandable 17-project catalogue, and optional glyphs for 12 projects. Creative
Rehab is configured in Buttondown with the username `creativerehab`; its managed
sending domain and the full subscribe, confirmation, welcome, reply and forwarding
flows have been tested successfully.

One draft Practice entry exists. A clean production build therefore contains no
published entries yet. Launch still requires two more entries, project-association
testing, a main-site route into Live, the GitHub Pages build workflow and final QA.

Where the implementation currently differs from the target below:

- entries target 100–300 words and currently have a 500-word hard ceiling rather
  than the proposed 1,500-word maximum and stream truncation;
- optional project glyphs were added after Anthony supplied a second photographed
  sheet; a missing glyph never blocks a project and falls back to its colour mark;
- project-category grouping is deferred until the published project list actually
  passes eight;
- `/writing/` remains deferred until there is an `essay: true` entry;
- RSS-to-email will be connected after deployment, using the public feed to create
  Buttondown drafts rather than send automatically.

The repository README is the operational guide for setup, authoring and launch.

---

## 1. What this is

A new section of **anthonycreates.com** documenting work as it happens — what's being made,
learned and abandoned — supported by a newsletter. It is a working notebook left open, not
a portfolio and not a blog.

The rest of the site shows finished things. Live shows things in progress. It is also the
precursor to a community of practice: entries invite replies, and that's how Anthony finds
out whether one is wanted before building anything with members and moderation.

**Live carries two meanings, both intended.** In progress, not finished. And live as in
performance — happening now, audience present, no second take.

### Medium neutrality — non-negotiable

**Nothing in navigation, headings, copy or metadata may frame Live as being about games.**
The subject is how work gets made, which covers websites, tools, browser extensions,
physical craft, exhibitions and improv material as much as puzzle games. Use **"The
projects"** and **"The practice"**. Never "the games."

---

## 2. Stack and repository

### What the site currently is

- Hand-authored static HTML5, CSS and vanilla JS. **No build step, no framework, no dependencies.**
- Published by pushing checked-in files to `main`; hosted on **GitHub Pages** via `CNAME`.
- Hugo is gone; only dead artefacts remain.
- Shared styling in `css/modern.css`. Tokens: background, text, accent, border, white; three shadows; 6/12/20px radii; easing; `--max-w: 1100px`.
- `/projects/` is a hand-maintained card grid; every `/projects/{slug}/index.html` is bespoke.
- Routing is static directory style: `/projects/{slug}/index.html` served as `/projects/{slug}/`.

### What to build with

**Add Eleventy (11ty), scoped to `/live/` only. Do not touch or migrate anything else.**

Rationale: hand-authoring an HTML document per entry — then updating an index, a sitemap and
a feed by hand — makes each post cost twenty minutes of plumbing. The entire section depends
on publishing being nearly free. A previous newsletter attempt died of an expensive format;
this would die of expensive infrastructure.

A client-side JSON + JS rendering approach is **explicitly rejected**: entries would have no
real URLs, therefore no per-entry OG cards (crawlers don't reliably run JS), no dependable
RSS, and poor indexing. Individual entries being shareable is the main distribution
mechanism.

Eleventy rather than Astro because the site is vanilla HTML/CSS and Eleventy is a template
layer rather than a framework.

**Deployment:** GitHub Action building on push to `main`, outputting static HTML into
`/live/`. One-time setup; publishing thereafter is "write markdown, commit, done."

**Styling:** Live gets its own scoped stylesheet. Reuse `modern.css` spacing, radii and
`--max-w` for continuity; override colour and type per §7.

---

## 3. Content model

One Markdown file per entry.

```yaml
---
title: The tutorial was one screen and it shouldn't have been
date: 2026-07-25
kind: learned            # made | learned | scrapped | wondering
projects: [haikucraft]   # omit entirely for practice entries
essay: false             # true = also collected at /writing/. Orthogonal to kind.
image: ./split.png       # optional
draft: true              # excluded from production build
---
```

`content/live/YYYY-MM-DD-slug.md` → `/live/YYYY/MM/slug/`

### The four kinds — categories of *offer to the reader*

Not categories of work. Framing them as what the reader is handed keeps them on one axis
and makes the choice knowable at the moment of writing.

| Kind | Offer |
|---|---|
| `made` | Here's a thing to look at |
| `learned` | Here's something to take away |
| `scrapped` | Here's a warning |
| `wondering` | Here's a question for you |

Where two apply, pick the dominant offer.

**Never recategorise retrospectively.** If something posted as `made` is abandoned later,
write a new entry rather than editing the old one. The log is a record of what was true at
the time, not a status board.

### Length is not fixed

**Entries run from roughly 100 to 1,500 words**, at whatever weight the day warrants. A
one-line fix is a short entry; a day with a real design decision and technical detail worth
recording is a long one. Do not constrain length — constrain form (see §9).

### `essay: true`

Marks the occasional durable piece that argues something rather than recounting it. It
publishes into the stream exactly like any other entry **and** is additionally collected at
`/writing/`. Orthogonal to `kind` — an essay can still be a `learned` or a `wondering`.

`/writing/` is a **view, not a destination to fill**. It renders only when at least one
entry is flagged, so there is no empty-section problem and nothing extra to build later.

**Drafts:** `draft: true` is the approval gate. Excluded from the production build entirely
(no page, no feed, no sitemap). Flipping the flag publishes. No PR flow — one person doesn't
need the ceremony.

---

## 4. Routes

```
/live/                      The stream
/live/YYYY/MM/{slug}/       An entry — permalink, own OG card
/live/practice/             Entries tagged as practice, with its own intro
/live/about/                What this is, who it's for, newsletter signup
/live/feed.xml              RSS, full text
/writing/                   Collected view of entries flagged essay: true.
                            Renders nothing until at least one exists.
```

`/live/now/` is **not** a separate page — the "now" line lives in the masthead (§5).

---

## 5. The stream page

### Masthead

Carries the page when there's little below it, so a short stream reads as a beginning
rather than a gap.

Contains, in order:
1. **Wordmark** — hand-lettered, scanned.
2. **Strapline**, verbatim: *What I'm making, learning, abandoning and still trying to understand.*
3. **Entry count**, shown openly: "3 entries". Do not hide it.
4. **The now line** — one sentence on what's being worked on this month. Editable in one
   place (a data file or global front matter), updated monthly. **Must not be hard-coded
   into the template.** Fixed copy at masthead scale becomes furniture and competes with
   entry titles.

### Margin

Two groups only:

- **The practice** — grey mark, sits above the projects, links to `/live/practice/`.
  Description: *Entries about working this way rather than about any one project.*
- **The projects** — **list only projects that have at least one published entry.** A
  sidebar of six projects with zeros beside five of them advertises emptiness and
  pigeonholes simultaneously. When the list passes roughly eight, group it using the main
  site's existing categories: Games & experiments / Tools & systems / Art & performance.

Each kind label states its offer beside it (per §3 table) — this doubles as a prompt against
the blank page.

**No filter UI at v0.** It returns at roughly thirty entries. Four filters across three
entries advertises emptiness.

**No cadence promise anywhere.** Never "weekly", never "every fortnight."

### Entry compression

**The newest three entries run in full. Everything earlier collapses to a titled line**
(date, kind mark, project label, title as link).

**Long entries truncate even within the newest three.** Past roughly 250 words, show an
excerpt with a "read on" link — otherwise a single long entry swallows the page. Short
entries continue to show in full, so the stream reads as a mix of complete short posts and
openings of longer ones.

This is the most important behaviour in the spec: growth adds rhythm without a redesign, and
it means the dense-index end state is something the page *becomes* rather than a later
migration. **Ship this in v0**, even though only three entries will exist.

### Footer

- Newsletter capture — the most important conversion element on the page.
- RSS link to `/live/feed.xml`.
- Sign-off, verbatim: *Work in progress, shared without a second take.*

---

## 6. The entry page

One column. Permalink. Project colour appears only in the rule and marks. Drawn divider
before the footer. Newsletter capture at the foot, plus a link back into the relevant
`/projects/{slug}/` page.

**No "Open entry →" links anywhere** — full entry text appears in the stream, so the title
is the permalink.

Per-entry OG and Twitter card metadata, generated. Title, date, kind and first ~150
characters.

---

## 7. Design

### Typography

Personality comes from scale, not ornament.

- **Display / structure:** Archivo (heavy grotesque)
- **Reading:** Source Serif 4
- **Utility** — dates, kind labels, counts, code: IBM Plex Mono

This deliberately differs from the main site's Playfair Display, differentiating the
sections while palette, spacing and `--max-w` carry the continuity. Same person, different
room.

### Palette

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FCFBF7` | Background |
| `ink` | `#1A1917` | Body text, drawn strokes |
| `pencil` | `#6B6560` | Dates, metadata, captions; also "the practice" mark |
| — | `#D2452B` | The Daily Playhouse |
| — | `#E07A1F` | Suggestion Machine |
| — | `#2B5FA8` | Seams |
| — | `#1F7A4D` | Always Never |
| — | `#7B3B8C` | HaikuCraft |
| — | `#C4407E` | Emojo |

Project colour is inherited consistently everywhere a project appears, so colour becomes
navigation.

**Avoid** cream + high-contrast serif + terracotta accent. It's the current default look of
AI-generated design, and on a section about working with AI it would read as an unfortunate
joke.

### The hand — load-bearing, not decorative

**Drawn elements must be real scanned marker on paper.** Not CSS approximations, not
generated "hand-drawn style" assets, not a handwriting font.

The subject of Live is work made with generative tools. The one irreducibly human element
should be visible. That tension is the design. Sober editorial structure *plus* real drawn
marks — big type does the structure, the hand does the texture.

**Assets Anthony provides** — one afternoon, once, never repeated:

- A Live wordmark, hand-lettered
- Four kind marks (made, learned, scrapped, wondering)
- One general "practice" mark
- Two or three irregular dividers

**Projects get a colour and a text label. A drawn glyph is optional, never required.**

Anthony subsequently supplied a photographed sheet of project glyphs, so the implementation
uses them where available. The underlying rule remains: a new project must never be blocked
on drawing an asset. Projects without a glyph use their catalogue colour and text label,
and a glyph can be added later without changing entry content.

SVG where possible, otherwise optimised WebP/PNG — **there is no image optimisation
pipeline, so compress by hand before commit.**

**Placeholders are acceptable at v0.** Asset production must not block launch.

### Motion

One idea only. Respect `prefers-reduced-motion`.

### Quality floor

Responsive; visible keyboard focus; no layout shift; fast on a phone on mobile data.
Text-first.

---

## 8. Newsletter

Assembled from Live, not written separately. **The send must be cheap or it will stop.**

- **Platform:** Buttondown. The publication is configured as **Creative Rehab** under the
  username `creativerehab` with a managed sending domain.
- **Start a new publication**; do not revive the dormant Substack (*The Improvised Life*, four posts, ~15 subscribers, scoped to improv). Consider naming it **Creative Rehab** to consolidate with the podcast.
- Intended fortnightly editorial rhythm, but no public cadence promise. Contents: a ~100-word
  personal note, the entries since last time, and one thing someone else made that Anthony
  found interesting. That last section makes the issue worth reading in a fortnight where
  nothing shipped. RSS-to-email should create drafts for manual assembly because Buttondown
  does not provide a fortnightly RSS cadence.
- **Replies on, and answered.** This is the community mechanism.
- Free, always. The Daily Playhouse subscription is separate infrastructure.

---

## 9. Editorial rules

These govern content, not code, but constrain the design.

- **Write accounts, not arguments.** This is the real constraint, and it replaces any word limit. An account describes what happened, what was decided and why — the material is already in your head, so it's cheap to write at any length. An argument constructs a case from scratch, which is expensive regardless of how short it is. The previous newsletter died because every post was an argument, not because posts were long.
- **Length follows the day.** 150 words for a single fix; 1,200 when there was a real decision and technical detail worth recording. Don't pad and don't truncate artificially.
- **When you notice yourself building a case rather than recounting**, that's the expensive mode. Either stop, or accept it's an essay and flag it `essay: true`.
- **Specific over general.** "The spec said 'friendly tone' and I got exclamation marks in the error states" is an entry. "AI needs clear prompts" is not. Never a listicle of lessons.
- **Publish before resolution.** Unresolved is good.
- **Include the failures**, especially those caused by a vague brief. At a directorial level the test is *what I cannot specify, I do not understand.*
- **Never** anything about Anthony's employer, its codebase or its clients; client or participant details; credentials or private-repo content; unreleased commercial specifics.

---

## 10. Build order

**v0 — the target.**
- Eleventy scoped to `/live/`, GitHub Action deploying on push
- Stream page with masthead, margin, compression behaviour
- Entry pages with OG metadata
- `/live/practice/` and `/live/about/`
- `feed.xml`, newsletter capture, RSS link
- Placeholder marks if drawn assets aren't ready
- **Three entries written before launch.** At least one must not be about a game — Classic Comic Art, building Live itself, or a practice entry. Three HaikuCraft posts make it a games site on day one whatever the sidebar says.
- Footer link added to HaikuCraft pointing back to Live

**Definition of done:** write and publish an entry end to end, timed. **If it takes more
than five minutes from opening the editor to it being live, the plumbing isn't finished**
and everything else in this spec is at risk.

**v1.** Real drawn assets. Per-project Live strips on `/projects/{slug}/` pages. Newsletter
sending. Fix the defects in §11.

**v2.** Filter UI (~30 entries). Whatever two months of use shows to be missing.

Ship v0 rough rather than v1 in three months.

---

## 11. Existing defects to fix

- **The body font is not loading.** Pages declare Nunito Sans but no font files are fetched, so body text renders in a browser fallback. Live on the site now.
- **`sitemap.xml` lists only four project pages**; there are eight.
- **Legacy Hugo RSS files** remain checked in with the invalid placeholder year `0001`. Delete before publishing a real feed.

---

## 12. Out of scope

- Migrating the existing eight project pages. They stay bespoke.
- Rebuilding the main site. The gap was never design — it was the absence of a present tense.
- Comments, accounts, membership, or any community platform. Newsletter replies are the mechanism.
- Paywalling anything.
- A separate long-form section. Superseded — essays live in the stream and are collected at `/writing/` via the `essay` flag (§3). Build the route; it renders nothing until an entry is flagged.

---

## 13. Failure modes

- **Entries becoming essays.** Killed the last attempt.
- **Building Live instead of using it.** A beautifully-built empty section is procrastination with a deploy pipeline. Timebox it.
- **Waiting for the drawn assets.** Ship with placeholders.
- **Only posting wins.** Scrapped and wondering entries are what make it an invitation rather than a highlight reel.
- **Simulated handwriting.** If the hand isn't real, the concept is hollow.
- **Judging it on puzzle-player numbers.** Wrong audience — players come from Reddit, press and search. Live serves makers and people reconnecting with their own creativity.
