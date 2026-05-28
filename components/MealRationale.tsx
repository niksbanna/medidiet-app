import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import AILoader from './ui/AILoader';
import MedicalDisclaimer from './ui/MedicalDisclaimer';
import { MealItem, UserProfile } from '../types/health';
import { explainMealRationale } from '../services/geminiService';

const SESSION_RATIONALE_CACHE = new Map<string, string[]>();
const STORAGE_KEY_PREFIX = 'meal-rationale-cache:';

interface MealRationaleProps {
  meal: MealItem;
  userProfile: UserProfile;
  dayDate?: string;
  mealType?: string;
}

type LoadState = 'loading' | 'success' | 'error';

function normalizeKeyPart(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function getMealCacheKey(meal: MealItem, dayDate?: string, mealType?: string): string {
  if (meal.id && meal.id.trim().length > 0) {
    return `meal-id:${meal.id}`;
  }

  const stableDay = normalizeKeyPart(dayDate || 'unknown-day');
  const stableType = normalizeKeyPart(mealType || 'unknown-type');
  const stableName = normalizeKeyPart(meal.name || 'unknown-meal');
  return `meal-derived:${stableDay}:${stableType}:${stableName}`;
}

async function readAsyncStorageCache(key: string): Promise<string[] | null> {
  try {
    const rawValue = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!rawValue) {
      return null;
    }
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.map((entry) => String(entry)).filter((entry) => entry.trim().length > 0);
  } catch (error) {
    console.warn('[MEAL RATIONALE] Failed to read cache:', error);
    return null;
  }
}

async function writeAsyncStorageCache(key: string, bullets: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(bullets));
  } catch (error) {
    console.warn('[MEAL RATIONALE] Failed to write cache:', error);
  }
}

export default function MealRationale({ meal, userProfile, dayDate, mealType }: MealRationaleProps) {
  const cacheKey = useMemo(() => getMealCacheKey(meal, dayDate, mealType), [meal, dayDate, mealType]);
  const [state, setState] = useState<LoadState>('loading');
  const [bullets, setBullets] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('Unable to load meal rationale right now.');

  const loadRationale = useCallback(async (forceRefresh = false) => {
    setState('loading');
    setErrorMessage('Unable to load meal rationale right now.');

    if (!forceRefresh) {
      const sessionValue = SESSION_RATIONALE_CACHE.get(cacheKey);
      if (sessionValue) {
        setBullets(sessionValue);
        setState('success');
        return;
      }

      const storedValue = await readAsyncStorageCache(cacheKey);
      if (storedValue && storedValue.length > 0) {
        SESSION_RATIONALE_CACHE.set(cacheKey, storedValue);
        setBullets(storedValue);
        setState('success');
        return;
      }
    }

    try {
      const responseBullets = await explainMealRationale(meal, userProfile);
      const normalizedBullets = responseBullets.filter((bullet) => bullet.trim().length > 0).slice(0, 4);
      if (normalizedBullets.length < 2) {
        throw new Error('Insufficient rationale points returned.');
      }
      SESSION_RATIONALE_CACHE.set(cacheKey, normalizedBullets);
      await writeAsyncStorageCache(cacheKey, normalizedBullets);
      setBullets(normalizedBullets);
      setState('success');
    } catch (error) {
      console.error('[MEAL RATIONALE] Failed to load rationale:', error);
      setErrorMessage('Could not generate rationale. Please try again.');
      setState('error');
    }
  }, [cacheKey, meal, userProfile]);

  useEffect(() => {
    loadRationale();
  }, [loadRationale]);

  if (state === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <AILoader
          message="Why this meal?"
          subMessage="Analyzing your profile and nutrition details"
        />
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="info-outline" size={18} color="#B54708" />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadRationale(true)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="lightbulb-outline" size={16} color="#0066CC" />
        <Text style={styles.title}>Why this meal?</Text>
      </View>
      <View style={styles.bulletList}>
        {bullets.map((bullet, index) => (
          <View key={`${cacheKey}-${index}`} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
      <MedicalDisclaimer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: '#F8FBFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E8FF',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
  },
  bulletList: {
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 14,
    color: '#1A1A1A',
    marginRight: 6,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  loaderContainer: {
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  errorContainer: {
    marginTop: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#9A3412',
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 18,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0066CC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
