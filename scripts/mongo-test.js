// Quick connectivity test. Run with: node scripts/mongo-test.js
// Deprecated: legacy Mongo connectivity test (kept only for reference, not used by Prisma setup).
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI || process.env.STANDARD_MONGODB_URI;
  if(!uri){ console.error('No MONGODB_URI or STANDARD_MONGODB_URI set'); process.exit(1); }
  const start = Date.now();
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    await client.connect();
    console.log('Connected in', Date.now() - start, 'ms');
    const dbNameMatch = /\/([^/?]+)(?:\?|$)/.exec(uri);
    const dbName = process.env.MONGODB_DB || (dbNameMatch ? dbNameMatch[1] : undefined);
    if(dbName){
      const stats = await client.db(dbName).command({ ping: 1 });
      console.log('Ping result:', stats);
    }
    await client.close();
  } catch (e) {
    console.error('Connection failed:', e.message);
  }
})();
