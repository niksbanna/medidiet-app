import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutrientBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  warning?: boolean;
}

export default function NutrientBar({ 
  label, 
  current, 
  target, 
  unit, 
  color, 
  warning = false 
}: NutrientBarProps) {
  const hasTarget = target > 0;
  const percentage = hasTarget ? Math.min((current / target) * 100, 100) : 0;
  const isOver = hasTarget && current > target;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, warning && styles.warningText]}>{label}</Text>
        {hasTarget ? (
          <Text style={[styles.values, warning && styles.warningText]}>
            {Math.round(current)}/{Math.round(target)} {unit}
          </Text>
        ) : (
          <Text style={styles.values}>Target not set</Text>
        )}
      </View>
      
      <View style={styles.barContainer}>
        {hasTarget ? (
          <View 
            style={[
              styles.bar, 
              { 
                width: `${percentage}%`, 
                backgroundColor: warning || isOver ? '#FF6B6B' : color 
              }
            ]} 
          />
        ) : (
          <View style={[styles.bar, { width: '0%' }]} />
        )}
      </View>
      
      {isOver && (
        <Text style={styles.overText}>
          {Math.round(current - target)} {unit} over target
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  values: {
    fontSize: 13,
    color: '#666',
  },
  warningText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  barContainer: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
  overText: {
    fontSize: 11,
    color: '#FF6B6B',
    marginTop: 2,
    fontWeight: '500',
  },
});
