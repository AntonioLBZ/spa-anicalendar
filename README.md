# Anicalendar

A mostly client-side app that shows your weekly anime airing schedule. Enter your username and see your currently watching anime organized by airing day in a weekly calendar.

## Features

- Weekly calendar view of airing anime
- Multiple API providers: AniList, Kitsu, MyAnimeList
- Watching and planning lists
- Browse the current and next season without a username
- Filters: format, content, new-season only, top N for seasonal views
- Edit mode to hide entries from the calendar
- Configurable settings: theme (dark/light/system), layout (auto/grid/list), empty days display, week start day, time format
- Settings, filters and hidden entries persisted to localStorage
- English, Spanish, French and German localization (`en`/`es`/`fr`/`de`)
- No user authentication

## Tech Stack

- Next.js 16 (App Router)
- React 19, TypeScript 5.9
- react-aria / react-aria-components
- TanStack Query
- next-intl
- Plain CSS with CSS custom properties for theming
- Deployed on Vercel

Almost all data fetching and rendering happens client-side, but `src/app/api/mal/**` are server route handlers that proxy the MyAnimeList API so its client credential never reaches the browser.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

- `NEXT_PUBLIC_ENABLED_PROVIDERS` (optional) — comma-separated provider allowlist, e.g. `anilist,myanimelist,kitsu`. Defaults to `anilist`.
- `MAL_CLIENT_ID` (server-only) — required for the MyAnimeList proxy routes; never exposed.
