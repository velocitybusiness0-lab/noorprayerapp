import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface OnboardingContinueButtonProps {
  label?: string;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  onPress: () => void;
}

/** Full-width pill continue button at the bottom of each onboarding step. */
export function OnboardingContinueButton({
  label = "Continue",
  disabled = false,
  backgroundColor,
  textColor,
  onPress,
}: OnboardingContinueButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={16}
      onPress={() => {
        if (disabled) return;
        if (__DEV__) console.info("[Onboarding] continue pressed", label);
        onPress();
        haptics.selection();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          borderRadius: theme.radii.pill,
          backgroundColor: backgroundColor ?? theme.colors.textPrimary,
          opacity: disabled ? 0.35 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      <ThemedText
        variant="bodyStrong"
        style={{ color: textColor ?? theme.colors.textInverse }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
});
