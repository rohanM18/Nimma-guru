import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AvatarInitials } from "@/components/AvatarInitials";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface ProfileRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileRow({ icon, label, value }: ProfileRowProps) {
  const colors = useColors();
  if (!value) return null;
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const { role, studentProfile, guruProfile, bookings, t, textSize } = useApp();
  const insets = useSafeAreaInsets();
  const fontSize = textSize === "large" ? 1.15 : 1;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const isGuru = role === "guru";
  const profile = isGuru ? guruProfile : studentProfile;
  const name = isGuru ? guruProfile.fullName : studentProfile.fullName;
  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : role === "guru" ? "G" : "S";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: 100 + (Platform.OS === "web" ? 34 : insets.bottom),
      }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={isGuru ? [colors.warmOrange, colors.gold] : [colors.deepGreen, colors.primary]}
        style={[styles.headerGradient, { paddingTop: topPad + 16 }]}
      >
        <AvatarInitials
          initials={initials}
          color="rgba(255,255,255,0.25)"
          size={80}
          fontSize={30}
        />
        <Text style={[styles.name, { fontSize: 22 * fontSize }]}>
          {name || (isGuru ? "Guru Profile" : "Student Profile")}
        </Text>
        <View style={styles.roleBadge}>
          {isGuru ? (
            <Ionicons name="school" size={14} color="rgba(255,255,255,0.9)" />
          ) : (
            <MaterialCommunityIcons name="book-open-page-variant" size={14} color="rgba(255,255,255,0.9)" />
          )}
          <Text style={styles.roleText}>
            {isGuru ? guruProfile.profession || "Guru / Mentor" : "Student / Learner"}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{isGuru ? "0" : "0"}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>KA</Text>
            <Text style={styles.statLabel}>Region</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 16 * fontSize }]}>
          Profile Details
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {isGuru ? (
            <>
              <ProfileRow icon={<Ionicons name="briefcase-outline" size={18} color={colors.primary} />} label="Profession" value={guruProfile.profession} />
              <ProfileRow icon={<Ionicons name="time-outline" size={18} color={colors.primary} />} label={t("experience")} value={guruProfile.experience} />
              <ProfileRow icon={<Ionicons name="location-outline" size={18} color={colors.primary} />} label={t("village")} value={guruProfile.village} />
              <ProfileRow icon={<Ionicons name="book-outline" size={18} color={colors.primary} />} label={t("subjectsTaught")} value={guruProfile.subjects} />
              <ProfileRow icon={<Ionicons name="calendar-outline" size={18} color={colors.primary} />} label={t("availability")} value={guruProfile.availability} />
              <ProfileRow icon={<MaterialCommunityIcons name="whatsapp" size={18} color={colors.primary} />} label="WhatsApp" value={guruProfile.whatsapp} />
              <ProfileRow icon={<Feather name="info" size={18} color={colors.primary} />} label="Bio" value={guruProfile.bio} />
            </>
          ) : (
            <>
              <ProfileRow icon={<Ionicons name="school-outline" size={18} color={colors.primary} />} label="School" value={studentProfile.school} />
              <ProfileRow icon={<Ionicons name="calendar-outline" size={18} color={colors.primary} />} label="Age" value={studentProfile.age} />
              <ProfileRow icon={<Ionicons name="location-outline" size={18} color={colors.primary} />} label={t("village")} value={studentProfile.village} />
              <ProfileRow icon={<Ionicons name="book-outline" size={18} color={colors.primary} />} label="Preferred Subjects" value={studentProfile.subjects} />
              <ProfileRow icon={<Ionicons name="heart-outline" size={18} color={colors.primary} />} label="Interests" value={studentProfile.interests} />
              <ProfileRow icon={<Feather name="info" size={18} color={colors.primary} />} label="Bio" value={studentProfile.bio} />
            </>
          )}

          {!name && (
            <View style={styles.emptyProfile}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Your profile details will appear here after setup.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.section, { paddingHorizontal: 16 }]}>
        <TouchableOpacity
          style={[styles.settingsLink, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { router.push("/settings"); Haptics.selectionAsync(); }}
        >
          <Ionicons name="settings-outline" size={20} color={colors.mutedForeground} />
          <Text style={[styles.settingsLinkText, { color: colors.foreground, fontSize: 14 * fontSize }]}>
            {t("settings")}
          </Text>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    alignItems: "center",
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 8,
  },
  name: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 0,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statNum: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  statDivider: {
    width: 1,
    height: 32,
    marginHorizontal: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 28,
    alignItems: "center",
    marginTop: 2,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  emptyProfile: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  settingsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  settingsLinkText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
});
