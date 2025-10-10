import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useHealth } from '../hooks/useHealth';
import { UserProfile } from '../types/health';
import { showWarningToast, showErrorToast, showSuccessToast } from '../utils/toast';

const { width } = Dimensions.get('window');

const MEDICAL_CONDITIONS = [
  'Diabetes Type 1',
  'Diabetes Type 2',
  'Hypertension',
  'Kidney Disease',
  'Thyroid Disorder',
  'Heart Disease',
  'Celiac Disease',
  'IBS',
  'PCOS',
  'Other'
];

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary', description: 'Office work, little exercise' },
  { key: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
  { key: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week' },
  { key: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' },
  { key: 'very_active', label: 'Very Active', description: 'Physical job + exercise' }
];

export default function OnboardingScreen() {
  const { updateUserProfile } = useHealth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    medicalCondition: '',
    customCondition: '',
    allergies: '',
    dietaryRestrictions: '',
    activityLevel: 'moderate'
  });

  const totalSteps = 6;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate step transitions
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
          slideAnim.setValue(50);
        } else {
          handleComplete();
        }
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(prev => prev - 1);
        slideAnim.setValue(-50);
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        if (!formData.name.trim()) {
          showWarningToast('Please enter your name');
          return false;
        }
        if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
          showWarningToast('Please enter a valid age between 1-120');
          return false;
        }
        if (!formData.gender) {
          showWarningToast('Please select your gender');
          return false;
        }
        return true;
      
      case 1: // Physical Stats
        if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
          showWarningToast('Please enter height in cm (100-250)');
          return false;
        }
        if (!formData.weight || parseFloat(formData.weight) < 20 || parseFloat(formData.weight) > 300) {
          showWarningToast('Please enter weight in kg (20-300)');
          return false;
        }
        return true;
      
      case 2: // Medical Condition
        if (!formData.medicalCondition) {
          showWarningToast('Please select your medical condition');
          return false;
        }
        if (formData.medicalCondition === 'Other' && !formData.customCondition.trim()) {
          showWarningToast('Please specify your medical condition');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    try {
      const profile: UserProfile = {
        id: `user_${Date.now()}`,
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender as 'male' | 'female' | 'other',
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        medicalCondition: formData.medicalCondition === 'Other' ? formData.customCondition : formData.medicalCondition,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
        dietaryRestrictions: formData.dietaryRestrictions.split(',').map(d => d.trim()).filter(d => d),
        activityLevel: formData.activityLevel as any,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await updateUserProfile(profile);
      showSuccessToast('Profile created successfully! Welcome aboard! 🎉');
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } catch (error) {
      showErrorToast('Failed to save profile. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepContainer title="Basic Information" subtitle="Tell us about yourself">
            <InputField
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter your full name"
              required
            />
            
            <InputField
              label="Age"
              value={formData.age}
              onChangeText={(value) => updateField('age', value)}
              placeholder="Enter your age"
              keyboardType="numeric"
              required
            />
            
            <Text style={styles.fieldLabel}>Gender *</Text>
            <View style={styles.optionGroup}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.optionButton,
                    formData.gender === gender && styles.optionButtonSelected
                  ]}
                  onPress={() => updateField('gender', gender)}
                >
                  <Text style={[
                    styles.optionText,
                    formData.gender === gender && styles.optionTextSelected
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </StepContainer>
        );

      case 1:
        return (
          <StepContainer title="Physical Stats" subtitle="Help us calculate your nutritional needs">
            <InputField
              label="Height (cm)"
              value={formData.height}
              onChangeText={(value) => updateField('height', value)}
              placeholder="e.g., 170"
              keyboardType="numeric"
              required
            />
            
            <InputField
              label="Weight (kg)"
              value={formData.weight}
              onChangeText={(value) => updateField('weight', value)}
              placeholder="e.g., 70"
              keyboardType="numeric"
              required
            />
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer title="Medical Condition" subtitle="Select your primary condition for personalized nutrition">
            <Text style={styles.fieldLabel}>Primary Medical Condition *</Text>
            <ScrollView style={styles.conditionsList} showsVerticalScrollIndicator={false}>
              {MEDICAL_CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.conditionButton,
                    formData.medicalCondition === condition && styles.conditionButtonSelected
                  ]}
                  onPress={() => updateField('medicalCondition', condition)}
                >
                  <Text style={[
                    styles.conditionText,
                    formData.medicalCondition === condition && styles.conditionTextSelected
                  ]}>
                    {condition}
                  </Text>
                  {formData.medicalCondition === condition && (
                    <MaterialIcons name="check" size={20} color="#0066CC" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {formData.medicalCondition === 'Other' && (
              <InputField
                label="Specify Condition"
                value={formData.customCondition}
                onChangeText={(value) => updateField('customCondition', value)}
                placeholder="Enter your medical condition"
                required
              />
            )}
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer title="Allergies & Restrictions" subtitle="Help us avoid foods that could harm you">
            <InputField
              label="Food Allergies"
              value={formData.allergies}
              onChangeText={(value) => updateField('allergies', value)}
              placeholder="e.g., nuts, shellfish, dairy (separate with commas)"
              multiline
            />
            
            <InputField
              label="Dietary Restrictions"
              value={formData.dietaryRestrictions}
              onChangeText={(value) => updateField('dietaryRestrictions', value)}
              placeholder="e.g., vegetarian, gluten-free, low-sodium"
              multiline
            />
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer title="Activity Level" subtitle="Choose your typical physical activity level">
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.activityButton,
                  formData.activityLevel === level.key && styles.activityButtonSelected
                ]}
                onPress={() => updateField('activityLevel', level.key)}
              >
                <View style={styles.activityContent}>
                  <Text style={[
                    styles.activityLabel,
                    formData.activityLevel === level.key && styles.activityLabelSelected
                  ]}>
                    {level.label}
                  </Text>
                  <Text style={[
                    styles.activityDescription,
                    formData.activityLevel === level.key && styles.activityDescriptionSelected
                  ]}>
                    {level.description}
                  </Text>
                </View>
                {formData.activityLevel === level.key && (
                  <MaterialIcons name="radio-button-checked" size={24} color="#0066CC" />
                )}
                {formData.activityLevel !== level.key && (
                  <MaterialIcons name="radio-button-unchecked" size={24} color="#CCC" />
                )}
              </TouchableOpacity>
            ))}
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer title="Ready to Start!" subtitle="Your personalized nutrition journey begins now">
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <MaterialIcons name="person" size={24} color="#0066CC" />
                <Text style={styles.summaryText}>{formData.name}, {formData.age} years old</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <MaterialIcons name="medical-services" size={24} color="#0066CC" />
                <Text style={styles.summaryText}>
                  {formData.medicalCondition === 'Other' ? formData.customCondition : formData.medicalCondition}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <MaterialIcons name="fitness-center" size={24} color="#0066CC" />
                <Text style={styles.summaryText}>
                  {ACTIVITY_LEVELS.find(l => l.key === formData.activityLevel)?.label} Activity
                </Text>
              </View>
            </View>
            
            <View style={styles.disclaimerBox}>
              <MaterialIcons name="info-outline" size={20} color="#FF6B6B" />
              <Text style={styles.disclaimerText}>
                The meal plans generated are AI-powered recommendations for educational purposes only. 
                Always consult your healthcare provider before making significant dietary changes.
              </Text>
            </View>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0066CC', '#0052A3']}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardView} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Premium Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <View style={styles.backButtonCircle}>
                  <MaterialIcons name="arrow-back" size={24} color="#FFF" />
                </View>
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <View style={styles.stepIndicatorContainer}>
                  {[...Array(totalSteps)].map((_, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.stepDot,
                        index <= currentStep && styles.stepDotActive,
                        index === currentStep && styles.stepDotCurrent
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.stepText}>
                  Step {currentStep + 1} of {totalSteps}
                </Text>
              </View>
            </View>

            {/* Content Card */}
            <Animated.View 
              style={[
                styles.contentCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }]
                }
              ]}
            >
              <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderStep()}
              </ScrollView>
            </Animated.View>

            {/* Premium Navigation */}
            <View style={styles.navigation}>
              {currentStep > 0 && (
                <TouchableOpacity style={styles.backNavButton} onPress={prevStep}>
                  <MaterialIcons name="chevron-left" size={24} color="#0066CC" />
                  <Text style={styles.backNavText}>Back</Text>
                </TouchableOpacity>
              )}
              
              <View style={{ flex: 1 }} />
              
              <TouchableOpacity 
                style={styles.nextButtonContainer}
                onPress={nextStep}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0066CC', '#0052A3']}
                  style={styles.nextButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nextButtonText}>
                    {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
                  </Text>
                  <MaterialIcons 
                    name={currentStep === totalSteps - 1 ? "check-circle" : "arrow-forward"} 
                    size={20} 
                    color="white" 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

// Helper Components
interface StepContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function StepContainer({ title, subtitle, children }: StepContainerProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSubtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
  required?: boolean;
}

function InputField({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  multiline = false,
  required = false 
}: InputFieldProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  stepDotCurrent: {
    width: 24,
    backgroundColor: '#FFF',
  },
  stepText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  stepContainer: {
    width: '100%',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  required: {
    color: '#FF6B6B',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#E6F3FF',
    borderColor: '#0066CC',
    elevation: 2,
    shadowColor: '#0066CC',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#0066CC',
    fontWeight: '700',
  },
  conditionsList: {
    maxHeight: 360,
    marginBottom: 16,
  },
  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  conditionButtonSelected: {
    backgroundColor: '#E6F3FF',
    borderColor: '#0066CC',
    elevation: 2,
    shadowColor: '#0066CC',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  conditionText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  conditionTextSelected: {
    color: '#0066CC',
    fontWeight: '700',
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityButtonSelected: {
    backgroundColor: '#E6F3FF',
    borderColor: '#0066CC',
    elevation: 2,
    shadowColor: '#0066CC',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  activityLabelSelected: {
    color: '#0066CC',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  activityDescriptionSelected: {
    color: '#0066CC',
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 16,
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    padding: 18,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  backNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 4,
  },
  backNavText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
  },
  nextButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});