import { storage } from "./storage";

async function seedDatabase() {
  console.log("Checking if database needs seeding...");
  const doctors = await storage.getAllDoctors();
  if (doctors.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  console.log("Seeding dummy data...");

  // Create an Admin User
  await storage.createUser({
    username: "admin@gov.com",
    password: "password123", // Dummy password
    fullName: "System Admin",
    userType: "ADMIN",
    active: true,
  });

  // Create some Doctor Users
  const docUser1 = await storage.createUser({
    username: "john.smith@hospital.com",
    password: "password123",
    fullName: "Dr. John Smith",
    userType: "DOCTOR",
    active: true,
  });

  const docUser2 = await storage.createUser({
    username: "priya.sharma@clinic.com",
    password: "password123",
    fullName: "Dr. Priya Sharma",
    userType: "DOCTOR",
    active: true,
  });
  
  const docUser3 = await storage.createUser({
    username: "ahmed.khan@ortho.com",
    password: "password123",
    fullName: "Dr. Ahmed Khan",
    userType: "DOCTOR",
    active: true,
  });

  // Create corresponding Doctor profiles
  await storage.createDoctor({
    userId: docUser1.id,
    licenseNumber: "LIC-1001",
    specialization: "Cardiology",
    qualifications: "MBBS, MD",
    contactEmail: "john.smith@hospital.com",
    contactPhone: "555-0101",
    clinicAddress: "123 Heart Center Rd, Metro City",
    licenseExpiryDate: new Date("2028-12-31"),
    verificationStatus: "VERIFIED",
    qrCodeData: "https://example.com/doctor/LIC-1001"
  });

  await storage.createDoctor({
    userId: docUser2.id,
    licenseNumber: "LIC-1002",
    specialization: "Neurology",
    qualifications: "MBBS, DM Neurology",
    contactEmail: "priya.sharma@clinic.com",
    contactPhone: "555-0202",
    clinicAddress: "456 Brain Health Ave, Metro City",
    licenseExpiryDate: new Date("2026-06-30"),
    verificationStatus: "VERIFIED",
    qrCodeData: "https://example.com/doctor/LIC-1002"
  });

  await storage.createDoctor({
    userId: docUser3.id,
    licenseNumber: "LIC-1003",
    specialization: "Orthopedics",
    qualifications: "MBBS, MS Orthopedics",
    contactEmail: "ahmed.khan@ortho.com",
    contactPhone: "555-0303",
    clinicAddress: "789 Bone & Joint Clinic, Suburbia",
    licenseExpiryDate: new Date("2024-01-15"),
    verificationStatus: "EXPIRED",
    qrCodeData: "https://example.com/doctor/LIC-1003"
  });

  // Create a pending application
  await storage.createApplication({
    doctorName: "Dr. Sarah Jenkins",
    email: "sarah.j@newclinic.com",
    phone: "555-0404",
    specialization: "Pediatrics",
    qualifications: "MBBS, MD Pediatrics",
    licenseNumber: "LIC-1004",
    hospitalName: "Children's General",
    clinicAddress: "321 Kids Lane",
    documentUrl: "https://example.com/docs/1004.pdf",
  });

  console.log("Dummy data successfully seeded.");
}

seedDatabase().catch(console.error);
