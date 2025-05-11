import { 
  users, 
  type User, 
  type InsertUser, 
  travelPreferences, 
  type TravelPreferences, 
  type InsertTravelPreferences 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTravelPreferences(id: number): Promise<TravelPreferences | undefined>;
  getActiveTravelPreferences(userId: number): Promise<TravelPreferences | undefined>;
  createTravelPreferences(preferences: InsertTravelPreferences): Promise<TravelPreferences>;
  updateTravelPreferences(id: number, preferences: Partial<InsertTravelPreferences>): Promise<TravelPreferences>;
  deactivateTravelPreferences(userId: number): Promise<void>;
  revealTravelDestination(id: number): Promise<TravelPreferences>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Database error in getUser:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Database error in getUserByUsername:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createUser:", error);
      throw error;
    }
  }

  async getTravelPreferences(id: number): Promise<TravelPreferences | undefined> {
    try {
      const result = await db
        .select()
        .from(travelPreferences)
        .where(eq(travelPreferences.id, id))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Database error in getTravelPreferences:", error);
      throw error;
    }
  }

  async getActiveTravelPreferences(userId: number): Promise<TravelPreferences | undefined> {
    try {
      const result = await db
        .select()
        .from(travelPreferences)
        .where(
          and(
            eq(travelPreferences.userId, userId),
            eq(travelPreferences.active, true)
          )
        )
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Database error in getActiveTravelPreferences:", error);
      throw error;
    }
  }

  async createTravelPreferences(insertPreferences: InsertTravelPreferences): Promise<TravelPreferences> {
    try {
      // Set revealed status based on reveal preference
      const preferences = {
        ...insertPreferences,
        revealed: insertPreferences.revealPreference === "now",
        active: true
      };
      
      const result = await db
        .insert(travelPreferences)
        .values(preferences)
        .returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createTravelPreferences:", error);
      throw error;
    }
  }

  async updateTravelPreferences(id: number, updates: Partial<InsertTravelPreferences>): Promise<TravelPreferences> {
    try {
      const result = await db
        .update(travelPreferences)
        .set(updates)
        .where(eq(travelPreferences.id, id))
        .returning();
      
      if (result.length === 0) {
        throw new Error(`Travel preferences with ID ${id} not found`);
      }
      
      return result[0];
    } catch (error) {
      console.error("Database error in updateTravelPreferences:", error);
      throw error;
    }
  }

  async deactivateTravelPreferences(userId: number): Promise<void> {
    try {
      await db
        .update(travelPreferences)
        .set({ active: false })
        .where(
          and(
            eq(travelPreferences.userId, userId),
            eq(travelPreferences.active, true)
          )
        );
    } catch (error) {
      console.error("Database error in deactivateTravelPreferences:", error);
      throw error;
    }
  }

  async revealTravelDestination(id: number): Promise<TravelPreferences> {
    try {
      const result = await db
        .update(travelPreferences)
        .set({ revealed: true })
        .where(eq(travelPreferences.id, id))
        .returning();
      
      if (result.length === 0) {
        throw new Error(`Travel preferences with ID ${id} not found`);
      }
      
      return result[0];
    } catch (error) {
      console.error("Database error in revealTravelDestination:", error);
      throw error;
    }
  }
}

// Create a database storage instance
export const storage = new DatabaseStorage();
