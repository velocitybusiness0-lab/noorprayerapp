import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PurposeEbookManager } from "@/features/purposeEbook/PurposeEbookManager";
import { PurposeEbookPresenter } from "@/features/purposeEbook/PurposeEbookPresenter";

/** Today tab entry into the My Purpose companion guide. */
export function HomePurposeEbookCard() {
  const theme = useTheme();
  const meta = PurposeEbookPresenter.meta();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        PurposeEbookManager.openCover();
      }}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel={meta.title}
    >
      <LinearGradient
        colors={[theme.colors.sageMuted, theme.colors.sand]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radii.lg }]}
      >
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(255,255,255,0.55)" }]}>
            <Ionicons name="reader-outline" size={26} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.copy}>
            <ThemedText variant="heading">{meta.title}</ThemedText>
            <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
              {meta.homeCardSubtitle}
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.textTertiary} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
  gradient: { paddingVertical: 22, paddingHorizontal: 22, minHeight: 108 },
  row: { flex: 1, flexDirection: "row", alignItems: "center", gap: 16 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: 5 },
  subtitle: { lineHeight: 22 },
});
