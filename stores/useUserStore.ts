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
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from v0 to v1: Convert single medicalCondition to array
          const state = persistedState as UserState;
          if (state.userProfile) {
            const oldProfile = state.userProfile as any;
            if (oldProfile.medicalCondition && !oldProfile.medicalConditions) {
              state.userProfile = {
                ...state.userProfile,
                medicalConditions: [oldProfile.medicalCondition],
                medicalConditionsDisplay: oldProfile.medicalConditionDisplay 
                  ? [oldProfile.medicalConditionDisplay] 
                  : [oldProfile.medicalCondition],
              };
              // Remove old fields if possible, or just ignore them
              delete (state.userProfile as any).medicalCondition;
              delete (state.userProfile as any).medicalConditionDisplay;
            }
          }
          return state;
        }
        return persistedState;
      },
    }
  )
);
