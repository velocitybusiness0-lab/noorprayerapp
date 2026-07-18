import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ReminderRoutes } from "@/features/motivation/ReminderRoutes";

/** Today tab entry into the Reminders swipe feed — matched to My Duas card. */
export function HomeMotivationCard() {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        router.push(ReminderRoutes.feed());
      }}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel="Reminders"
    >
      <LinearGradient
        colors={[theme.colors.sand, theme.colors.sageMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radii.lg }]}
      >
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(255,255,255,0.55)" }]}>
            <Ionicons name="sparkles-outline" size={26} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.copy}>
            <ThemedText variant="heading">Reminders</ThemedText>
            <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
              Quotes, hadith & daily motivation
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
