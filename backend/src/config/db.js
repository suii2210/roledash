const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const startMemoryServer = async (dbName) => {
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri, { dbName });
  console.log(`MongoDB (in-memory) started at ${memoryUri}`);
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/frontend_task';
  const dbName = process.env.DB_NAME || 'frontend_task';
  const useMemory = process.env.USE_IN_MEMORY_DB === 'true';
  const allowFallback = process.env.USE_IN_MEMORY_FALLBACK === 'true';

  mongoose.set('strictQuery', true);

  if (useMemory) {
    await startMemoryServer(dbName);
    return;
  }

  try {
    await mongoose.connect(uri, { dbName });
    console.log(`MongoDB connected to ${mongoose.connection.host}/${dbName}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    if (allowFallback) {
      console.warn('Falling back to in-memory MongoDB because USE_IN_MEMORY_FALLBACK is enabled');
      await startMemoryServer(dbName);
      return;
    }
    throw err;
  }
};

const stopDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = connectDB;
module.exports.stopDB = stopDB;
