/**
 * Seed script to initialize portfolio with sample data
 * Run with: node scripts/seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    tags: [String],
    liveLink: String,
    githubLink: String,
    featured: Boolean,
  },
  { timestamps: true }
);

const aboutSchema = new mongoose.Schema(
  {
    bio: String,
    skills: [String],
    experience: String,
    location: String,
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    twitter: String,
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
const About = mongoose.model('About', aboutSchema);
const Contact = mongoose.model('Contact', contactSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await About.deleteMany({});
    await Contact.deleteMany({});

    // Seed projects
    const projects = [
      {
        title: "EcoTrack: Sustainability Platform",
        description: "A comprehensive dashboard for tracking carbon footprint and environmental impact. Built with a focus on real-time data visualization and actionable insights.",
        image: "https://images.unsplash.com/photo-1542601906-938b7d7fd74b?auto=format&fit=crop&q=80&w=800",
        tags: ["Next.js", "TypeScript", "D3.js", "TailwindCSS"],
        liveLink: "https://ecotrack-demo.vercel.app",
        githubLink: "https://github.com/example/ecotrack",
        featured: true
      },
      {
        title: "NeuroSync: AI Brain Mapping",
        description: "Advanced mental health application using machine learning to analyze sleep patterns and cognitive performance, providing personalized wellness recommendations.",
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
        tags: ["React Native", "Python", "TensorFlow", "FastAPI"],
        liveLink: "https://neurosync.app",
        githubLink: "https://github.com/example/neurosync",
        featured: true
      },
      {
        title: "QuantumPay: DeFi Hub",
        description: "Secure, lightning-fast cryptocurrency wallet and exchange interface designed for seamless asset management across multiple blockchain networks.",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800",
        tags: ["Solidity", "Ether.js", "Next.js", "PostgreSQL"],
        liveLink: "https://quantumpay.finance",
        githubLink: "https://github.com/example/quantumpay",
        featured: true
      },
      {
        title: "Swift物流: Smart Logistics",
        description: "Optimizing supply chain routes using real-time traffic data and predictive analytics. Reduced delivery times by 15% for enterprise fleets.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        tags: ["Go", "Kafka", "Docker", "React"],
        liveLink: "#",
        githubLink: "#",
        featured: false
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log(`✅ Created ${createdProjects.length} sample projects`);

    // Seed about info
    const about = await About.create({
      bio: "I'm a visionary Full Stack Developer with a passion for building software that pushes the boundaries of what's possible. I bridge the gap between complex backend systems and beautiful, immersive frontends.",
      skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "Docker", "PostgreSQL", "MongoDB", "Redis", "AWS"],
      experience: "3+ years",
      location: "San Francisco, CA",
    });

    console.log('✅ Created sample about info');

    // Seed contact info
    const contact = await Contact.create({
      email: "hello@visionary.dev",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/visionary-dev",
      github: "https://github.com/visionary-dev",
      twitter: "https://twitter.com/visionary_dev",
    });

    console.log('✅ Created sample contact info');
    console.log('\n📚 Seeded portfolio with sample data!');
    console.log('🚀 Your portfolio is ready to customize from the admin panel at /admin\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
