import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarInitialsProps {
  initials: string;
  color: string;
  size?: number;
  fontSize?: number;
}

export function AvatarInitials({ initials, color, size = 48, fontSize = 18 }: AvatarInitialsProps) {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
