import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AvatarInitials } from "@/components/AvatarInitials";
import { useApp } from "@/context/AppContext";
import { Guru } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface GuruCardProps {
  guru: Guru;
  onBook?: () => void;
}

export function GuruCard({ guru, onBook }: GuruCardProps) {
  const colors = useColors();
  const { t, textSize, addBooking, bookings } = useApp();
  const isBooked = bookings.some((b) => b.guruId === guru.id);
  const fontSize = textSize === "large" ? 1.15 : 1;

  function handleWhatsApp() {
    const number = guru.whatsapp.replace(/\s+/g, "");
    const url = `https://wa.me/${number.replace("+", "")}?text=Hello ${guru.name}, I found you on NimmaGuru and would like to learn from you.`;
    Linking.openURL(url).catch(() => Alert.alert("Cannot open WhatsApp"));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleDirections() {
    const query = encodeURIComponent(`${guru.village}, ${guru.district}, Karnataka`);
    const url = Platform.select({
      ios: `maps:?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://maps.google.com/?q=${query}`,
    });
    Linking.openURL(url!).catch(() => {});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleBook() {
    if (isBooked) return;
    addBooking({
      id: `bk-${guru.id}-${Date.now()}`,
      guruId: guru.id,
      guruName: guru.name,
      subject: guru.subjects[0],
      date: "Fri, 20 Jun 2026",
      time: "4:00 PM",
      location: `${guru.village}, ${guru.district}`,
      status: "upcoming",
      guruInitials: guru.initials,
      guruAvatarColor: guru.avatarColor,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (onBook) onBook();
  }

  function handleCardPress() {
    router.push(`/guru/${guru.id}`);
    Haptics.selectionAsync();
  }

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handleCardPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <AvatarInitials initials={guru.initials} color={guru.avatarColor} size={54} fontSize={20} />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.foreground, fontSize: 16 * fontSize }]} numberOfLines={1}>
            {guru.name}
          </Text>
          <Text style={[styles.profession, { color: colors.mutedForeground, fontSize: 12 * fontSize }]} numberOfLines={1}>
            {guru.profession}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={12} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.primary, fontSize: 11 * fontSize }]}>
              {guru.village}, {guru.district}
            </Text>
          </View>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.foreground }]}>{guru.rating}</Text>
        </View>
      </View>

      <View style={styles.subjectsRow}>
        {guru.subjects.slice(0, 3).map((s) => (
          <View key={s} style={[styles.subjectTag, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.subjectText, { color: colors.deepGreen, fontSize: 11 * fontSize }]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={handleWhatsApp}>
          <MaterialCommunityIcons name="whatsapp" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.deepGreen, fontSize: 12 * fontSize }]}>
            {t("whatsapp")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.muted }]} onPress={handleDirections}>
          <Ionicons name="navigate-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.actionText, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
            {t("directions")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bookBtn,
            {
              backgroundColor: isBooked ? colors.secondary : colors.primary,
            },
          ]}
          onPress={handleBook}
          disabled={isBooked}
        >
          <Text style={[styles.bookText, { color: isBooked ? colors.deepGreen : colors.primaryForeground, fontSize: 12 * fontSize }]}>
            {isBooked ? t("booked") : t("bookSession")}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  profession: {
    fontFamily: "Inter_400Regular",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  metaText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(245,158,11,0.12)",
  },
  ratingText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  subjectsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  subjectTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  subjectText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  actionText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  bookBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
});
