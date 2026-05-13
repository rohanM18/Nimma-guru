import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

function SkeletonBox({ width, height, borderRadius = 8 }: { width: number | string; height: number; borderRadius?: number }) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: width as number, height, borderRadius, backgroundColor: colors.muted },
        animStyle,
      ]}
    />
  );
}

export function SkeletonCard() {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <SkeletonBox width={56} height={56} borderRadius={28} />
        <View style={styles.headerText}>
          <SkeletonBox width={140} height={16} />
          <View style={{ height: 6 }} />
          <SkeletonBox width={100} height={12} />
        </View>
      </View>
      <View style={{ height: 12 }} />
      <SkeletonBox width={"100%"} height={12} />
      <View style={{ height: 6 }} />
      <SkeletonBox width={"80%"} height={12} />
      <View style={{ height: 12 }} />
      <View style={styles.tags}>
        <SkeletonBox width={70} height={28} borderRadius={14} />
        <View style={{ width: 8 }} />
        <SkeletonBox width={80} height={28} borderRadius={14} />
        <View style={{ width: 8 }} />
        <SkeletonBox width={60} height={28} borderRadius={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  tags: {
    flexDirection: "row",
  },
});
