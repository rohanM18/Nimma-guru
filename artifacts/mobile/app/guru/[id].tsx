import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AvatarInitials } from "@/components/AvatarInitials";
import { useApp } from "@/context/AppContext";
import { GURUS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

function StarRating({ rating, onRate, size = 28 }: { rating: number; onRate?: (r: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onRate?.(i)} disabled={!onRate}>
          <Ionicons name={i <= rating ? "star" : "star-outline"} size={size} color="#F59E0B" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function GuruDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { t, textSize, addBooking, bookings, reviews, addReview, currentUser } = useApp();
  const insets = useSafeAreaInsets();
  const fontSize = textSize === "large" ? 1.15 : 1;
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [reviewModal, setReviewModal] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState(currentUser?.name ?? "");
  const [submitted, setSubmitted] = useState(false);

  const guru = GURUS.find((g) => g.id === id);
  if (!guru) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, textAlign: "center", marginTop: 100 }}>Guru not found</Text>
      </View>
    );
  }

  const isBooked = bookings.some((b) => b.guruId === guru.id);
  const guruReviews = reviews[guru.id] ?? [];

  function handleWhatsApp() {
    const number = guru.whatsapp.replace(/\s+/g, "");
    const url = `https://wa.me/${number.replace("+", "")}?text=Hello ${guru.name}, I found you on NimmaGuru.`;
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
    Linking.openURL(url!);
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
  }

  function submitReview() {
    if (!comment.trim() || !reviewerName.trim()) return;
    addReview(guru.id, {
      id: `rev-${guru.id}-${Date.now()}`,
      guruId: guru.id,
      reviewerName: reviewerName.trim(),
      rating: starRating,
      comment: comment.trim(),
      date: "June 2026",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
    setTimeout(() => {
      setReviewModal(false);
      setComment("");
      setStarRating(5);
      setSubmitted(false);
    }, 2000);
  }

  const avgRating = guruReviews.length
    ? (guruReviews.reduce((s, r) => s + r.rating, 0) / guruReviews.length).toFixed(1)
    : guru.rating.toFixed(1);
  const totalReviews = guruReviews.length + guru.reviewCount;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 + botPad }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[guru.avatarColor, colors.primary]}
          style={[styles.headerGradient, { paddingTop: topPad + 16 }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => { router.back(); Haptics.selectionAsync(); }}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <AvatarInitials initials={guru.initials} color="rgba(255,255,255,0.2)" size={88} fontSize={32} />
          <Text style={[styles.name, { fontSize: 24 * fontSize }]}>{guru.name}</Text>
          <Text style={styles.profession}>{guru.profession}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.location}>{guru.village}, {guru.district} · Karnataka</Text>
          </View>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name={i <= Math.floor(Number(avgRating)) ? "star" : "star-outline"} size={16} color="#F59E0B" />
            ))}
            <Text style={styles.ratingText}>{avgRating} ({totalReviews} {t("reviews")})</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          {[
            { label: t("sessionsCompleted"), value: String(guru.sessionsCompleted) },
            { label: t("studentsTaught"), value: String(guru.studentsTaught) },
            { label: t("experience"), value: guru.experience },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary, fontSize: 18 * fontSize }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground, fontSize: 11 * fontSize }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 15 * fontSize }]}>About</Text>
          <Text style={[styles.bioText, { color: colors.foreground, fontSize: 14 * fontSize }]}>{guru.bio}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 15 * fontSize }]}>{t("subjectsTaught")}</Text>
          <View style={styles.tags}>
            {guru.subjects.map((s) => (
              <View key={s} style={[styles.tag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.tagText, { color: colors.deepGreen, fontSize: 13 * fontSize }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: <Ionicons name="time-outline" size={18} color={colors.primary} />, label: t("availability"), value: guru.availability },
            { icon: <Ionicons name="language-outline" size={18} color={colors.primary} />, label: t("languages"), value: guru.languages.join(", ") },
          ].map((row) => (
            <View key={row.label} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              {row.icon}
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground, fontSize: 11 * fontSize }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: colors.foreground, fontSize: 14 * fontSize }]}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: 15 * fontSize }]}>
              Student Reviews ({guruReviews.length + guru.reviewCount})
            </Text>
            <TouchableOpacity
              style={[styles.writeReviewBtn, { backgroundColor: colors.secondary }]}
              onPress={() => { setReviewModal(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Feather name="edit-2" size={13} color={colors.primary} />
              <Text style={[styles.writeReviewText, { color: colors.deepGreen }]}>Write a Review</Text>
            </TouchableOpacity>
          </View>

          {guruReviews.map((review) => (
            <Animated.View entering={FadeIn.springify()} key={review.id} style={[styles.reviewCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.reviewTop}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.reviewAvatarText}>{review.reviewerName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reviewName, { color: colors.foreground }]}>{review.reviewerName}</Text>
                  <StarRating rating={review.rating} size={14} />
                </View>
                <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{review.date}</Text>
              </View>
              <Text style={[styles.reviewComment, { color: colors.foreground }]}>{review.comment}</Text>
            </Animated.View>
          ))}

          {guruReviews.length === 0 && (
            <View style={styles.noReviews}>
              <Ionicons name="chatbubble-outline" size={28} color={colors.mutedForeground} />
              <Text style={[styles.noReviewsText, { color: colors.mutedForeground }]}>
                Be the first to review {guru.name.split(" ")[0]}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomActions, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: botPad + 16 }]}>
        <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: colors.secondary }]} onPress={handleWhatsApp}>
          <MaterialCommunityIcons name="whatsapp" size={20} color={colors.primary} />
          <Text style={[styles.bottomBtnText, { color: colors.deepGreen }]}>{t("whatsapp")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: colors.muted }]} onPress={handleDirections}>
          <Ionicons name="navigate-outline" size={20} color={colors.mutedForeground} />
          <Text style={[styles.bottomBtnText, { color: colors.mutedForeground }]}>{t("directions")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: isBooked ? colors.secondary : colors.primary }]}
          onPress={handleBook}
          disabled={isBooked}
        >
          <Text style={[styles.bookBtnText, { color: isBooked ? colors.deepGreen : "#fff" }]}>
            {isBooked ? t("booked") : t("bookSession")}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={reviewModal} animationType="slide" transparent onRequestClose={() => setReviewModal(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View entering={SlideInDown.springify()} style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />

            {submitted ? (
              <Animated.View entering={FadeIn.springify()} style={styles.successContainer}>
                <View style={[styles.successIcon, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="checkmark-circle" size={56} color={colors.primary} />
                </View>
                <Text style={[styles.successTitle, { color: colors.foreground }]}>Thank you!</Text>
                <Text style={[styles.successText, { color: colors.mutedForeground }]}>
                  Your review has been posted successfully ✓
                </Text>
              </Animated.View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.foreground }]}>Rate {guru.name.split(" ")[0]}</Text>
                  <TouchableOpacity onPress={() => setReviewModal(false)}>
                    <Feather name="x" size={22} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>

                <View style={styles.starsContainer}>
                  <StarRating rating={starRating} onRate={(r) => { setStarRating(r); Haptics.selectionAsync(); }} size={36} />
                  <Text style={[styles.starLabel, { color: colors.mutedForeground }]}>
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][starRating]}
                  </Text>
                </View>

                <View style={[styles.reviewInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.reviewInputLabel, { color: colors.foreground }]}>Your Name</Text>
                  <TextInput
                    style={[styles.reviewTextField, { color: colors.foreground }]}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.mutedForeground}
                    value={reviewerName}
                    onChangeText={setReviewerName}
                  />
                </View>

                <View style={[styles.reviewInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.reviewInputLabel, { color: colors.foreground }]}>Your Review</Text>
                  <TextInput
                    style={[styles.reviewTextField, styles.reviewTextArea, { color: colors.foreground }]}
                    placeholder="Share how this mentor helped you..."
                    placeholderTextColor={colors.mutedForeground}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitReviewBtn,
                    { backgroundColor: comment.trim() && reviewerName.trim() ? colors.primary : colors.muted },
                  ]}
                  onPress={submitReview}
                  disabled={!comment.trim() || !reviewerName.trim()}
                >
                  <Text style={[styles.submitReviewText, { color: comment.trim() && reviewerName.trim() ? "#fff" : colors.mutedForeground }]}>
                    Submit Review
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { alignItems: "center", paddingBottom: 28, paddingHorizontal: 20, gap: 6 },
  backBtn: {
    position: "absolute", top: 16, left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center",
  },
  name: { color: "#fff", fontFamily: "Inter_700Bold", fontWeight: "700", textAlign: "center" },
  profession: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Inter_400Regular" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontFamily: "Inter_500Medium", marginLeft: 4 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 16 },
  statCard: { flex: 1, alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
  statValue: { fontFamily: "Inter_700Bold", fontWeight: "700" },
  statLabel: { fontFamily: "Inter_400Regular", textAlign: "center" },
  section: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontWeight: "700" },
  bioText: { fontFamily: "Inter_400Regular", lineHeight: 22 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontFamily: "Inter_500Medium", fontWeight: "500" },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  infoLabel: { fontFamily: "Inter_500Medium", fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontFamily: "Inter_400Regular", lineHeight: 20 },
  reviewsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  writeReviewBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  writeReviewText: { fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  reviewCard: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 8, marginTop: 8 },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold", fontWeight: "700" },
  reviewName: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  reviewDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  reviewComment: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  noReviews: { alignItems: "center", gap: 6, paddingVertical: 16 },
  noReviewsText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  bottomActions: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1,
  },
  bottomBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20 },
  bottomBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  bookBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 20 },
  bookBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", fontWeight: "700" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 16, paddingBottom: 32 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: 4 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold", fontWeight: "700" },
  starsContainer: { alignItems: "center", gap: 8 },
  starLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  reviewInput: { borderRadius: 12, borderWidth: 1.5, padding: 12, gap: 4 },
  reviewInputLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600", marginBottom: 4 },
  reviewTextField: { fontSize: 14, fontFamily: "Inter_400Regular" },
  reviewTextArea: { height: 80, textAlignVertical: "top" },
  submitReviewBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  submitReviewText: { fontSize: 15, fontFamily: "Inter_700Bold", fontWeight: "700" },
  successContainer: { alignItems: "center", paddingVertical: 24, gap: 12 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold", fontWeight: "700" },
  successText: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
});
