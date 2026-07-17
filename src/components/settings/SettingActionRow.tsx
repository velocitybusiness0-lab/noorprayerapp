import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface SettingActionRowProps {
  label: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  last?: boolean;
}

/** Tappable settings row with optional icon and trailing chevron. */
export function SettingActionRow({
  label,
  description,
  icon,
  onPress,
  last,
}: SettingActionRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={[
        styles.row,
        !last && {
          borderBottomColor: theme.colors.hairline,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.left}>
        {icon ? (
          <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
        ) : null}
        <View style={styles.text}>
          <ThemedText variant="body">{label}</ThemedText>
          {description ? (
            <ThemedText variant="caption" color="textTertiary">
              {description}
            </ThemedText>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: { flex: 1, gap: 2 },
});
