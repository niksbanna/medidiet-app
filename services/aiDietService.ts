import { UserProfile, DayPlan, WeeklyPlan, MealItem, NutrientInfo } from '../types/health';
import { GeminiService } from './geminiService';

// Medical condition dietary guidelines
const CONDITION_GUIDELINES = {
  diabetes: {
    carbs: { max: 130, focus: 'complex carbs, low GI' },
    fiber: { min: 25, focus: 'soluble fiber priority' },
    sodium: { max: 2300, focus: 'heart health' },
    notes: ['Monitor carbohydrate intake', 'Choose whole grains', 'Limit processed sugars']
  },
  hypertension: {
    sodium: { max: 1500, focus: 'DASH diet principles' },
    potassium: { min: 3500, focus: 'fruits and vegetables' },
    notes: ['Limit sodium intake', 'Increase potassium-rich foods', 'Moderate alcohol']
  },
  kidney_disease: {
    protein: { max: 0.8, focus: 'per kg body weight' },
    phosphorus: { max: 800, focus: 'limit dairy and processed foods' },
    sodium: { max: 2000, focus: 'fluid balance' },
    notes: ['Monitor protein intake', 'Limit phosphorus', 'Control fluid intake']
  },
  thyroid: {
    iodine: { focus: 'moderate intake' },
    selenium: { focus: 'brazil nuts, fish' },
    notes: ['Consistent meal timing', 'Adequate selenium', 'Monitor soy intake']
  }
};

// Sample meal database for fallback functionality
const MEAL_DATABASE: MealItem[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    portion: '1 cup cooked',
    nutrients: { calories: 220, protein: 8, carbs: 42, fat: 4, fiber: 8, sodium: 2, potassium: 350, calcium: 150, iron: 3 }
  },
  {
    id: '2', 
    name: 'Grilled Salmon',
    portion: '4 oz',
    nutrients: { calories: 280, protein: 39, carbs: 0, fat: 12, fiber: 0, sodium: 75, potassium: 628, calcium: 20, iron: 1 }
  },
  {
    id: '3',
    name: 'Quinoa Salad',
    portion: '1 cup',
    nutrients: { calories: 190, protein: 8, carbs: 32, fat: 3, fiber: 5, sodium: 15, potassium: 290, calcium: 30, iron: 3 }
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    portion: '6 oz',
    nutrients: { calories: 130, protein: 20, carbs: 9, fat: 0, fiber: 0, sodium: 65, potassium: 240, calcium: 200, iron: 0 }
  },
  {
    id: '5',
    name: 'Steamed Broccoli',
    portion: '1 cup',
    nutrients: { calories: 25, protein: 3, carbs: 5, fat: 0, fiber: 2, sodium: 30, potassium: 230, calcium: 40, iron: 1 }
  }
];

export class AIDietService {
  // Calculate daily caloric needs using Mifflin-St Jeor equation
  static calculateCalorieNeeds(profile: UserProfile): number {
    const { age, gender, height, weight, activityLevel } = profile;
    
    let bmr: number;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  }

  // Generate personalized meal plan using AI with fallback
  static async generateWeeklyPlan(profile: UserProfile): Promise<WeeklyPlan> {
    try {
      // Try AI API first
      console.log('[AI DIET SERVICE] Attempting AI API generation...');
      const aiPlan = await GeminiService.generateDietPlan(profile);
      console.log('[AI DIET SERVICE] Successfully generated plan via AI API');
      return aiPlan;
    } catch (error) {
      console.warn('[AI DIET SERVICE] AI API failed, falling back to local generation:', error);
      
      // Fallback to local generation
      return this.generateLocalWeeklyPlan(profile);
    }
  }

  // Local fallback meal plan generation
  private static async generateLocalWeeklyPlan(profile: UserProfile): Promise<WeeklyPlan> {
    console.log('[LOCAL AI] Generating fallback diet plan for:', profile.medicalCondition);
    
    const dailyCalories = this.calculateCalorieNeeds(profile);
    const condition = profile.medicalCondition.toLowerCase().replace(/\s+/g, '_');
    const guidelines = CONDITION_GUIDELINES[condition as keyof typeof CONDITION_GUIDELINES] || {};
    
    const days: DayPlan[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const dayPlan = this.generateDayPlan(
        date.toISOString().split('T')[0],
        dailyCalories,
        condition,
        guidelines
      );
      
      days.push(dayPlan);
    }

    return {
      id: `local_plan_${Date.now()}`,
      weekOf: new Date().toISOString().split('T')[0],
      days,
      condition: profile.medicalCondition,
      generatedAt: new Date()
    };
  }

  private static generateDayPlan(
    date: string, 
    targetCalories: number, 
    condition: string,
    guidelines: any
  ): DayPlan {
    // Distribute calories across meals (breakfast: 25%, lunch: 35%, dinner: 30%, snacks: 10%)
    const breakfast = this.selectMeals(targetCalories * 0.25, 'breakfast', condition);
    const lunch = this.selectMeals(targetCalories * 0.35, 'lunch', condition);
    const dinner = this.selectMeals(targetCalories * 0.30, 'dinner', condition);
    const snacks = this.selectMeals(targetCalories * 0.10, 'snack', condition);

    const totalNutrients = this.calculateTotalNutrients([
      ...breakfast, ...lunch, ...dinner, ...snacks
    ]);

    const medicalGuidelines = guidelines.notes || [
      '⚡ Using offline meal planning - connect to internet for AI-powered recommendations',
      'Consult healthcare provider before making dietary changes',
      'Monitor your body\'s response to new foods'
    ];

    return {
      date,
      breakfast,
      lunch,
      dinner,
      snacks,
      totalNutrients,
      medicalGuidelines
    };
  }

  private static selectMeals(targetCalories: number, mealType: string, condition: string): MealItem[] {
    // Local meal selection logic - simple filtering based on condition
    const availableMeals = MEAL_DATABASE.filter(meal => {
      // Basic condition-based filtering
      if (condition === 'hypertension' && meal.nutrients.sodium > 300) return false;
      if (condition === 'diabetes' && meal.nutrients.carbs > 30) return false;
      return true;
    });

    const selectedMeals: MealItem[] = [];
    let currentCalories = 0;

    // Simple selection algorithm
    for (const meal of availableMeals) {
      if (currentCalories + meal.nutrients.calories <= targetCalories + 50) {
        selectedMeals.push({
          ...meal,
          medicalNotes: this.getMedicalNotes(meal, condition)
        });
        currentCalories += meal.nutrients.calories;
        
        if (selectedMeals.length >= 2) break; // Limit meals per type
      }
    }

    return selectedMeals;
  }

  private static getMedicalNotes(meal: MealItem, condition: string): string {
    const notes: string[] = [];
    
    if (condition === 'diabetes' && meal.nutrients.fiber >= 5) {
      notes.push('High fiber - helps blood sugar control');
    }
    if (condition === 'hypertension' && meal.nutrients.potassium >= 300) {
      notes.push('Potassium-rich - supports heart health');
    }
    if (condition === 'kidney_disease' && meal.nutrients.protein <= 10) {
      notes.push('Moderate protein - kidney-friendly');
    }

    return notes.join(' • ');
  }

  private static calculateTotalNutrients(meals: MealItem[]): NutrientInfo {
    return meals.reduce((total, meal) => ({
      calories: total.calories + meal.nutrients.calories,
      protein: total.protein + meal.nutrients.protein,
      carbs: total.carbs + meal.nutrients.carbs,
      fat: total.fat + meal.nutrients.fat,
      fiber: total.fiber + meal.nutrients.fiber,
      sodium: total.sodium + meal.nutrients.sodium,
      potassium: total.potassium + meal.nutrients.potassium,
      calcium: total.calcium + meal.nutrients.calcium,
      iron: total.iron + meal.nutrients.iron,
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
      sodium: 0, potassium: 0, calcium: 0, iron: 0
    });
  }
}