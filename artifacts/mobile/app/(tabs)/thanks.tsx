import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppreciationCard } from "@/components/AppreciationCard";
import { useApp } from "@/context/AppContext";
import { Appreciation, GURUS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const GRADIENT_PAIRS = [
  ["#2D6A4F", "#3D9A6A"],
  ["#C4520A", "#EA580C"],
  ["#6B3FA0", "#8B5CF6"],
  ["#0369A1", "#0EA5E9"],
  ["#BE185D", "#EC4899"],
  ["#CA8A04", "#D97706"],
];

export default function ThanksScreen() {
  const colors = useColors();
  const { t, textSize, appreciations, addAppreciation } = useApp();
  const insets = useSafeAreaInsets();
  const fontSize = textSize === "large" ? 1.15 : 1;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [modalVisible, setModalVisible] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [message, setMessage] = useState("");
  const [selectedGuru, setSelectedGuru] = useState(GURUS[0].name);

  function handlePost() {
    if (!studentName.trim() || !message.trim()) return;
    const pair = GRADIENT_PAIRS[Math.floor(Math.random() * GRADIENT_PAIRS.length)];
    const newNote: Appreciation = {
      id: `app-${Date.now()}`,
      studentName: studentName.trim(),
      grade: grade.trim() || "Student",
      school: school.trim() || "Village School",
      guruName: selectedGuru,
      message: message.trim(),
      date: "June 2026",
      gradientStart: pair[0],
      gradientEnd: pair[1],
    };
    addAppreciation(newNote);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(false);
    setStudentName("");
    setGrade("");
    setSchool("");
    setMessage("");
  }

  function renderItem({ item, index }: { item: Appreciation; index: number }) {
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
        <AppreciationCard item={item} />
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground, fontSize: 24 * fontSize }]}>
              {t("appreciationWall")}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
              {appreciations.length} notes of gratitude
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => { setModalVisible(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={appreciations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 100 + (Platform.OS === "web" ? 34 : insets.bottom) },
        ]}
        scrollEnabled={!!appreciations.length}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <Animated.View
            entering={SlideInDown.springify()}
            style={[styles.modalCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {t("thankYouNote")}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalFields}>
                {[
                  { label: t("yourName"), value: studentName, onChange: setStudentName, placeholder: "Your name" },
                  { label: t("grade"), value: grade, onChange: setGrade, placeholder: "e.g., 10th Grade" },
                  { label: t("school"), value: school, onChange: setSchool, placeholder: "School name" },
                ].map((field) => (
                  <View key={field.label} style={styles.field}>
                    <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{field.label}</Text>
                    <TextInput
                      style={[styles.fieldInput, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]}
                      placeholder={field.placeholder}
                      placeholderTextColor={colors.mutedForeground}
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  </View>
                ))}

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Guru / Mentor</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.guruRow}>
                    {GURUS.slice(0, 6).map((g) => (
                      <TouchableOpacity
                        key={g.id}
                        onPress={() => setSelectedGuru(g.name)}
                        style={[
                          styles.guruChip,
                          {
                            backgroundColor: selectedGuru === g.name ? colors.primary : colors.secondary,
                            borderColor: selectedGuru === g.name ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text style={{ color: selectedGuru === g.name ? "#fff" : colors.deepGreen, fontSize: 12, fontFamily: "Inter_500Medium" }}>
                          {g.name.split(" ")[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{t("message")}</Text>
                  <TextInput
                    style={[
                      styles.fieldInput,
                      styles.messageInput,
                      { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                    placeholder="Share how this mentor changed your life..."
                    placeholderTextColor={colors.mutedForeground}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.postBtn, { backgroundColor: studentName.trim() && message.trim() ? colors.primary : colors.muted }]}
                  onPress={handlePost}
                  disabled={!studentName.trim() || !message.trim()}
                >
                  <Text style={[styles.postText, { color: studentName.trim() && message.trim() ? "#fff" : colors.mutedForeground }]}>
                    {t("postNote")}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  modalFields: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  fieldInput: {
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    height: 44,
  },
  messageInput: {
    height: 100,
    textAlignVertical: "top",
  },
  guruRow: {
    flexDirection: "row",
  },
  guruChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  modalActions: {
    marginTop: 20,
    paddingBottom: 8,
  },
  postBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  postText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
});
