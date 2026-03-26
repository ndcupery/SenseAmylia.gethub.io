This directory contains media for the "Phazer Visuals 2026 Performances" project.

## Directory Structure

```
phazer-visuals-2026/
├── hero.jpg              ← Full-width hero image (recommended: 1920px wide)
├── thumbnail.jpg         ← Card thumbnail (recommended: 600px wide)
├── photos/
│   ├── festival-crowd-lasers.jpg
│   ├── stage-projection-setup.jpg
│   └── live-vj-generative.jpg
└── videos/
    └── (add .mp4 files or reference YouTube URLs in projects.ts)
```

## How to Add Media

1. Drop image/video files into the appropriate subdirectory
2. Update `src/data/projects.ts` — add entries to the `media` array:

```typescript
{
  type: "image",
  src: import.meta.env.BASE_URL + "content/projects/phazer-visuals-2026/photos/your-image.jpg",
  alt: "Description of the image",
  tags: ["festival", "laser"],
}
```

## Current Placeholders

The images referenced in projects.ts currently use Unsplash URLs.
Replace them with your own files and update the paths.
