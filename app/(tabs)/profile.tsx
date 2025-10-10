import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useHealth } from '../../hooks/useHealth';
import { AIDietService } from '../../services/aiDietService';
import { showSuccessToast, showWarningToast, showErrorToast } from '../../utils/toast';

export default function ProfileScreen() {
  const { userProfile, updateUserProfile, clearUserProfile, currentPlan, mealLogs, getAdherenceRate } = useHealth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="person-off" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No profile found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/onboarding')}
          >
            <Text style={styles.primaryButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate stats
  const bmi = (userProfile.weight / Math.pow(userProfile.height / 100, 2)).toFixed(1);
  const dailyCalories = AIDietService.calculateCalorieNeeds(userProfile);
  const adherenceRate = getAdherenceRate(7);
  const totalMealsLogged = mealLogs.length;
  const daysActive = Math.floor((Date.now() - new Date(userProfile.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      showWarningToast('Please enter a value');
      return;
    }

    try {
      const updates: any = { ...userProfile, updatedAt: new Date() };
      
      switch (editField) {
        case 'name':
          updates.name = editValue;
          break;
        case 'age':
          updates.age = parseInt(editValue);
          break;
        case 'height':
          updates.height = parseFloat(editValue);
          break;
        case 'weight':
          updates.weight = parseFloat(editValue);
          break;
        case 'medicalCondition':
          updates.medicalCondition = editValue;
          break;
      }

      await updateUserProfile(updates);
      setEditModalVisible(false);
      showSuccessToast('Profile updated successfully!');
    } catch (error) {
      showErrorToast('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await clearUserProfile();
      router.replace('/onboarding');
      showSuccessToast('Logged out successfully');
    } catch (error) {
      showErrorToast('Failed to logout');
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#FF9800' };
    if (bmi < 25) return { label: 'Normal', color: '#4CAF50' };
    if (bmi < 30) return { label: 'Overweight', color: '#FF9800' };
    return { label: 'Obese', color: '#F44336' };
  };

  const bmiCategory = getBMICategory(parseFloat(bmi));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#0066CC', '#0052A3']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#E6F3FF']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {userProfile.name.substring(0, 2).toUpperCase()}
                </Text>
              </LinearGradient>
              <View style={styles.aiBadge}>
                <MaterialIcons name="psychology" size={16} color="#FFF" />
              </View>
            </View>
            <Text style={styles.headerName}>{userProfile.name}</Text>
            <Text style={styles.headerSubtitle}>{userProfile.medicalCondition}</Text>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{daysActive}</Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalMealsLogged}</Text>
                <Text style={styles.statLabel}>Meals Logged</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{adherenceRate}%</Text>
                <Text style={styles.statLabel}>Adherence</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Health Metrics Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="favorite" size={24} color="#0066CC" />
            <Text style={styles.sectionTitle}>Health Metrics</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>BMI</Text>
                <Text style={[styles.metricValue, { color: bmiCategory.color }]}>
                  {bmi}
                </Text>
                <Text style={[styles.metricCategory, { color: bmiCategory.color }]}>
                  {bmiCategory.label}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Daily Calories</Text>
                <Text style={styles.metricValue}>{dailyCalories}</Text>
                <Text style={styles.metricCategory}>kcal/day</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={24} color="#0066CC" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.card}>
            <InfoRow
              icon="badge"
              label="Name"
              value={userProfile.name}
              onEdit={() => handleEditField('name', userProfile.name)}
            />
            <InfoRow
              icon="cake"
              label="Age"
              value={`${userProfile.age} years`}
              onEdit={() => handleEditField('age', userProfile.age.toString())}
            />
            <InfoRow
              icon="wc"
              label="Gender"
              value={userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)}
            />
            <InfoRow
              icon="straighten"
              label="Height"
              value={`${userProfile.height} cm`}
              onEdit={() => handleEditField('height', userProfile.height.toString())}
            />
            <InfoRow
              icon="monitor-weight"
              label="Weight"
              value={`${userProfile.weight} kg`}
              onEdit={() => handleEditField('weight', userProfile.weight.toString())}
            />
            <InfoRow
              icon="local-hospital"
              label="Medical Condition"
              value={userProfile.medicalCondition}
              onEdit={() => handleEditField('medicalCondition', userProfile.medicalCondition)}
              isLast
            />
          </View>
        </View>

        {/* Activity & Lifestyle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="directions-run" size={24} color="#0066CC" />
            <Text style={styles.sectionTitle}>Activity & Lifestyle</Text>
          </View>

          <View style={styles.card}>
            <InfoRow
              icon="fitness-center"
              label="Activity Level"
              value={userProfile.activityLevel.replace('_', ' ').toUpperCase()}
            />
            <InfoRow
              icon="no-meals"
              label="Allergies"
              value={userProfile.allergies.length > 0 ? userProfile.allergies.join(', ') : 'None'}
            />
            <InfoRow
              icon="restaurant"
              label="Dietary Restrictions"
              value={userProfile.dietaryRestrictions.length > 0 ? userProfile.dietaryRestrictions.join(', ') : 'None'}
              isLast
            />
          </View>
        </View>

        {/* AI Insights */}
        {currentPlan && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="psychology" size={24} color="#0066CC" />
              <Text style={styles.sectionTitle}>AI Insights</Text>
            </View>

            <View style={[styles.card, styles.insightCard]}>
              <LinearGradient
                colors={['#E6F3FF', '#FFFFFF']}
                style={styles.insightGradient}
              >
                <MaterialIcons name="emoji-objects" size={32} color="#0066CC" />
                <Text style={styles.insightTitle}>Your AI Health Assistant is Active</Text>
                <Text style={styles.insightText}>
                  Your personalized meal plan is optimized for {userProfile.medicalCondition.toLowerCase()}.
                  Keep logging meals to help AI improve recommendations!
                </Text>
                <View style={styles.insightStats}>
                  <View style={styles.insightStatItem}>
                    <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                    <Text style={styles.insightStatText}>Plan Active</Text>
                  </View>
                  <View style={styles.insightStatItem}>
                    <MaterialIcons name="auto-awesome" size={20} color="#FF9800" />
                    <Text style={styles.insightStatText}>AI Powered</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/onboarding')}
          >
            <MaterialIcons name="edit" size={24} color="#0066CC" />
            <Text style={styles.actionButtonText}>Edit Full Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <MaterialIcons name="logout" size={24} color="#F44336" />
            <Text style={[styles.actionButtonText, styles.dangerText]}>Logout</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Member since {new Date(userProfile.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField}`}
              keyboardType={['age', 'height', 'weight'].includes(editField) ? 'numeric' : 'default'}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="warning" size={48} color="#FF9800" />
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout? Your data will remain saved.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonSaveText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  onEdit?: () => void;
  isLast?: boolean;
}

function InfoRow({ icon, label, value, onEdit, isLast }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <View style={styles.infoLeft}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={20} color="#0066CC" />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <MaterialIcons name="edit" size={20} color="#0066CC" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  aiBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0066CC',
  },
  headerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  metricCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  insightCard: {
    padding: 0,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 20,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  insightStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightStatText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginLeft: 12,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  dangerText: {
    color: '#F44336',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F5F5F5',
  },
  modalButtonCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonSave: {
    backgroundColor: '#0066CC',
  },
  modalButtonDanger: {
    backgroundColor: '#F44336',
  },
  modalButtonSaveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
