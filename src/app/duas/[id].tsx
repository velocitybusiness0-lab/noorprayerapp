import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { DuaCatalog } from "@/features/duas/DuaCatalog";
import { DuaCollectionIconBadge } from "@/components/duas/DuaCollectionIconBadge";
import { useDuaLibrary } from "@/features/duas/duaLibraryStore";
import { stackBackNavigator } from "@/features/navigation/StackBackNavigator";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Full dua detail with save, favourite, reminder, and collection actions. */
export default function DuaDetailScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = firstParam(params.id) ?? "";
  const dua = useMemo(() => DuaCatalog.byId(id), [id]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isSaved = useDuaLibrary((s) => s.savedIds.includes(id));
  const isFavorite = useDuaLibrary((s) => s.favoriteIds.includes(id));
  const hasReminder = useDuaLibrary((s) => s.reminderIds.includes(id));
  const collections = useDuaLibrary((s) => s.collections);
  const toggleSaved = useDuaLibrary((s) => s.toggleSaved);
  const toggleFavorite = useDuaLibrary((s) => s.toggleFavorite);
  const toggleReminder = useDuaLibrary((s) => s.toggleReminder);
  const addToCollection = useDuaLibrary((s) => s.addToCollection);

  if (!dua) {
    return (
      <Screen>
        <Stack.Screen options={{ title: "Dua", headerShown: true }} />
        <ThemedText variant="body">Dua not found.</ThemedText>
        <Button
          label="Back"
          onPress={() => stackBackNavigator.goBack()}
          style={styles.back}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: dua.title, headerShown: true }} />

      <ThemedText variant="caption" color="textTertiary">
        {DuaCatalog.categoryLabel(dua.categoryId)}
      </ThemedText>
      <ThemedText variant="title" style={styles.title}>
        {dua.title}
      </ThemedText>

      <View
        style={[
          styles.block,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.hairline,
            borderRadius: theme.radii.lg,
          },
        ]}
      >
        <ThemedText variant="heading" style={styles.arabic}>
          {dua.arabic}
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.transliteration}>
          {dua.transliteration}
        </ThemedText>
        <ThemedText variant="body">{dua.translation}</ThemedText>
      </View>

      <ThemedText variant="caption" color="textTertiary" style={styles.meta}>
        Source
      </ThemedText>
      <ThemedText variant="body" color="textSecondary">
        {dua.source}
      </ThemedText>

      <ThemedText variant="caption" color="textTertiary" style={styles.meta}>
        When to recite
      </ThemedText>
      <ThemedText variant="body" color="textSecondary">
        {dua.whenToRecite}
      </ThemedText>

      <View style={styles.actions}>
        <ActionChip
          icon={isSaved ? "bookmark" : "bookmark-outline"}
          label={isSaved ? "Saved" : "Save"}
          active={isSaved}
          onPress={() => {
            haptics.selection();
            toggleSaved(dua.id);
          }}
        />
        <ActionChip
          icon={isFavorite ? "heart" : "heart-outline"}
          label="Favourite"
          active={isFavorite}
          onPress={() => {
            haptics.selection();
            toggleFavorite(dua.id);
          }}
        />
        <ActionChip
          icon={hasReminder ? "notifications" : "notifications-outline"}
          label="Remind"
          active={hasReminder}
          onPress={() => {
            haptics.selection();
            toggleReminder(dua.id);
          }}
        />
      </View>

      <Button
        label="Add to collection"
        variant="secondary"
        onPress={() => {
          haptics.selection();
          setPickerOpen((open) => !open);
        }}
        style={styles.collectionBtn}
      />

      {pickerOpen ? (
        <View style={styles.picker}>
          {collections.map((collection) => {
            const included = collection.duaIds.includes(dua.id);
            return (
              <Pressable
                key={collection.id}
                onPress={() => {
                  haptics.selection();
                  if (!included) addToCollection(collection.id, dua.id);
                  setPickerOpen(false);
                }}
                style={[
                  styles.pickerRow,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.hairline,
                    borderRadius: theme.radii.md,
                  },
                ]}
              >
                <View style={styles.pickerLabel}>
                  <DuaCollectionIconBadge collection={collection} size={28} />
                  <ThemedText variant="body" numberOfLines={1} style={styles.pickerName}>
                    {collection.name}
                  </ThemedText>
                </View>
                {included ? (
                  <Ionicons name="checkmark" size={18} color={theme.colors.accent} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {hasReminder ? (
        <ThemedText variant="caption" color="textTertiary" style={styles.reminderHint}>
          Reminder flagged for this dua. Notification scheduling can be wired next.
        </ThemedText>
      ) : null}
    </Screen>
  );
}

function ActionChip({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.sageMuted,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Ionicons name={icon} size={16} color={active ? "#FFFFFF" : theme.colors.textSecondary} />
      <ThemedText variant="caption" style={{ color: active ? "#FFFFFF" : theme.colors.textSecondary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 6, marginBottom: 16 },
  block: { padding: 18, borderWidth: StyleSheet.hairlineWidth, gap: 14 },
  arabic: { textAlign: "right", lineHeight: 36, writingDirection: "rtl" },
  transliteration: { fontStyle: "italic" },
  meta: { marginTop: 18, marginBottom: 4, letterSpacing: 0.6 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 22 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  collectionBtn: { marginTop: 18, alignSelf: "stretch" },
  picker: { marginTop: 12, gap: 8 },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pickerLabel: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, marginRight: 8 },
  pickerName: { flex: 1 },
  reminderHint: { marginTop: 14 },
  back: { marginTop: 16 },
});
