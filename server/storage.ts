import { TravelPreferences, InsertTravelPreferences, BookletContent } from "@shared/schema";

export interface IStorage {
  createTravelPreferences(prefs: InsertTravelPreferences, content: BookletContent): Promise<TravelPreferences>;
  getTravelPreferences(id: number): Promise<TravelPreferences | undefined>;
}

export class MemStorage implements IStorage {
  private preferences: Map<number, TravelPreferences>;
  private currentId: number;

  constructor() {
    this.preferences = new Map();
    this.currentId = 1;
  }

  async createTravelPreferences(prefs: InsertTravelPreferences, content: BookletContent): Promise<TravelPreferences> {
    const id = this.currentId++;
    const travelPrefs: TravelPreferences = {
      id,
      location: prefs.location,
      startDate: prefs.startDate.toISOString(),
      endDate: prefs.endDate.toISOString(),
      interests: prefs.interests,
      activityLevel: prefs.activityLevel,
      diningPreferences: prefs.diningPreferences,
      additionalNotes: prefs.additionalNotes || null,
      bookletContent: content,
    };
    this.preferences.set(id, travelPrefs);
    return travelPrefs;
  }

  async getTravelPreferences(id: number): Promise<TravelPreferences | undefined> {
    return this.preferences.get(id);
  }
}

export const storage = new MemStorage();