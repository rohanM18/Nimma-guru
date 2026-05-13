import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Appreciation } from "@/data/mockData";
import { useApp } from "@/context/AppContext";

interface AppreciationCardProps {
  item: Appreciation;
}

export function AppreciationCard({ item }: AppreciationCardProps) {
  const { textSize } = useApp();
  const fontSize = textSize === "large" ? 1.15 : 1;

  return (
    <View style={[styles.card, { backgroundColor: item.gradientStart }]}>
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>"</Text>
      </View>
      <Text style={[styles.message, { fontSize: 14 * fontSize }]} numberOfLines={5}>
        {item.message}
      </Text>
      <View style={[styles.divider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
      <View style={styles.footer}>
        <View>
          <Text style={[styles.studentName, { fontSize: 14 * fontSize }]}>{item.studentName}</Text>
          <Text style={[styles.meta, { fontSize: 11 * fontSize }]}>
            {item.grade} · {item.school}
          </Text>
        </View>
        <View style={styles.guruTag}>
          <Text style={[styles.guruText, { fontSize: 10 * fontSize }]}>to {item.guruName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },
  quoteContainer: {
    marginBottom: 4,
  },
  quote: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 48,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    lineHeight: 40,
  },
  message: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  studentName: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  meta: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  guruTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  guruText: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
});
