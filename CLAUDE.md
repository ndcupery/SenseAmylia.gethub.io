# Phazer Labs — Agent Instructions

## Adding a New Project

When the user asks to add a new project (e.g. "Add a new project for Sharks and Lazers 2.0"):

### Step 1: Gather required info

If the user **did not provide a project name** in their prompt, ask for the name first.

Once you have the name, ask the user to provide a **project overview** — a short description of what the project is about. Use this to generate the abstract, description, and tags.

### Step 2: Generate the slug

Convert the project name to a URL-safe slug: lowercase, spaces to hyphens, strip special characters.
Example: "Sharks and Lazers 2.0" → `sharks-and-lazers-2`

### Step 3: Create the content directory

Create the following structure under `public/content/projects/<slug>/`:

```
public/content/projects/<slug>/
├── OVERVIEW.md
├── media/           ← empty directory (add .gitkeep)
└── updates/         ← empty directory (add .gitkeep)
```

### Step 4: Write OVERVIEW.md

Use YAML frontmatter with this exact schema:

```markdown
---
title: <Project Name>
slug: <slug>
abstract: <1-2 sentence summary>
tags:
  - <tag-1>
  - <tag-2>
status: active
startDate: <today's date in YYYY-MM-DD>
heroImage: hero.jpg    # optional — omit to use auto-generated shader visual
thumbnail: thumbnail.jpg  # optional — omit to use auto-generated shader visual
---

<Full project description written in first person ("I"). 2-4 sentences.>
```

### Step 5: Add to `src/data/projects.ts`

Add a new entry to the `projects` array. **Do NOT provide `heroImage` or `thumbnail`** — the site auto-generates unique shader visuals for each project based on its slug. Only add these fields if the user provides real images. The entry must match the `Project` interface:

```typescript
{
  slug: "<slug>",
  title: "<Project Name>",
  abstract: "<same as OVERVIEW.md frontmatter>",
  description: "<same as OVERVIEW.md body>",
  // heroImage and thumbnail are omitted — auto-generated via shader
  tags: ["<tag-1>", "<tag-2>"],
  status: "active",
  startDate: "<YYYY-MM-DD>",
  media: [],
  updates: [],
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

## Project Content Conventions

- **Voice**: First person ("I"), not corporate "we"
- **Tags**: lowercase, hyphenated (e.g. `live-visuals`, `creative-coding`)
- **Update files**: Named by date (`YYYY-MM-DD.md`) in the `updates/` directory with `title` in YAML frontmatter
- **Media files**: All photos and videos go in the `media/` directory (no separate photos/videos subdirs)
- **Status values**: `active`, `completed`, or `archived`

## Tech Stack

- React 19 + TypeScript (strict) + Vite
- TanStack Router (file-based routing, `@tanstack/router-plugin/vite`)
- Tailwind CSS v4 with `@tailwindcss/vite`
- Framer Motion for animations
- Deployed to GitHub Pages at `/phazer-labs/`
- Base path configured in both `vite.config.ts` and router (`basepath: "/phazer-labs"`)
