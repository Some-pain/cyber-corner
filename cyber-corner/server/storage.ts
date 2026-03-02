import { db } from "./db";
import { serviceRequests, notices, admins } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import type { ServiceRequest, InsertServiceRequest, Notice, InsertNotice, Admin, InsertAdmin } from "@shared/schema";
import bcrypt from "bcryptjs";

export async function getAllServiceRequests(): Promise<ServiceRequest[]> {
  return db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
}

export async function getServiceRequestById(id: number): Promise<ServiceRequest | undefined> {
  const results = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
  return results[0];
}

export async function getServiceRequestsByPhone(phone: string): Promise<ServiceRequest[]> {
  return db.select().from(serviceRequests).where(eq(serviceRequests.phone, phone)).orderBy(desc(serviceRequests.createdAt));
}

export async function createServiceRequest(data: InsertServiceRequest): Promise<ServiceRequest> {
  const results = await db.insert(serviceRequests).values(data).returning();
  return results[0];
}

export async function updateServiceRequestStatus(id: number, status: string, adminNotes?: string): Promise<ServiceRequest | undefined> {
  const updateData: Partial<ServiceRequest> = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  const results = await db.update(serviceRequests).set(updateData).where(eq(serviceRequests.id, id)).returning();
  return results[0];
}

export async function deleteServiceRequest(id: number): Promise<boolean> {
  const results = await db.delete(serviceRequests).where(eq(serviceRequests.id, id)).returning();
  return results.length > 0;
}

export async function getServiceRequestStats() {
  const all = await db.select({ count: sql<number>`count(*)` }).from(serviceRequests);
  const pending = await db.select({ count: sql<number>`count(*)` }).from(serviceRequests).where(eq(serviceRequests.status, "Pending"));
  const completed = await db.select({ count: sql<number>`count(*)` }).from(serviceRequests).where(eq(serviceRequests.status, "Completed"));
  const today = await db.select({ count: sql<number>`count(*)` }).from(serviceRequests).where(
    sql`date(created_at) = current_date`
  );
  return {
    totalRequests: Number(all[0].count),
    pendingRequests: Number(pending[0].count),
    completedRequests: Number(completed[0].count),
    todayRequests: Number(today[0].count),
  };
}

export async function getAllNotices(): Promise<Notice[]> {
  return db.select().from(notices).orderBy(desc(notices.createdAt));
}

export async function createNotice(data: InsertNotice): Promise<Notice> {
  const results = await db.insert(notices).values(data).returning();
  return results[0];
}

export async function deleteNotice(id: number): Promise<boolean> {
  const results = await db.delete(notices).where(eq(notices.id, id)).returning();
  return results.length > 0;
}

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  const results = await db.select().from(admins).where(eq(admins.email, email));
  return results[0];
}

export async function getAdminByUsername(username: string): Promise<Admin | undefined> {
  const results = await db.select().from(admins).where(eq(admins.username, username));
  return results[0];
}

export async function createAdmin(data: InsertAdmin): Promise<Admin> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const results = await db.insert(admins).values({ ...data, password: hashedPassword }).returning();
  return results[0];
}

export async function validateAdminPassword(admin: Admin, password: string): Promise<boolean> {
  return bcrypt.compare(password, admin.password);
}

export async function ensureDefaultAdmin() {
  const existing = await getAdminByEmail("admin@cybercorner.com");
  if (!existing) {
    await createAdmin({
      username: "admin",
      email: "admin@cybercorner.com",
      password: "admin123",
    });
    console.log("Default admin created: admin@cybercorner.com / admin123");
  }
}
