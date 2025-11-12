const { MongoClient } = require("mongodb");

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL is not set");
}

const DB_NAME = process.env.MONGODB_DB || "roledash";

let client;
let clientPromise;
let dbPromise;

function getClient() {
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = getClient().then((connectedClient) => connectedClient.db(DB_NAME));
  }
  return dbPromise;
}

async function initDb() {
  const db = await getDb();
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  return db;
}

module.exports = { getDb, initDb };
