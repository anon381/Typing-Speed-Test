import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
	throw new Error('Missing MONGODB_URI environment variable');
}

if (!dbName) {
	throw new Error('Missing MONGODB_DB environment variable');
}

type GlobalMongo = {
	mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as unknown as GlobalMongo;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const clientPromise = globalForMongo.mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== 'production') {
	globalForMongo.mongoClientPromise = clientPromise;
}

export async function getDb() {
	const connectedClient = await clientPromise;
	return connectedClient.db(dbName);
}

export async function pingDb() {
	try {
		const db = await getDb();
		await db.command({ ping: 1 });
		return { ok: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return { ok: false, error: message };
	}
}
