import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // email
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // ADMIN, DOCTOR
  active: boolean("active").default(true),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  licenseNumber: text("license_number").notNull().unique(),
  specialization: text("specialization").notNull(),
  qualifications: text("qualifications").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  clinicAddress: text("clinic_address").notNull(),
  licenseExpiryDate: timestamp("license_expiry_date").notNull(),
  verificationStatus: text("verification_status").notNull(), // VERIFIED, EXPIRED, REVOKED, PENDING
  qrCodeData: text("qr_code_data"), // URL to doctor detail
});

export const applications = pgTable("doctor_applications", {
  id: serial("id").primaryKey(),
  applicationId: uuid("application_id").defaultRandom().notNull().unique(),
  doctorName: text("doctor_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  specialization: text("specialization").notNull(),
  qualifications: text("qualifications").notNull(),
  licenseNumber: text("license_number").notNull(),
  hospitalName: text("hospital_name").notNull(),
  clinicAddress: text("clinic_address").notNull(),
  documentUrl: text("document_url"),
  submittedDate: timestamp("submitted_date").defaultNow(),
  verificationDate: timestamp("verification_date"),
  status: text("status").notNull().default("SUBMITTED"), // SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
  reviewNotes: text("review_notes"),
  assignedOfficer: text("assigned_officer"),
});

export const prescriptions = pgTable("emergency_prescriptions", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  patientName: text("patient_name").notNull(),
  patientAge: integer("patient_age").notNull(),
  symptoms: text("symptoms").notNull(),
  prescriptionText: text("prescription_text").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  emergencyLevel: text("emergency_level").notNull(), // LOW, MEDIUM, HIGH, CRITICAL
});

export const qrScanLogs = pgTable("qr_scan_logs", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  licenseNumber: text("license_number").notNull(),
  scannedByIp: text("scanned_by_ip"),
  scannerLocation: text("scanner_location"),
  deviceType: text("device_type"),
  scanTime: timestamp("scan_time").defaultNow(),
  scanResult: text("scan_result"), // VERIFIED, NOT_FOUND, etc.
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true, 
  applicationId: true, 
  submittedDate: true, 
  verificationDate: true, 
  status: true, 
  reviewNotes: true, 
  assignedOfficer: true 
});
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true, doctorId: true, issuedAt: true });

export type User = typeof users.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type DoctorApplication = typeof applications.$inferSelect;
export type Prescription = typeof prescriptions.$inferSelect;
export type QrScanLog = typeof qrScanLogs.$inferSelect;
