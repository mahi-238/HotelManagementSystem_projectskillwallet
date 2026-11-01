const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedDatabase } = require('./utils/seeder');

dotenv.config();

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel';
    console.log(` Connecting to MongoDB for seeding: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);

    console.log(' Starting seed process...');
    const result = await seedDatabase(true);

    console.log(' Seeding completed successfully!');
    console.log(` Summary: ${result.rooms} rooms, ${result.users} users, ${result.bookings} bookings.`);
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
