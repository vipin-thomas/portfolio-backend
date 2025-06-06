require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

// Replace with your real MongoDB connection string (same as in your backend .env)
const MONGODB_URI = process.env.MONGO_URI || 'your-mongodb-uri-here';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = 'admin';
    const password = 'secret123';

    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.deleteMany({}); // optional: clear all existing admins
    await Admin.create({ username, passwordHash });

    console.log('✅ Admin user created successfully');
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
