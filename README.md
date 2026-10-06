# Anirban Mondal — Portfolio

Single-page portfolio built with **React**, **React Three Fiber** (3D developer workstation in the hero), **Framer Motion** (page transitions and scroll reveals) and **Vite**. It is fully static and deploys to GitHub Pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Deploy to GitHub Pages

1. Push this repository to GitHub (branch `main`).
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds the site and publishes `dist/`.

The site uses a relative base path and hash routing (`/#/work`), so it works both as a user site (`username.github.io`) and as a project site (`username.github.io/PortfolioFinal/`) without configuration, and page refreshes never 404.

## Editing content

| What | Where |
|---|---|
| Projects, features, stats, skills, timeline | [src/data/portfolio.js](src/data/portfolio.js) |
| Screenshots | Put PNGs in `assets_folder/` (e.g. `Project.png` = hero, `Project2.png` … = gallery), then run `npm run images` to regenerate `public/works/*.webp` |
| CV download | `public/resume/Anirban_Mondal_Lead_Developer_Resume.pdf` |
| 3D scene | [src/three/DeveloperScene.jsx](src/three/DeveloperScene.jsx), code typed on the monitor in [src/three/codeScreen.js](src/three/codeScreen.js) |

`npm run images` also blurs the saved address and phone number in `GrapheWeddings4.png` before publishing; add regions to `REDACT` in [scripts/optimize-images.mjs](scripts/optimize-images.mjs) for any other screenshot with private data.
