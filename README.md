<!-- Project README: Typing Speed Test application overview -->

# Typing Speed Test

This project is a Next.js app scaffolded with TypeScript, Tailwind CSS, ESLint, App Router, and a src directory. It was created using npm.

## Data Layer

Uses MongoDB for Users and Scores.

### Environment Variables

Create `.env.local`:

```
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=typing_speed_test
AUTH_JWT_SECRET=<long-random-secret>
```

Never commit `.env.local`.

### Deploying

Set `MONGODB_URI` and `MONGODB_DB` to your production MongoDB values.
These are loaded automatically by Next.js.

## Scripts

- `npm run dev` – Dev server (Turbopack)
- `npm run build` – Production build
- `npm start` – Start production server (used by Vercel)
- `npm run lint` – ESLint

## Next Steps

- Add pagination or date filtering on scores.
- Add richer user profile data.
- Improve typing test metrics (error streaks, per-character timing).
