const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supportflow_ai';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500 // Don't hang if no local mongod
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.log(`[Database] Notice: Standalone mode active. (MongoDB not detected at ${uri}).`);
    console.log(`[Database] Built-in local persistent datastore is active with demo tickets and users.`);
    return false;
  }
};

const getStatus = () => isConnected;

module.exports = {
  connectDB,
  getStatus
};
