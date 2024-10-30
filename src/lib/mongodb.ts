import { MongoClient, MongoClientOptions, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string | undefined;
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
};

function initClient() {
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');
  if (!clientPromise) {
    clientPromise = (globalForMongo._mongoClientPromise ||= new MongoClient(uri, options).connect());
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
