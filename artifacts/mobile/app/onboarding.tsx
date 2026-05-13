import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const colors = useColors();
  const { setRole, t } = useApp();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<"student" | "guru" | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleSelect(role: "student" | "guru") {
    setSelected(role);
    await setRole(role);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => router.push("/auth"), 300);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <View style={[styles.logoMini, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoEmoji}>🪔</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          How will you use{"\n"}NimmaGuru?
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          ನೀವು ಹೇಗೆ NimmaGuru ಬಳಸಲಿದ್ದೀರಿ?
        </Text>
      </Animated.View>

      <View style={styles.cards}>
        <Animated.View entering={FadeInDown.delay(200).springify()} style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleSelect("student")}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={
                selected === "student"
                  ? [colors.deepGreen, colors.primary]
                  : [colors.card, colors.card]
              }
              style={[
                styles.roleCard,
                {
                  borderColor: selected === "student" ? colors.primary : colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: selected === "student" ? "rgba(255,255,255,0.2)" : colors.lightGreen }]}>
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  size={36}
                  color={selected === "student" ? "#fff" : colors.primary}
                />
              </View>
              <Text style={[styles.roleTitle, { color: selected === "student" ? "#fff" : colors.foreground }]}>
                {t("learn")}
              </Text>
              <Text style={[styles.roleSubtitle, { color: selected === "student" ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
                {t("student")}
              </Text>
              <Text style={[styles.roleDesc, { color: selected === "student" ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                Find mentors, book sessions, and grow under the guidance of experts from your community.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleSelect("guru")}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={
                selected === "guru"
                  ? [colors.warmOrange, "#D4A017"]
                  : [colors.card, colors.card]
              }
              style={[
                styles.roleCard,
                {
                  borderColor: selected === "guru" ? colors.warmOrange : colors.border,
                  borderWidth: 2,
                },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: selected === "guru" ? "rgba(255,255,255,0.2)" : colors.accent }]}>
                <Ionicons
                  name="school"
                  size={36}
                  color={selected === "guru" ? "#fff" : colors.warmOrange}
                />
              </View>
              <Text style={[styles.roleTitle, { color: selected === "guru" ? "#fff" : colors.foreground }]}>
                {t("teach")}
              </Text>
              <Text style={[styles.roleSubtitle, { color: selected === "guru" ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>
                {t("mentor")}
              </Text>
              <Text style={[styles.roleDesc, { color: selected === "guru" ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                Share your years of expertise with the next generation. Your knowledge is a gift — give it freely.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={{ height: botPad + 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
    gap: 8,
  },
  logoMini: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 26,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  cards: {
    flex: 1,
    flexDirection: "column",
    gap: 14,
  },
  roleCard: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    gap: 8,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  roleSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  roleDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginTop: 4,
  },
});
