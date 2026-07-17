import React from "react";
import { Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { AppBlockingShieldBadge } from "./AppBlockingShieldBadge";
import { AppBlockingStepIndicator } from "./AppBlockingStepIndicator";
import { AppBlockingActionTile } from "./AppBlockingActionTile";
import {
  appBlockingSetupPhaseResolver,
  AppBlockingSetupPhase,
} from "./AppBlockingSetupPhaseResolver";
import { AppBlockingCopy } from "@/features/blocking/AppBlockingCopy";

interface AppBlockingPanelProps {
  authorized: boolean;
  selectionTotal: number;
  shieldActive: boolean;
  busy: boolean;
  primaryLabel: string;
  onPrimaryAction: () => void;
  onOpenPicker: () => void;
  onScanUnblock: () => void;
  style?: ViewStyle;
  showHint?: boolean;
}

function headline(phase: AppBlockingSetupPhase): string {
  if (phase === "active") return "Focus shield on";
  return "Focus shield";
}

/** Gradient blocking card — shared by Today and Settings. */
export function AppBlockingPanel({
  authorized,
  selectionTotal,
  shieldActive,
  busy,
  primaryLabel,
  onPrimaryAction,
  onOpenPicker,
  onScanUnblock,
  style,
  showHint = false,
}: AppBlockingPanelProps) {
  const theme = useTheme();
  const phase = appBlockingSetupPhaseResolver.resolve(authorized, selectionTotal, shieldActive);
  const stepIndex = appBlockingSetupPhaseResolver.stepIndex(phase);

  return (
    <LinearGradient
      colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { borderRadius: theme.radii.lg }, style]}
    >
      <View style={styles.inner}>
        <AppBlockingShieldBadge active={shieldActive} appCount={selectionTotal} />

        <ThemedText variant="heading" style={styles.headline}>
          {headline(phase)}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" style={styles.subtitle}>
          {phase === "active"
            ? AppBlockingCopy.activeStatus(selectionTotal)
            : AppBlockingCopy.setupStatus(phase)}
        </ThemedText>

        {phase === "active" ? (
          <View style={styles.actions}>
            <AppBlockingActionTile
              icon="scan-outline"
              title="Scan"
              subtitle="to unblock"
              onPress={onScanUnblock}
            />
            {authorized && selectionTotal > 0 ? (
              <AppBlockingActionTile
                icon="apps-outline"
                title="Apps"
                subtitle={`${selectionTotal} selected`}
                onPress={onOpenPicker}
              />
            ) : null}
          </View>
        ) : (
          <>
            <AppBlockingStepIndicator phase={phase} stepIndex={stepIndex} />
            <Pressable
              disabled={busy}
              onPress={() => {
                haptics.selection();
                onPrimaryAction();
              }}
              style={({ pressed }) => [
                styles.cta,
                {
                  backgroundColor: theme.colors.accent,
                  opacity: busy ? 0.6 : pressed ? 0.92 : 1,
                },
              ]}
            >
              <ThemedText variant="bodyStrong" color="onAccent">
                {primaryLabel}
              </ThemedText>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.onAccent} />
            </Pressable>
          </>
        )}

        {showHint && !authorized && Platform.OS === "android" ? (
          <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
            Settings → Accessibility → Miraj → On
          </ThemedText>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
    overflow: "hidden",
  },
  inner: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  headline: { marginTop: 14, textAlign: "center" },
  subtitle: { marginTop: 6, textAlign: "center", maxWidth: 280, lineHeight: 18 },
  actions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    marginTop: 18,
    alignSelf: "stretch",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "stretch",
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  hint: { marginTop: 12, textAlign: "center" },
});
