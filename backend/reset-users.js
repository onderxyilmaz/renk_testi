import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    resetUsers();
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Reset users and create default admin
const resetUsers = async () => {
  try {
    // Remove all users
    await User.deleteMany({});
    console.log('All users deleted');
    
    // Create default admin
    await User.create({
      email: 'admin@admin.com',
      password: 'admin',
    });
    console.log('Default admin user created');
    
    console.log('User reset completed');
    process.exit(0);
  } catch (err) {
    console.error('User reset error:', err);
    process.exit(1);
  }
};
