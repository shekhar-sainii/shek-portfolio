const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// Define the Admin Schema directly for the script
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Drop legacy 'username' index if it exists
    try {
      await Admin.collection.dropIndex('username_1');
      console.log('Legacy username index dropped.');
    } catch (e) {
      if (e.code === 27) {
        console.log('Username index not found, skipping drop.');
      } else {
        console.warn('Warning dropping index:', e.message);
      }
    }

    // Superadmin
    const superadminEmail = 'super@example.com';
    const superadminPassword = 'super123';
    
    // Admin
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    // Create Superadmin
    const existingSuper = await Admin.findOne({ email: superadminEmail });
    if (existingSuper) {
      existingSuper.role = 'superadmin';
      await existingSuper.save();
      console.log('Superadmin user updated:', superadminEmail);
    } else {
      await Admin.create({
        email: superadminEmail,
        password: superadminPassword,
        role: 'superadmin',
      });
      console.log('Superadmin user created successfully!');
    }

    // Create regular Admin
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin user updated:', adminEmail);
    } else {
      await Admin.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully!');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
