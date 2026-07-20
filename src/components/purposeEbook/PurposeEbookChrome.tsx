import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface PurposeEbookChromeProps {
  title?: string;
  onBack: () => void;
}

/** Simple top bar for cover and chapter reader screens. */
export function PurposeEbookChrome({ title, onBack }: PurposeEbookChromeProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          paddingHorizontal: theme.spacing.lg,
          borderBottomColor: theme.colors.hairline,
        },
      ]}
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
      <ThemedText variant="bodyStrong" style={styles.title} numberOfLines={1}>
        {title ?? ""}
      </ThemedText>
      <View style={styles.iconBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
});
