import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AvatarInitials } from "@/components/AvatarInitials";
import { useApp } from "@/context/AppContext";
import { Session } from "@/data/mockData";
import { GURUS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface SessionCardProps {
  session: Session;
  onBook?: (session: Session) => void;
  booked?: boolean;
}

export function SessionCard({ session, onBook, booked = false }: SessionCardProps) {
  const colors = useColors();
  const { t, textSize } = useApp();
  const fontSize = textSize === "large" ? 1.15 : 1;

  const guru = GURUS.find((g) => g.id === session.guruId);

  function handleBook() {
    if (booked) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (onBook) onBook(session);
  }

  const spotsColor = session.spotsLeft <= 3 ? "#EF4444" : colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.dateBlock, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.dateDay, { color: colors.deepGreen }]}>
            {session.date.split(",")[0]}
          </Text>
          <Text style={[styles.dateFull, { color: colors.primary }]}>
            {session.date.split(", ")[1]?.slice(0, 6)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.subject, { color: colors.foreground, fontSize: 14 * fontSize }]} numberOfLines={2}>
            {session.subject}
          </Text>
          <View style={styles.row}>
            {guru && (
              <AvatarInitials initials={guru.initials} color={guru.avatarColor} size={20} fontSize={8} />
            )}
            <Text style={[styles.guruName, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
              {session.guruName}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
            {session.time} · {session.duration}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.mutedForeground, fontSize: 12 * fontSize }]} numberOfLines={1}>
            {session.location}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Feather name="users" size={14} color={spotsColor} />
          <Text style={[styles.detailText, { color: spotsColor, fontSize: 12 * fontSize }]}>
            {session.spotsLeft} {t("spotsLeft")} · {session.mode}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.bookBtn,
          { backgroundColor: booked ? colors.secondary : colors.primary },
        ]}
        onPress={handleBook}
        disabled={booked}
      >
        <Text style={[styles.bookText, { color: booked ? colors.deepGreen : colors.primaryForeground, fontSize: 13 * fontSize }]}>
          {booked ? t("booked") : t("bookSession")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    gap: 12,
  },
  dateBlock: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dateFull: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  subject: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  guruName: {
    fontFamily: "Inter_400Regular",
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  bookBtn: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  bookText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
});
