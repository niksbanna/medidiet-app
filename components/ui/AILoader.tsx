import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AILoaderProps {
  message?: string;
  subMessage?: string;
}

export default function AILoader({ 
  message = "AI is creating your personalized meal plan...",
  subMessage
}: AILoaderProps) {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim1 = useRef(new Animated.Value(0.3)).current;
  const fadeAnim2 = useRef(new Animated.Value(0.3)).current;
  const fadeAnim3 = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Pulsing animation for the main icon
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation for outer ring
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Sequential fade animation for dots
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.timing(fadeAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim3, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(fadeAnim1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(fadeAnim2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(fadeAnim3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 0.8, duration: 300, useNativeDriver: true }),
        ]),
      ])
    );

    pulseAnimation.start();
    rotateAnimation.start();
    dotsAnimation.start();

    return () => {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
      fadeAnim1.stopAnimation();
      fadeAnim2.stopAnimation();
      fadeAnim3.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        {/* Outer rotating ring */}
        <Animated.View 
          style={[
            styles.outerRing,
            { transform: [{ rotate: spin }] }
          ]}
        >
          <View style={styles.ringSegment1} />
          <View style={styles.ringSegment2} />
          <View style={styles.ringSegment3} />
        </Animated.View>

        {/* Middle pulsing circle */}
        <Animated.View 
          style={[
            styles.middleCircle,
            { transform: [{ scale: pulseAnim }] }
          ]}
        />

        {/* Center AI icon */}
        <Animated.View 
          style={[
            styles.centerIcon,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <MaterialIcons name="psychology" size={56} color="#FFFFFF" />
        </Animated.View>

        {/* Orbiting particles */}
        <Animated.View 
          style={[
            styles.particle,
            styles.particle1,
            { transform: [{ rotate: spin }] }
          ]}
        >
          <View style={styles.particleDot} />
        </Animated.View>
        <Animated.View 
          style={[
            styles.particle,
            styles.particle2,
            { 
              transform: [
                { rotate: spin },
                { rotateZ: '120deg' }
              ] 
            }
          ]}
        >
          <View style={styles.particleDot} />
        </Animated.View>
        <Animated.View 
          style={[
            styles.particle,
            styles.particle3,
            { 
              transform: [
                { rotate: spin },
                { rotateZ: '240deg' }
              ] 
            }
          ]}
        >
          <View style={styles.particleDot} />
        </Animated.View>
      </View>

      {/* Text content */}
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{message}</Text>
        {subMessage && (
          <Text style={styles.subText}>{subMessage}</Text>
        )}
        
        {/* Animated dots */}
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: fadeAnim1 }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim2 }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim3 }]} />
        </View>
      </View>

      {/* Status indicators */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <MaterialIcons name="analytics" size={16} color="#0066CC" />
          <Text style={styles.statusText}>Analyzing nutrition</Text>
        </View>
        <View style={styles.statusItem}>
          <MaterialIcons name="restaurant" size={16} color="#0066CC" />
          <Text style={styles.statusText}>Selecting meals</Text>
        </View>
        <View style={styles.statusItem}>
          <MaterialIcons name="schedule" size={16} color="#0066CC" />
          <Text style={styles.statusText}>Planning schedule</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FAFAFA',
  },
  loaderContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSegment1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#0066CC',
    borderRightColor: '#0066CC',
  },
  ringSegment2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'transparent',
    borderBottomColor: '#4CAF50',
    borderLeftColor: '#4CAF50',
  },
  ringSegment3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#FF9800',
  },
  middleCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F3FF',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  particle: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  particle1: {},
  particle2: {},
  particle3: {},
  particleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066CC',
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066CC',
    marginHorizontal: 4,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    fontWeight: '500',
  },
});
