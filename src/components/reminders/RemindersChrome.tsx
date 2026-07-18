import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";

interface RemindersChromeProps {
  onBack: () => void;
  onOpenSettings: () => void;
}

/** Minimal overlay: back + settings gear over the full-screen quote feed. */
export function RemindersChrome({ onBack, onOpenSettings }: RemindersChromeProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingTop: insets.top + 8, paddingHorizontal: theme.spacing.lg }]}
    >
      <Pressable
        onPress={() => {
          haptics.selection();
          onBack();
        }}
        style={styles.iconBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <Pressable
        onPress={() => {
          haptics.selection();
          onOpenSettings();
        }}
        style={styles.iconBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Reminder settings"
      >
        <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
