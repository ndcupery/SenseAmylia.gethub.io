# Sense Amylia

Official website for Sense Amylia — tech creator, software builder, creative agency.

## Tech Stack

- **React 19** + TypeScript
- **TanStack Router** — file-based routing
- **Tailwind CSS v4** — styling
- **shadcn/ui** — component primitives
- **React Three Fiber** — 3D scenes
- **Framer Motion** — animations
- **Vite** — build tooling

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Automated via GitHub Actions. Pushes to `main` trigger:

1. Lint + type-check
2. Production build
3. Deploy to GitHub Pages
