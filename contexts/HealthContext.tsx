import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WeeklyPlan, MealLog, HealthProgress } from '../types/health';

interface HealthContextType {
  userProfile: UserProfile | null;
  currentPlan: WeeklyPlan | null;
  mealLogs: MealLog[];
  healthProgress: HealthProgress[];
  isLoading: boolean;
  
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
  
  // Logout functionality
  logout: () => Promise<void>;
}

export const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPlan, setCurrentPlanState] = useState<WeeklyPlan | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [healthProgress, setHealthProgress] = useState<HealthProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      setIsLoading(true);
      
      const [storedProfile, storedPlan, storedLogs, storedProgress] = await Promise.all([
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('currentPlan'),
        AsyncStorage.getItem('mealLogs'),
        AsyncStorage.getItem('healthProgress')
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
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    try {
      setUserProfile(profile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const clearUserProfile = async () => {
    try {
      setUserProfile(null);
      await AsyncStorage.removeItem('userProfile');
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  };

  const setCurrentPlan = async (plan: WeeklyPlan) => {
    try {
      setCurrentPlanState(plan);
      await AsyncStorage.setItem('currentPlan', JSON.stringify(plan));
    } catch (error) {
      console.error('Error saving current plan:', error);
    }
  };

  const clearCurrentPlan = async () => {
    try {
      setCurrentPlanState(null);
      await AsyncStorage.removeItem('currentPlan');
    } catch (error) {
      console.error('Error clearing current plan:', error);
    }
  };

  const addMealLog = async (log: MealLog) => {
    try {
      const updatedLogs = [...mealLogs, log];
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem('mealLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error adding meal log:', error);
    }
  };

  const updateMealLog = async (logId: string, updates: Partial<MealLog>) => {
    try {
      const updatedLogs = mealLogs.map(log => 
        log.id === logId ? { ...log, ...updates } : log
      );
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem('mealLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error updating meal log:', error);
    }
  };

  const deleteMealLog = async (logId: string) => {
    try {
      const updatedLogs = mealLogs.filter(log => log.id !== logId);
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem('mealLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error deleting meal log:', error);
    }
  };

  const addHealthProgress = async (progress: HealthProgress) => {
    try {
      const updatedProgress = [...healthProgress, progress];
      setHealthProgress(updatedProgress);
      await AsyncStorage.setItem('healthProgress', JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error adding health progress:', error);
    }
  };

  const getAdherenceRate = (days: number): number => {
    const recentProgress = healthProgress
      .slice(-days)
      .filter(p => p.adherenceRate > 0);
    
    if (recentProgress.length === 0) return 0;
    
    const totalAdherence = recentProgress.reduce((sum, p) => sum + p.adherenceRate, 0);
    return Math.round(totalAdherence / recentProgress.length);
  };

  const logout = async () => {
    try {
      // Clear all user-scoped data from state
      setUserProfile(null);
      setCurrentPlanState(null);
      setMealLogs([]);
      setHealthProgress([]);
      
      // Clear all user-scoped data from AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem('userProfile'),
        AsyncStorage.removeItem('currentPlan'),
        AsyncStorage.removeItem('mealLogs'),
        AsyncStorage.removeItem('healthProgress')
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const value: HealthContextType = {
    userProfile,
    currentPlan,
    mealLogs,
    healthProgress,
    isLoading,
    updateUserProfile,
    clearUserProfile,
    setCurrentPlan,
    clearCurrentPlan,
    addMealLog,
    updateMealLog,
    deleteMealLog,
    addHealthProgress,
    getAdherenceRate,
    logout
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
}