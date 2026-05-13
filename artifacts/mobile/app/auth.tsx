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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Tab = "login" | "signup";

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words" | "sentences";
}

function InputField({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType = "default", autoCapitalize = "none" }: InputFieldProps) {
  const colors = useColors();
  const [show, setShow] = useState(false);
  return (
    <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.inputIcon}>{icon}</View>
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !show}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShow((s) => !s)} style={styles.eyeBtn}>
          <Feather name={show ? "eye" : "eye-off"} size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function AuthScreen() {
  const colors = useColors();
  const { role, setCurrentUser, t } = useApp();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function validate(): string {
    if (tab === "login") {
      if (!loginEmail.includes("@")) return "Enter a valid email address";
      if (loginPassword.length < 6) return "Password must be at least 6 characters";
    } else {
      if (!signupName.trim()) return "Enter your full name";
      if (!signupEmail.includes("@")) return "Enter a valid email address";
      if (signupPassword.length < 6) return "Password must be at least 6 characters";
      if (signupPassword !== signupConfirm) return "Passwords do not match";
    }
    return "";
  }

  async function handleSubmit() {
    setError("");
    const err = validate();
    if (err) { setError(err); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const name = tab === "signup" ? signupName.trim() : loginEmail.split("@")[0];
    const email = tab === "signup" ? signupEmail : loginEmail;
    await setCurrentUser({ name, email });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/setup-profile");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: botPad + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🪔</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {tab === "login" ? t("welcomeBack") : "Join NimmaGuru"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {role === "guru"
              ? tab === "login" ? "Sign in to start mentoring students" : "Create your mentor account"
              : tab === "login" ? "Sign in to discover mentors" : "Create your learning account"}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={[styles.tabRow, { backgroundColor: colors.muted, borderRadius: 14 }]}>
            {(["login", "signup"] as Tab[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tabBtn,
                  { backgroundColor: tab === t ? colors.card : "transparent" },
                ]}
                onPress={() => { setTab(t); setError(""); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.tabText, { color: tab === t ? colors.foreground : colors.mutedForeground }]}>
                  {t === "login" ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).springify()} style={styles.form}>
          {tab === "signup" && (
            <InputField
              icon={<Ionicons name="person-outline" size={18} color={colors.mutedForeground} />}
              placeholder="Full name"
              value={signupName}
              onChangeText={setSignupName}
              autoCapitalize="words"
            />
          )}
          <InputField
            icon={<Feather name="mail" size={18} color={colors.mutedForeground} />}
            placeholder="Email address"
            value={tab === "login" ? loginEmail : signupEmail}
            onChangeText={tab === "login" ? setLoginEmail : setSignupEmail}
            keyboardType="email-address"
          />
          <InputField
            icon={<Feather name="lock" size={18} color={colors.mutedForeground} />}
            placeholder="Password"
            value={tab === "login" ? loginPassword : signupPassword}
            onChangeText={tab === "login" ? setLoginPassword : setSignupPassword}
            secureTextEntry
          />
          {tab === "signup" && (
            <InputField
              icon={<Feather name="lock" size={18} color={colors.mutedForeground} />}
              placeholder="Confirm password"
              value={signupConfirm}
              onChangeText={setSignupConfirm}
              secureTextEntry
            />
          )}

          {error !== "" && (
            <Animated.View entering={FadeInUp.springify()} style={[styles.errorBox, { backgroundColor: "rgba(220,38,38,0.08)", borderColor: colors.destructive }]}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>{tab === "login" ? "Sign In" : "Create Account"}</Text>
            )}
          </TouchableOpacity>

          {tab === "login" && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            By continuing, you agree to NimmaGuru's Terms & Privacy Policy
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 0 },
  header: { alignItems: "center", gap: 8, marginBottom: 28 },
  logoCircle: {
    width: 60, height: 60, borderRadius: 30,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  logoEmoji: { fontSize: 30 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", fontWeight: "700" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  tabRow: { flexDirection: "row", padding: 4, marginBottom: 20 },
  tabBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  tabText: { fontSize: 14, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  form: { gap: 12, marginBottom: 16 },
  inputRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: 14, borderWidth: 1.5,
  },
  inputIcon: { width: 22 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  eyeBtn: { padding: 4 },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 10, borderRadius: 10, borderWidth: 1,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  submitBtn: {
    paddingVertical: 15, borderRadius: 14, alignItems: "center",
    marginTop: 4,
  },
  submitText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold", fontWeight: "700" },
  forgotBtn: { alignItems: "center", paddingVertical: 10 },
  forgotText: { fontSize: 13, fontFamily: "Inter_500Medium", fontWeight: "500" },
  footer: { alignItems: "center", marginTop: 8 },
  footerText: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
});
