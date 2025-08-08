const mongoose = require("mongoose");
const Guild = require("../models/Guild");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the backend directory (parent of scripts)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const defaultGuilds = [
  {
    name: "Frontend Developers",
    description:
      "Discuss React, Vue, Angular, and modern frontend technologies",
    category: "frontend",
    icon: "⚛️",
    color: "#61DAFB",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "Welcome to the Frontend Developers guild! Share your React, Vue, Angular questions and experiences here.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "Backend Wizards",
    description: "Node.js, Python, Java, databases, and server-side magic",
    category: "backend",
    icon: "🔧",
    color: "#68A063",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "Backend Wizards unite! Discuss APIs, databases, server architecture, and backend technologies.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "Full Stack Heroes",
    description: "End-to-end development, MERN, MEAN, and full-stack projects",
    category: "fullstack",
    icon: "🚀",
    color: "#FF6B6B",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "Full Stack Heroes assemble! Share your end-to-end development experiences and full-stack projects.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "Mobile Developers",
    description: "React Native, Flutter, iOS, Android development",
    category: "mobile",
    icon: "📱",
    color: "#4ECDC4",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "Mobile Developers hub! Discuss React Native, Flutter, native iOS/Android development.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "AI & ML Enthusiasts",
    description:
      "Machine Learning, AI, Data Science, and emerging technologies",
    category: "ai-ml",
    icon: "🤖",
    color: "#9B59B6",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "AI & ML Enthusiasts! Share your machine learning projects, discuss algorithms, and explore AI trends.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "DevOps & Cloud",
    description:
      "Docker, Kubernetes, AWS, Azure, CI/CD, and cloud infrastructure",
    category: "devops",
    icon: "☁️",
    color: "#E67E22",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "DevOps & Cloud community! Discuss containerization, cloud services, CI/CD pipelines, and infrastructure.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "UI/UX Designers",
    description:
      "Design systems, user experience, prototyping, and design tools",
    category: "design",
    icon: "🎨",
    color: "#F39C12",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "UI/UX Designers unite! Share your designs, discuss user experience, and collaborate on design systems.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  {
    name: "General Discussion",
    description:
      "Career advice, job hunting, tech news, and casual conversations",
    category: "general",
    icon: "💬",
    color: "#3498DB",
    members: [],
    moderators: [],
    messages: [
      {
        senderId: new mongoose.Types.ObjectId(),
        senderName: "System",
        content:
          "Welcome to General Discussion! Share career advice, tech news, and have casual conversations with fellow developers.",
        timestamp: new Date(),
        messageType: "text",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
];

async function seedGuilds() {
  try {
    // Debug: Check if MONGO_URI is loaded
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Found" : "Not found");

    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not defined in environment variables");
      console.log("Current working directory:", process.cwd());
      console.log("Script directory:", __dirname);
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "skill-gap-platform",
    });

    console.log("Connected to MongoDB");

    // Clear existing guilds
    await Guild.deleteMany({});
    console.log("Cleared existing guilds");

    // Insert default guilds
    await Guild.insertMany(defaultGuilds);
    console.log("Default guilds seeded successfully!");

    const guildCount = await Guild.countDocuments();
    console.log(`Total guilds in database: ${guildCount}`);
  } catch (error) {
    console.error("Error seeding guilds:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seeder
seedGuilds();
