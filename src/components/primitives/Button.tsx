import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "./ThemedText";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

/** Soft pastel pressable with subtle press-scale and haptic feedback. */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const palette: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: theme.colors.accent },
    secondary: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
    ghost: { backgroundColor: "transparent" },
  };

  const textColor = variant === "primary" ? "onAccent" : "textPrimary";

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        disabled={disabled}
        onPressIn={() => {
          scale.value = withTiming(0.96, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={() => {
          haptics.selection();
          onPress();
        }}
        style={[
          styles.base,
          { borderRadius: theme.radii.md },
          palette[variant],
          disabled && styles.disabled,
        ]}
      >
        <ThemedText variant="bodyStrong" color={textColor as never}>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
});
