import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from "react-native-reanimated";
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
  autoCapitalize?: "none" | "words" | "sentences";
}

function FormField({ label, value, onChange, placeholder, multiline, keyboardType = "default", autoCapitalize = "sentences" }: FieldProps) {
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
            height: multiline ? 96 : 50,
            textAlignVertical: multiline ? "top" : "center",
            paddingTop: multiline ? 12 : 0,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const GURU_STEPS = [
  { title: "Who are you?", subtitle: "Let students know you", icon: "person-circle-outline" },
  { title: "Your experience", subtitle: "Your professional background", icon: "briefcase-outline" },
  { title: "What you teach", subtitle: "Subjects & when you're free", icon: "book-outline" },
  { title: "Your story", subtitle: "Let students know your journey", icon: "create-outline" },
];

const STUDENT_STEPS = [
  { title: "Who are you?", subtitle: "Your personal details", icon: "person-circle-outline" },
  { title: "Your studies", subtitle: "Tell us about your school", icon: "school-outline" },
  { title: "About you", subtitle: "Your interests and bio", icon: "heart-outline" },
];

export default function SetupProfileScreen() {
  const colors = useColors();
  const { role, studentProfile, guruProfile, setStudentProfile, setGuruProfile, setIsOnboarded, currentUser } = useApp();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const steps = role === "guru" ? GURU_STEPS : STUDENT_STEPS;
  const [step, setStep] = useState(0);
  const [bioLoading, setBioLoading] = useState(false);

  const [fullName, setFullName] = useState(currentUser?.name ?? "");
  const [village, setVillage] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [subjects, setSubjects] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [availability, setAvailability] = useState("");

  async function generateBio() {
    setBioLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const url = `https://${domain}/api/generate-bio`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, name: fullName, village, profession, subjects, experience }),
      });
      const data = await res.json();
      if (data.bio) {
        setBio(data.bio);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      setBio(
        role === "guru"
          ? `I am ${fullName}, a retired ${profession} from ${village} with ${experience} of experience. I am passionate about sharing knowledge with the next generation of students.`
          : `I am ${fullName}, a student from ${village} passionate about learning ${subjects}. I believe in the power of mentorship to transform lives.`
      );
    } finally {
      setBioLoading(false);
    }
  }

  function canProceed(): boolean {
    if (role === "guru") {
      if (step === 0) return fullName.trim().length > 0 && village.trim().length > 0;
      if (step === 1) return profession.trim().length > 0;
      if (step === 2) return subjects.trim().length > 0;
      return true;
    } else {
      if (step === 0) return fullName.trim().length > 0 && village.trim().length > 0;
      if (step === 1) return school.trim().length > 0;
      return true;
    }
  }

  async function handleNext() {
    if (step < steps.length - 1) {
      Haptics.selectionAsync();
      setStep((s) => s + 1);
    } else {
      await handleSubmit();
    }
  }

  function handleBack() {
    if (step > 0) {
      Haptics.selectionAsync();
      setStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (role === "student") {
      await setStudentProfile({ fullName, age, school, village, bio, interests, subjects });
    } else {
      await setGuruProfile({ fullName, profession, experience, subjects, availability, bio, village, whatsapp });
    }
    await setIsOnboarded(true);
    router.replace("/(tabs)/gurus");
  }

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const totalSteps = steps.length;

  function renderGuruStep() {
    if (step === 0) {
      return (
        <>
          <FormField label="Full Name" value={fullName} onChange={setFullName} placeholder="e.g., Nagaraj Patil" autoCapitalize="words" />
          <FormField label="Village / Town" value={village} onChange={setVillage} placeholder="e.g., Alnavar, Dharwad" autoCapitalize="words" />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <FormField label="Former Profession" value={profession} onChange={setProfession} placeholder="e.g., Retired Mathematics Teacher" autoCapitalize="words" />
          <FormField label="Years of Experience" value={experience} onChange={setExperience} placeholder="e.g., 30" keyboardType="numeric" />
          <FormField label="WhatsApp Number (optional)" value={whatsapp} onChange={setWhatsapp} placeholder="+91 9xxxxxxxxx" keyboardType="phone-pad" />
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <FormField label="Subjects / Skills you teach" value={subjects} onChange={setSubjects} placeholder="e.g., Mathematics, Physics, Science" autoCapitalize="words" />
          <FormField label="Availability" value={availability} onChange={setAvailability} placeholder="e.g., Mon/Wed/Fri 4–6 PM" />
        </>
      );
    }
    return (
      <>
        <View style={styles.fieldContainer}>
          <View style={styles.bioLabelRow}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Your Bio</Text>
            <TouchableOpacity
              style={[styles.aiBtn, { backgroundColor: colors.primary, opacity: bioLoading ? 0.7 : 1 }]}
              onPress={generateBio}
              disabled={bioLoading}
            >
              {bioLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={14} color="#fff" />
                  <Text style={styles.aiBtnText}>Generate with AI</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.fieldInput, styles.bioInput, {
              color: colors.foreground, backgroundColor: colors.card,
              borderColor: bio ? colors.primary : colors.border,
            }]}
            placeholder="Share your story and what inspires you to teach..."
            placeholderTextColor={colors.mutedForeground}
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
          />
          <Text style={[styles.bioHint, { color: colors.mutedForeground }]}>
            Tap "Generate with AI" to auto-write your bio based on what you've shared
          </Text>
        </View>
      </>
    );
  }

  function renderStudentStep() {
    if (step === 0) {
      return (
        <>
          <FormField label="Full Name" value={fullName} onChange={setFullName} placeholder="e.g., Priya Sharma" autoCapitalize="words" />
          <FormField label="Age" value={age} onChange={setAge} placeholder="e.g., 16" keyboardType="numeric" />
          <FormField label="Village / Town" value={village} onChange={setVillage} placeholder="e.g., Alnavar, Dharwad" autoCapitalize="words" />
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <FormField label="School / College" value={school} onChange={setSchool} placeholder="e.g., Govt High School, Dharwad" autoCapitalize="words" />
          <FormField label="Subjects I want to learn" value={subjects} onChange={setSubjects} placeholder="e.g., Mathematics, Science, English" autoCapitalize="words" />
        </>
      );
    }
    return (
      <>
        <FormField label="Hobbies & Interests" value={interests} onChange={setInterests} placeholder="e.g., Drawing, Cricket, Reading" autoCapitalize="words" />
        <View style={styles.fieldContainer}>
          <View style={styles.bioLabelRow}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>About Me</Text>
            <TouchableOpacity
              style={[styles.aiBtn, { backgroundColor: colors.primary, opacity: bioLoading ? 0.7 : 1 }]}
              onPress={generateBio}
              disabled={bioLoading}
            >
              {bioLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={14} color="#fff" />
                  <Text style={styles.aiBtnText}>Generate with AI</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.fieldInput, styles.bioInput, {
              color: colors.foreground, backgroundColor: colors.card,
              borderColor: bio ? colors.primary : colors.border,
            }]}
            placeholder="Tell the world a little about yourself..."
            placeholderTextColor={colors.mutedForeground}
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
          />
          <Text style={[styles.bioHint, { color: colors.mutedForeground }]}>
            Tap "Generate with AI" to auto-write your bio
          </Text>
        </View>
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.topBar, { paddingTop: topPad + 12 }]}>
        <View style={styles.progressRow}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  flex: 1,
                  backgroundColor: i <= step ? colors.primary : colors.muted,
                  opacity: i === step ? 1 : i < step ? 0.6 : 0.3,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.stepCount, { color: colors.mutedForeground }]}>
          Step {step + 1} of {totalSteps}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: botPad + 120 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.springify()} key={`header-${step}`} style={styles.stepHeader}>
          <View style={[styles.stepIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name={currentStep.icon as any} size={28} color={colors.primary} />
          </View>
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>{currentStep.title}</Text>
          <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>{currentStep.subtitle}</Text>
        </Animated.View>

        <Animated.View entering={FadeInRight.springify()} key={`fields-${step}`} style={styles.fields}>
          {role === "guru" ? renderGuruStep() : renderStudentStep()}
        </Animated.View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: botPad + 16 }]}>
        {step > 0 && (
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.border }]} onPress={handleBack}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextBtn,
            { backgroundColor: canProceed() ? colors.primary : colors.muted, flex: 1 },
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[styles.nextText, { color: canProceed() ? "#fff" : colors.mutedForeground }]}>
            {isLastStep ? "Complete Profile" : "Next"}
          </Text>
          <Feather name={isLastStep ? "check" : "arrow-right"} size={18} color={canProceed() ? "#fff" : colors.mutedForeground} />
        </TouchableOpacity>

        {isLastStep && (
          <TouchableOpacity style={styles.skipInline} onPress={handleSubmit}>
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { paddingHorizontal: 20, paddingBottom: 8, gap: 8 },
  progressRow: { flexDirection: "row", gap: 6, height: 5 },
  progressDot: { borderRadius: 3 },
  stepCount: { fontSize: 12, fontFamily: "Inter_500Medium", fontWeight: "500" },
  scroll: { paddingHorizontal: 20 },
  stepHeader: { alignItems: "center", paddingVertical: 24, gap: 8 },
  stepIcon: {
    width: 68, height: 68, borderRadius: 34,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  stepTitle: { fontSize: 22, fontFamily: "Inter_700Bold", fontWeight: "700", textAlign: "center" },
  stepSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  fields: { gap: 14 },
  fieldContainer: { gap: 6 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  fieldInput: { borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, fontSize: 15, fontFamily: "Inter_400Regular" },
  bioInput: { height: 120, paddingTop: 12 },
  bioLabelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  aiBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, minWidth: 48, minHeight: 32,
  },
  aiBtnText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  bioHint: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1,
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: "center", justifyContent: "center", borderWidth: 1.5,
  },
  nextBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 14, borderRadius: 14,
  },
  nextText: { fontSize: 16, fontFamily: "Inter_700Bold", fontWeight: "700" },
  skipInline: { paddingVertical: 14, paddingHorizontal: 4 },
  skipText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
