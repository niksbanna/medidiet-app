import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeeklyPlan } from '../types/health';

interface PlanState {
  currentPlan: WeeklyPlan | null;
  
  // Actions
  setCurrentPlan: (plan: WeeklyPlan) => Promise<void>;
  clearCurrentPlan: () => Promise<void>;
  updateMealInPlan: (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', mealIndex: number, newMeal: any) => void;
  
  // Reset
  reset: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      currentPlan: null,

      setCurrentPlan: async (plan) => {
        set({ currentPlan: plan });
      },

      clearCurrentPlan: async () => {
        set({ currentPlan: null });
      },

      updateMealInPlan: (dayIndex, mealType, mealIndex, newMeal) => {
        set((state) => {
          if (!state.currentPlan) return state;
          
          const newPlan = { ...state.currentPlan };
          const day = newPlan.days[dayIndex];
          
          if (day && day[mealType]) {
            const meals = [...day[mealType]];
            meals[mealIndex] = newMeal;
            day[mealType] = meals;
          }
          
          return { currentPlan: newPlan };
        });
      },

      reset: () => {
        set({ currentPlan: null });
      },
    }),
    {
      name: 'plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
