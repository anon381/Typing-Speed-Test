
 ## Typing Speed Test

This project is a Next.js app scaffolded with TypeScript, Tailwind CSS, ESLint, App Router, and a src directory. It was created using npm.

## Data Layer
Uses Prisma + SQLite Scores & Users persisted in `dev.db` file (see `prisma/schema.prisma`).

### Initialize Database
```
npx prisma migrate dev --name init
```

### Inspect Data
```
npx prisma studio
```

### Environment Variables
Create `.env.local`:
```
DATABASE_URL=file:./dev.db
AUTH_JWT_SECRET=<long-random-secret>
```
Never commit `.env.local`.

### Deploying
For production you can keep SQLite (low traffic) or point `DATABASE_URL` to Postgres/MySQL and run:
```
npx prisma migrate deploy
```
These are loaded automatically by Next.js.
## Scripts
- `npm run dev` – Dev server (Turbopack)
- `npm run build` – Production build
- `npm start` – Start production server (used by Vercel)
- `npm run lint` – ESLint


