import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AvatarInitials } from "@/components/AvatarInitials";
import { useApp } from "@/context/AppContext";
import { BookedSession } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function BookingCard({ booking }: { booking: BookedSession }) {
  const colors = useColors();
  const { t, textSize, removeBooking } = useApp();
  const fontSize = textSize === "large" ? 1.15 : 1;

  function handleDirections() {
    const url = Platform.select({
      ios: `maps:?q=${encodeURIComponent(booking.location)}`,
      android: `geo:0,0?q=${encodeURIComponent(booking.location)}`,
      default: `https://maps.google.com/?q=${encodeURIComponent(booking.location)}`,
    });
    Linking.openURL(url!);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleCancel() {
    Alert.alert("Cancel Booking?", "Are you sure you want to cancel this session?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => {
          removeBooking(booking.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  }

  const statusColor = booking.status === "upcoming" ? colors.primary : booking.status === "completed" ? colors.gold : colors.destructive;
  const statusBg = booking.status === "upcoming" ? colors.secondary : booking.status === "completed" ? colors.accent : "rgba(220,38,38,0.1)";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <AvatarInitials
          initials={booking.guruInitials}
          color={booking.guruAvatarColor}
          size={44}
          fontSize={16}
        />
        <View style={styles.cardInfo}>
          <Text style={[styles.guruName, { color: colors.foreground, fontSize: 15 * fontSize }]} numberOfLines={1}>
            {booking.guruName}
          </Text>
          <Text style={[styles.subject, { color: colors.mutedForeground, fontSize: 12 * fontSize }]} numberOfLines={1}>
            {booking.subject}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor, fontSize: 11 * fontSize }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.foreground, fontSize: 13 * fontSize }]}>
            {booking.date} · {booking.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.detailText, { color: colors.foreground, fontSize: 13 * fontSize }]} numberOfLines={1}>
            {booking.location}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
          onPress={handleDirections}
        >
          <Ionicons name="navigate-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.deepGreen, fontSize: 12 * fontSize }]}>
            {t("directions")}
          </Text>
        </TouchableOpacity>

        {booking.status === "upcoming" && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "rgba(220,38,38,0.08)" }]}
            onPress={handleCancel}
          >
            <Ionicons name="close-circle-outline" size={16} color={colors.destructive} />
            <Text style={[styles.actionText, { color: colors.destructive, fontSize: 12 * fontSize }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function BookingsScreen() {
  const colors = useColors();
  const { t, textSize, bookings } = useApp();
  const insets = useSafeAreaInsets();
  const fontSize = textSize === "large" ? 1.15 : 1;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function renderBooking({ item, index }: { item: BookedSession; index: number }) {
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
        <BookingCard booking={item} />
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={[styles.title, { color: colors.foreground, fontSize: 24 * fontSize }]}>
          {t("myBookings")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
          {bookings.length} session{bookings.length !== 1 ? "s" : ""} booked
        </Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 100 + (Platform.OS === "web" ? 34 : insets.bottom) },
        ]}
        scrollEnabled={!!bookings.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {t("noBookings")}
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Discover gurus and book your first session
            </Text>
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
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  guruName: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  subject: {
    fontFamily: "Inter_400Regular",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  divider: {
    height: 1,
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
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
