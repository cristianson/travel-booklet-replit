import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTravelPreferencesSchema, type TravelPreferences } from "@shared/schema";
import { getTravelRecommendations } from "./lib/perplexity";
import { generateBookletContent, generateTravelPrompt } from "./lib/openai";
import { ZodError } from "zod";

export async function registerRoutes(app: Express) {
  app.post("/api/booklets", async (req, res) => {
    try {
      const preferences = insertTravelPreferencesSchema.parse(req.body);

      // Create a temporary TravelPreferences object for API calls
      const tempPrefs: TravelPreferences = {
        id: -1, // temporary ID
        location: preferences.location,
        startDate: preferences.startDate.toISOString(),
        endDate: preferences.endDate.toISOString(),
        interests: preferences.interests,
        activityLevel: preferences.activityLevel,
        diningPreferences: preferences.diningPreferences,
        restaurantBudget: preferences.restaurantBudget,
        additionalNotes: preferences.additionalNotes || null,
        bookletContent: {}, // temporary empty content
      };

      // Step 1: Generate optimized prompt with OpenAI
      const optimizedPrompt = await generateTravelPrompt(tempPrefs);

      // Step 2: Get recommendations from Perplexity using the optimized prompt
      const recommendations = await getTravelRecommendations(tempPrefs, optimizedPrompt);

      // Step 3: Format the final booklet content with OpenAI
      const bookletContent = await generateBookletContent(tempPrefs, recommendations);

      // Store preferences and generated content
      const result = await storage.createTravelPreferences(preferences, bookletContent);

      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  app.get("/api/booklets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const preferences = await storage.getTravelPreferences(id);

      if (!preferences) {
        res.status(404).json({ message: "Booklet not found" });
        return;
      }

      res.json(preferences);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  });

  return createServer(app);
}