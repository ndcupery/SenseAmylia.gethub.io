# Phazer Labs — Agent Instructions

## Adding a New Project

When the user asks to add a new project (e.g. "Add a new project for Sharks and Lazers 2.0"):

### Step 1: Gather required info

Ask the user for these three things **in order**, one at a time:

1. **Project name** — if not already provided
2. **Project type** — one of: `3d`, `software`, `performance`, `artwork`, `diy`
3. **Project abstract** — 1–2 sentence summary of what the project is about

Use the abstract to generate the full description and tags.

### Step 2: Generate the slug

Convert the project name to a URL-safe slug: lowercase, spaces to hyphens, strip special characters.
Example: "Sharks and Lazers 2.0" → `sharks-and-lazers-2`

### Step 3: Create the content directory

Create the following structure under `src/content/projects/<slug>/`:

```
src/content/projects/<slug>/
├── OVERVIEW.md          ← reference doc for agents/humans (NOT loaded by the app)
├── media/               ← empty directory (add .gitkeep)
└── updates/             ← empty directory (add .gitkeep)
```

> **Important:** All project content lives in `src/content/`, not `public/content/`. The Vite build uses `import.meta.glob` to load lab notes and media from `src/content/` at build time. Files placed in `public/content/` will NOT appear on the site.

### Step 4: Write OVERVIEW.md

`src/content/projects/<slug>/OVERVIEW.md` is a **reference document** — it is not loaded by the app. It exists so agents and humans have a single readable source of truth for the project. The app reads project metadata from `src/data/projects.ts` directly.

```markdown
---
title: <Project Name>
slug: <slug>
abstract: <1-2 sentence summary>
tags:
  - <tag-1>
  - <tag-2>
projectType: <3d|software|performance|artwork|diy>
status: active
startDate: <today's date in YYYY-MM-DD>
---

<Full project description written in first person ("I"). 2-4 sentences.>
```

### Step 5: Add to `src/data/projects.ts`

Add a new entry to the `projects` array. **Do NOT provide `heroImage` or `thumbnail`** — the site auto-generates unique shader visuals for each project based on its slug. Only add these fields if the user provides real images. The entry must match the `Project` interface exactly:

```typescript
{
  slug: "<slug>",
  title: "<Project Name>",
  abstract: "<same as OVERVIEW.md frontmatter>",
  description: "<same as OVERVIEW.md body>",
  // heroImage and thumbnail are omitted — auto-generated via shader
  tags: ["<tag-1>", "<tag-2>"],
  projectType: "<3d|software|performance|artwork|diy>",
  status: "active",
  startDate: "<YYYY-MM-DD>",
},
```

To reference local images later (when the user provides real ones), use the `projectAsset()` helper:
```typescript
heroImage: projectAsset("<slug>/hero.jpg"),
thumbnail: projectAsset("<slug>/thumbnail.jpg"),
```

### Step 6: Verify

Run `npm run lint && npx tsc -b && npm run build` to ensure everything compiles.

---

## Adding a Lab Note

Lab notes are dated entries that document progress, events, or milestones for a project. They live in `src/content/projects/<slug>/updates/` and are named by date.

**File location:** `src/content/projects/<slug>/updates/YYYY-MM-DD.md`

Two supported formats:

**Format A — YAML frontmatter** (preferred for Notion-imported notes):
```markdown
---
title: <Note Title>
date: <YYYY-MM-DD>  # optional — falls back to the filename date if omitted
---

Content here...
```

**Format B — Simple heading** (preferred for manually authored notes):
```markdown
# Note Title

Content here...
```

**Images in lab notes:** Reference as `./media/filename.jpg`. Images must be placed in `src/content/projects/<slug>/media/` — **not** `public/`.

---

## Notion-Based Project Initialization or Update

Use this workflow when the user asks to initialize a project from Notion, or to update/improve an existing project using a Notion page as the source.

**Trigger phrases:**
- "initialize [project] from Notion"
- "update [project] using its Notion page"
- "sync [project] from Notion"
- "there's a Notion page for [project], bring it in"
- "update and improve [project] with this Notion page"

**Steps:**

1. **Find the page** — use `notion-search` to locate it by name. If ambiguous, confirm with the user before proceeding.

2. **Fetch content** — use `notion-fetch` to read the page. Note any child pages.

3. **Determine slug** — derive from the page title for new projects; use the existing project slug for updates.

4. **For new projects** — create the full directory structure and `projects.ts` entry (follow the Adding a New Project steps above, using Notion content to fill in the fields).

5. **Import or update content:**
   - Main page body → update `OVERVIEW.md` and the `description` field in `projects.ts`
   - Child pages → each becomes a dated lab note at `src/content/projects/<slug>/updates/YYYY-MM-DD.md` using YAML frontmatter format; use the Notion page's created or last-edited date as the file date
   - Large main pages with distinct sections → split: summary stays in OVERVIEW, major sections become separate lab notes
   - For updates to existing projects: check existing lab notes by date — skip dates that already have a file unless the user asks to overwrite

6. **Download images** — for each image block in the Notion page, download it to `src/content/projects/<slug>/media/` using `curl`. Update all markdown image references to use `./media/filename`.

7. **Verify** — run `npm run lint && npx tsc -b && npm run build`.

---

## Project Content Conventions

- **Voice**: First person ("I"), not corporate "we"
- **Tags**: lowercase, hyphenated (e.g. `live-visuals`, `creative-coding`)
- **Lab note files**: Named by date (`YYYY-MM-DD.md`) in the `updates/` directory
- **Media files**: All photos and videos go in `src/content/projects/<slug>/media/` (no subdirs)
- **Status values**: `active`, `completed`, or `archived`
- **Content path**: Everything goes in `src/content/projects/`, never `public/content/projects/`

## Adding a New Event

When the user asks to add a new event (e.g. "Add an event for Summerfest"):

### Step 1: Gather required info

Ask the user for these things **in order**, one at a time:

1. **Event name** — if not already provided
2. **Event date** — in YYYY-MM-DD format (determines upcoming vs. past automatically)
3. **Venue and city** — e.g. "Mortimers, Minneapolis, MN" (optional but recommended)
4. **Event page URL** — Facebook/Eventbrite/etc. link (optional)
5. **Abstract** — 1–2 sentence summary

### Step 2: Generate the slug

Convert the event name + year to a URL-safe slug: lowercase, spaces to hyphens, strip special characters.
Example: "Summerfest 2026" → `summerfest-2026`

### Step 3: Create the content directory

```
src/content/events/<slug>/
├── INFO.md          ← reference doc (not app-loaded)
└── media/           ← empty directory (add .gitkeep)
```

> **Poster convention:** If the user provides an event poster image, name it `event_poster.<ext>` (e.g. `event_poster.jpg`) and place it in the `media/` directory. It will automatically be used as the card thumbnail and hero image fallback.

### Step 4: Write INFO.md

```markdown
---
title: <Event Name>
slug: <slug>
eventDate: <YYYY-MM-DD>
venue: <Venue Name>
city: <City, State>
eventUrl: <URL>    # optional
tags:
  - <tag-1>
---

<Full event description written in first person ("I"). 2-4 sentences.>
```

### Step 5: Add to `src/data/events.ts`

Add a new entry to the `events` array:

```typescript
{
  slug: "<slug>",
  title: "<Event Name>",
  abstract: "<1-2 sentence summary>",
  description: "<full description in first person>",
  eventDate: "<YYYY-MM-DD>",
  venue: "<Venue Name>",
  city: "<City, State>",
  eventUrl: "<URL>",   // optional — omit if none
  tags: ["<tag-1>"],
},
```

Event status (upcoming vs. past) is derived automatically from the `eventDate` — no status field needed.

### Step 6: Verify

Run `npm run lint && npx tsc -b && npm run build` to ensure everything compiles.

---

## Tech Stack

- React 19 + TypeScript (strict) + Vite
- TanStack Router (file-based routing, `@tanstack/router-plugin/vite`)
- Tailwind CSS v4 with `@tailwindcss/vite`
- Framer Motion for animations
- Deployed to GitHub Pages at root `/`
- Base path configured to `"/"` in both `vite.config.ts` and router
