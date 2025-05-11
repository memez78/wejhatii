import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { TravelPreferencesSchema } from "@shared/schema";
import { generateDestinationRecommendation } from "./openai";
import { destinations } from "./data/destinations";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Create a test user if in development
  if (process.env.NODE_ENV === "development") {
    console.log("Setting up development environment");
    const existingUser = await storage.getUserByUsername("demo_user");
    if (!existingUser) {
      await storage.createUser({
        username: "demo_user",
        password: "secure_password", // In a real app, this would be hashed properly
        fullName: "Ahmed",
        email: "ahmed@example.com",
      });
    }
  }

  // POST /api/travel-preferences - Submit travel preferences
  app.post("/api/travel-preferences", isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = TravelPreferencesSchema.parse(req.body);
      
      // Get the user ID from the authenticated session
      const userId = req.user!.id;

      // Mark any existing preferences as inactive
      await storage.deactivateTravelPreferences(userId);

      // Use recommendation system to get a destination
      const destinationId = await generateDestinationRecommendation(validatedData);

      // Create new travel preferences
      const newPreferences = await storage.createTravelPreferences({
        userId,
        budget: validatedData.budget,
        startDate: validatedData.startDate || "",
        endDate: validatedData.endDate || "",
        interests: validatedData.interests || [],
        companions: validatedData.companions,
        muslimRequirements: validatedData.muslimRequirements || [],
        revealPreference: validatedData.revealPreference,
        revealTiming: validatedData.revealTiming || "7",
        destinationId: destinationId,
      });

      return res.status(201).json(newPreferences);
    } catch (error) {
      console.error("Error creating travel preferences:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create travel preferences" });
    }
  });

  // GET /api/travel-preferences/active - Get active travel preferences for the current user
  app.get("/api/travel-preferences/active", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      const preferences = await storage.getActiveTravelPreferences(userId);
      if (!preferences) {
        return res.status(404).json({ message: "No active travel preferences found" });
      }

      return res.json(preferences);
    } catch (error) {
      console.error("Error fetching travel preferences:", error);
      return res.status(500).json({ message: "Failed to fetch travel preferences" });
    }
  });

  // GET /api/destination - Get a sample destination for non-authenticated users
  app.get("/api/destination", async (req, res) => {
    try {
      // Return a random destination for demo purposes
      const randomIndex = Math.floor(Math.random() * destinations.length);
      return res.json(destinations[randomIndex]);
    } catch (error) {
      console.error("Error fetching destination:", error);
      return res.status(500).json({ message: "Failed to fetch destination" });
    }
  });
  
  // GET /api/destination/:preferenceId - Get destination details based on preferences
  app.get("/api/destination/:preferenceId", isAuthenticated, async (req, res) => {
    try {
      const preferenceId = parseInt(req.params.preferenceId);
      if (isNaN(preferenceId)) {
        return res.status(400).json({ message: "Invalid preference ID" });
      }

      const preferences = await storage.getTravelPreferences(preferenceId);
      if (!preferences) {
        return res.status(404).json({ message: "Travel preferences not found" });
      }

      // Check if the preferences belong to the authenticated user
      if (preferences.userId !== req.user!.id) {
        return res.status(403).json({ message: "You do not have permission to view this destination" });
      }

      // Find the destination in our dataset
      const destinationId = preferences.destinationId || "istanbul";
      const destination = destinations.find(d => d.id === destinationId) || destinations[0];

      return res.json(destination);
    } catch (error) {
      console.error("Error fetching destination:", error);
      return res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  // GET /api/recommended-destinations - Get recommended destinations
  app.get("/api/recommended-destinations", async (req, res) => {
    try {
      // For simplicity, return a subset of our destination data
      // In a real app, this would be personalized based on user preferences
      const recommendedDestinations = destinations.filter(d => d.id !== "istanbul").slice(0, 3);
      return res.json(recommendedDestinations);
    } catch (error) {
      console.error("Error fetching recommended destinations:", error);
      return res.status(500).json({ message: "Failed to fetch recommended destinations" });
    }
  });

  // POST /api/reveal-destination - Reveal a surprise destination
  app.post("/api/reveal-destination/:preferenceId", isAuthenticated, async (req, res) => {
    try {
      const preferenceId = parseInt(req.params.preferenceId);
      if (isNaN(preferenceId)) {
        return res.status(400).json({ message: "Invalid preference ID" });
      }

      const preferences = await storage.getTravelPreferences(preferenceId);
      if (!preferences) {
        return res.status(404).json({ message: "Travel preferences not found" });
      }

      // Check if the preferences belong to the authenticated user
      if (preferences.userId !== req.user!.id) {
        return res.status(403).json({ message: "You do not have permission to reveal this destination" });
      }

      // Update preferences to mark destination as revealed
      const updatedPreferences = await storage.revealTravelDestination(preferenceId);

      return res.json(updatedPreferences);
    } catch (error) {
      console.error("Error revealing destination:", error);
      return res.status(500).json({ message: "Failed to reveal destination" });
    }
  });
  
  // DELETE /api/travel-preferences/:id - Delete travel preferences
  app.delete("/api/travel-preferences/:id", isAuthenticated, async (req, res) => {
    try {
      const preferenceId = parseInt(req.params.id);
      if (isNaN(preferenceId)) {
        return res.status(400).json({ message: "Invalid preference ID" });
      }
      
      const preferences = await storage.getTravelPreferences(preferenceId);
      if (!preferences) {
        return res.status(404).json({ message: "Travel preferences not found" });
      }
      
      // Check if the preferences belong to the authenticated user
      if (preferences.userId !== req.user!.id) {
        return res.status(403).json({ message: "You do not have permission to delete these preferences" });
      }
      
      await storage.deactivateTravelPreferences(req.user!.id);
      return res.status(200).json({ message: "Travel preferences deleted successfully" });
    } catch (error) {
      console.error("Error deleting travel preferences:", error);
      return res.status(500).json({ message: "Failed to delete travel preferences" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
