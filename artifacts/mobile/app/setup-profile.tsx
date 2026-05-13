import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "phone-pad" | "numeric";
}

function FormField({ label, value, onChange, placeholder, multiline, keyboardType = "default" }: FieldProps) {
  const colors = useColors();
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[
          styles.fieldInput,
          {
            color: colors.foreground,
            backgroundColor: colors.card,
            borderColor: colors.border,
            height: multiline ? 80 : 48,
            textAlignVertical: multiline ? "top" : "center",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

export default function SetupProfileScreen() {
  const colors = useColors();
  const { role, setStudentProfile, setGuruProfile, setIsOnboarded, t } = useApp();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [village, setVillage] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [subjects, setSubjects] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  async function handleSubmit() {
    if (!fullName.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (role === "student") {
      await setStudentProfile({ fullName, age, school, village, bio, interests, subjects });
    } else {
      await setGuruProfile({ fullName, profession, experience, subjects, availability, bio, village, whatsapp });
    }

    await setIsOnboarded(true);
    router.replace("/(tabs)/gurus");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: botPad + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.springify()} style={styles.header}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
            <Ionicons name={role === "guru" ? "school" : "person"} size={32} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {role === "guru" ? "Create your Guru Profile" : "Create your Profile"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            This helps students find and connect with you
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.form}>
          <FormField label={t("fullName")} value={fullName} onChange={setFullName} placeholder="e.g., Nagaraj Patil" />

          {role === "student" && (
            <>
              <FormField label="Age" value={age} onChange={setAge} placeholder="e.g., 16" keyboardType="numeric" />
              <FormField label="School / College" value={school} onChange={setSchool} placeholder="e.g., Govt High School, Dharwad" />
              <FormField label={t("village")} value={village} onChange={setVillage} placeholder="e.g., Alnavar, Dharwad" />
              <FormField label="Subjects of Interest" value={subjects} onChange={setSubjects} placeholder="e.g., Mathematics, Science" />
              <FormField label="Hobbies & Interests" value={interests} onChange={setInterests} placeholder="e.g., Drawing, Cricket" />
              <FormField label="Bio" value={bio} onChange={setBio} placeholder="Tell us a bit about yourself..." multiline />
            </>
          )}

          {role === "guru" && (
            <>
              <FormField label="Former Profession" value={profession} onChange={setProfession} placeholder="e.g., Retired Mathematics Teacher" />
              <FormField label="Years of Experience" value={experience} onChange={setExperience} placeholder="e.g., 30 years" keyboardType="numeric" />
              <FormField label={t("village")} value={village} onChange={setVillage} placeholder="e.g., Alnavar, Dharwad" />
              <FormField label="Subjects / Skills" value={subjects} onChange={setSubjects} placeholder="e.g., Mathematics, Physics" />
              <FormField label={t("availability")} value={availability} onChange={setAvailability} placeholder="e.g., Mon/Wed/Fri 4–6 PM" />
              <FormField label="WhatsApp Number" value={whatsapp} onChange={setWhatsapp} placeholder="+91 9xxxxxxxxx" keyboardType="phone-pad" />
              <FormField label="Bio" value={bio} onChange={setBio} placeholder="Share your story and what you'd like to teach..." multiline />
            </>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: fullName.trim() ? colors.primary : colors.muted },
            ]}
            onPress={handleSubmit}
            disabled={!fullName.trim()}
          >
            <Text style={[styles.submitText, { color: fullName.trim() ? "#fff" : colors.mutedForeground }]}>
              {t("save")} & Continue
            </Text>
            <Feather name="arrow-right" size={18} color={fullName.trim() ? "#fff" : colors.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    gap: 0,
  },
  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  form: {
    gap: 14,
    marginBottom: 20,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  fieldInput: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 12,
  },
  submitText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
