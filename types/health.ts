export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  medicalCondition: string; // Slug key (e.g., 'diabetes', 'hypertension')
  medicalConditionDisplay?: string; // Display name (e.g., 'Diabetes Type 2', 'Hypertension')
  allergies: string[];
  dietaryRestrictions: string[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  createdAt: Date;
  updatedAt: Date;
}

export interface NutrientInfo {
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  sodium: number; // mg
  potassium: number; // mg
  calcium: number; // mg
  iron: number; // mg
}

export interface MealItem {
  id: string;
  name: string;
  portion: string;
  nutrients: NutrientInfo;
  medicalNotes?: string;
  isFavorite?: boolean;
}

export interface DayPlan {
  date: string;
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
  totalNutrients: NutrientInfo;
  medicalGuidelines: string[];
}

export interface WeeklyPlan {
  id: string;
  weekOf: string;
  days: DayPlan[];
  condition: string;
  generatedAt: Date;
}

export interface MealLog {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealItem[];
  adherenceRating: number; // 0-10
  notes?: string;
  loggedAt: Date;
}

export interface HealthProgress {
  date: string;
  weight?: number;
  adherenceRate: number;
  caloriesConsumed: number;
  caloriesTarget: number;
}