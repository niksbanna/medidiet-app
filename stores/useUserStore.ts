import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/health';

interface UserState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  
  // Actions
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  clearUserProfile: () => Promise<void>;
  
  // API Key Management
  updateGeminiApiKey: (apiKey: string) => Promise<void>;
  getGeminiApiKey: () => string | null;
  updateOpenAIApiKey: (apiKey: string) => Promise<void>;
  getOpenAIApiKey: () => string | null;
  updatePreferredAiProvider: (provider: 'gemini' | 'openai') => Promise<void>;
  getPreferredAiProvider: () => 'gemini' | 'openai' | undefined;
  
  // Reset
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      isLoading: false,

      updateUserProfile: async (profile) => {
        set({ userProfile: profile });
      },

      clearUserProfile: async () => {
        set({ userProfile: null });
      },

      updateGeminiApiKey: async (apiKey) => {
        const { userProfile } = get();
        if (!userProfile) return;
        set({ 
          userProfile: { 
            ...userProfile, 
            geminiApiKey: apiKey, 
            updatedAt: new Date() 
          } 
        });
      },

      getGeminiApiKey: () => {
        return get().userProfile?.geminiApiKey || null;
      },

      updateOpenAIApiKey: async (apiKey) => {
        const { userProfile } = get();
        if (!userProfile) return;
        set({ 
          userProfile: { 
            ...userProfile, 
            openAIApiKey: apiKey, 
            updatedAt: new Date() 
          } 
        });
      },

      getOpenAIApiKey: () => {
        return get().userProfile?.openAIApiKey || null;
      },

      updatePreferredAiProvider: async (provider) => {
        const { userProfile } = get();
        if (!userProfile) return;
        set({ 
          userProfile: { 
            ...userProfile, 
            preferredAiProvider: provider, 
            updatedAt: new Date() 
          } 
        });
      },

      getPreferredAiProvider: () => {
        return get().userProfile?.preferredAiProvider;
      },

      reset: () => {
        set({ userProfile: null, isLoading: false });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
