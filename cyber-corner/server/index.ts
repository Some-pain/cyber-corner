import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { ensureDefaultAdmin } from "./storage";
import { db } from "./db";

// 5. Global crash protection
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});

const app = express();

// Compression
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// 1. Ensure the server listens using the provided PORT or 5000 (Replit default)
const PORT = parseInt(process.env.PORT || "5000");

// 2. Add a lightweight health check route at the TOP
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS and Security Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// 8-11. Ensure API, auth, sessions, and WebSockets work
registerRoutes(app);

// Serve uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Centralized Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[Error] ${status} - ${message}`);
  res.status(status).json({ success: false, message });
});

async function initDatabase() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_type TEXT NOT NULL,
        message TEXT,
        document_file TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await ensureDefaultAdmin();
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

async function setupVite() {
  if (process.env.NODE_ENV === "development") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // 6. Properly serve the Vite production build
    const distPath = path.resolve(process.cwd(), "dist", "public");
    
    // Serve static files with specific options for production stability
    app.use(express.static(distPath, {
      index: false, // Don't serve index.html automatically to avoid conflicts with SPA routing
      maxAge: '1d'
    }));
    
    // 3. Fix Express 5 wildcard usage and ensure SPA fallback works
    // Use a regular middleware or a specific route for the fallback
    app.use((req, res, next) => {
      // Avoid intercepting API, uploads, or static assets
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads") || req.path.includes(".")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"), (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Internal Server Error");
        }
      });
    });
  }
}

async function main() {
  const server = createServer(app);
  
  // 1 & 4. Start server first, then connect DB to ensure health checks pass
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  await initDatabase();
  await setupVite();
}

main().catch(console.error);
