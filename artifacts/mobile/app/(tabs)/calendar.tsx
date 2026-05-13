import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SessionCard } from "@/components/SessionCard";
import { useApp } from "@/context/AppContext";
import { Session, UPCOMING_SESSIONS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

export default function CalendarScreen() {
  const colors = useColors();
  const { t, textSize, addBooking, bookings } = useApp();
  const insets = useSafeAreaInsets();
  const fontSize = textSize === "large" ? 1.15 : 1;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function handleBook(session: Session) {
    const already = bookings.some((b) => b.id === `booked-${session.id}`);
    if (already) return;
    addBooking({
      id: `booked-${session.id}`,
      guruId: session.guruId,
      guruName: session.guruName,
      subject: session.subject,
      date: session.date,
      time: session.time,
      location: session.location,
      status: "upcoming",
      guruInitials: session.guruName.split(" ").map((n) => n[0]).join("").slice(0, 2),
      guruAvatarColor: "#3D9A6A",
    });
  }

  function renderSession({ item, index }: { item: Session; index: number }) {
    const booked = bookings.some((b) => b.id === `booked-${item.id}`);
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
        <SessionCard session={item} onBook={handleBook} booked={booked} />
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={[styles.title, { color: colors.foreground, fontSize: 24 * fontSize }]}>
          {t("upcoming")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
          {UPCOMING_SESSIONS.length} sessions this month
        </Text>

        <View style={[styles.monthBanner, { backgroundColor: colors.secondary }]}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={[styles.monthText, { color: colors.deepGreen, fontSize: 14 * fontSize }]}>
            June 2026 · Karnataka
          </Text>
        </View>
      </View>

      <FlatList
        data={UPCOMING_SESSIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 100 + (Platform.OS === "web" ? 34 : insets.bottom) },
        ]}
        scrollEnabled={!!UPCOMING_SESSIONS.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("noSessions")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  monthBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  monthText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
});
