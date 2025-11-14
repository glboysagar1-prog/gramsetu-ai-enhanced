import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { insforgeAuthController } from "./controllers/insforgeAuthController";
import { fileController } from "./controllers/fileController";
import { analyticsController } from "./controllers/analyticsController";
import { insforgeAuth, requireCitizen, requireFieldWorker, requireDistrictOfficer, requireStateOfficer, requireNationalAdmin } from "./middleware/insforgeAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public Auth Routes
  app.post("/api/auth/signup", (req, res) => insforgeAuthController.signup(req, res));
  app.post("/api/auth/login", (req, res) => insforgeAuthController.login(req, res));
  app.post("/api/auth/google", (req, res) => insforgeAuthController.googleLogin(req, res));
  app.post("/api/auth/password-reset/send-otp", (req, res) => insforgeAuthController.sendPasswordResetOTP(req, res));
  app.post("/api/auth/password-reset/verify-otp", (req, res) => insforgeAuthController.verifyPasswordResetOTP(req, res));
  app.post("/api/auth/password-reset/reset", (req, res) => insforgeAuthController.resetPassword(req, res));

  // Protected Profile Route
  app.get("/api/auth/profile", insforgeAuth, (req, res) => insforgeAuthController.getProfile(req, res));

  // File Routes (Protected - Citizen and above)
  app.post("/api/files/upload", insforgeAuth, requireCitizen, (req, res) => 
    fileController.uploadFile(req, res)
  );
  app.get("/api/files", insforgeAuth, requireCitizen, (req, res) => 
    fileController.getFiles(req, res)
  );
  app.delete("/api/files/:id", insforgeAuth, requireCitizen, (req, res) => 
    fileController.deleteFile(req, res)
  );

  // Analytics Route (Protected - Field Worker and above)
  app.get("/api/analytics", insforgeAuth, requireFieldWorker, (req, res) => 
    analyticsController.getAnalytics(req, res)
  );

  const httpServer = createServer(app);
  return httpServer;
}