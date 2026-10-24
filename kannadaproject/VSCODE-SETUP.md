# Namma Baashe — Run in VS Code

This is the full source of your Namma Baashe web app. It runs locally in Chrome at `http://localhost:8080`.

## Prerequisites

1. **Node.js 20 or newer** — install from https://nodejs.org (or with nvm: `nvm install --lts`)
2. **VS Code** — https://code.visualstudio.com

## Setup (in the VS Code terminal)

```sh
npm install
npm run dev
```

Then open **http://localhost:8080** in Chrome.

> The first `npm install` takes a few minutes. `src/routeTree.gen.ts` is generated automatically when the dev server starts — it is not in this archive, that is normal.

## What each command does

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (hot reload) |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run the routing tests |
| `npm run lint` / `npm run format` | Check / fix code style |

## Useful VS Code extensions (optional)

- **ESLint** (dbaeumer.vscode-eslint) — inline error highlighting
- **Prettier** (esbenp.prettier-vscode) — auto formatting (a `.prettierrc` is included)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)

## How the app is organised

| Path | What it is |
| --- | --- |
| `src/routes/` | One file per page (Home, Translate, Scan, QR, Simplify, Learn, Travel, Tools) |
| `src/routes/__root.tsx` | Site shell: nav bar, footer, fonts, page head tags |
| `src/nb.css` | Your original custom CSS (green/gold/cream theme) |
| `src/styles.css` | Tailwind theme tokens |
| `src/lib/nb.ts` | Shared helpers: phrasebook data, voice output, mic input, downloads |
| `src/lib/phrases.json` | The phrasebook (English → Kannada → pronunciation) |
| `src/lib/nb.functions.ts` | Server-side translation + AI simplify |
| `src/server.ts` | SSR error wrapper |
| `vite.config.ts` | Build configuration (TanStack Start) |

## Features and what works locally

- **Translate** — works out of the box (uses Google's public translate endpoint server-side).
- **Scan & Translate** — works in Chrome (browser OCR with tesseract.js). First scan can take up to a minute.
- **Learn / Travel / phrasebook download / favourites** — fully local, works everywhere.
- **Voice output & QR scanner** — work in Chrome; they ask for mic/camera permission.
- **Simplify Kannada** — uses Lovable's built-in AI, which authenticates through Lovable. Locally it needs an AI API key to run; the page shows a friendly error until you add one. If you want, add your own OpenAI-style key and call it from `src/lib/nb.functions.ts`.

## Notes

- No database is used; favourites are saved per-browser in localStorage.
- Everything is plain React + TypeScript on TanStack Start (Vite). `npm install` resolves all packages from the public npm registry.
