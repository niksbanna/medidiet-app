import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserProfile,
  WeeklyPlan,
  MealLog,
  HealthProgress,
  MealItem,
} from "../types/health";

interface HealthContextType {
  userProfile: UserProfile | null;
  currentPlan: WeeklyPlan | null;
  mealLogs: MealLog[];
  healthProgress: HealthProgress[];
  isLoading: boolean;
  favoriteMeals: MealItem[];
  toggleFavoriteMeal: (meal: MealItem) => Promise<void>; // or Promise<void> if it's async
  // User profile actions
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  clearUserProfile: () => Promise<void>;

  // Diet plan actions
  setCurrentPlan: (plan: WeeklyPlan) => Promise<void>;
  clearCurrentPlan: () => Promise<void>;

  // Meal logging actions
  addMealLog: (log: MealLog) => Promise<void>;
  updateMealLog: (logId: string, updates: Partial<MealLog>) => Promise<void>;
  deleteMealLog: (logId: string) => Promise<void>;

  // Progress tracking
  addHealthProgress: (progress: HealthProgress) => Promise<void>;
  getAdherenceRate: (days: number) => number;

  // API key management
  updateGeminiApiKey: (apiKey: string) => Promise<void>;
  getGeminiApiKey: () => string | null;
  updateOpenAIApiKey: (apiKey: string) => Promise<void>;
  getOpenAIApiKey: () => string | null;
  updatePreferredAiProvider: (provider: 'gemini' | 'openai') => Promise<void>;
  getPreferredAiProvider: () => 'gemini' | 'openai' | undefined;

  // Logout functionality
  logout: () => Promise<void>;
}

export const HealthContext = createContext<HealthContextType | undefined>(
  undefined
);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlanState] = useState<WeeklyPlan | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [healthProgress, setHealthProgress] = useState<HealthProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteMeals, setFavoriteMeals] = useState<MealItem[]>([]);

  // Load data from storage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      setIsLoading(true);

      const [
        storedProfile,
        storedPlan,
        storedLogs,
        storedProgress,
        storedFavorites,
      ] = await Promise.all([
        AsyncStorage.getItem("userProfile"),
        AsyncStorage.getItem("currentPlan"),
        AsyncStorage.getItem("mealLogs"),
        AsyncStorage.getItem("healthProgress"),
        AsyncStorage.getItem("favoriteMeals"), // <-- LOAD FAVORITES
      ]);

      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
      if (storedPlan) {
        setCurrentPlanState(JSON.parse(storedPlan));
      }
      if (storedLogs) {
        setMealLogs(JSON.parse(storedLogs));
      }
      if (storedProgress) {
        setHealthProgress(JSON.parse(storedProgress));
      }
      if (storedFavorites) {
        // <-- SET FAVORITES
        setFavoriteMeals(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavoriteMeal = async (meal: MealItem) => {
    let newFavorites: MealItem[] = [];

    setFavoriteMeals((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.find((m) => m.id === meal.id);

      if (isAlreadyFavorite) {
        // Remove from favorites
        newFavorites = prevFavorites.filter((m) => m.id !== meal.id);
      } else {
        // Add to favorites
        newFavorites = [{ ...meal, isFavorite: true }, ...prevFavorites];
      }

      return newFavorites;
    });

    // --- ADDED PERSISTENCE ---
    try {
      await AsyncStorage.setItem("favoriteMeals", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorite meals:", error);
      // Optionally roll back state if save fails
      // setFavoriteMeals(prevFavorites);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    try {
      setUserProfile(profile);
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const clearUserProfile = async () => {
    try {
      setUserProfile(null);
      await AsyncStorage.removeItem("userProfile");
    } catch (error) {
      console.error("Error clearing user profile:", error);
    }
  };

  const setCurrentPlan = async (plan: WeeklyPlan) => {
    try {
      setCurrentPlanState(plan);
      await AsyncStorage.setItem("currentPlan", JSON.stringify(plan));
    } catch (error) {
      console.error("Error saving current plan:", error);
    }
  };

  const clearCurrentPlan = async () => {
    try {
      setCurrentPlanState(null);
      await AsyncStorage.removeItem("currentPlan");
    } catch (error) {
      console.error("Error clearing current plan:", error);
    }
  };

  const addMealLog = async (log: MealLog) => {
    try {
      const updatedLogs = [...mealLogs, log];
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem("mealLogs", JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Error adding meal log:", error);
    }
  };

  const updateMealLog = async (logId: string, updates: Partial<MealLog>) => {
    try {
      const updatedLogs = mealLogs.map((log) =>
        log.id === logId ? { ...log, ...updates } : log
      );
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem("mealLogs", JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Error updating meal log:", error);
    }
  };

  const deleteMealLog = async (logId: string) => {
    try {
      const updatedLogs = mealLogs.filter((log) => log.id !== logId);
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem("mealLogs", JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Error deleting meal log:", error);
    }
  };

  const addHealthProgress = async (progress: HealthProgress) => {
    try {
      const updatedProgress = [...healthProgress, progress];
      setHealthProgress(updatedProgress);
      await AsyncStorage.setItem(
        "healthProgress",
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error("Error adding health progress:", error);
    }
  };

  const getAdherenceRate = (days: number): number => {
    const recentProgress = healthProgress
      .slice(-days)
      .filter((p) => p.adherenceRate > 0);

    if (recentProgress.length === 0) return 0;

    const totalAdherence = recentProgress.reduce(
      (sum, p) => sum + p.adherenceRate,
      0
    );
    return Math.round(totalAdherence / recentProgress.length);
  };

  const updateGeminiApiKey = async (apiKey: string) => {
    try {
      if (!userProfile) return;
      const updatedProfile = { ...userProfile, geminiApiKey: apiKey, updatedAt: new Date() };
      await updateUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating Gemini API key:", error);
      throw error;
    }
  };

  const updateOpenAIApiKey = async (apiKey: string) => {
    try {
      if (!userProfile) return;
      const updatedProfile = { 
        ...userProfile, 
        openAIApiKey: apiKey, 
        updatedAt: new Date() 
      };
      await updateUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating OpenAI API key:", error);
      throw error;
    }
  };

  const updatePreferredAiProvider = async (provider: 'gemini' | 'openai') => {
    try {
      if (!userProfile) return;
      const updatedProfile = { 
        ...userProfile, 
        preferredAiProvider: provider, 
        updatedAt: new Date() 
      };
      await updateUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating preferred AI provider:", error);
      throw error;
    }
  };

  const getGeminiApiKey = (): string | null => {
    return userProfile?.geminiApiKey || null;
  };

  const getOpenAIApiKey = (): string | null => {
    return userProfile?.openAIApiKey || null;
  };

  const getPreferredAiProvider = (): 'gemini' | 'openai' | undefined => {
    return userProfile?.preferredAiProvider;
  };

  const logout = async () => {
    try {
      // Clear all user-scoped data from state
      setUserProfile(null);
      setCurrentPlanState(null);
      setMealLogs([]);
      setHealthProgress([]);
      setFavoriteMeals([]); // <-- CLEAR FAVORITES STATE

      // Clear all user-scoped data from AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem("userProfile"),
        AsyncStorage.removeItem("currentPlan"),
        AsyncStorage.removeItem("mealLogs"),
        AsyncStorage.removeItem("healthProgress"),
        AsyncStorage.removeItem("favoriteMeals"), // <-- CLEAR FAVORITES STORAGE
      ]);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const value: HealthContextType = {
    userProfile,
    currentPlan,
    mealLogs,
    healthProgress,
    isLoading,
    favoriteMeals,
    updateUserProfile,
    clearUserProfile,
    setCurrentPlan,
    clearCurrentPlan,
    addMealLog,
    updateMealLog,
    deleteMealLog,
    addHealthProgress,
    getAdherenceRate,
    toggleFavoriteMeal,
    updateGeminiApiKey,
    getGeminiApiKey,
    updateOpenAIApiKey,
    getOpenAIApiKey,
    updatePreferredAiProvider,
    getPreferredAiProvider,
    logout,
  };

  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
}
