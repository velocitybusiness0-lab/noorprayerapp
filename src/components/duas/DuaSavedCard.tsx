import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCatalog } from "@/features/duas/DuaCatalog";
import { DuaLibraryPresenter } from "@/features/duas/DuaLibraryPresenter";
import { DuaEntry } from "@/features/duas/dua.types";

interface DuaSavedCardProps {
  dua: DuaEntry;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  onUnsave?: () => void;
}

/** Soft shadowed saved-dua card matching the My Duas design. */
export function DuaSavedCard({
  dua,
  favorite,
  onPress,
  onToggleFavorite,
  onUnsave,
}: DuaSavedCardProps) {
  const theme = useTheme();
  const category = DuaCatalog.categories().find((item) => item.id === dua.categoryId);
  const iconName = (category?.icon ?? "book-outline") as keyof typeof Ionicons.glyphMap;

  const openMenu = () => {
    haptics.selection();
    const buttons: {
      text: string;
      style?: "cancel" | "destructive" | "default";
      onPress?: () => void;
    }[] = [
      {
        text: favorite ? "Unfavourite" : "Favourite",
        onPress: onToggleFavorite,
      },
    ];
    if (onUnsave) {
      buttons.push({ text: "Unsave", style: "destructive", onPress: onUnsave });
    }
    buttons.push({ text: "Cancel", style: "cancel" });
    Alert.alert(dua.title, undefined, buttons);
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          shadowColor: theme.colors.textPrimary,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.sageMuted }]}>
        <Ionicons name={iconName} size={22} color={theme.colors.accent} />
      </View>

      <View style={styles.body}>
        <ThemedText variant="bodyStrong" numberOfLines={1}>
          {dua.title}
        </ThemedText>
        <ThemedText variant="caption" color="textTertiary" numberOfLines={1}>
          {DuaLibraryPresenter.metaLine(dua)}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            haptics.selection();
            onToggleFavorite();
          }}
          accessibilityRole="button"
          accessibilityLabel={favorite ? "Unfavourite" : "Favourite"}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={20}
            color={favorite ? theme.colors.accent : theme.colors.textTertiary}
          />
        </Pressable>
        <Pressable hitSlop={10} onPress={openMenu} accessibilityRole="button">
          <Ionicons name="ellipsis-vertical" size={18} color={theme.colors.textTertiary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 3, paddingTop: 2 },
  actions: { alignItems: "center", gap: 10, paddingTop: 2 },
});
