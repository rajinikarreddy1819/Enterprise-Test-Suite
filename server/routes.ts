import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Mock auth middleware for demonstration (since user wants dummy test data and login)
// In a real app, you would use sessions/JWT.
// For testing, we'll implement a simple session-less auth mock by checking a custom header 
// or returning dummy logged-in user if an endpoint requires it.
// To keep it simple and fulfill the requirement, we'll setup login to return the mock user.

// Define dummy user state memory (just for MVP/lite-build testing)
const activeSessions = new Map<string, any>(); // username -> user details

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Setup a pseudo-session by sending back the user and expecting client to 
      // maybe store it. In a real app, use express-session or JWT.
      // For this simplified version without express-session middleware configured:
      activeSessions.set("mock-session", user);
      
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        userType: user.userType,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    const user = activeSessions.get("mock-session");
    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }
    
    let doctorId;
    if (user.userType === "DOCTOR") {
      const doc = await storage.getDoctorByUserId(user.id);
      if (doc) doctorId = doc.id;
    }
    
    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      userType: user.userType,
      doctorId,
    });
  });

  app.post(api.auth.logout.path, (req, res) => {
    activeSessions.delete("mock-session");
    res.json({ message: "Logged out" });
  });

  // Public Endpoints
  app.get(api.public.search.path, async (req, res) => {
    const query = req.query.q as string || "";
    const doctors = await storage.searchDoctors(query);
    res.json(doctors);
  });

  app.get(api.public.doctorDetails.path, async (req, res) => {
    const license = req.params.license;
    const doctor = await storage.getDoctorByLicense(license);
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  });

  app.post(api.public.logScan.path, async (req, res) => {
    try {
      const input = api.public.logScan.input.parse(req.body);
      const doctor = await storage.getDoctorByLicense(input.licenseNumber);
      
      if (doctor) {
        await storage.logScan({
          doctorId: doctor.id,
          licenseNumber: input.licenseNumber,
          deviceType: input.deviceType,
          scannerLocation: input.scannerLocation,
          scannedByIp: req.ip,
          scanResult: doctor.verificationStatus
        });
      }
      res.json({ success: true });
    } catch (err) {
      // Don't fail the request if logging fails
      res.json({ success: false });
    }
  });

  // Applications
  app.post(api.applications.apply.path, async (req, res) => {
    try {
      const input = api.applications.apply.input.parse(req.body);
      const app = await storage.createApplication(input);
      res.status(201).json(app);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.applications.track.path, async (req, res) => {
    const app = await storage.getApplicationByUuid(req.params.applicationId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(app);
  });

  // Admin / Protected Endpoints
  // In a real app we'd have a middleware check here
  app.get(api.applications.list.path, async (req, res) => {
    const apps = await storage.getAllApplications();
    res.json(apps);
  });

  app.post(api.applications.updateStatus.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewNotes, assignedOfficer } = req.body;
      const app = await storage.updateApplicationStatus(id, status, reviewNotes, assignedOfficer);
      
      // If approved, we could automatically create a doctor user here
      // For MVP, we'll just update status
      
      res.json(app);
    } catch (err) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.doctors.list.path, async (req, res) => {
    const doctors = await storage.getAllDoctors();
    res.json(doctors);
  });

  app.post(api.doctors.updateStatus.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const { verificationStatus } = req.body;
    const doc = await storage.updateDoctorStatus(id, verificationStatus);
    res.json(doc);
  });

  app.get(api.admin.scans.path, async (req, res) => {
    const scans = await storage.getAllScans();
    res.json(scans);
  });

  // Doctor protected endpoints
  app.post(api.doctors.prescriptions.path, async (req, res) => {
    try {
      const input = api.doctors.prescriptions.input.parse(req.body);
      // Hack for MVP: usually we'd get doctorId from session
      // In this lite-build, assume doctorId comes from client or use dummy
      const user = activeSessions.get("mock-session");
      if (!user || user.userType !== "DOCTOR") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const doc = await storage.getDoctorByUserId(user.id);
      if (!doc) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const p = await storage.createPrescription({ ...input, doctorId: doc.id });
      res.status(201).json(p);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.doctors.prescriptionsList.path, async (req, res) => {
    const user = activeSessions.get("mock-session");
    if (!user || user.userType !== "DOCTOR") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const doc = await storage.getDoctorByUserId(user.id);
    if (!doc) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const ps = await storage.getPrescriptionsByDoctor(doc.id);
    res.json(ps);
  });

  return httpServer;
}
