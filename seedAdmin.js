require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error('Missing ADMIN_USERNAME or ADMIN_PASSWORD in environment variables');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Optional: Remove all existing admins
    await Admin.deleteMany({});
    console.log('Old admin(s) removed');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    console.log('New admin seeded');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
