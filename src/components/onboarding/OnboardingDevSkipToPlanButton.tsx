import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";

interface OnboardingDevSkipToPlanButtonProps {
  onPress: () => void;
}

/**
 * Temporary/dev convenience: jump from the first welcome page to personalized-plan.
 * Top-right control, visible enough to find during testing without competing with Continue.
 */
export function OnboardingDevSkipToPlanButton({
  onPress,
}: OnboardingDevSkipToPlanButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Skip to plan"
      hitSlop={12}
      onPress={onPress}
      style={[styles.button, { top: insets.top + 8 }]}
    >
      <ThemedText variant="caption" style={styles.label}>
        Skip to plan
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 16,
    zIndex: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  label: {
    color: ONBOARDING_INK,
    opacity: 0.85,
    fontSize: 14,
    fontWeight: "600",
  },
});
