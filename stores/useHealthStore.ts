import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthProgress } from '../types/health';

interface HealthState {
  healthProgress: HealthProgress[];
  
  // Actions
  addHealthProgress: (progress: HealthProgress) => Promise<void>;
  getAdherenceRate: (days: number) => number;
  
  // Reset
  reset: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      healthProgress: [],

      addHealthProgress: async (progress) => {
        set((state) => ({ healthProgress: [...state.healthProgress, progress] }));
      },

      getAdherenceRate: (days) => {
        const { healthProgress } = get();
        const recentProgress = healthProgress
          .slice(-days)
          .filter((p) => p.adherenceRate > 0);

        if (recentProgress.length === 0) return 0;

        const totalAdherence = recentProgress.reduce(
          (sum, p) => sum + p.adherenceRate,
          0
        );
        return Math.round(totalAdherence / recentProgress.length);
      },

      reset: () => {
        set({ healthProgress: [] });
      },
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
