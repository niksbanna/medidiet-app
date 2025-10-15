# GitHub Copilot Instructions for MediDiet AI

## Project Overview

MediDiet AI is a React Native mobile application built with Expo that provides AI-powered personalized nutrition management for individuals with medical conditions such as diabetes, hypertension, kidney disease, and other health conditions.

### Purpose
- Generate personalized weekly meal plans using Google Gemini AI
- Track daily meal intake and adherence to dietary plans
- Provide medical-condition-specific nutritional guidance
- Monitor health metrics and progress over time

## Tech Stack

### Core Technologies
- **React Native**: 0.79.3
- **Expo**: ~53.0.9 with Expo Router for navigation
- **TypeScript**: 5.8.3 (strict mode enabled)
- **Node.js**: v18 or higher

### Key Libraries
- **expo-router**: File-based routing system
- **@react-native-async-storage/async-storage**: Local data persistence
- **expo-linear-gradient**: UI gradients
- **@expo/vector-icons (MaterialIcons)**: Icon system
- **react-native-safe-area-context**: Safe area handling

### AI Integration
- **Google Gemini API**: AI-powered meal plan generation via `gemini-2.0-flash-exp` model
- **Fallback System**: Local meal generation when API is unavailable

## Project Structure

```
medidiet-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Dashboard/Home screen
│   │   ├── plan.tsx       # Meal plan screen
│   │   ├── log.tsx        # Meal logging screen
│   │   ├── profile.tsx    # User profile screen
│   │   └── _layout.tsx    # Tab layout configuration
│   ├── onboarding.tsx     # Multi-step onboarding flow
│   ├── index.tsx          # Root entry screen
│   └── _layout.tsx        # Root layout
├── components/
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
│   └── HealthContext.tsx  # Global health state management
├── hooks/                 # Custom React hooks
│   └── useHealth.tsx      # Health context hook
├── services/              # Business logic and API services
│   ├── aiDietService.ts   # Diet plan generation with fallback
│   └── geminiService.ts   # Google Gemini API integration
├── types/                 # TypeScript type definitions
│   └── health.ts          # Health-related interfaces
├── utils/                 # Utility functions
│   └── toast.ts           # Toast notification helpers
└── constants/             # App-wide constants
    └── Colors.ts          # Color scheme definitions
```

## Coding Standards

### TypeScript
- **Always use TypeScript**: No plain JavaScript files (.js)
- **Strict mode enabled**: All TypeScript strict checks are active
- **Type safety**: Always provide explicit types for function parameters and return values
- **Interface over type**: Prefer `interface` for object shapes, use `type` for unions/intersections
- **No `any` type**: Use proper types or `unknown` if type is truly unknown

### React Native / React Conventions
- **Functional Components**: Use function components with hooks, no class components
- **Hooks**: Follow React hooks rules (useEffect, useState, useContext, custom hooks)
- **File naming**: 
  - Components: PascalCase (e.g., `MealPlanScreen.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useHealth.tsx`)
  - Services: camelCase (e.g., `aiDietService.ts`)
  - Types: camelCase (e.g., `health.ts`)
- **Component structure**:
  ```tsx
  import statements
  
  interfaces/types
  
  constants
  
  main component
  
  helper components (if any)
  
  styles
  ```

### Styling
- **StyleSheet API**: Use React Native's `StyleSheet.create()` for component styles
- **No inline styles**: Avoid inline style objects except for dynamic values
- **Design system**:
  - Headers: 28px, Bold
  - Titles: 20px, Bold  
  - Body: 15px, Medium
  - Small: 13px, Regular
- **Color scheme**:
  - Primary: `#0066CC` (blue)
  - Success: `#4CAF50` (green)
  - Warning: `#FF9800` (orange)
  - Error: `#FF6B6B` (red)
  - Background: `#F5F7FA`
- **Meal type colors**:
  - Breakfast: Orange/Yellow
  - Lunch: Green
  - Dinner: Blue/Purple
  - Snacks: Pink/Red

### Component Patterns
- **SafeAreaView**: Always wrap screens with `SafeAreaView` from `react-native-safe-area-context`
- **KeyboardAvoidingView**: Use for screens with input fields
- **ScrollView**: Use for scrollable content with `refreshControl` for pull-to-refresh
- **Loading states**: Show `AILoader` component during async operations
- **Error handling**: Use toast notifications for user feedback

### State Management
- **Context API**: Use React Context for global state (HealthContext)
- **Local state**: Use `useState` for component-local state
- **AsyncStorage**: Use for data persistence (user profile, meal plans, logs)
- **State updates**: Always immutable updates, use spreading operators

## Medical and AI Guidelines

### Medical Safety
- **Disclaimers**: Always show medical disclaimers when displaying health advice
- **Data validation**: Validate all health-related inputs (age, weight, height, etc.)
- **Condition-specific**: Respect medical condition constraints in all features
- **Not medical advice**: Make it clear that the app provides educational guidance, not medical advice

### AI Integration
- **API key security**: Use environment variables (`EXPO_PUBLIC_GEMINI_API_KEY`)
- **Fallback mechanism**: Always provide local fallback when AI API fails
- **Error handling**: Gracefully handle API failures with user-friendly messages
- **Temperature**: Use low temperature (0.3) for consistent medical recommendations
- **Prompt engineering**: Be specific about medical conditions and dietary requirements in prompts
- **Response parsing**: Validate and sanitize all AI responses before using

### Data Handling
- **Privacy first**: All data stored locally, no cloud sync (currently)
- **Sensitive data**: Handle medical information with care
- **Input validation**: Validate all user inputs, especially numerical health metrics
- **Data consistency**: Ensure data structure matches TypeScript interfaces

## Testing and Quality

### Linting
```bash
pnpm lint
# or
npm run lint
```
- Uses `eslint-config-expo`
- Fix linting errors before committing

### Type Checking
```bash
npx tsc --noEmit
```
- Run TypeScript compiler to check types
- Fix all type errors before committing

### Testing Devices
- Test on both iOS simulator and Android emulator when possible
- Consider different screen sizes
- Test with and without internet connectivity (for AI fallback)

## Environment Configuration

### Required Environment Variables
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Optional (Future Features)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Workflow

### Starting Development
```bash
pnpm install
pnpm start
```

### Running on Devices
```bash
pnpm ios      # iOS simulator
pnpm android  # Android emulator
```

### Making Changes
1. Create feature branch from main
2. Make minimal, focused changes
3. Test on both platforms if UI changes
4. Run linter and type checking
5. Write meaningful commit messages
6. Test the full user flow affected by changes

## Common Patterns and Anti-Patterns

### ✅ DO
- Use TypeScript strict mode features
- Follow existing code style and patterns
- Add comments for complex medical logic
- Handle loading and error states
- Validate user inputs
- Use existing UI components and styles
- Test offline fallback behavior
- Show user-friendly error messages

### ❌ DON'T
- Use `any` type
- Skip error handling for async operations
- Hardcode API keys or secrets
- Ignore TypeScript errors
- Skip input validation for health data
- Remove or bypass medical disclaimers
- Make breaking changes to data structures without migration
- Use inline styles excessively

## Key Files to Understand

1. **types/health.ts**: Core data structures for the entire app
2. **contexts/HealthContext.tsx**: Global state management
3. **services/aiDietService.ts**: Main business logic for meal planning
4. **services/geminiService.ts**: AI API integration
5. **app/onboarding.tsx**: Multi-step user onboarding flow
6. **app/(tabs)/plan.tsx**: Meal plan display and generation

## Special Considerations

### Medical Conditions Supported
- Diabetes Type 1 & Type 2
- Hypertension
- Kidney Disease
- Thyroid Disorder
- Heart Disease
- Celiac Disease
- IBS (Irritable Bowel Syndrome)
- PCOS (Polycystic Ovary Syndrome)
- Custom/Other conditions

### Activity Levels
- Sedentary: Office work, little exercise
- Light: Light exercise 1-3 days/week
- Moderate: Exercise 3-5 days/week
- Active: Heavy exercise 6-7 days/week
- Very Active: Physical job + exercise

### Nutrition Tracking
Track comprehensive nutrients:
- Calories, Protein, Carbs, Fat, Fiber
- Sodium, Potassium, Calcium, Iron

## Git Workflow

### Commit Messages
- Use descriptive commit messages
- Format: `<type>: <description>`
- Examples:
  - `feat: add meal logging functionality`
  - `fix: correct calorie calculation for diabetes`
  - `docs: update README with API setup`
  - `style: improve meal card design`
  - `refactor: simplify AI service error handling`

### Branch Naming
- Feature: `feature/feature-name`
- Bug fix: `fix/bug-description`
- Docs: `docs/update-name`

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## Questions and Issues

For questions or issues, refer to:
- **GitHub Issues**: https://github.com/niksbanna/medidiet-app/issues
- **Documentation**: Check README.md for setup and usage
- **Code Comments**: Look for inline comments in complex logic sections
