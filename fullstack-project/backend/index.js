const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health Check Route
app.get("/api/health", async (req, res) => {
  try {
    // Check database connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "OK",
      message: "Backend server is running",
      database: "Connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Backend server is running, but database connection failed",
      error: error.message,
    });
  }
});

// User Registration Route (Placeholder / Starter route to verify Prisma schema)
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.status(201).json({ message: "User registered successfully", user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
