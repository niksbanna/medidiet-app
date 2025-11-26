import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncRequest {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data?: any;
  timestamp: number;
  retryCount: number;
}

interface SyncState {
  queue: SyncRequest[];
  isOnline: boolean;
  addToQueue: (request: Omit<SyncRequest, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setOnlineStatus: (status: boolean) => void;
  incrementRetry: (id: string) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      queue: [],
      isOnline: true,
      addToQueue: (request) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              ...request,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: Date.now(),
              retryCount: 0,
            },
          ],
        })),
      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((req) => req.id !== id),
        })),
      clearQueue: () => set({ queue: [] }),
      setOnlineStatus: (status) => set({ isOnline: status }),
      incrementRetry: (id) =>
        set((state) => ({
          queue: state.queue.map((req) =>
            req.id === id ? { ...req, retryCount: req.retryCount + 1 } : req
          ),
        })),
    }),
    {
      name: 'medidiet-sync-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ queue: state.queue }), // Only persist the queue
    }
  )
);
