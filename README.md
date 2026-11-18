# new-tab-next

Next.js-Version (App Router, SSR) des Headless-Frontends für die WordPress-Site
„New Tab". WordPress dient als CMS/Backend (REST API +
`/wp-json/woowoow/v1/site`), Next.js rendert serverseitig.

Migrations-Plan und Hintergrund: `next-version.md`

## Setup (Clone-and-Run)

Voraussetzungen: Node.js 20+, Docker (nur für das lokale WP-Backend).

```bash
# 1. WP-Backend (Schwester-Repo, einmalig/parallel)
git clone <new-tab-headless-repo> && cd new-tab-headless
docker compose up -d          # WordPress auf http://localhost:8082
# einmalig: wp-content/uploads/ aus Backup kopieren (Bilder)

# 2. Dieses Repo
cd new-tab-next
cp .env.example .env.local    # WP_API_BASE=http://127.0.0.1:8082
npm ci
npm run dev                 # → http://localhost:3000
```

Alternativ ohne lokales WP: `WP_API_BASE=https://new-tab.de` in `.env.local`
(CORS-Origin `http://localhost:3000` muss dann auf dem Live-WP freigegeben sein).

## Struktur

- `app/` — App-Router-Routen (caps, flags, cups, post, category, calendar,
  calendario, puzzle, `[slug]`-Fallback). Alle Pages sind async Server
  Components; `generateMetadata` liefert SEO-Titel
- `components/` — Shared Components; `*Client.tsx`-Wrapper laden interaktive
  Widgets (Kalender-Türen, Puzzle) mit `ssr: false`
- `lib/api.ts` — REST-Fetches gegen `WP_API_BASE`; `lib/types.ts`,
  `lib/archiveConfig.ts`

## Umgebungsvariablen

| Variable | Lokal | Produktion |
|---|---|---|
| `WP_API_BASE` | `http://127.0.0.1:8082` | `https://new-tab.de` |
| `SITE_URL` | `http://localhost:3000` | Deploy-URL (Sitemap) |

## Deployment (Vercel)

Siehe `next-version.md`, Schritt 8: Repo auf GitHub pushen, in Vercel
importieren (Framework-Preset Next.js wird erkannt), `WP_API_BASE` (und
`SITE_URL`) in den Vercel-Env-Settings setzen. Deploy erfolgt automatisch
bei Push auf `main`.
