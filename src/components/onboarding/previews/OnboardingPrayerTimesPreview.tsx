import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";

const SLOTS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

/** Static prayer arc mock matching the Today screen layout. */
export function OnboardingPrayerTimesPreview() {
  const theme = useTheme();
  const width = 260;
  const height = 130;
  const cx = width / 2;
  const cy = 108;
  const radius = 88;
  const track = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <View style={[styles.card, { borderColor: theme.colors.border }]}>
      <LinearGradient
        colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
        style={styles.gradient}
      >
        <ThemedText variant="caption" color="textSecondary" style={styles.nextLabel}>
          NEXT · ASR
        </ThemedText>
        <ThemedText variant="title" style={styles.countdown}>
          01:24:08
        </ThemedText>

        <Svg width={width} height={height}>
          <Path d={track} stroke={theme.colors.arcTrack} strokeWidth={2} fill="none" />
        </Svg>

        <View style={styles.nodes}>
          {SLOTS.map((slot, index) => (
            <View key={slot} style={styles.nodeWrap}>
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: index < 2 ? theme.colors.accent : theme.colors.surface,
                    borderColor: index === 2 ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              />
              <ThemedText variant="caption" color="textTertiary">
                {slot.slice(0, 1)}
              </ThemedText>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  gradient: {
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: "center",
  },
  nextLabel: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  countdown: {
    marginBottom: 4,
  },
  nodes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "92%",
    marginTop: -18,
  },
  nodeWrap: {
    alignItems: "center",
    gap: 4,
  },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
