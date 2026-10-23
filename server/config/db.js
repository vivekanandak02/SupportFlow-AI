const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supportflow_ai';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);

    // Auto-seed Atlas if collections are newly created and empty
    try {
      const User = require('../models/User');
      const Ticket = require('../models/Ticket');
      const { initialUsers, initialTickets } = require('../data/seedData');

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Database] MongoDB Atlas collections are empty. Auto-seeding initial users and tickets...');
        await User.insertMany(initialUsers);
        await Ticket.insertMany(initialTickets);
        console.log('[Database] MongoDB Atlas seeded with initial demo data successfully!');
      }
    } catch (seedErr) {
      console.warn('[Database] Auto-seeding check warning:', seedErr.message);
    }

    return true;
  } catch (err) {
    isConnected = false;
    console.log(`[Database] Notice: MongoDB connection failed (${err.message}).`);
    console.log(`[Database] Standalone mode active with built-in local persistent datastore.`);
    return false;
  }
};

const getStatus = () => isConnected;

module.exports = {
  connectDB,
  getStatus
};
