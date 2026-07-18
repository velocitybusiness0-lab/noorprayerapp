import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface DuaLibraryHeaderProps {
  onBack: () => void;
  onNewList: () => void;
}

/** Back + title + short "+ List" action for My Duas. */
export function DuaLibraryHeader({ onBack, onNewList }: DuaLibraryHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => {
          haptics.selection();
          onBack();
        }}
        style={styles.back}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
        <ThemedText variant="body">Back</ThemedText>
      </Pressable>

      <View style={styles.titleRow}>
        <ThemedText variant="title" style={{ color: theme.colors.accent, flex: 1 }}>
          My Duas
        </ThemedText>
        <Pressable
          onPress={() => {
            haptics.selection();
            onNewList();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Create new list"
        >
          <ThemedText variant="bodyStrong" color="accent">
            + List
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
});
