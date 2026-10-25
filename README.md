# Anicalendar

A mostly client-side app that shows when your anime airs. Enter your username and it arranges what you're currently watching by airing day in a weekly calendar.

## Features

- Weekly calendar view of airing anime
- Providers: AniList, Kitsu, MyAnimeList (only AniList is enabled by default, see [Environment variables](#environment-variables))
- Watching and planning lists
- Browse the current and next season without a username
- Filters: format, content, new-season only, top N for seasonal views
- Edit mode to hide entries from the calendar
- Configurable settings: theme (dark/light/system), color scheme (original blue or schemes based on AniList profile colors), layout (auto/grid/list), empty days display, week start day, time format
- Settings, filters and hidden entries persisted to localStorage
- English, Spanish, French and German localization (`en`/`es`/`fr`/`de`)
- No user authentication

## Tech stack

- Next.js 16 (App Router)
- React 19, TypeScript 5.9
- react-aria / react-aria-components
- TanStack Query
- next-intl
- Plain CSS with CSS custom properties for theming
- Deployed on Vercel

Almost all data fetching and rendering happens client-side, but `src/app/api/mal/**` are server route handlers that proxy the MyAnimeList API so its client credential never reaches the browser.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`pnpm dev` first tries `vercel env pull .env.local`. Without the Vercel CLI that step is skipped, so create `.env.local` yourself if you need the variables below.

## Environment variables

- `NEXT_PUBLIC_ENABLED_PROVIDERS` (optional): comma-separated provider allowlist, e.g. `anilist,myanimelist,kitsu`. Defaults to `anilist`.
- `MAL_CLIENT_ID` (server-only): required for the MyAnimeList proxy routes.
