import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={() => {
          if (disabled) return;
          haptics.selection();
          onPress();
        }}
        style={[
          styles.button,
          {
            borderRadius: theme.radii.pill,
            backgroundColor: backgroundColor ?? theme.colors.textPrimary,
          },
          disabled && styles.disabled,
        ]}
      >
        <ThemedText
          variant="bodyStrong"
          style={{ color: textColor ?? theme.colors.textInverse }}
        >
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.35,
  },
});
