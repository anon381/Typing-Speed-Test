import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI as string | undefined;
const dbName = process.env.MONGODB_DB;

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

// Use global to preserve client in dev (hot reload)
const globalForMongo = global as unknown as GlobalMongo;

let clientPromise: Promise<MongoClient> | undefined;
const options: MongoClientOptions = {};

function initClient() {
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');
  if (!clientPromise) {
    clientPromise = (globalForMongo._mongoClientPromise ||= new MongoClient(uri, options).connect());
  }
  return clientPromise;
}

export async function getDb() {
  const client = await initClient();
  return client.db(dbName);
}

export async function withDb<T>(fn: (db: import('mongodb').Db) => Promise<T>): Promise<T> {
  const db = await getDb();
  return fn(db);
}
