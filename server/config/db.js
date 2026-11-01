const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel');
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed sample rooms and users if the database is currently empty
    try {
      const { autoSeed } = require('../utils/seeder');
      await autoSeed();
    } catch (seedErr) {
      console.error(` Auto-seed warning: ${seedErr.message}`);
    }

    return conn;
  } catch (error) {
    console.error(` Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
