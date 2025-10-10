import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MedicalDisclaimerProps {
  compact?: boolean;
  showIcon?: boolean;
}

export default function MedicalDisclaimer({ compact = false, showIcon = true }: MedicalDisclaimerProps) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {showIcon && <MaterialIcons name="info-outline" size={14} color="#f9e2e2ff" />}
        <Text style={styles.compactText}>AI advisory • Consult healthcare provider</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="medical-services" size={20} color="#0066CC" />
        <Text style={styles.title}>Medical Advisory Notice</Text>
      </View>
      <Text style={styles.text}>
        This AI-generated meal plan is for informational purposes only and should not replace professional medical advice. 
        Always consult with your healthcare provider before making significant dietary changes, especially when managing medical conditions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#B3D9FF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    marginLeft: 8,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    color: '#333',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  compactText: {
    fontSize: 11,
    color: '#f9e2e2ff',
    marginLeft: 4,
  },
});