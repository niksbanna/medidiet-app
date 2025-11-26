import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeeklyPlan } from '../types/health';

interface PlanState {
  currentPlan: WeeklyPlan | null;
  
  // Actions
  setCurrentPlan: (plan: WeeklyPlan) => Promise<void>;
  clearCurrentPlan: () => Promise<void>;
  
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
