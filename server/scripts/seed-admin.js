/**
 * Seed script - Creates initial admin account
 * Run: node scripts/seed-admin.js
 */
const mongoose = require('mongoose');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env');
console.log('Loading env from:', envPath);
require('dotenv').config({ path: envPath });

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env');
  process.exit(1);
}

const User = require('../src/modules/user/user.model');
const { ROLES } = require('../src/shared/constants/roles');

const ADMIN_DATA = {
  email: 'admin@gundamuniverse.com',
  password: 'Admin@123456',
  displayName: 'System Admin',
  role: ROLES.ADMIN,
  isActive: true,
  isVerified: true,
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      console.log('Admin account already exists. Skipping...');
    } else {
      await User.create(ADMIN_DATA);
      console.log('Admin account created successfully!');
      console.log(`  Email: ${ADMIN_DATA.email}`);
      console.log(`  Password: ${ADMIN_DATA.password}`);
    }
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedAdmin();
