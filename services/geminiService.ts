import { UserProfile, DayPlan, WeeklyPlan, MealItem, NutrientInfo } from '../types/health';

// AI API configuration
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static validateApiKey(): boolean {
    if (!GEMINI_API_KEY) {
      console.warn('AI API key not found. Please add EXPO_PUBLIC_GEMINI_API_KEY to your environment variables.');
      return false;
    }
    return true;
  }

  static async generateDietPlan(userProfile: UserProfile): Promise<WeeklyPlan> {
    if (!this.validateApiKey()) {
      throw new Error('AI API key not configured');
    }

    try {
      const prompt = this.createMedicalDietPrompt(userProfile);
      const response = await this.callGeminiAPI(prompt);
      const parsedPlan = this.parseDietPlanResponse(response, userProfile);
      
      return parsedPlan;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate diet plan. Please try again.');
    }
  }

  private static createMedicalDietPrompt(profile: UserProfile): string {
    const bmr = this.calculateBMR(profile);
    const dailyCalories = Math.round(bmr * this.getActivityMultiplier(profile.activityLevel));

    return `You are a clinical nutritionist AI creating a 7-day meal plan for a patient with ${profile.medicalCondition}.

PATIENT PROFILE:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Height: ${profile.height}cm, Weight: ${profile.weight}kg
- Medical Condition: ${profile.medicalCondition}
- Activity Level: ${profile.activityLevel}
- Daily Calorie Target: ${dailyCalories} kcal
- Food Allergies: ${profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}
- Dietary Restrictions: ${profile.dietaryRestrictions.length > 0 ? profile.dietaryRestrictions.join(', ') : 'None'}

MEDICAL REQUIREMENTS FOR ${profile.medicalCondition.toUpperCase()}:
${this.getMedicalGuidelines(profile.medicalCondition)}

RESPONSE FORMAT REQUIRED (JSON):
{
  "weeklyPlan": {
    "condition": "${profile.medicalCondition}",
    "days": [
      {
        "date": "2024-01-01",
        "breakfast": [
          {
            "name": "Oatmeal with Berries",
            "portion": "1 cup cooked",
            "nutrients": {
              "calories": 220,
              "protein": 8,
              "carbs": 42,
              "fat": 4,
              "fiber": 8,
              "sodium": 2,
              "potassium": 350,
              "calcium": 150,
              "iron": 3
            },
            "medicalNotes": "High fiber supports blood sugar control"
          }
        ],
        "lunch": [...],
        "dinner": [...],
        "snacks": [...],
        "medicalGuidelines": [
          "Monitor carbohydrate portions at each meal",
          "Include protein with every meal for blood sugar stability"
        ]
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
1. All nutrition values must be realistic and evidence-based
2. Include 2-3 medical guidelines per day specific to ${profile.medicalCondition}
3. Ensure total daily calories are within ±100 of ${dailyCalories}
4. Avoid foods contraindicated for ${profile.medicalCondition}
5. Include medicalNotes for foods that specifically benefit the condition
6. Provide exactly 7 days of meal plans
7. Each day should have breakfast, lunch, dinner, and snacks arrays
8. All dates should be consecutive starting from today

MEDICAL DISCLAIMER: This is advisory nutritional guidance. Patient should consult healthcare provider before making dietary changes.`;
  }

  private static getMedicalGuidelines(condition: string): string {
    const guidelines: { [key: string]: string } = {
      'diabetes': `
- Limit simple carbohydrates and focus on complex carbs with low glycemic index
- Include fiber-rich foods to slow glucose absorption
- Maintain consistent meal timing
- Limit sodium to <2300mg/day for cardiovascular health
- Include omega-3 fatty acids for inflammation reduction`,
      
      'hypertension': `
- Follow DASH diet principles with high potassium (3500mg+/day)
- Strict sodium restriction <1500mg/day
- Emphasize fruits, vegetables, whole grains, lean proteins
- Limit saturated fats and processed foods
- Include magnesium-rich foods for blood pressure support`,
      
      'kidney_disease': `
- Protein restriction to 0.8g/kg body weight to reduce kidney burden
- Limit phosphorus <800mg/day and avoid high-phosphorus foods
- Control potassium based on lab values
- Moderate sodium <2000mg/day for fluid balance
- Monitor fluid intake as recommended by nephrologist`,
      
      'thyroid_disorder': `
- Ensure adequate iodine but avoid excessive amounts
- Include selenium-rich foods (Brazil nuts, fish) for thyroid function
- Maintain consistent meal timing for medication absorption
- Include iron-rich foods if hypothyroid
- Limit goitrogenic foods if indicated`,
      
      'heart_disease': `
- Mediterranean diet pattern with emphasis on olive oil
- Limit saturated fat <7% of calories, trans fat <1%
- Include omega-3 fatty acids 2-3 times per week
- High fiber intake for cholesterol management
- Limit sodium <2000mg/day for heart health`,

      'celiac_disease': `
- Strict avoidance of all gluten-containing foods (wheat, barley, rye)
- Focus on naturally gluten-free whole foods
- Ensure adequate fiber from gluten-free sources
- Monitor for cross-contamination in food preparation
- Include nutrient-dense foods to prevent deficiencies from restricted diet`,

      'ibs': `
- Identify and limit individual trigger foods through elimination diet
- Consider low FODMAP approach as recommended by healthcare provider
- Maintain regular meal timing and eating patterns
- Stay well hydrated throughout the day
- Include soluble fiber as tolerated to regulate bowel function`,

      'pcos': `
- Focus on low glycemic index foods to manage insulin resistance
- Include anti-inflammatory foods rich in antioxidants
- Maintain consistent protein intake (25-30% of calories)
- Limit processed foods and added sugars
- Include healthy fats from plant sources for hormone regulation`
    };

    // The condition should already be in slug format from the onboarding process
    return guidelines[condition] || guidelines['diabetes']; // Default to diabetes guidelines
  }

  private static calculateBMR(profile: UserProfile): number {
    const { age, gender, height, weight } = profile;
    
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }

  private static getActivityMultiplier(activityLevel: string): number {
    const multipliers: { [key: string]: number } = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };
    return multipliers[activityLevel] || 1.55;
  }

  private static async callGeminiAPI(prompt: string): Promise<string> {
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent medical advice
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('AI API Error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from AI API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  private static parseDietPlanResponse(response: string, profile: UserProfile): WeeklyPlan {
    try {
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      const weeklyPlanData = parsedData.weeklyPlan || parsedData;

      // Validate and structure the response
      const days: DayPlan[] = weeklyPlanData.days.map((day: any, index: number) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        
        return {
          date: date.toISOString().split('T')[0],
          breakfast: this.validateMealItems(day.breakfast || []),
          lunch: this.validateMealItems(day.lunch || []),
          dinner: this.validateMealItems(day.dinner || []),
          snacks: this.validateMealItems(day.snacks || []),
          totalNutrients: this.calculateTotalNutrients([
            ...day.breakfast || [],
            ...day.lunch || [],
            ...day.dinner || [],
            ...day.snacks || []
          ]),
          medicalGuidelines: day.medicalGuidelines || [
            'Consult your healthcare provider before making dietary changes',
            'Monitor your body\'s response to new foods',
            'Maintain consistent meal timing'
          ]
        };
      });

      return {
        id: `ai_plan_${Date.now()}`,
        weekOf: new Date().toISOString().split('T')[0],
        days,
        condition: profile.medicalCondition,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response. Please try generating again.');
    }
  }

  private static validateMealItems(items: any[]): MealItem[] {
    return items.map((item: any, index: number) => ({
      id: `meal_${Date.now()}_${index}`,
      name: item.name || 'Unknown Food',
      portion: item.portion || '1 serving',
      nutrients: {
        calories: Number(item.nutrients?.calories) || 0,
        protein: Number(item.nutrients?.protein) || 0,
        carbs: Number(item.nutrients?.carbs) || 0,
        fat: Number(item.nutrients?.fat) || 0,
        fiber: Number(item.nutrients?.fiber) || 0,
        sodium: Number(item.nutrients?.sodium) || 0,
        potassium: Number(item.nutrients?.potassium) || 0,
        calcium: Number(item.nutrients?.calcium) || 0,
        iron: Number(item.nutrients?.iron) || 0,
      },
      medicalNotes: item.medicalNotes || undefined
    }));
  }

  private static calculateTotalNutrients(meals: any[]): NutrientInfo {
    return meals.reduce((total: NutrientInfo, meal: any) => ({
      calories: total.calories + (meal.nutrients?.calories || 0),
      protein: total.protein + (meal.nutrients?.protein || 0),
      carbs: total.carbs + (meal.nutrients?.carbs || 0),
      fat: total.fat + (meal.nutrients?.fat || 0),
      fiber: total.fiber + (meal.nutrients?.fiber || 0),
      sodium: total.sodium + (meal.nutrients?.sodium || 0),
      potassium: total.potassium + (meal.nutrients?.potassium || 0),
      calcium: total.calcium + (meal.nutrients?.calcium || 0),
      iron: total.iron + (meal.nutrients?.iron || 0),
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
      sodium: 0, potassium: 0, calcium: 0, iron: 0
    });
  }
}