import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GuruCard } from "@/components/GuruCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useApp } from "@/context/AppContext";
import { GURUS, Guru } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const SUBJECTS = ["All", "Mathematics", "Science", "English", "Commerce", "Engineering", "Health"];

export default function GurusScreen() {
  const colors = useColors();
  const { t, textSize } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [loading] = useState(false);
  const [bookedId, setBookedId] = useState<string | null>(null);

  const fontSize = textSize === "large" ? 1.15 : 1;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = useMemo(() => {
    return GURUS.filter((g) => {
      const matchQuery =
        query === "" ||
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        g.profession.toLowerCase().includes(query.toLowerCase()) ||
        g.village.toLowerCase().includes(query.toLowerCase()) ||
        g.subjects.some((s) => s.toLowerCase().includes(query.toLowerCase()));

      const matchSubject =
        selectedSubject === "All" ||
        g.subjects.some((s) => s.toLowerCase().includes(selectedSubject.toLowerCase()));

      return matchQuery && matchSubject;
    });
  }, [query, selectedSubject]);

  function handleBook() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function renderGuru({ item, index }: { item: Guru; index: number }) {
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
        <GuruCard guru={item} onBook={handleBook} />
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.screenTitle, { color: colors.foreground, fontSize: 24 * fontSize }]}>
              {t("discoverGurus")}
            </Text>
            <Text style={[styles.screenSubtitle, { color: colors.mutedForeground, fontSize: 12 * fontSize }]}>
              {filtered.length} mentors available
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { router.push("/settings"); Haptics.selectionAsync(); }}
          >
            <Ionicons name="settings-outline" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, fontSize: 14 * fontSize }]}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={SUBJECTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedSubject(item);
                Haptics.selectionAsync();
              }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedSubject === item ? colors.primary : colors.card,
                  borderColor: selectedSubject === item ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: selectedSubject === item ? colors.primaryForeground : colors.foreground,
                    fontSize: 12 * fontSize,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.content}>
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderGuru}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 100 + (Platform.OS === "web" ? 34 : insets.bottom) },
          ]}
          scrollEnabled={!!filtered.length}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No gurus found</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Try a different search or subject filter
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  screenTitle: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  screenSubtitle: {
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
  },
  filterList: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
