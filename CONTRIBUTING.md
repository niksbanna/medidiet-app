# Contributing to MediDiet AI 🤝

First off, thank you for considering contributing to MediDiet AI! It's people like you that make MediDiet AI such a great tool for helping people manage their nutrition and health.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What Should I Know Before I Get Started?](#what-should-i-know-before-i-get-started)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Contributing Code](#contributing-code)
  - [Improving Documentation](#improving-documentation)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [React Native Best Practices](#react-native-best-practices)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

**Expected Behavior:**
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and open to feedback
- Focus on what is best for the community
- Show empathy towards other community members

**Unacceptable Behavior:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Any conduct which could reasonably be considered inappropriate in a professional setting

## What Should I Know Before I Get Started?

### Project Overview

MediDiet AI is a React Native mobile application that provides AI-powered personalized nutrition management for individuals with medical conditions. The app uses Google's Gemini API to generate meal plans tailored to specific health needs.

**Key Technologies:**
- React Native 0.79.3
- Expo ~53.0.9
- TypeScript 5.8.3
- Google Gemini API
- AsyncStorage for local data

**Project Structure:**
```
medidiet-app/
├── app/                    # Expo Router screens
├── components/             # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # Business logic and API services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── constants/             # App-wide constants
```

### Medical and Health Context

This app deals with sensitive health information and provides dietary guidance for medical conditions. When contributing:
- **Always prioritize user safety** - Health-related features require extra scrutiny
- **Include medical disclaimers** where appropriate
- **Validate health data inputs** thoroughly
- **Respect privacy** - All data is stored locally by design
- **Be evidence-based** - Nutritional recommendations should align with established medical guidelines

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Device Information:**
 - Device: [e.g. iPhone 14, Samsung Galaxy S23]
 - OS: [e.g. iOS 17.0, Android 13]
 - App Version: [e.g. 1.0.0]
 - Expo Version: [e.g. ~53.0.9]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

**Enhancement Suggestion Template:**

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Medical/Health Considerations**
If this feature involves health data or medical advice, describe how it ensures user safety.

**Additional context**
Add any other context, mockups, or screenshots about the feature request here.
```

### Contributing Code

We love code contributions! Here's how to get started:

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `main`
3. **Make your changes** following our style guidelines
4. **Test your changes** on both iOS and Android if possible
5. **Commit with meaningful messages** following our conventions
6. **Push to your fork** and create a Pull Request

### Improving Documentation

Documentation improvements are always welcome! This includes:
- README updates
- Code comments for complex logic
- API documentation
- User guides and tutorials
- Medical/nutritional reference information

## Development Setup

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (preferred) or npm/yarn
- **Expo CLI**: Latest version
- **iOS Simulator** (Mac only) or **Android Studio** (for emulator)
- **Git**: For version control

### Initial Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/medidiet-app.git
   cd medidiet-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**
   ```bash
   pnpm start
   ```

5. **Run on your device**
   - iOS: Press `i` or run `pnpm ios`
   - Android: Press `a` or run `pnpm android`

### Running Tests and Checks

```bash
# Run linter
pnpm lint

# Type checking
npx tsc --noEmit

# Run on specific platforms
pnpm ios      # iOS simulator
pnpm android  # Android emulator
```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with one of these prefixes:
- `feature/` - New features (e.g., `feature/meal-photo-recognition`)
- `fix/` - Bug fixes (e.g., `fix/calorie-calculation-diabetes`)
- `docs/` - Documentation updates (e.g., `docs/api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/health-context`)
- `test/` - Adding tests (e.g., `test/ai-service`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make focused commits**
   - Keep changes small and focused
   - One logical change per commit
   - Test frequently as you develop

3. **Write tests** (when applicable)
   - Add tests for new features
   - Ensure existing tests still pass

4. **Update documentation**
   - Update README if needed
   - Add JSDoc comments for complex functions
   - Update type definitions

5. **Test thoroughly**
   - Test on both iOS and Android
   - Test with and without internet (for AI fallback)
   - Test with different medical conditions
   - Verify loading and error states

## Style Guidelines

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```bash
feat(meal-plan): add weekly meal plan generation with AI
fix(diabetes): correct carb calculation for type 2 diabetes
docs(readme): update installation instructions
style(ui): improve meal card spacing and colors
refactor(ai-service): simplify error handling logic
test(health-context): add tests for BMI calculation
chore(deps): update expo to version 53.0.9
```

### TypeScript Style Guide

**General Rules:**
- ✅ Always use TypeScript, never plain JavaScript
- ✅ Enable strict mode (already configured)
- ✅ Provide explicit types for function parameters and return values
- ✅ Use `interface` for object shapes, `type` for unions/intersections
- ❌ Never use `any` type - use proper types or `unknown`

**Examples:**

```typescript
// ✅ Good - Explicit types
interface MealPlan {
  id: string;
  date: Date;
  meals: Meal[];
}

function calculateCalories(meals: Meal[]): number {
  return meals.reduce((total, meal) => total + meal.calories, 0);
}

// ❌ Bad - Missing types
function calculateCalories(meals) {
  return meals.reduce((total, meal) => total + meal.calories, 0);
}

// ❌ Bad - Using any
function processMeal(meal: any): void {
  // ...
}
```

### React Native Best Practices

**Component Structure:**

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

// 1. Interfaces/Types
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// 2. Constants
const DEFAULT_PADDING = 16;

// 3. Main Component
export default function MyComponent({ title, onPress }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// 4. Styles
const styles = StyleSheet.create({
  container: {
    padding: DEFAULT_PADDING,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

**Key Practices:**
- ✅ Use functional components with hooks
- ✅ Use `StyleSheet.create()` for styles
- ✅ Wrap screens with `SafeAreaView`
- ✅ Handle loading and error states
- ✅ Use existing UI components from `components/ui/`
- ❌ Avoid inline styles (except for dynamic values)
- ❌ Avoid class components
- ❌ Don't skip error handling

**Design System:**
```typescript
// Use constants from constants/Colors.ts
import Colors from '@/constants/Colors';

// Headers: 28px, Bold
// Titles: 20px, Bold
// Body: 15px, Medium
// Small: 13px, Regular

// Colors:
// Primary: #0066CC
// Success: #4CAF50
// Warning: #FF9800
// Error: #FF6B6B
// Background: #F5F7FA
```

### Medical Safety Guidelines

When working with health-related features:

1. **Always validate health inputs**
   ```typescript
   // ✅ Good
   function validateWeight(weight: number): boolean {
     return weight > 0 && weight < 500; // Reasonable range
   }
   ```

2. **Include disclaimers**
   ```typescript
   // ✅ Good
   <MedicalDisclaimer text="This is for educational purposes only. Consult your healthcare provider." />
   ```

3. **Handle medical conditions carefully**
   ```typescript
   // ✅ Good - Condition-specific validation
   if (userProfile.medicalConditions.includes('diabetes')) {
     // Apply diabetes-specific dietary restrictions
   }
   ```

4. **Respect data privacy**
   - All health data stored locally
   - Never log sensitive information
   - Use secure storage for authentication tokens

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] TypeScript types are properly defined
- [ ] Code has been tested on iOS and/or Android
- [ ] Linter passes (`pnpm lint`)
- [ ] Type check passes (`npx tsc --noEmit`)
- [ ] Commit messages follow conventions
- [ ] Documentation updated (if needed)
- [ ] Medical disclaimers included (if applicable)

### Submitting a Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub
   - Use a clear, descriptive title
   - Reference related issues (e.g., "Fixes #123")
   - Describe your changes in detail
   - Include screenshots for UI changes
   - List any breaking changes

3. **Pull Request Template:**

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
Describe the tests you ran:
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested with medical condition: [specify]
- [ ] Tested offline fallback
- [ ] Linter passed
- [ ] Type checking passed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex code
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on real devices
- [ ] Medical disclaimers included (if applicable)
```

### Review Process

1. **Automated checks** will run (linting, type checking)
2. **Maintainers will review** your code
3. **Address feedback** by pushing new commits
4. **Approval** - Once approved, your PR will be merged

**Review Timeline:**
- Small fixes: Usually within 1-3 days
- New features: May take 3-7 days
- Large refactors: Could take 1-2 weeks

## Community

### Getting Help

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Email**: support@medidiet.app
- **Documentation**: Check the [README](README.md) and code comments

### Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Special mentions for exceptional contributions

### Stay Updated

- **Watch** the repository for notifications
- **Star** the project to show support
- **Share** the project with others who might benefit

---

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Questions?

If you have questions that aren't covered in this guide:
1. Check the [README](README.md)
2. Search existing [GitHub Issues](https://github.com/niksbanna/medidiet-app/issues)
3. Create a new issue with the `question` label

---

## Thank You! 🙏

Your contributions help make MediDiet AI better for everyone managing their health through nutrition. Every contribution, no matter how small, is valued and appreciated!

**Happy Contributing!** 🎉
