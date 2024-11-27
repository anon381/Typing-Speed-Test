# Typing Speed Test

This project is a Next.js app scaffolded with TypeScript, Tailwind CSS, ESLint, App Router, and a src directory. It was created using npm.

## Getting Started

Install dependencies (already done after scaffold, but safe to repeat):

```powershell
npm install
```

Create a `.env.local` file based on `.env.local.example` and set `MONGODB_URI`.

Run the development server:

```powershell
npm run dev
```

Open http://localhost:3000 in your browser to see the app.

## MongoDB Integration
- Connection utility in `src/lib/mongodb.ts`.
- Scores API route at `src/app/api/scores/route.ts` supports GET (top 20 by WPM) and POST (add score).
- UI on home page allows submitting and viewing scores.

### Environment Variables
Create `.env.local`:
```env
MONGODB_URI=your-full-connection-string
# MONGODB_DB=typing-speed  # optional override
```
These are loaded automatically by Next.js. Never commit your real `.env.local`.

### Local Testing Without Atlas
You can use a local MongoDB instance instead:
```env
MONGODB_URI=mongodb://localhost:27017/typing-speed
```

## Deployment to Vercel
1. Commit and push changes.
2. In Vercel dashboard import the GitHub repo.
3. Add Environment Variable `MONGODB_URI` (and optionally `MONGODB_DB`) in Production (and Preview for branches).
4. Trigger a deploy; Vercel will build using `npm run build` automatically.
5. After deploy, test the API endpoint: `https://<your-domain>/api/scores`.

## Scripts
- `npm run dev` – Dev server (Turbopack)
- `npm run build` – Production build
- `npm start` – Start production server (used by Vercel)
- `npm run lint` – ESLint



## Next Steps
- Add auth (optional) to prevent spam submissions.
- Add pagination or date filtering on scores.
- Add actual typing test logic (timer, accuracy calculation) feeding into the POST.
