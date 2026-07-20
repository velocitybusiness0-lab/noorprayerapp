import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { OnboardingStepFadeTiming } from "@/features/onboarding/OnboardingStepFadeTiming";

interface OnboardingProgressHeaderProps {
  progress: number;
  showBack: boolean;
  opacity?: number;
  hideTrack?: boolean;
  onBack: () => void;
  foregroundColor?: string;
  trackColor?: string;
}

/** Top progress strip with optional back arrow. */
export function OnboardingProgressHeader({
  progress,
  showBack,
  opacity = 1,
  hideTrack = false,
  onBack,
  foregroundColor,
  trackColor,
}: OnboardingProgressHeaderProps) {
  const theme = useTheme();
  const fill = useSharedValue(progress);
  const headerOpacity = useSharedValue(opacity);
  const iconColor = foregroundColor ?? theme.colors.textPrimary;
  const barTrack = trackColor ?? theme.colors.hairline;
  const barFill = foregroundColor ?? theme.colors.textPrimary;

  useEffect(() => {
    fill.value = withTiming(progress, {
      duration: OnboardingStepFadeTiming.backgroundMs,
      easing: OnboardingStepFadeTiming.easing,
    });
  }, [fill, progress]);

  useEffect(() => {
    headerOpacity.value = withTiming(opacity, {
      duration: OnboardingStepFadeTiming.fadeInMs,
      easing: OnboardingStepFadeTiming.easing,
    });
  }, [headerOpacity, opacity]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0.04, fill.value * 100)}%`,
  }));

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            hitSlop={12}
            onPress={() => {
              haptics.selection();
              onBack();
            }}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={24} color={iconColor} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}

        <View style={[styles.track, { backgroundColor: barTrack, opacity: hideTrack ? 0 : 1 }]}>
          <Animated.View style={[styles.fill, { backgroundColor: barFill }, fillStyle]} />
        </View>

        <View style={styles.backSpacer} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  back: {
    width: 32,
    alignItems: "flex-start",
  },
  backSpacer: {
    width: 32,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
