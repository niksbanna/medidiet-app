import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealLog, MealItem } from '../types/health';

interface JournalState {
  mealLogs: MealLog[];
  favoriteMeals: MealItem[];
  
  // Actions
  addMealLog: (log: MealLog) => Promise<void>;
  updateMealLog: (logId: string, updates: Partial<MealLog>) => Promise<void>;
  deleteMealLog: (logId: string) => Promise<void>;
  toggleFavoriteMeal: (meal: MealItem) => Promise<void>;
  
  // Reset
  reset: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      mealLogs: [],
      favoriteMeals: [],

      addMealLog: async (log) => {
        set((state) => ({ mealLogs: [...state.mealLogs, log] }));
      },

      updateMealLog: async (logId, updates) => {
        set((state) => ({
          mealLogs: state.mealLogs.map((log) =>
            log.id === logId ? { ...log, ...updates } : log
          ),
        }));
      },

      deleteMealLog: async (logId) => {
        set((state) => ({
          mealLogs: state.mealLogs.filter((log) => log.id !== logId),
        }));
      },

      toggleFavoriteMeal: async (meal) => {
        set((state) => {
          const isAlreadyFavorite = state.favoriteMeals.find((m) => m.id === meal.id);
          let newFavorites;
          
          if (isAlreadyFavorite) {
            newFavorites = state.favoriteMeals.filter((m) => m.id !== meal.id);
          } else {
            newFavorites = [{ ...meal, isFavorite: true }, ...state.favoriteMeals];
          }
          
          return { favoriteMeals: newFavorites };
        });
      },

      reset: () => {
        set({ mealLogs: [], favoriteMeals: [] });
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
