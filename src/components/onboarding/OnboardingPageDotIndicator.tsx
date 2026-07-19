import React from "react";
import { StyleSheet, View } from "react-native";

interface OnboardingPageDotIndicatorProps {
  count: number;
  activeIndex: number;
  activeColor?: string;
  inactiveColor?: string;
}

const DOT_SIZE = 8;
const DOT_GAP = 8;

/**
 * Equal-sized page-control dots synced to a discrete slide index.
 * Active = full opacity; inactive = muted — no oversized sliding pill.
 */
export function OnboardingPageDotIndicator({
  count,
  activeIndex,
  activeColor = "#FFFFFF",
  inactiveColor = "rgba(255,255,255,0.35)",
}: OnboardingPageDotIndicatorProps) {
  if (count <= 0) return null;

  const safeIndex = Math.max(0, Math.min(activeIndex, count - 1));

  return (
    <View style={styles.row} accessibilityRole="adjustable">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === safeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? activeColor : inactiveColor,
                marginRight: index < count - 1 ? DOT_GAP : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    height: DOT_SIZE,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
