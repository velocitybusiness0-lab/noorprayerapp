import React from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "@/core/theme";

interface GoalProgressBarProps {
  ratio: number;
  animate?: boolean;
  durationMs?: number;
}

/** Animated green fill bar — width driven by measured track pixels (Reanimated-safe). */
export function GoalProgressBar({
  ratio,
  animate = true,
  durationMs = 220,
}: GoalProgressBarProps) {
  const theme = useTheme();
  const trackWidth = useSharedValue(0);
  const fillRatio = useSharedValue(ratio);

  React.useEffect(() => {
    fillRatio.value = animate ? withTiming(ratio, { duration: durationMs }) : ratio;
  }, [animate, durationMs, fillRatio, ratio]);

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: fillRatio.value * trackWidth.value,
  }));

  return (
    <View
      onLayout={onLayout}
      style={[styles.track, { backgroundColor: theme.colors.backgroundElevated }]}
    >
      <Animated.View
        style={[styles.fill, fillStyle, { backgroundColor: theme.colors.accent }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
});
