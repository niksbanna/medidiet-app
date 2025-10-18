import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useHealth } from '../../hooks/useHealth';
import { AIDietService } from '../../services/aiDietService';
import { DayPlan, MealItem } from '../../types/health';
import NutrientBar from '../../components/ui/NutrientBar';
import MedicalDisclaimer from '../../components/ui/MedicalDisclaimer';
import AILoader from '../../components/ui/AILoader';
import { showToast, showErrorToast } from '../../utils/toast';

export default function MealPlanScreen() {
  const { userProfile, currentPlan, setCurrentPlan } = useHealth();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'offline'>('unknown');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedDay]);

  const generateNewPlan = async () => {
    if (!userProfile) return;

    setIsGenerating(true);
    setApiStatus('unknown');
    
    try {
      console.log('[MEAL PLAN] Starting AI generation...');
      const newPlan = await AIDietService.generateWeeklyPlan(userProfile);
      
      // Check if this was generated via AI API or local fallback
      const isAIGenerated = newPlan.id.startsWith('ai_plan_');
      setApiStatus(isAIGenerated ? 'connected' : 'offline');
      
      await setCurrentPlan(newPlan);
      
      if (isAIGenerated) {
        showToast('AI-Powered Plan Ready to use!');
      } else {
        showToast('⚡ Offline Plan Generated.');
      }
    } catch (error) {
      console.error('[MEAL PLAN] Generation failed:', error);
      setApiStatus('offline');
      showErrorToast('Unable to generate meal plan. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onRefresh = async () => {
  setRefreshing(true);
  try {
    await generateNewPlan();
  } catch (error) {
    console.error('[REFRESH] Failed to refresh plan:', error);
  } finally {
    setRefreshing(false);
  }
};


  useEffect(() => {
    if (userProfile && !currentPlan) {
      generateNewPlan();
    }
  }, [userProfile]);

  // Determine current plan source
  useEffect(() => {
    if (currentPlan) {
      const isAIPlan = currentPlan.id.startsWith('ai_plan_');
      setApiStatus(isAIPlan ? 'connected' : 'offline');
    }
  }, [currentPlan]);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialIcons name="person-add" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Complete your profile to generate meal plans</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPlan && !isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialIcons name="restaurant-menu" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No meal plan available</Text>
          <TouchableOpacity style={styles.generateButton} onPress={generateNewPlan}>
            <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <AILoader 
          message="AI is creating your personalized meal plan"
          subMessage={`Analyzing your ${userProfile?.medicalCondition} requirements`}
        />
      </SafeAreaView>
    );
  }

  const todayPlan = currentPlan?.days[selectedDay];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0066CC', '#0052A3']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Meal Plan 🍽️</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Personalized for {userProfile.medicalCondition}</Text>
              {apiStatus === 'connected' && (
                <View style={styles.aiIndicator}>
                  <MaterialIcons name="psychology" size={14} color="#FFFFFF" />
                  <Text style={styles.aiText}>AI-Powered</Text>
                </View>
              )}
              {apiStatus === 'offline' && (
                <View style={styles.offlineIndicator}>
                  <MaterialIcons name="wifi-off" size={14} color="#FFD700" />
                  <Text style={styles.offlineIndicatorText}>Offline Mode</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.regenerateButton} onPress={generateNewPlan}>
            <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0066CC']} tintColor="#0066CC" />}
        showsVerticalScrollIndicator={false}
      >

        {/* Day Selector */}
        <View style={styles.daySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentPlan?.days.map((day, index) => {
              const date = new Date(day.date);
              const dayName = dayNames[date.getDay()];
              const isSelected = selectedDay === index;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                    {dayName.slice(0, 3)}
                  </Text>
                  <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {todayPlan && (
            <>
              {/* Medical Guidelines */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medical Guidelines</Text>
                <LinearGradient
                  colors={['#E6F3FF', '#D1E7FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.guidelinesContainer}
                >
                  {todayPlan.medicalGuidelines.map((guideline, index) => (
                    <View key={index} style={styles.guidelineItem}>
                      <MaterialIcons name="verified" size={18} color="#0066CC" />
                      <Text style={styles.guidelineText}>{guideline}</Text>
                    </View>
                  ))}
                </LinearGradient>
              </View>

            {/* Daily Nutrition Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Nutrition Target</Text>
              <View style={styles.nutritionCard}>
                <NutrientBar
                  label="Calories"
                  current={todayPlan.totalNutrients.calories}
                  target={AIDietService.calculateCalorieNeeds(userProfile)}
                  unit="kcal"
                  color="#0066CC"
                />
                <NutrientBar
                  label="Protein"
                  current={todayPlan.totalNutrients.protein}
                  target={userProfile.weight * 1.2}
                  unit="g"
                  color="#4CAF50"
                />
                <NutrientBar
                  label="Carbohydrates"
                  current={todayPlan.totalNutrients.carbs}
                  target={todayPlan.totalNutrients.calories * 0.45 / 4}
                  unit="g"
                  color="#FF9800"
                />
                <NutrientBar
                  label="Fiber"
                  current={todayPlan.totalNutrients.fiber}
                  target={25}
                  unit="g"
                  color="#8BC34A"
                />
                <NutrientBar
                  label="Sodium"
                  current={todayPlan.totalNutrients.sodium}
                  target={2300}
                  unit="mg"
                  color="#FF5722"
                  warning={todayPlan.totalNutrients.sodium > 2000}
                />
              </View>
            </View>

            {/* Meals */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Meals</Text>
              
              <MealSection title="Breakfast" icon="wb-sunny" meals={todayPlan.breakfast} />
              <MealSection title="Lunch" icon="wb-cloudy" meals={todayPlan.lunch} />
              <MealSection title="Dinner" icon="brightness-3" meals={todayPlan.dinner} />
              <MealSection title="Snacks" icon="local-cafe" meals={todayPlan.snacks} />
            </View>

              {/* Medical Disclaimer */}
              <View style={[styles.section, { marginBottom: 20 }]}>
                <MedicalDisclaimer />
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MealSectionProps {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  meals: MealItem[];
}

function MealSection({ title, icon, meals }: MealSectionProps) {
  if (meals.length === 0) return null;

  const iconColors: Record<string, string> = {
    'Breakfast': '#FF9800',
    'Lunch': '#4CAF50',
    'Dinner': '#9C27B0',
    'Snacks': '#FF5722'
  };

  const iconColor = iconColors[title] || '#0066CC';

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.mealSection}
    >
      <View style={styles.mealHeader}>
        <View style={[styles.mealIconContainer, { backgroundColor: `${iconColor}15` }]}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        <Text style={styles.mealTitle}>{title}</Text>
        <View style={styles.mealCount}>
          <Text style={styles.mealCountText}>{meals.length}</Text>
        </View>
      </View>
      
      {meals.map((meal, index) => (
        <View key={index} style={[styles.mealItem, index === meals.length - 1 && styles.mealItemLast]}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealPortion}>{meal.portion}</Text>
            {meal.medicalNotes && (
              <View style={styles.medicalNotesContainer}>
                <MaterialIcons name="local-hospital" size={12} color="#0066CC" />
                <Text style={styles.medicalNotes}>{meal.medicalNotes}</Text>
              </View>
            )}
          </View>
          <View style={styles.mealNutrition}>
            <View style={styles.caloriesBadge}>
              <Text style={styles.calories}>{Math.round(meal.nutrients.calories)}</Text>
              <Text style={styles.caloriesLabel}>cal</Text>
            </View>
            <Text style={styles.macros}>
              P: {Math.round(meal.nutrients.protein)}g • C: {Math.round(meal.nutrients.carbs)}g • F: {Math.round(meal.nutrients.fat)}g
            </Text>
          </View>
        </View>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 8,
    fontWeight: '500',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  aiText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 4,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  offlineIndicatorText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '700',
    marginLeft: 4,
  },
  regenerateButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#0066CC',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  offlineText: {
    fontSize: 12,
    color: '#FF9500',
    marginLeft: 4,
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#0066CC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 6,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  daySelector: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  dayButton: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayButtonSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dayText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
  },
  dayTextSelected: {
    color: 'white',
  },
  dateText: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  dateTextSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  guidelinesContainer: {
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  mealIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  mealCount: {
    backgroundColor: '#0066CC',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCountText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mealItemLast: {
    borderBottomWidth: 0,
  },
  mealInfo: {
    flex: 1,
    marginRight: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  mealPortion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  medicalNotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  medicalNotes: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
    marginLeft: 4,
  },
  mealNutrition: {
    alignItems: 'flex-end',
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
  },
  calories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  caloriesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
    marginLeft: 2,
  },
  macros: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
});