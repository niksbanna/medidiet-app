import { useUserStore } from '../stores/useUserStore';
import { usePlanStore } from '../stores/usePlanStore';
import { useJournalStore } from '../stores/useJournalStore';
import { useHealthStore } from '../stores/useHealthStore';

export function useHealth() {
  const userStore = useUserStore();
  const planStore = usePlanStore();
  const journalStore = useJournalStore();
  const healthStore = useHealthStore();

  const logout = async () => {
    userStore.reset();
    planStore.reset();
    journalStore.reset();
    healthStore.reset();
  };

  return {
    // User Profile
    userProfile: userStore.userProfile,
    isLoading: userStore.isLoading,
    updateUserProfile: userStore.updateUserProfile,
    clearUserProfile: userStore.clearUserProfile,
    
    // API Keys
    updateGeminiApiKey: userStore.updateGeminiApiKey,
    getGeminiApiKey: userStore.getGeminiApiKey,
    updateOpenAIApiKey: userStore.updateOpenAIApiKey,
    getOpenAIApiKey: userStore.getOpenAIApiKey,
    updatePreferredAiProvider: userStore.updatePreferredAiProvider,
    getPreferredAiProvider: userStore.getPreferredAiProvider,

    // Diet Plan
    currentPlan: planStore.currentPlan,
    setCurrentPlan: usePlanStore((state) => state.setCurrentPlan),
    clearCurrentPlan: usePlanStore((state) => state.clearCurrentPlan),
    updateMealInPlan: usePlanStore((state) => state.updateMealInPlan),

    // Meal Logs & Favorites
    mealLogs: useJournalStore((state) => state.mealLogs),
    favoriteMeals: journalStore.favoriteMeals,
    addMealLog: journalStore.addMealLog,
    updateMealLog: journalStore.updateMealLog,
    deleteMealLog: journalStore.deleteMealLog,
    toggleFavoriteMeal: journalStore.toggleFavoriteMeal,

    // Health Progress
    healthProgress: healthStore.healthProgress,
    addHealthProgress: healthStore.addHealthProgress,
    getAdherenceRate: healthStore.getAdherenceRate,

    // Logout
    logout,
  };
}