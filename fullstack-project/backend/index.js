const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { PrismaClient } = require("@prisma/client");
const { scrapeAndSaveProducts } = require("./scraper");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes."
  }
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authLimiter, authRoutes);

// Serve mock-source.html for the scraper to read
app.get("/mock-source.html", (req, res) => {
  res.sendFile(path.join(__dirname, "mock-source.html"));
});

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

// GET /api/products - Get all scraped products from the database
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Trigger scraper on startup asynchronously so it doesn't block the server from listening
  console.log("[Server] Triggering initial scrape...");
  scrapeAndSaveProducts();
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
