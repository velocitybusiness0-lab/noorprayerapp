import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCatalog } from "@/features/duas/DuaCatalog";
import { DuaLibraryPresenter } from "@/features/duas/DuaLibraryPresenter";
import { DuaEntry } from "@/features/duas/dua.types";

interface DuaSuggestedFeaturedCardProps {
  dua: DuaEntry;
  saved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}

/** Wide featured suggestion card with Save and Arabic preview. */
export function DuaSuggestedFeaturedCard({
  dua,
  saved,
  onPress,
  onToggleSave,
}: DuaSuggestedFeaturedCardProps) {
  const theme = useTheme();
  const category = DuaCatalog.categories().find((item) => item.id === dua.categoryId);
  const iconName = (category?.icon ?? "eye-outline") as keyof typeof Ionicons.glyphMap;
  const tag = DuaLibraryPresenter.authenticityTag(dua);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          borderColor: theme.colors.hairline,
          shadowColor: theme.colors.textPrimary,
        },
      ]}
    >
      <View style={styles.top}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.sageMuted }]}>
          <Ionicons name={iconName} size={22} color={theme.colors.accent} />
        </View>

        <View style={styles.copy}>
          <ThemedText variant="bodyStrong" numberOfLines={2}>
            {dua.title}
          </ThemedText>
          <View style={[styles.tag, { backgroundColor: theme.colors.sageMuted }]}>
            <ThemedText variant="caption" color="accent">
              {tag}
            </ThemedText>
          </View>
        </View>

        <ThemedText
          variant="caption"
          color="textSecondary"
          style={styles.arabic}
          numberOfLines={3}
        >
          {dua.arabic}
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            haptics.selection();
            onToggleSave();
          }}
          style={[
            styles.saveBtn,
            {
              borderColor: theme.colors.accent,
              backgroundColor: saved ? theme.colors.sageMuted : theme.colors.surface,
              borderRadius: theme.radii.md,
            },
          ]}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={16}
            color={theme.colors.accent}
          />
          <ThemedText variant="caption" color="accent">
            {saved ? "Saved" : "Save"}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={onPress}
          style={[styles.chevron, { backgroundColor: theme.colors.backgroundElevated }]}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 14,
  },
  top: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: 6 },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  arabic: {
    maxWidth: 88,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
