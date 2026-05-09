# Anicalendar

A client-side SPA that shows your weekly anime airing schedule from [AniList](https://anilist.co). Enter your AniList username and see your currently watching anime organized by airing day in a weekly calendar.

## Features

- Weekly calendar view of airing anime
- Configurable settings: theme (dark/light), content filter, empty days display, week start day, and time format
- Settings persisted to localStorage
- No authentication required — uses the public AniList GraphQL API

## Tech Stack

- Next.js 16 (App Router, static export)
- React 19, TypeScript 5.9
- react-aria / react-aria-components
- Plain CSS with CSS custom properties for theming

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

The app uses the [AniList GraphQL API](https://graphql.anilist.co). You can explore the schema in the [Apollo Studio Sandbox](https://studio.apollographql.com/sandbox/explorer).
