const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

let isConnected = false;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${MONGODB_URI}: ${error.message}`);
    console.info(`[Database Info] Operating with resilient memory-backed store for offline/demo modes.`);
    isConnected = false;
    return null;
  }
};

const getDBStatus = () => ({
  connected: isConnected || mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'local-memory-fallback',
});

module.exports = { connectDB, getDBStatus };
