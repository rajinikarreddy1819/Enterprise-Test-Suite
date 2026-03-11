import { db } from "./db";
import { 
  users, doctors, applications, prescriptions, qrScanLogs,
  type User, type Doctor, type DoctorApplication, type Prescription, type QrScanLog
} from "@shared/schema";
import { eq, or, ilike } from "drizzle-orm";
import type { z } from "zod";
import type { 
  insertUserSchema, insertDoctorSchema, insertApplicationSchema, insertPrescriptionSchema 
} from "@shared/schema";

type InsertUser = z.infer<typeof insertUserSchema>;
type InsertDoctor = z.infer<typeof insertDoctorSchema>;
type InsertApplication = z.infer<typeof insertApplicationSchema>;
type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctors
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: number): Promise<Doctor | undefined>;
  getDoctorByLicense(licenseNumber: string): Promise<(Doctor & { fullName?: string }) | undefined>;
  searchDoctors(query: string): Promise<(Doctor & { fullName?: string })[]>;
  getAllDoctors(): Promise<(Doctor & { fullName?: string })[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctorStatus(id: number, status: string): Promise<Doctor>;
  
  // Applications
  getApplication(id: number): Promise<DoctorApplication | undefined>;
  getApplicationByUuid(uuid: string): Promise<DoctorApplication | undefined>;
  getAllApplications(): Promise<DoctorApplication[]>;
  createApplication(app: InsertApplication): Promise<DoctorApplication>;
  updateApplicationStatus(id: number, status: string, notes?: string, officer?: string): Promise<DoctorApplication>;
  
  // Prescriptions
  getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription & { doctorId: number }): Promise<Prescription>;
  
  // QR Logs
  logScan(log: { doctorId: number; licenseNumber: string; scannedByIp?: string; scannerLocation?: string; deviceType?: string; scanResult?: string }): Promise<QrScanLog>;
  getAllScans(): Promise<QrScanLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Doctors
  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getDoctorByLicense(licenseNumber: string): Promise<(Doctor & { fullName?: string }) | undefined> {
    const result = await db.select({
      doctor: doctors,
      user: users,
    })
    .from(doctors)
    .leftJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.licenseNumber, licenseNumber));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].doctor,
      fullName: result[0].user?.fullName,
    };
  }

  async searchDoctors(query: string): Promise<(Doctor & { fullName?: string })[]> {
    if (!query) return this.getAllDoctors();
    
    const results = await db.select({
      doctor: doctors,
      user: users,
    })
    .from(doctors)
    .leftJoin(users, eq(doctors.userId, users.id))
    .where(
      or(
        ilike(doctors.licenseNumber, `%${query}%`),
        ilike(users.fullName, `%${query}%`),
        ilike(doctors.specialization, `%${query}%`)
      )
    );
    
    return results.map(r => ({
      ...r.doctor,
      fullName: r.user?.fullName,
    }));
  }

  async getAllDoctors(): Promise<(Doctor & { fullName?: string })[]> {
    const results = await db.select({
      doctor: doctors,
      user: users,
    })
    .from(doctors)
    .leftJoin(users, eq(doctors.userId, users.id));
    
    return results.map(r => ({
      ...r.doctor,
      fullName: r.user?.fullName,
    }));
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }
  
  async updateDoctorStatus(id: number, status: string): Promise<Doctor> {
    const [doctor] = await db.update(doctors)
      .set({ verificationStatus: status })
      .where(eq(doctors.id, id))
      .returning();
    return doctor;
  }

  // Applications
  async getApplication(id: number): Promise<DoctorApplication | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.id, id));
    return app;
  }

  async getApplicationByUuid(uuid: string): Promise<DoctorApplication | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.applicationId, uuid));
    return app;
  }

  async getAllApplications(): Promise<DoctorApplication[]> {
    return await db.select().from(applications);
  }

  async createApplication(app: InsertApplication): Promise<DoctorApplication> {
    const [newApp] = await db.insert(applications).values(app).returning();
    return newApp;
  }

  async updateApplicationStatus(id: number, status: string, notes?: string, officer?: string): Promise<DoctorApplication> {
    const updates: Partial<DoctorApplication> = { status };
    if (notes) updates.reviewNotes = notes;
    if (officer) updates.assignedOfficer = officer;
    if (status === "APPROVED" || status === "REJECTED" || status === "VERIFIED") {
      updates.verificationDate = new Date();
    }
    
    const [app] = await db.update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return app;
  }

  // Prescriptions
  async getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.doctorId, doctorId));
  }

  async createPrescription(prescription: InsertPrescription & { doctorId: number }): Promise<Prescription> {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
    return newPrescription;
  }

  // QR Logs
  async logScan(log: { doctorId: number; licenseNumber: string; scannedByIp?: string; scannerLocation?: string; deviceType?: string; scanResult?: string }): Promise<QrScanLog> {
    const [scan] = await db.insert(qrScanLogs).values(log).returning();
    return scan;
  }
  
  async getAllScans(): Promise<QrScanLog[]> {
    return await db.select().from(qrScanLogs).orderBy(qrScanLogs.scanTime);
  }
}

export const storage = new DatabaseStorage();
