import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const colors = useColors();
  const { isOnboarded } = useApp();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    const timer = setTimeout(() => {
      if (isOnboarded) {
        router.replace("/(tabs)/gurus");
      } else {
        router.replace("/onboarding");
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isOnboarded]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topPad },
      ]}
    >
      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🪔</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={[styles.appName, { color: colors.foreground }]}>NimmaGuru</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Village mentorship through Gyaan-Daan
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1200)} style={styles.taglineKn}>
          <Text style={[styles.taglineKnText, { color: colors.primary }]}>
            ಜ್ಞಾನ-ದಾನದ ಮೂಲಕ ಗ್ರಾಮ ಮಾರ್ಗದರ್ಶನ
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeIn.delay(900)}
        style={styles.footer}
      >
        <View style={styles.dots}>
          <Animated.View
            entering={FadeIn.delay(1000)}
            style={[styles.dot, { backgroundColor: colors.primary }]}
          />
          <Animated.View
            entering={FadeIn.delay(1200)}
            style={[styles.dot, { backgroundColor: colors.gold }]}
          />
          <Animated.View
            entering={FadeIn.delay(1400)}
            style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.4 }]}
          />
        </View>
        <Text style={[styles.madeWith, { color: colors.mutedForeground }]}>
          Connecting Karnataka · One mentor at a time
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 48,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  taglineKn: {
    marginTop: 4,
  },
  taglineKnText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  footer: {
    alignItems: "center",
    gap: 10,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  madeWith: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
