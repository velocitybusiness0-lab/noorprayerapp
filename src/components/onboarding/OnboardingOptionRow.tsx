import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ImpactFeedbackStyle } from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";

interface OnboardingOptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Full-width pill answer row: label left, radio indicator right. */
export function OnboardingOptionRow({
  label,
  selected,
  onPress,
}: OnboardingOptionRowProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animated}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={() => {
          haptics.impact(ImpactFeedbackStyle.Soft);
          onPress();
        }}
        style={[
          styles.row,
          {
            backgroundColor: selected ? theme.colors.sageMuted : "#FFFFFF",
            borderColor: selected
              ? theme.colors.accent
              : "rgba(61,56,50,0.12)",
            borderWidth: selected ? 1.5 : 1,
          },
        ]}
      >
        <ThemedText variant="bodyStrong" style={styles.label}>
          {label}
        </ThemedText>
        <View
          style={[
            styles.radio,
            {
              borderColor: selected
                ? theme.colors.accent
                : "rgba(61,56,50,0.22)",
              backgroundColor: selected ? theme.colors.accent : "transparent",
            },
          ]}
        >
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    minHeight: 58,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    color: ONBOARDING_INK,
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});
