# Next.js-Version des Headless-Frontends

Migration der Vite/React-App aus `new-tab-headless/frontend` zu einer
Next.js-App (App Router) mit SSR. WordPress bleibt als Headless-CMS auf
`new-tab.de` (REST API), lokal läuft es weiterhin über Docker.

## Zielbild

```
Browser → Next.js (SSR) → fetch → new-tab.de/wp-json/... (lokal: WP auf :8082)
```

- **Entwicklung lokal:** WP aus `new-tab-headless/docker-compose.yml` auf
  `127.0.0.1:8082`, Next.js-Dev-Server auf `localhost:3000`
- **Produktion:** Deploy auf **Vercel** via GitHub-CI; API-Basis zeigt auf
  `https://new-tab.de`
- SEO gelöst durch serverseitiges Rendering + `generateMetadata`

## Ausgangslage (was migriert wird)

Aus `new-tab-headless/frontend/src/`:

- `App.tsx` — React-Router-Routen (caps, flags, cups, post, category,
  calendar, calendario, puzzle, `:slug`-Fallback)
- `api.ts` — Fetch-Funktionen für `/wp-json/wp/v2/*` und
  `/wp-json/woowoow/v1/site` (relativ, via Vite-Proxy)
- `components/Layout.tsx` — Header/Footer, fetched `getSite()` und reicht es
  per `Outlet context` an Seiten
- `hooks/useSite.ts`, `pages/*`, `types.ts`, `archiveConfig.ts`, CSS

## Schritt 1: Projekt-Grundgerüst

```bash
cd ~/projects/dockertest/new-tab-next
npx create-next-app@latest . --ts --app --eslint --no-src-dir --import-alias "@/*"
```

(Wenn das Verzeichnis nicht leer sein darf: `frontend/` als Unterordner
verwenden und Pfade entsprechend anpassen.)

Dependencies der alten App, die übernommen werden: **keine** —
`react-router-dom` entfällt komplett (Next.js-Routing), React 19 bringt
Next mit.

## Schritt 2: Umgebungsvariablen

`.env.local` (lokal, nicht committen):

```
WP_API_BASE=http://127.0.0.1:8082
```

`.env.production` (committed):

```
WP_API_BASE=https://new-tab.de
```

In `api.ts` (zu `lib/api.ts` verschieben):

```ts
const API_BASE = process.env.WP_API_BASE ?? ''
```

Serverseitige Fetches nutzen die absolute URL; der Vite-Proxy entfällt
komplett. **Achtung:** `toLocalPath()` und `decodeEntities()` aus der alten
`api.ts` verwenden `window`/`document` — serverseitig ersetzen:

- `toLocalPath`: `new URL(url).pathname + search + hash` (ohne `window`)
- `decodeEntities`: Paket `he` oder `html-entities` (läuft überall), oder
  Entities bleiben unangetastet und werden nur für `dangerouslySetInnerHTML`
  decodiert — entscheiden beim Portieren

## Schritt 3: Routing migrieren

`react-router`-Routen aus `App.tsx` → App-Router-Dateien:

```
app/
  layout.tsx                  ← components/Layout.tsx (html/body, Header, Footer)
  page.tsx                    ← HomePage
  caps/page.tsx               ← PostTypeArchive type="caps"
  caps/[slug]/page.tsx        ← PostTypeSingle type="caps"
  flags/page.tsx + flags/[slug]/page.tsx
  cups/page.tsx  + cups/[slug]/page.tsx
  post/[slug]/page.tsx        ← PostTypeSingle type="posts"
  category/[slug]/page.tsx    ← CategoryArchive
  calendar/page.tsx + calendar/[slug]/page.tsx
  calendario/page.tsx + calendario/[slug]/page.tsx
  puzzle/page.tsx + puzzle/[slug]/page.tsx
  [slug]/page.tsx             ← GenericPage (Catch-all)
  not-found.tsx               ← bisherige "*"-Route
```

Konkrete Ersetzungen:

| Vite/React Router | Next.js App Router |
|---|---|
| `<Link to="...">` | `<Link href="...">` aus `next/link` |
| `useParams()` | Page-Prop `{ params }` (Promise, `await params`) |
| `useNavigate()` | `useRouter().push()` aus `next/navigation` (nur in Client-Components) |
| `useLocation().pathname` | `usePathname()` (Client-Component) |
| `useOutletContext` + `useSite` | `site` im Layout fetchen und als Prop weitergeben, oder pro Page fetchen (Next dedupliziert `fetch` pro Request) |
| Query `?page=2` via `useSearchParams` | Page-Prop `{ searchParams }` |

## Schritt 4: Data-Fetching → Server Components

Pages werden `async` Server Components; `useEffect`-Fetching entfällt:

```tsx
// app/caps/[slug]/page.tsx
import { getPostBySlug } from '@/lib/api'
import { notFound } from 'next/navigation'

export default async function CapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug('caps', slug)
  if (!post) notFound()
  return <article>...</article>
}
```

- `Layout` fetched `getSite()` serverseitig und reicht `site` an
  Header/Footer (Client-Components bekommen es als Prop)
- Interaktive Teile (Menü-Toggle, Puzzle, Pagination-Buttons) bekommen
  `'use client'` — so klein wie möglich halten
- Fehlerzustände: `error.tsx` pro Route statt manuellem Error-State

## Schritt 5: SEO

Pro Route `generateMetadata` exportieren:

```tsx
export async function generateMetadata({ params }) {
  const post = await getPostBySlug('caps', (await params).slug)
  return { title: post?.title.rendered }
}
```

Dazu `metadata` in `app/layout.tsx` (Site-Titel, Description),
`app/sitemap.ts` und `app/robots.ts` optional ergänzen.

## Schritt 6: Docker für die lokale Entwicklung

Variante A (empfohlen, einfach): WP bleibt in `new-tab-headless` via
`docker compose up -d` auf `:8082`, Next.js läuft nativ mit `npm run dev`.
`WP_API_BASE=http://127.0.0.1:8082` in `.env.local` reicht.

Variante B (alles in Docker): `docker-compose.yml` in `new-tab-next` mit
eigenem `frontend`-Service:

```yaml
services:
  frontend:
    image: node:22
    working_dir: /app
    volumes:
      - ./:/app
    ports:
      - "3000:3000"
    command: npm run dev
    environment:
      WP_API_BASE: http://host.docker.internal:8082
```

(`host.docker.internal` zeigt aus dem Container auf den Docker-Host, wo WP
auf 8082 läuft. Unter Linux ggf. `extra_hosts: ["host.docker.internal:host-gateway"]`.)

**Entscheidung beim Start:** A reicht meistens; B nur wenn keine lokale
Node-Installation gewünscht ist.

## Schritt 7: Lokale WP-Umgebung & Reproduzierbarkeit

Das Frontend braucht die WP-REST-API. Für komplett lokale, offline-fähige
Entwicklung kommt WordPress aus dem Schwester-Repo `new-tab-headless` —
das ist bereits nahezu vollständig reproduzierbar:

- **WP-Core** (`wp-admin`, `wp-includes`, `wp-config.php`) kommt aus dem
  offiziellen Image `wordpress:php8.5-apache` (wird beim ersten
  `docker compose up -d` automatisch von Docker Hub geladen, ~700 MB)
- **DB** wird beim ersten Start aus `db/backup.sql` importiert
  (`/docker-entrypoint-initdb.d/`)
- **`wp-content/`** (Theme, ACF, mu-plugins, uploads) liegt im Repo —
  nur `uploads/` ist gitignored und muss einmalig kopiert werden
- **Config** (`WP_HOME`, Credentials, `WP_ENVIRONMENT_TYPE=local`) setzt
  `WORDPRESS_CONFIG_EXTRA` in der `docker-compose.yml`

### Auf einem anderen Rechner starten

```bash
# 1. WP-Backend (Schwester-Repo)
git clone <new-tab-headless-repo>
cd new-tab-headless
docker compose up -d          # WP auf http://localhost:8082
# einmalig: wp-content/uploads/ von Backup/altem Rechner kopieren

# 2. Frontend (dieses Repo)
git clone <new-tab-next-repo>
cd new-tab-next
cp .env.example .env.local    # WP_API_BASE=http://127.0.0.1:8082
npm ci
npm run dev                 # → http://localhost:3000
```

Alternative ohne Docker: `.env.local` auf `WP_API_BASE=https://new-tab.de`
setzen und gegen das Live-WP entwickeln (CORS-Origin `http://localhost:3000`
muss dann im CORS-mu-plugin freigegeben sein).

### Was ins Repo gehört — und was nicht

**Committed:**
- `app/`, `lib/`, `public/` — kompletter Source-Code
- `package.json` + `package-lock.json` — Lock-File macht `npm ci`
  reproduzierbar
- `next.config.ts`, `tsconfig.json`, `eslint.config.*`
- `.env.example` — Variablennamen mit Beispielwerten
- `README.md`, `next-version.md`
- optional `docker-compose.yml` (Frontend-Variante B)

**Nicht committed** (steht in der Next.js-`.gitignore` bzw. wird ergänzt):
- `node_modules/`, `.next/`, `dist/`
- `.env.local` — nur `.env.example` kommt ins Repo
- Secrets generell: `WP_API_BASE` ist keine geheime Info, echte Secrets
  (z. B. später für WP-Auth/Preview) gehören nur in `.env.local` bzw.
  Vercel-Env-Settings

### Backup aktuell halten

`db/backup.sql` ist ein Snapshot — werden Inhalte lokal geändert und sollen
auf anderen Rechnern verfügbar sein, Dump erneuern:

```bash
docker compose exec db mariadb-dump -uwordpress -pnewtab_local_dev wordpress > db/backup.sql
```

und committen (im `new-tab-headless`-Repo, nicht hier).

## Schritt 8: Vercel-Deployment via CI

1. Repo `new-tab-next` auf GitHub pushen
2. In Vercel: Projekt aus Git-Repo importieren, Framework-Preset Next.js
   (wird automatisch erkannt), Root ggf. auf Unterordner setzen
3. Env-Variable `WP_API_BASE=https://new-tab.de` in Vercel-Settings
   hinterlegen
4. Deploy: automatisch bei Push auf `main` (Vercel-Git-Integration) —
   ein eigener GitHub-Workflow ist nicht nötig; alternativ
   `vercel build && vercel deploy --prebuilt` in einer Action, falls der
   Build unter unserer Kontrolle in CI laufen soll
5. CORS: `cors-headless.php` auf dem Live-WP um die Vercel-Domain
   ergänzen (z. B. `https://new-tab-next.vercel.app` + spätere
   Eigendomain) — Origin-Liste am besten als PHP-Array pflegen

## Checkliste (Reihenfolge)

- [ ] `create-next-app` in `new-tab-next`
- [ ] `.env.example` anlegen (`WP_API_BASE`), `.env.local` lokal setzen
- [ ] `lib/api.ts` portieren (WP_API_BASE, keine Browser-APIs serverseitig)
- [ ] `app/layout.tsx` aus `Layout.tsx` (Header/Footer als Components, `getSite()` serverseitig)
- [ ] Alle Routen anlegen (Tabelle oben), Pages als async Server Components
- [ ] Interaktive Teile als `'use client'`-Components auslagern
- [ ] `generateMetadata` + `not-found.tsx`
- [ ] CSS übernehmen (`index.css`/`App.css` → `app/globals.css` + Module)
- [ ] Lokal testen: WP aus `new-tab-headless` auf :8082, `npm run dev` auf :3000
- [ ] README mit Clone-and-Run-Anleitung (beide Repos, siehe Schritt 7)
- [ ] GitHub-Repo + Vercel-Projekt, `WP_API_BASE` in Vercel setzen
- [ ] CORS-Origin für die Vercel-Domain auf dem Live-WP ergänzen

## Offene Punkte / Entscheidungen

- [ ] Puzzle-Seite: interaktive Logik ist komplett clientseitig → als
      Client-Component übernehmen oder neu schreiben?
- [ ] Pagination: weiter Client-Pagination (Button „mehr laden") oder
      `searchParams`-basiert (SSR-freundlicher, `?page=2`)?
- [ ] Bilder: `next/image` mit `images.remotePatterns` für `new-tab.de`
      konfigurieren (Optimierung) oder plain `<img>`?
- [ ] Preview-Modus für WP-Redakteure (Draft-Preview via
      `draftMode()`) — später, nicht im ersten Wurf
