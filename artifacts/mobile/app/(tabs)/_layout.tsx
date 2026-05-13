import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="gurus">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>Gurus</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <Icon sf={{ default: "calendar", selected: "calendar.badge.clock" }} />
        <Label>Calendar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookings">
        <Icon sf={{ default: "bookmark", selected: "bookmark.fill" }} />
        <Label>Bookings</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="thanks">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Thanks</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person.circle", selected: "person.circle.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const { t } = useApp();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? 1 : 0.5,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : 60,
          paddingBottom: isWeb ? 20 : 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          marginTop: 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="gurus"
        options={{
          title: t("gurus"),
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="person.2" tintColor={color} size={size} />
            ) : (
              <Ionicons name="people-outline" size={22} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: t("calendar"),
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="calendar" tintColor={color} size={size} />
            ) : (
              <Ionicons name="calendar-outline" size={22} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: t("bookings"),
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="bookmark" tintColor={color} size={size} />
            ) : (
              <Ionicons name="bookmark-outline" size={22} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="thanks"
        options={{
          title: t("thanks"),
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="heart" tintColor={color} size={size} />
            ) : (
              <Ionicons name="heart-outline" size={22} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="person.circle" tintColor={color} size={size} />
            ) : (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
