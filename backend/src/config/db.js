const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/frontend_task';
  const dbName = process.env.DB_NAME || 'frontend_task';

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, { dbName });
  console.log(`MongoDB connected to ${mongoose.connection.host}/${dbName}`);
};

module.exports = connectDB;

