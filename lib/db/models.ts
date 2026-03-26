import mongoose from 'mongoose';

// Project Model
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    image: {
      type: String,
      required: [true, 'Project image is required'],
    },
    tags: [String],
    liveLink: String,
    githubLink: String,
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// About Model
const aboutSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      required: true,
    },
    skills: [String],
    experience: String,
    location: String,
  },
  { timestamps: true }
);

// Contact Model
const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: String,
    linkedin: String,
    github: String,
    twitter: String,
  },
  { timestamps: true }
);

// Admin User Model
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// UI Settings Model
const uiSettingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Engineering Digital Excellence" },
    heroSubtitle: { type: String, default: "I architect high-performance digital ecosystems with a focus on scalability, security, and immersive user experiences." },
    heroEffect: { type: String, default: "highlight" }, // highlight, beams, spotlight
    primaryColor: { type: String, default: "#6366f1" },
    accentColor: { type: String, default: "#a855f7" },
    isStatsVisible: { type: Boolean, default: true },
    isProjectsVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const About = mongoose.models.About || mongoose.model('About', aboutSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export const UISettings = mongoose.models.UISettings || mongoose.model('UISettings', uiSettingsSchema);
