# GoWithLaila

Editable React + Vite rebuild of the GoWithLaila landing page and questionnaire.
The current direction keeps the cleaner new layout while using real assets pulled from
the live GoWithLaila site.

## Current State

- New single-page landing layout with hero, process, value props, buyer reviews, about,
  FAQ, final CTA, modal questionnaire, and local `/admin` control panel.
- `/admin` includes a no-code Site Editor for hero copy, CTA labels, contact links,
  image slots, process steps, value cards, reviews, about copy, FAQ, and final CTA copy.
- Real live-site photo assets live in `public/img/`:
  - `hero-1.png`
  - `hero-2.png`
- Logo/wordmark images are intentionally not used right now.
- Review cards are source-based paraphrases of public buyer reviews mentioning Laila.
- Site Editor changes and questionnaire leads are saved to browser `localStorage` for
  testing. The storage helpers live in `src/siteContent.js` so they can later be swapped
  to a real backend/database.
- WhatsApp buttons stay hidden until a confirmed real `wa.me` URL is added through
  `/admin` or `src/siteContent.js`. No fake/generated WhatsApp icon is used.

## Run

Node is installed locally at `~/.local/node-lts`. A normal new Terminal should pick it up
from `~/.zshrc`.

```bash
cd ~/Documents/gowithlaila
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
```

For Tailscale/device testing:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the Tailscale device name or Tailscale IP on port `5173`.

## Build

```bash
npm run build
```

Static output is written to `dist/`.

## Before Going Live

- Replace localStorage lead storage with a real backend/API.
- Replace localStorage site content storage with the same backend/API when ready.
- Add real admin authentication.
- Confirm the correct phone, SMS, or WhatsApp contact link before adding direct
  messaging CTAs. For WhatsApp, fill the Real WhatsApp URL field in `/admin`.
- Have legal/TCPA language reviewed before production use.
