import { MongoClient, MongoClientOptions, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string | undefined;
const fallbackUri = process.env.STANDARD_MONGODB_URI as string | undefined; // optional non-SRV standard URI
const dbName = process.env.MONGODB_DB; // optional – path in URI usually defines db

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoIndexesPromise?: Promise<void>;
}

// Preserve client across hot reloads in dev
const globalForMongo = global as unknown as GlobalMongo;

let clientPromise: Promise<MongoClient> | undefined;
const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 10_000, // fail fast instead of hanging forever
  connectTimeoutMS: 10_000,
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

function initClient() {
  if (!uri && !fallbackUri) throw new Error('Missing MONGODB_URI (and no STANDARD_MONGODB_URI)');
  if (!clientPromise) {
    clientPromise = (async (): Promise<MongoClient> => {
      const start = Date.now();
      const primary = uri || fallbackUri!;
      try {
        if (process.env.NODE_ENV !== 'production') console.log('[mongo] connecting primary URI...');
        let attempt = 0; let lastErr: unknown;
        while (attempt < 2) { // one retry on same URI
          try {
            const c = await new MongoClient(primary, options).connect();
            return c;
          } catch (err) {
            lastErr = err; attempt++;
            if (attempt < 2 && process.env.NODE_ENV !== 'production') console.warn('[mongo] retrying primary connect...');
          }
        }
        // If still failing, throw last error to trigger fallback logic
        if (lastErr) throw lastErr;
      } catch (e: unknown) {
        if (fallbackUri && primary !== fallbackUri) {
          const msg = e instanceof Error ? e.message : String(e);
          if (process.env.NODE_ENV !== 'production') console.warn('[mongo] primary connect failed, trying fallback URI:', msg);
          const startFb = Date.now();
          let attemptFb = 0; let lastErrFb: unknown;
          while (attemptFb < 2) { // retry once on fallback
            try {
              const c2 = await new MongoClient(fallbackUri, options).connect();
              if (process.env.NODE_ENV !== 'production') console.log(`[mongo] fallback connected in ${Date.now() - startFb}ms`);
              return c2;
            } catch (err) {
              lastErrFb = err; attemptFb++;
              if (attemptFb < 2 && process.env.NODE_ENV !== 'production') console.warn('[mongo] retrying fallback connect...');
            }
          }
          if (lastErrFb) throw lastErrFb;
        }
        throw e;
      }
      // Should never reach here; type guard
      throw new Error('Mongo connection failed without throwing cause');
    })();
    globalForMongo._mongoClientPromise = clientPromise;
  }
  return clientPromise;
}

async function ensureIndexes(db: Db) {
  if (!globalForMongo._mongoIndexesPromise) {
    globalForMongo._mongoIndexesPromise = (async () => {
      try {
        // Users: unique username
        await db.collection('users').createIndex({ username: 1 }, { unique: true, name: 'uniq_username' });
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('[mongo] users index warning:', (e as Error).message);
      }
      try {
        const scores = db.collection('scores');
        await scores.createIndex({ wpm: -1 }, { name: 'wpm_desc' });
        await scores.createIndex({ name: 1, createdAt: -1 }, { name: 'user_recent_scores' });
        await scores.createIndex({ createdAt: -1 }, { name: 'created_desc' });
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('[mongo] scores index warning:', (e as Error).message);
      }
    })();
  }
  return globalForMongo._mongoIndexesPromise;
}

export async function getDb() {
  const client = await initClient();
  const db = client.db(dbName);
  await ensureIndexes(db); // safe / idempotent
  return db;
}

export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const db = await getDb();
  return fn(db);
}

export async function pingDb(): Promise<{ ok: boolean; error?: string; roundTripMs?: number }> {
  try {
    const start = Date.now();
    await withDb(d => d.command({ ping: 1 }));
    return { ok: true, roundTripMs: Date.now() - start };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
