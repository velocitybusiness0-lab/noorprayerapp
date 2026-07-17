import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { AppPickerRow } from "@/components/blocking/AppPickerRow";
import { AppBlockingCopy } from "@/features/blocking/AppBlockingCopy";
import { InstalledAppInfo } from "@/modules/app-blocker";

interface AndroidAppPickerModalProps {
  visible: boolean;
  installedApps: InstalledAppInfo[];
  selectedPackages: string[];
  suggestedApps: InstalledAppInfo[];
  onClose: () => void;
  onSave: (packages: string[]) => void;
}

/** Multi-select launcher for Android blocked package names. */
export function AndroidAppPickerModal({
  visible,
  installedApps,
  selectedPackages,
  suggestedApps,
  onClose,
  onSave,
}: AndroidAppPickerModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<string[]>(selectedPackages);

  useEffect(() => {
    if (visible) setDraft(selectedPackages);
  }, [visible, selectedPackages]);

  const installedByPackage = useMemo(() => {
    const map = new Map<string, InstalledAppInfo>();
    for (const app of installedApps) map.set(app.packageName, app);
    return map;
  }, [installedApps]);

  const rows = useMemo(() => {
    const merged = new Map<string, InstalledAppInfo>();
    for (const app of suggestedApps) merged.set(app.packageName, app);
    for (const app of installedApps) merged.set(app.packageName, app);

    const list = [...merged.values()].sort((a, b) => a.label.localeCompare(b.label));
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (app) =>
        app.label.toLowerCase().includes(needle) ||
        app.packageName.toLowerCase().includes(needle)
    );
  }, [installedApps, suggestedApps, query]);

  const allPackages = useMemo(() => rows.map((app) => app.packageName), [rows]);
  const allSelected =
    allPackages.length > 0 && allPackages.every((pkg) => draft.includes(pkg));

  const toggle = (packageName: string) => {
    haptics.selection();
    setDraft((current) =>
      current.includes(packageName)
        ? current.filter((item) => item !== packageName)
        : [...current, packageName]
    );
  };

  const toggleSelectAll = () => {
    haptics.selection();
    setDraft((current) => {
      if (allSelected) {
        return current.filter((pkg) => !allPackages.includes(pkg));
      }
      const next = new Set(current);
      for (const pkg of allPackages) next.add(pkg);
      return [...next];
    });
  };

  const bottomInset =
    Platform.OS === "android" ? Math.max(insets.bottom, 48) : insets.bottom;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable
            onPress={() => {
              haptics.selection();
              onClose();
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={[styles.countChip, { backgroundColor: theme.colors.sageMuted }]}>
            <ThemedText variant="caption" color="accent">
              {draft.length} selected
            </ThemedText>
          </View>
        </View>

        <ThemedText variant="title" style={styles.title}>
          Choose apps
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" style={styles.subtitle}>
          {AppBlockingCopy.pickerHint()}
        </ThemedText>

        <View
          style={[
            styles.searchWrap,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search apps"
            placeholderTextColor={theme.colors.textTertiary}
            style={[styles.search, { color: theme.colors.textPrimary }]}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textTertiary} />
            </Pressable>
          ) : null}
        </View>

        {rows.length > 0 ? (
          <Pressable onPress={toggleSelectAll} hitSlop={8} style={styles.selectAll}>
            <ThemedText variant="bodyStrong" color="accent">
              {allSelected ? "Clear all" : query.trim() ? `Select all (${rows.length})` : "Select all"}
            </ThemedText>
          </Pressable>
        ) : null}

        <FlatList
          data={rows}
          keyExtractor={(item) => item.packageName}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <AppPickerRow
              label={installedByPackage.get(item.packageName)?.label ?? item.label}
              selected={draft.includes(item.packageName)}
              onToggle={() => toggle(item.packageName)}
            />
          )}
        />

        <View style={[styles.actions, { paddingBottom: bottomInset + 12 }]}>
          <Button
            label={draft.length > 0 ? `Save ${draft.length} app${draft.length === 1 ? "" : "s"}` : "Save"}
            onPress={() => onSave(draft)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  countChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 14 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  search: { flex: 1, padding: 0, fontSize: 16 },
  selectAll: { alignSelf: "flex-start", marginBottom: 10 },
  list: { flex: 1 },
  listContent: { paddingBottom: 8 },
  actions: { paddingTop: 8 },
});
