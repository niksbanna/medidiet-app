# MediDiet AI 🏥🍽️

<div align="center">

![MediDiet AI](https://img.shields.io/badge/MediDiet-AI-0066CC?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-0.79.3-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-~53.0.9-000020?style=for-the-badge&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
[![GitHub stars](https://img.shields.io/github/stars/niksbanna/medidiet-app?style=for-the-badge&logo=github&color=yellow)](https://github.com/niksbanna/medidiet-app)

**AI-Powered Personalized Nutrition Management for Medical Conditions**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

<div align="center">

### ⭐ **If you find MediDiet AI helpful, please give it a star!** ⭐

Your support helps us grow and improve this project. Stars motivate us to add new features and maintain the app.

[⭐ **Star this repository**](https://github.com/niksbanna/medidiet-app) to show your support!

</div>

---

## 📖 Overview

**MediDiet AI** is a cutting-edge mobile application designed to help individuals manage their nutrition in relation to specific medical conditions such as diabetes and hypertension. Leveraging AI-powered meal planning through Google's Gemini API, the app provides personalized dietary recommendations, meal logging, and adherence tracking to support better health outcomes.

### 🎯 Key Objectives

- **Personalized Nutrition**: AI-generated meal plans tailored to individual medical conditions
- **Easy Tracking**: Simple meal logging with nutrition information
- **Health Insights**: Real-time analytics and adherence monitoring
- **Medical Compliance**: Guidelines aligned with medical best practices
- **Beautiful UX**: Premium, modern interface with smooth animations

---

## ✨ Features

### 🤖 AI-Powered Meal Planning
- **Gemini API Integration**: Utilizes Google's advanced AI for intelligent meal suggestions
- **Medical Condition Support**: Specialized plans for diabetes, hypertension, and other conditions
- **Weekly Meal Plans**: Complete 7-day meal schedules with breakfast, lunch, dinner, and snacks
- **Nutritional Analysis**: Detailed breakdown of calories, macros, fiber, sodium, and more
- **Offline Fallback**: Local meal generation when internet is unavailable

### 📊 Health Tracking
- **Daily Progress Dashboard**: Visual overview of calories, meals logged, and adherence rates
- **Meal Logging**: Quick and easy meal entry with portion tracking
- **Adherence Rating**: Self-assessment of how well meals fit dietary plans
- **Health Insights**: AI-powered recommendations based on tracking data
- **Weekly Trends**: Historical data visualization and progress monitoring

### 👤 User Profile Management
- **Comprehensive Profiles**: Age, weight, height, activity level, and medical conditions
- **BMI Calculator**: Automatic BMI calculation with health categorization
- **Editable Information**: Easy updates to personal and medical data
- **Secure Storage**: Local data persistence with AsyncStorage

### 🎨 Premium UI/UX
- **Modern Design**: Gradient backgrounds, rounded corners, and elegant shadows
- **Smooth Animations**: 400ms transitions with fade and slide effects
- **Color-Coded Elements**: Intuitive visual hierarchy (breakfast=orange, lunch=green, etc.)
- **Dark Mode Ready**: Adaptive color schemes for different lighting conditions
- **Responsive Layout**: Optimized for various screen sizes

### 🔔 Smart Notifications
- **Non-Blocking Toasts**: Success, error, warning, and info messages
- **Medical Reminders**: Hydration and medication timing alerts
- **Plan Updates**: Notifications when new meal plans are generated

---

## 🚀 Installation

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (or npm/yarn)
- **Expo CLI**: Latest version
- **iOS Simulator** (Mac only) or **Android Studio** (for emulator)
- **Physical Device**: iOS or Android smartphone (optional)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/niksbanna/medidiet-app.git
   cd medidiet-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up Gemini API key (Optional)**

   - Skip this step during setup
   - After launching the app, go to Profile → Settings → Gemini API Key
   - Enter your API key directly in the app

4. **Start the development server**
   ```bash
   pnpm start
   # or
   npm start
   ```

5. **Run on your device**
   - **iOS**: Press `i` in the terminal or scan the QR code with the Expo Go app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

---

## 📱 Usage

### First Time Setup

1. **Welcome Screen**: Launch the app to see the beautiful welcome screen with feature highlights
2. **Login/Sign Up**: Enter your credentials or use social login (Google, Apple, Facebook)
3. **Onboarding**: Complete the 6-step onboarding process:
   - Basic information (name, age)
   - Physical metrics (height, weight)
   - Medical condition selection
   - Activity level
   - Dietary preferences
   - Goal setting

### Daily Workflow

1. **Dashboard**: View your daily progress, quick stats, and health insights
2. **Meal Plan**: Check your AI-generated weekly meal plan
3. **Log Meals**: Track what you eat throughout the day
4. **Profile**: Update your information and track BMI changes

### Generating a Meal Plan

1. Navigate to the **Meal Plan** tab
2. Tap the **refresh icon** to generate a new plan
3. Wait for the AI loader (typically 5-10 seconds)
4. Browse through 7 days of personalized meals
5. View detailed nutrition information for each meal

### Logging a Meal

1. Navigate to the **Log** tab
2. Tap **Log New Meal**
3. Select meal type (breakfast, lunch, dinner, snack)
4. Choose food items from the quick list
5. Rate adherence (1-10)
6. Add optional notes
7. Tap **Save**

---

## 🛠️ Tech Stack

### Frontend
- **React Native**: 0.79.3 - Cross-platform mobile framework
- **Expo**: ~53.0.9 - Development platform and build tools
- **TypeScript**: ~5.8.3 - Type-safe JavaScript
- **Expo Router**: File-based navigation system

### UI Components
- **expo-linear-gradient**: Gradient backgrounds
- **expo-blur**: iOS-style blur effects
- **@expo/vector-icons**: Material Design icons
- **React Native Animated API**: Smooth animations

### State Management
- **React Context API**: Global state (HealthContext)
- **React Hooks**: Local component state

### Data & Storage
- **AsyncStorage**: Local data persistence
- **TypeScript Interfaces**: Type-safe data models

### AI & Services
- **Google Gemini API**: AI meal plan generation
- **Custom AI Service**: Wrapper for Gemini integration
- **Fallback System**: Offline meal generation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Expo CLI**: Build and deployment

---

## 📂 Project Structure

```
medidiet-app/
├── .github/                  # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
│       ├── ai-pr-review.yml # AI code review automation
│       └── README.md        # Workflow documentation
├── app/                      # App screens (Expo Router)
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Dashboard screen
│   │   ├── plan.tsx         # Meal plan screen
│   │   ├── log.tsx          # Meal logging screen
│   │   └── profile.tsx      # User profile screen
│   ├── index.tsx            # Welcome/login screen
│   ├── onboarding.tsx       # Onboarding flow
│   └── _layout.tsx          # Root layout
├── components/              # Reusable components
│   └── ui/
│       ├── AILoader.tsx     # AI loading animation
│       ├── MedicalDisclaimer.tsx
│       └── NutrientBar.tsx  # Nutrition progress bars
├── contexts/                # React contexts
│   └── HealthContext.tsx    # Global health state
├── hooks/                   # Custom React hooks
│   ├── useHealth.tsx        # Health data hook
│   ├── useColorScheme.ts    # Theme hook
│   └── useThemeColor.ts     # Color utilities
├── services/                # External services
│   ├── geminiService.ts     # Gemini API wrapper
│   └── aiDietService.ts     # Diet planning logic
├── types/                   # TypeScript definitions
│   └── health.ts            # Health data types
├── utils/                   # Utility functions
│   └── toast.ts             # Toast notifications
├── constants/               # App constants
│   └── Colors.ts            # Color scheme
├── assets/                  # Static assets
│   ├── fonts/              # Custom fonts
│   └── images/             # Images and icons
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md               # This file
```

---

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#0066CC` - Main brand color
- **Dark Blue**: `#0052A3` - Gradient end
- **Success Green**: `#4CAF50` - Success states
- **Warning Orange**: `#FF9800` - Warnings
- **Error Red**: `#FF6B6B` - Errors
- **Background**: `#F5F7FA` - Light gray background
- **Text**: `#1A1A1A` - Primary text

### Meal Type Colors

- **Breakfast**: `#FF9800` (Orange)
- **Lunch**: `#4CAF50` (Green)
- **Dinner**: `#9C27B0` (Purple)
- **Snacks**: `#FF5722` (Red/Orange)

### Typography

- **Headers**: 28px, Bold
- **Titles**: 20px, Bold
- **Body**: 15px, Medium
- **Small**: 13px, Regular

---

## 🔐 API Key Configuration

### Gemini API Key

- Navigate to Profile tab
- Tap on Settings → Gemini API Key
- Enter your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- The key is securely stored in your device's local storage

---

## 🧪 Testing

```bash
# Run linting
pnpm lint

# Type checking
npx tsc --noEmit

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

---

## 📦 Building for Production

### iOS

```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

> **Note**: Requires [EAS CLI](https://docs.expo.dev/eas/) setup and account

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

### Quick Start

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### AI-Powered Code Review

When you open a pull request, our AI code review bot (powered by Google Gemini) will automatically:
- 🤖 Review your code changes
- 💡 Provide constructive feedback
- 🔍 Check for bugs, security issues, and best practices
- 📝 Post a detailed review comment on your PR

The AI reviewer focuses on React Native, TypeScript, Expo conventions, and medical app best practices. Use the feedback as suggestions to improve your code quality.

### Coding Standards

- Use TypeScript for type safety
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test on both iOS and Android

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Niks Banna** - [@niksbanna](https://github.com/niksbanna)

---

## 🙏 Acknowledgments

- **Google Gemini API** - For AI-powered meal planning
- **Expo Team** - For the amazing development platform
- **React Native Community** - For extensive libraries and support
- **Material Design** - For icon system

---

## 📞 Support

For questions or issues:

- **GitHub Issues**: [Create an issue](https://github.com/niksbanna/medidiet-app/issues)
- **Email**: support@medidiet.app
- **Documentation**: [Wiki](https://github.com/niksbanna/medidiet-app/wiki)

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Recipe details with cooking instructions
- [ ] Grocery list generation
- [ ] Barcode scanning for food items
- [ ] Water intake tracking
- [ ] Exercise tracking integration

### Version 1.2
- [ ] Social features (share meals, challenges)
- [ ] Healthcare provider integration
- [ ] Export reports as PDF
- [ ] Multi-language support
- [ ] Apple Health / Google Fit sync

### Version 2.0
- [ ] Meal photo recognition
- [ ] Restaurant menu analyzer
- [ ] Voice meal logging
- [ ] Wearable device integration
- [ ] Telemedicine consultation

---

## 📊 Statistics

- **Lines of Code**: ~5,000+
- **Components**: 20+
- **Screens**: 6 main screens
- **API Integrations**: 1 (Gemini AI)
- **Supported Platforms**: iOS, Android

---

## 💡 Tips & Tricks

### Performance Optimization
- Use `React.memo()` for expensive components
- Implement virtualized lists for large datasets
- Optimize images with `expo-image`
- Use `useCallback` and `useMemo` appropriately

### Best Practices
- Always handle loading and error states
- Validate user input before API calls
- Use TypeScript interfaces for data structures
- Implement proper error boundaries
- Test on real devices, not just simulators

---

<div align="center">

### ⭐ Show Your Support!

If you like this project and find it useful, please consider giving it a star! ⭐  
It helps others discover MediDiet AI and motivates us to keep improving it.

[![Star this repo](https://img.shields.io/github/stars/niksbanna/medidiet-app?style=social)](https://github.com/niksbanna/medidiet-app)

---

**Made with ❤️ and 🤖 AI**

[⬆ Back to Top](#medidiet-ai-)

</div>
