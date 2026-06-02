// scripts/seedAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // adjust path if needed
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

const adminCredentials = {
  username: 'SuperAdmin',
  email: 'superadmin@gmail.com',
  password: 'admin123!', // CHANGE THIS IN PRODUCTION
  role: 'admin',
};

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: adminCredentials.email }, { username: adminCredentials.username }],
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);

    // Create new admin
    const admin = new User({
      username: adminCredentials.username,
      email: adminCredentials.email,
      password: hashedPassword,
      role: 'admin',
      photo: '', // optional
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Username:', admin.username);
    console.log('Role:', admin.role);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();