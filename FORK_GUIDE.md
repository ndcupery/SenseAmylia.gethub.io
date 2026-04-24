# Fork Guide — Build Your Own Portfolio Site with Claude Code

This guide walks you through forking this portfolio site and making it your own — from zero. No prior coding experience required. By the end you'll have a live website at `https://yourusername.github.io` that you can update by chatting with an AI.

---

## Table of Contents

1. [What is this site?](#1-what-is-this-site)
2. [Fork the repo on GitHub](#2-fork-the-repo-on-github)
3. [Enable GitHub Pages](#3-enable-github-pages)
4. [Sign up for Claude Code](#4-sign-up-for-claude-code)
5. [Open your fork in Claude Code (Web)](#5-open-your-fork-in-claude-code-web)
6. [Personalize the site](#6-personalize-the-site)
7. [How the content files work](#7-how-the-content-files-work)
8. [Committing and merging your changes](#8-committing-and-merging-your-changes)
9. [Alternative hosting options](#9-alternative-hosting-options)
10. [Going further](#10-going-further)

---

## 1. What is this site?

This is a personal portfolio site — built with **React**, **TypeScript**, and **Vite** — for showcasing creative projects and events. It includes:

- A **home page** with an animated hero section
- A **Laboratory** section for ongoing projects (with lab notes / update logs)
- An **Events** section for shows, gigs, or appearances
- An **About** page and **Contact** page
- Auto-generated animated visuals (GLSL shader art) for any project or event without a photo

The site is deployed automatically to **GitHub Pages** every time you push to the `main` branch, via a GitHub Actions workflow. You write content by editing a handful of TypeScript and Markdown files — or by just asking Claude to do it for you.

---

## 2. Fork the repo on GitHub

"Forking" means making your own personal copy of this repository that you control.

1. Make sure you have a **GitHub account**. If not, sign up for free at [github.com](https://github.com).
2. Go to the original repository page on GitHub.
3. Click the **Fork** button in the top-right corner.
4. On the fork screen:
   - **Owner**: select your GitHub username
   - **Repository name**: change it to `yourusername.github.io` (replace `yourusername` with your actual GitHub username — this exact format is what makes GitHub Pages work automatically)
5. Click **Create fork**. GitHub will copy the entire repository to your account.

> **Why `yourusername.github.io`?** GitHub Pages automatically hosts repos named in this pattern at `https://yourusername.github.io`. Any other name works too, but the URL will be `https://yourusername.github.io/repo-name/` and you'll need an extra configuration step (see [Alternative hosting](#9-alternative-hosting-options)).

---

## 3. Enable GitHub Pages

After forking, you need to tell GitHub to publish the site.

1. In your forked repository, click the **Settings** tab (top navigation bar).
2. Scroll down to the **Pages** section in the left sidebar.
3. Under **Source**, select **GitHub Actions**.
4. Click **Save**.

That's it. The next time you push code to `main`, the GitHub Actions workflow will build the site and publish it. It usually takes 1–3 minutes.

To see the status of a deployment, click the **Actions** tab in your repo. A green checkmark means the site is live. A red X means something went wrong — click the run to read the error log.

---

## 4. Sign up for Claude Code

Claude Code is an AI coding assistant made by Anthropic. It can read, edit, and reason about your entire codebase — and you just talk to it in plain English.

1. Go to [claude.ai/code](https://claude.ai/code) and create an account (or log in with an existing Anthropic/Claude account).
2. Choose a plan. The **free tier** gives you a limited number of messages. The **Pro plan** ($20/month) gives much more usage and is recommended if you plan to update your site regularly.

---

## 5. Open your fork in Claude Code (Web)

Claude Code has a **Web (Cloud) mode** that works entirely in your browser — no installation, no terminal, no local setup required.

1. Go to [claude.ai/code](https://claude.ai/code) and log in.
2. Click **New session** or the **+** button.
3. When prompted to connect a repository, click **Connect GitHub** and authorize Claude Code to access your GitHub account.
4. Select your forked repo (`yourusername/yourusername.github.io`).
5. Claude Code will clone your repository into a secure cloud environment and open a chat interface.

You can now talk to Claude in plain English. It has access to all your files and can read them, edit them, run the build, and push changes back to GitHub — all from the browser.

> **Tip:** Claude Code is context-aware. It has already read a file called `CLAUDE.md` in this repo that explains exactly how projects and events are structured. You can just say "add a new project" and it will walk you through it.

---

## 6. Personalize the site

Here are the main things you'll want to change. You can do all of this by asking Claude — or by editing the files directly if you prefer.

### Change your name and branding

The site name ("Sense Amylia") appears in several places. Just tell Claude:

> "Replace all instances of 'Sense Amylia' with 'My Name' throughout the site."

Claude will find every file that needs updating and make the changes.

### Update the About page

The About page content lives in:

```
src/components/pages/About.tsx
```

You can say: "Rewrite the about page text to say [your bio here]."

### Update the Contact page

```
src/components/pages/Contact.tsx
```

### Add a project

Say: "Add a new project called [your project name]."

Claude will ask you for:
1. Project type (one of: `3d`, `software`, `performance`, `artwork`, `diy`)
2. A short 1–2 sentence description

Then it will create the right files and add an entry to `src/data/projects.ts` automatically.

### Add an event

Say: "Add a new event called [your event name]."

Claude will ask for the date, venue, city, and a short description, then add it to `src/data/events.ts`.

### Add a lab note (project update)

Say: "Add a lab note to [project name] about [what happened]."

Lab notes are Markdown files stored in:
```
src/content/projects/<project-slug>/updates/YYYY-MM-DD.md
```

### Add photos/media

Upload images to `src/content/projects/<slug>/media/` for project photos, or `src/content/events/<slug>/media/` for event photos. Then tell Claude: "Add the image `hero.jpg` as the hero image for [project name]." Claude will update the data file accordingly.

---

## 7. How the content files work

Understanding the structure helps you stay oriented.

```
src/
├── data/
│   ├── projects.ts     ← All project metadata (title, description, tags, dates)
│   └── events.ts       ← All event metadata
│
├── content/
│   └── projects/
│       └── my-project/
│           ├── OVERVIEW.md         ← Human-readable reference (not shown on site)
│           ├── updates/
│           │   └── 2025-03-01.md   ← Lab notes (shown on project page)
│           └── media/
│               └── hero.jpg        ← Photos (shown in gallery)
│   └── events/
│       └── my-event/
│           ├── INFO.md
│           └── media/
│               └── event_poster.jpg
│
├── routes/             ← Pages (home, about, contact, etc.)
└── components/         ← React UI components
```

**The most important rule:** All content goes in `src/content/`, not `public/content/`. The build system uses `import.meta.glob` to pick up content at build time — files in `public/content/` will be ignored.

**Projects and events without photos** automatically get a unique animated shader visual based on their slug. You don't need to provide images.

---

## 8. Committing and merging your changes

When Claude edits files in Web mode, it creates a new **branch** (a parallel version of your code) and you review the changes before they go live.

### The basic flow

1. **Claude makes changes** on a branch (e.g. `claude/add-my-project`).
2. **Claude opens a Pull Request (PR)** — a proposal to merge those changes into `main`.
3. **You review the PR** on GitHub. Click the **Files changed** tab to see exactly what was edited.
4. **You approve and merge** — click **Merge pull request** → **Confirm merge**.
5. **GitHub Actions runs automatically** — it builds the site and deploys to GitHub Pages. Wait ~2 minutes.
6. **Your live site is updated.**

### What is a branch?

Think of branches like drafts. The `main` branch is your published site. Claude works on a separate draft branch so your live site is never broken mid-edit. When you merge, the draft becomes the new published version.

### What is a Pull Request?

A Pull Request (PR) is GitHub's way of reviewing changes before applying them. It shows you a diff (a side-by-side view of what changed) and lets you leave comments or request edits. For a solo portfolio site you'll probably just merge everything yourself, but the review step is still useful to catch mistakes.

### Merging directly (skipping PRs)

If you trust the changes, you can ask Claude to commit and push directly to `main`:
> "Commit and push this to main."

This will trigger the deployment workflow immediately without a PR review step.

---

## 9. Alternative hosting options

GitHub Pages is the easiest option for a static site like this, but it's not the only one. Here are the main alternatives and what you'd change in the workflow file (`.github/workflows/deploy.yml`).

### Netlify (recommended alternative)

[Netlify](https://netlify.com) offers a generous free tier with custom domains, branch previews, and form handling.

1. Sign up at netlify.com and import your GitHub repo.
2. Set **Build command** to `npm run build` and **Publish directory** to `dist`.
3. Netlify handles the rest automatically — you don't need the GitHub Actions workflow at all.
4. To disable the GitHub Pages deployment, delete `.github/workflows/deploy.yml` or remove the `deploy` job from it.

### Vercel

[Vercel](https://vercel.com) works similarly to Netlify and has a free tier.

1. Sign up at vercel.com and import your GitHub repo.
2. Vercel auto-detects Vite and sets the build settings correctly.
3. Done — Vercel deploys on every push to `main`.

### Firebase Hosting

[Firebase Hosting](https://firebase.google.com/products/hosting) is a good choice if you're already in the Google ecosystem.

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` and `firebase init hosting` in your project folder.
3. Set the public directory to `dist` and configure as a single-page app.
4. To deploy via GitHub Actions, replace the `deploy` job in `.github/workflows/deploy.yml` with:

```yaml
deploy:
  name: Deploy to Firebase
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
    - run: npm ci
    - run: npm run build
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: ${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        channelId: live
```

You'll need to add your Firebase service account key as a GitHub secret (`FIREBASE_SERVICE_ACCOUNT`).

### SFTP / Traditional Web Host

If you have a web host (like Bluehost, SiteGround, DreamHost, etc.) with FTP/SFTP access, you can upload the built `dist/` folder after every push.

Replace the `deploy` job in `.github/workflows/deploy.yml` with:

```yaml
deploy:
  name: Deploy via SFTP
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
    - run: npm ci
    - run: npm run build
    - name: Upload via SFTP
      uses: appleboy/scp-action@v0.1.7
      with:
        host: ${{ secrets.SFTP_HOST }}
        username: ${{ secrets.SFTP_USER }}
        password: ${{ secrets.SFTP_PASSWORD }}
        source: dist/
        target: /public_html/
        strip_components: 1
```

Add `SFTP_HOST`, `SFTP_USER`, and `SFTP_PASSWORD` as **GitHub Secrets** (Settings → Secrets and variables → Actions → New repository secret).

> **Adding GitHub Secrets:** Never put passwords or API keys directly in workflow files — anyone who can see your repo can read them. GitHub Secrets encrypt the values and inject them as environment variables at runtime. They are never shown in logs.

### Keeping the GitHub Pages workflow while adding another host

You can run multiple deploy targets in parallel. Just add additional `deploy-*` jobs to the same workflow file, each depending on the `build` job. Claude can help you set this up — just describe what you want.

### Custom domain

Regardless of hosting provider, you can point a custom domain (e.g. `yourname.com`) to your site:

- **GitHub Pages:** Add a `CNAME` file to the `public/` folder containing just your domain name. Then configure your domain's DNS to point to GitHub's servers (see GitHub's docs).
- **Netlify/Vercel:** Configure the custom domain in their dashboard — they handle the DNS instructions.

---

## 10. Going further

### Changing the color scheme and fonts

The site uses **Tailwind CSS v4**. Colors and design tokens are defined in `src/styles/`. Tell Claude: "Change the primary accent color to orange" and it will find the right place to update.

### Modifying the shader visuals

The auto-generated project card visuals are GLSL shaders in `src/shaders/`. These are small GPU programs that generate animated patterns. If you want to tweak the look, Claude can help you understand and modify them — or you can replace them entirely with static images.

### Adding new page types

Routes are file-based and live in `src/routes/`. To add a new page at `/music`, create `src/routes/music.tsx`. Claude can scaffold the component for you.

### Updating the navigation

The navigation links are defined in the `__root.tsx` layout component at `src/routes/__root.tsx`. Tell Claude which links to add, remove, or rename.

### Keeping your fork up to date

If the original repository gets improvements you want, you can sync your fork:

1. On your fork's GitHub page, click **Sync fork** (above the file list).
2. GitHub will merge the upstream changes into your fork.
3. Review any conflicts (Claude can help resolve them).

---

## Quick reference: useful things to say to Claude

| What you want | What to say |
|---|---|
| Add a project | "Add a new project called [name]" |
| Add an event | "Add a new event called [name] on [date] at [venue]" |
| Add a lab note | "Add a lab note to [project] about [topic]" |
| Rename the site | "Replace 'Sense Amylia' with '[your name]' everywhere" |
| Change the about page | "Rewrite the about page to say: [your bio]" |
| Add a photo | "Use `hero.jpg` as the hero image for [project]" |
| Deploy now | "Commit and push to main" |
| Change the color | "Change the accent color to [color]" |
| Fix a broken build | "The build is failing, here's the error: [paste error]" |

---

## Troubleshooting

**The site isn't showing up after I merged.**
Wait 2–3 minutes and refresh. Check the **Actions** tab for errors.

**The Actions workflow is failing.**
Click the red X in the Actions tab and read the log. Common causes: a TypeScript type error, a missing import, or a syntax mistake. Paste the error into Claude and ask it to fix it.

**I see the old site / my changes aren't showing.**
Hard-refresh your browser (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on Mac) to bypass the cache.

**Claude made changes I don't want.**
If they haven't been merged yet, just close the Pull Request without merging. If they were already merged, tell Claude: "Revert the last set of changes."

**I want to start over.**
Delete your forked repository and re-fork from the original. Your GitHub Pages URL will still work once you re-enable Pages.

---

*Built with React, TypeScript, Vite, Tailwind CSS, and React Three Fiber. Deployed via GitHub Actions.*
