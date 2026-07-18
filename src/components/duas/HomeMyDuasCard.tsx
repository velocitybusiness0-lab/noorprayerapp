import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaRoutes } from "@/features/duas/DuaRoutes";

/** Today tab entry into the personal dua library. */
export function HomeMyDuasCard() {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        router.push(DuaRoutes.library());
      }}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel="My Duas"
    >
      <LinearGradient
        colors={[theme.colors.sky, theme.colors.lavender]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radii.lg }]}
      >
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(255,255,255,0.55)" }]}>
            <Ionicons name="book-outline" size={26} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.copy}>
            <ThemedText variant="heading">My Duas</ThemedText>
            <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
              Your personal dua library
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
