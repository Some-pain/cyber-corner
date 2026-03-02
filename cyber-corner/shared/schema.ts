import { pgTable, text, integer, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  message: text("message"),
  documentFile: text("document_file"),
  status: text("status").notNull().default("Pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  serviceType: z.string().min(1, "Service type is required"),
  message: z.string().optional(),
});

export const insertNoticeSchema = createInsertSchema(notices, {
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = typeof serviceRequests.$inferInsert;
export type Notice = typeof notices.$inferSelect;
export type InsertNotice = typeof notices.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;
