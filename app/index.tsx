import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useHealth } from '../hooks/useHealth';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toast';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { userProfile, isLoading } = useHealth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && userProfile) {
      router.replace('/(tabs)');
    }
  }, [userProfile, isLoading]);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showWarningToast('Please enter email and password');
      return;
    }

    // Mock login - in production, this would call an API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      showSuccessToast('Login successful! Welcome back!');
      setShowLoginModal(false);
      
      // In a real app, you'd fetch the user profile from the backend
      // For now, redirect to onboarding or dashboard based on profile existence
      if (userProfile) {
        router.replace('/(tabs)');
      } else {
        router.push('/onboarding');
      }
    } catch {
      showErrorToast('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0066CC', '#0052A3', '#003D7A']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Animated Background Circles */}
            <View style={styles.backgroundCircles}>
              <Animated.View 
                style={[
                  styles.circle, 
                  styles.circle1,
                  { transform: [{ translateY: floatAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.circle, 
                  styles.circle2,
                  { transform: [{ translateY: floatAnim }] }
                ]} 
              />
            </View>

            {/* Header with Logo */}
            <Animated.View 
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Animated.View 
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#E6F3FF']}
                  style={styles.logoGradient}
                >
                  <MaterialIcons name="medical-services" size={64} color="#0066CC" />
                </LinearGradient>
                <View style={styles.aiChip}>
                  <MaterialIcons name="psychology" size={14} color="#FFF" />
                  <Text style={styles.aiChipText}>AI</Text>
                </View>
              </Animated.View>
              
              <Text style={styles.title}>MediDiet AI</Text>
              <Text style={styles.subtitle}>
                Your Personal Health & Nutrition Assistant
              </Text>
              
              {/* Stats Preview */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <MaterialIcons name="people" size={20} color="#FFF" />
                  <Text style={styles.statText}>10K+ Users</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialIcons name="star" size={20} color="#FFD700" />
                  <Text style={styles.statText}>4.8 Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialIcons name="verified" size={20} color="#4CAF50" />
                  <Text style={styles.statText}>Trusted</Text>
                </View>
              </View>
            </Animated.View>

            {/* Features Grid */}
            <Animated.View 
              style={[
                styles.featuresContainer,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.featuresGrid}>
                <FeatureCard 
                  icon="psychology"
                  title="AI Planning"
                  description="Smart meal plans"
                  color="#4CAF50"
                  delay={0}
                />
                <FeatureCard 
                  icon="trending-up"
                  title="Track Progress"
                  description="Monitor health"
                  color="#FF9800"
                  delay={100}
                />
                <FeatureCard 
                  icon="restaurant-menu"
                  title="Log Meals"
                  description="Easy tracking"
                  color="#9C27B0"
                  delay={200}
                />
                <FeatureCard 
                  icon="security"
                  title="Secure & Private"
                  description="Data protection"
                  color="#2196F3"
                  delay={300}
                />
              </View>
            </Animated.View>

            {/* Call to Action Buttons */}
            <Animated.View 
              style={[
                styles.ctaContainer,
                { opacity: fadeAnim }
              ]}
            >
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F0F8FF']}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="rocket-launch" size={24} color="#0066CC" />
                  <Text style={styles.primaryButtonText}>Get Started Free</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#0066CC" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowLoginModal(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="login" size={20} color="#FFF" />
                <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Trust Indicators */}
            <View style={styles.trustContainer}>
              <View style={styles.trustItem}>
                <MaterialIcons name="lock" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.trustText}>End-to-end encrypted</Text>
              </View>
              <View style={styles.trustItem}>
                <MaterialIcons name="verified-user" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.trustText}>HIPAA compliant</Text>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowLoginModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isLogin ? 'Login to continue your health journey' : 'Start your health journey today'}
                </Text>
              </View>

              {/* Login Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>

                {isLogin && (
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#0066CC', '#0052A3']}
                    style={styles.loginButtonGradient}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLogin ? 'Login' : 'Sign Up'}
                    </Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Social Login */}
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <MaterialIcons name="g-mobiledata" size={32} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <MaterialIcons name="apple" size={28} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <MaterialIcons name="facebook" size={28} color="#4267B2" />
                  </TouchableOpacity>
                </View>

                {/* Toggle Login/Signup */}
                <TouchableOpacity 
                  style={styles.toggleAuth}
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text style={styles.toggleAuthText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Text style={styles.toggleAuthLink}>
                      {isLogin ? 'Sign Up' : 'Login'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>
    </View>
  );
}

interface FeatureCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  color: string;
  delay: number;
}

function FeatureCard({ icon, title, description, color, delay }: FeatureCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.featureCard,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={[styles.featureCardIcon, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={28} color="#FFF" />
      </View>
      <Text style={styles.featureCardTitle}>{title}</Text>
      <Text style={styles.featureCardDescription}>{description}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiChip: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0066CC',
  },
  aiChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureCardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  ctaContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 32,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 12,
    marginLeft: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  toggleAuth: {
    alignItems: 'center',
  },
  toggleAuthText: {
    fontSize: 14,
    color: '#666',
  },
  toggleAuthLink: {
    color: '#0066CC',
    fontWeight: '600',
  },
});