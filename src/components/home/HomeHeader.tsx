import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { StreakBadge } from "./StreakBadge";

interface HomeHeaderProps {
  locationName?: string;
  streakCount: number;
}

/** Top of the home screen: date + place on the left, streak pill on the right. */
export function HomeHeader({ locationName, streakCount }: HomeHeaderProps) {
  const now = new Date();
  const dateLabel = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <ThemedText variant="heading">{dateLabel}</ThemedText>
        <ThemedText variant="caption" color="textTertiary">
          {locationName ?? "Locating..."}
        </ThemedText>
      </View>
      <StreakBadge count={streakCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  left: { flex: 1, gap: 2 },
});
