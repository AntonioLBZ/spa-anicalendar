# Anicalendar

A client-side SPA that shows your weekly anime airing schedule. Enter your username and see your currently watching anime organized by airing day in a weekly calendar.

## Features

- Weekly calendar view of airing anime
- Multiple API providers: AniList, Kitsu, MyAnimeList
- Configurable settings: theme (dark/light/system), content filter, empty days display, week start day, time format
- Settings persisted to localStorage
- No authentication required

## Tech Stack

- Next.js 16 (App Router, static export)
- React 19, TypeScript 5.9
- react-aria / react-aria-components
- TanStack Query
- Plain CSS with CSS custom properties for theming

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
```

Outputs a static export to `out/`.
