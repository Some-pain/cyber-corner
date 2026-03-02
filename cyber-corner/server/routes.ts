import type { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import * as storage from "./storage";
import { insertServiceRequestSchema, insertNoticeSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "cybercorner-secret-key-2024";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and PDF files are allowed"));
    }
  },
});

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    (req as any).admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function registerRoutes(app: Express) {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password required" });
      }
      const admin = await storage.getAdminByEmail(email);
      if (!admin || !(await storage.validateAdminPassword(admin, password))) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.json({ success: true, message: "Login successful", data: { id: admin.id, username: admin.username, email: admin.email } });
    } catch (err) {
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const adminData = (req as any).admin;
      const admin = await storage.getAdminByEmail(adminData.email);
      if (!admin) return res.status(401).json({ error: "Admin not found" });
      res.json({ id: admin.id, username: admin.username, email: admin.email });
    } catch {
      res.status(500).json({ error: "Failed to get admin info" });
    }
  });

  app.get("/api/requests", authMiddleware, async (req, res) => {
    try {
      const requests = await storage.getAllServiceRequests();
      res.json(requests);
    } catch {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", upload.single("document"), async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        phone: req.body.phone,
        serviceType: req.body.serviceType,
        message: req.body.message,
        documentFile: req.file ? req.file.filename : undefined,
      };
      const parsed = insertServiceRequestSchema.parse(data);
      const request = await storage.createServiceRequest(parsed);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: err.errors });
      }
      res.status(500).json({ error: "Failed to create request" });
    }
  });

  app.patch("/api/requests/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      const updated = await storage.updateServiceRequestStatus(id, status, adminNotes);
      if (!updated) return res.status(404).json({ error: "Request not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  app.delete("/api/requests/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteServiceRequest(id);
      if (!deleted) return res.status(404).json({ error: "Request not found" });
      res.json({ message: "Deleted" });
    } catch {
      res.status(500).json({ error: "Failed to delete request" });
    }
  });

  app.get("/api/track-request", async (req, res) => {
    try {
      const phone = req.query.phone as string;
      if (!phone || phone.length < 10) {
        return res.status(400).json({ error: "Valid phone number required" });
      }
      const requests = await storage.getServiceRequestsByPhone(phone);
      res.json(requests);
    } catch {
      res.status(500).json({ error: "Failed to track requests" });
    }
  });

  app.get("/api/admin/analytics", authMiddleware, async (req, res) => {
    try {
      const stats = await storage.getServiceRequestStats();
      res.json(stats);
    } catch {
      res.status(500).json({ error: "Failed to get analytics" });
    }
  });

  app.get("/api/notices", async (req, res) => {
    try {
      const allNotices = await storage.getAllNotices();
      res.json(allNotices);
    } catch {
      res.status(500).json({ error: "Failed to fetch notices" });
    }
  });

  app.post("/api/notices", authMiddleware, upload.single("image"), async (req, res) => {
    try {
      const data = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file ? req.file.filename : undefined,
      };
      const parsed = insertNoticeSchema.parse(data);
      const notice = await storage.createNotice(parsed);
      res.status(201).json(notice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: err.errors });
      }
      res.status(500).json({ error: "Failed to create notice" });
    }
  });

  app.delete("/api/notices/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNotice(id);
      if (!deleted) return res.status(404).json({ error: "Notice not found" });
      res.json({ message: "Deleted" });
    } catch {
      res.status(500).json({ error: "Failed to delete notice" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    res.sendFile(path.join(uploadsDir, req.path.substring(1)), (err) => {
      if (err) res.status(404).json({ error: "File not found" });
    });
  });
}
