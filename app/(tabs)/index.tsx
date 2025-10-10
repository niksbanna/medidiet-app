import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useHealth } from '../../hooks/useHealth';
import { AIDietService } from '../../services/aiDietService';
import NutrientBar from '../../components/ui/NutrientBar';
import MedicalDisclaimer from '../../components/ui/MedicalDisclaimer';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { userProfile, currentPlan, mealLogs, healthProgress, getAdherenceRate } = useHealth();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialIcons name="person-add" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Complete onboarding to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dailyCalories = AIDietService.calculateCalorieNeeds(userProfile);
  const todayLogs = mealLogs.filter(log => 
    log.date === new Date().toISOString().split('T')[0]
  );
  
  const todayCalories = todayLogs.reduce((sum, log) => 
    sum + log.items.reduce((itemSum, item) => itemSum + item.nutrients.calories, 0), 0
  );

  const adherenceRate = getAdherenceRate(7);
  const weeklyProgress = healthProgress.slice(-7);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0066CC', '#0052A3']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Hello, {userProfile.name}! 👋</Text>
            <Text style={styles.subtitle}>Managing {userProfile.medicalCondition}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
            <MaterialIcons name="person" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.animatedContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            }
          ]}
        >

          {/* Today's Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            
            <View style={styles.statsContainer}>
              <StatCard
                icon="local-fire-department"
                title="Calories"
                value={`${Math.round(todayCalories)}`}
                target={`/${Math.round(dailyCalories)}`}
                color="#FF6B6B"
              />
              <StatCard
                icon="restaurant"
                title="Meals Logged"
                value={`${todayLogs.length}`}
                target="/4"
                color="#4ECDC4"
              />
              <StatCard
                icon="trending-up"
                title="Adherence"
                value={`${adherenceRate}%`}
                target=""
                color="#45B7D1"
              />
            </View>

            {/* Calorie Progress Bar */}
            <View style={styles.progressSection}>
              <NutrientBar
                label="Daily Calories"
                current={todayCalories}
                target={dailyCalories}
                unit="kcal"
                color="#0066CC"
                warning={todayCalories > dailyCalories * 1.1}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionsContainer}>
              <ActionCard
                icon="restaurant-menu"
                title="View Meal Plan"
                subtitle="Today's recommended meals"
                onPress={() => router.push('/(tabs)/plan')}
                color="#0066CC"
              />
              <ActionCard
                icon="add-circle"
                title="Log Meal"
                subtitle="Track what you ate"
                onPress={() => router.push('/(tabs)/log')}
                color="#4CAF50"
              />
            </View>
          </View>

          {/* Health Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Insights</Text>
            
            <LinearGradient
              colors={['#0066CC', '#0052A3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightCard}
            >
              <View style={styles.insightHeader}>
                <MaterialIcons name="psychology" size={24} color="#FFFFFF" />
                <Text style={styles.insightTitle}>AI Recommendation</Text>
              </View>
              
              <Text style={styles.insightText}>
                {getHealthInsight(userProfile.medicalCondition, adherenceRate, todayCalories, dailyCalories)}
              </Text>
              
              <View style={styles.disclaimerContainer}>
                <MedicalDisclaimer compact />
              </View>
            </LinearGradient>
          </View>

          {/* Weekly Trends */}
          {weeklyProgress.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Trends</Text>
              
              <View style={styles.trendsContainer}>
                <View style={styles.trendItem}>
                  <Text style={styles.trendLabel}>Average Adherence</Text>
                  <Text style={styles.trendValue}>{adherenceRate}%</Text>
                </View>
                <View style={styles.trendItem}>
                  <Text style={styles.trendLabel}>Days Tracked</Text>
                  <Text style={styles.trendValue}>{weeklyProgress.length}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Medical Reminders */}
          <View style={[styles.section, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            
            <View style={styles.reminderCard}>
              <MaterialIcons name="schedule" size={20} color="#FF9500" />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>Stay Hydrated</Text>
                <Text style={styles.reminderText}>Drink water regularly throughout the day</Text>
              </View>
            </View>
            
            <View style={styles.reminderCard}>
              <MaterialIcons name="medical-services" size={20} color="#FF6B6B" />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>Medication Timing</Text>
                <Text style={styles.reminderText}>Take medications as prescribed by your doctor</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
interface StatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  value: string;
  target: string;
  color: string;
}

function StatCard({ icon, title, value, target, color }: StatCardProps) {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.statCard}
    >
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTarget}>{target}</Text>
      </View>
    </LinearGradient>
  );
}

interface ActionCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  color: string;
}

function ActionCard({ icon, title, subtitle, onPress, color }: ActionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.actionCard}
      >
        <View style={[styles.actionIcon, { backgroundColor: `${color}15` }]}>
          <MaterialIcons name={icon} size={28} color={color} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={18} color="#0066CC" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// Helper Functions
function getHealthInsight(condition: string, adherence: number, consumed: number, target: number): string {
  const insights: Record<string, { high: string; medium: string; low: string }> = {
    diabetes: {
      high: "Great blood sugar management! Keep focusing on complex carbohydrates and fiber-rich foods.",
      medium: "Consider smaller, more frequent meals to help maintain steady blood sugar levels.",
      low: "Consistent meal timing is crucial for diabetes management. Try setting meal reminders."
    },
    hypertension: {
      high: "Excellent adherence! Continue limiting sodium and emphasizing potassium-rich foods.",
      medium: "Focus on the DASH diet principles: more fruits, vegetables, and whole grains.",
      low: "Consistent nutrition helps manage blood pressure. Consider meal prep for easier adherence."
    },
    default: {
      high: "Outstanding nutrition adherence! Your consistent approach supports your health goals.",
      medium: "Good progress! Small daily improvements in nutrition can have significant health benefits.",
      low: "Every step counts in nutrition management. Consider starting with one meal at a time."
    }
  };

  const conditionInsights = insights[condition.toLowerCase().replace(/\s+/g, '_')] || insights.default;
  
  if (adherence >= 80) return conditionInsights.high;
  if (adherence >= 60) return conditionInsights.medium;
  return conditionInsights.low;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  animatedContent: {
    flex: 1,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    width: (width - 60) / 3,
    elevation: 6,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statTarget: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  progressSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    elevation: 5,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  insightText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  disclaimerContainer: {
    marginTop: 4,
  },
  trendsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trendItem: {
    flex: 1,
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  trendValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  reminderContent: {
    flex: 1,
    marginLeft: 14,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});