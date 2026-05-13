import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const { t, language, setLanguage, textSize, setTextSize } = useApp();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const isKannada = language === "kn";

  async function toggleLanguage() {
    await setLanguage(language === "en" ? "kn" : "en");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function toggleTextSize() {
    setTextSize(textSize === "normal" ? "large" : "normal");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad + 32 }}
    >
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("settings")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>LANGUAGE / ಭಾಷೆ</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={toggleLanguage}
          >
            <Ionicons name="language-outline" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>Language / ಭಾಷೆ</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                {isKannada ? "ಕನ್ನಡ (Kannada)" : "English"}
              </Text>
            </View>
            <Switch
              value={isKannada}
              onValueChange={toggleLanguage}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isKannada ? "#fff" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DISPLAY</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Ionicons name="text-outline" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>{t("textSize")}</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                {textSize === "normal" ? t("normal") : t("large")}
              </Text>
            </View>
            <Switch
              value={textSize === "large"}
              onValueChange={toggleTextSize}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.row, { borderBottomColor: "transparent" }]}>
            <Ionicons name="moon-outline" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>{t("darkMode")}</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                Follows system setting
              </Text>
            </View>
            <View style={[styles.systemBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.systemText, { color: colors.deepGreen }]}>Auto</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: <Ionicons name="information-circle-outline" size={20} color={colors.primary} />, title: "About NimmaGuru", sub: "Version 1.0.0" },
            { icon: <Ionicons name="shield-outline" size={20} color={colors.primary} />, title: "Privacy Policy", sub: "How we protect your data" },
            { icon: <Ionicons name="document-text-outline" size={20} color={colors.primary} />, title: "Terms of Service", sub: "Rules and guidelines" },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.row,
                { borderBottomColor: idx < 2 ? colors.border : "transparent" },
              ]}
              onPress={() => Haptics.selectionAsync()}
            >
              {item.icon}
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.logoRow]}>
          <Text style={styles.logoEmoji}>🪔</Text>
          <Text style={[styles.footerName, { color: colors.foreground }]}>NimmaGuru</Text>
        </View>
        <Text style={[styles.footerTagline, { color: colors.mutedForeground }]}>
          ಜ್ಞಾನ-ದಾನದ ಮೂಲಕ ಗ್ರಾಮ ಮಾರ್ಗದರ್ಶನ
        </Text>
        <Text style={[styles.footerSub, { color: colors.mutedForeground }]}>
          Built with love for rural Karnataka
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  rowSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  systemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  systemText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 6,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoEmoji: {
    fontSize: 24,
  },
  footerName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  footerTagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  footerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
