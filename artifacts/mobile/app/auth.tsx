import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

export default function AuthScreen() {
  const colors = useColors();
  const { role, t } = useApp();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function simulateGoogle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/setup-profile");
    }, 1200);
  }

  function sendOtp() {
    if (phone.length < 10) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowOtp(true);
  }

  function verifyOtp() {
    if (otp.length < 4) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/setup-profile");
    }, 1000);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.inner, { paddingTop: topPad + 20 }]}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.topSection}>
          <View style={[styles.logoSmall, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🪔</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {t("welcomeBack")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {role === "guru"
              ? "Sign in to start mentoring rural students"
              : "Sign in to discover mentors near your village"}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.authSection}>
          <TouchableOpacity
            style={[styles.googleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={simulateGoogle}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <>
                <FontAwesome name="google" size={20} color="#EA4335" />
                <Text style={[styles.googleText, { color: colors.foreground }]}>
                  {t("signInGoogle")}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="phone" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.phoneInput, { color: colors.foreground }]}
              placeholder="Enter mobile number"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
            {phone.length === 10 && !showOtp && (
              <TouchableOpacity onPress={sendOtp}>
                <Text style={[styles.sendOtp, { color: colors.primary }]}>Send OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          {showOtp && (
            <Animated.View entering={FadeInDown.springify()}>
              <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="lock" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.phoneInput, { color: colors.foreground }]}
                  placeholder="Enter OTP"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>
              <TouchableOpacity
                style={[styles.verifyBtn, { backgroundColor: colors.primary }]}
                onPress={verifyOtp}
                disabled={otp.length < 4 || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyText}>{t("signInPhone")}</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

          {!showOtp && (
            <TouchableOpacity
              style={[styles.phoneBtn, { backgroundColor: colors.secondary }]}
              onPress={sendOtp}
            >
              <Feather name="message-circle" size={18} color={colors.primary} />
              <Text style={[styles.phoneBtnText, { color: colors.deepGreen }]}>
                {t("signInPhone")}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={[styles.footer, { paddingBottom: botPad + 16 }]}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            By continuing, you agree to NimmaGuru's{"\n"}Terms of Service & Privacy Policy
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  logoSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  authSection: {
    flex: 1,
    gap: 12,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    minHeight: 52,
  },
  googleText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  sendOtp: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  verifyBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  verifyText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  phoneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  phoneBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
