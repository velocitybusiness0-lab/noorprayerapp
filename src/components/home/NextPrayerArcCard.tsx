import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SLOT_ICON } from "@/components/prayer/slotIcons";
import { formatCountdown, progressBetween } from "@/core/utils/time";
import { PRAYER_LABELS } from "@/features/prayerTimes/prayerTimes.types";
import { rowStateFor } from "@/features/prayerTimes/prayerSelectors";
import { DayPrayerTimes } from "@/features/prayerTimes/prayerTimes.types";

interface NextPrayerArcCardProps {
  day: DayPrayerTimes;
  countdownMs: number;
  width: number;
}

const HEIGHT = 180;
const NODE = 26;

/** Hero card: an arc of prayer nodes with the live countdown in the centre. */
export function NextPrayerArcCard({ day, countdownMs, width }: NextPrayerArcCardProps) {
  const theme = useTheme();
  const inner = width - theme.spacing.lg * 2;
  const pad = 28;
  const radius = (inner - pad * 2) / 2;
  const cx = inner / 2;
  const cy = HEIGHT - 44;

  const pointAt = (f: number) => {
    const theta = Math.PI - f * Math.PI;
    return { x: cx + radius * Math.cos(theta), y: cy - radius * Math.sin(theta) };
  };

  const entries = day.entries;
  const n = entries.length;
  const progress = progressBetween(
    entries[0].time.getTime(),
    entries[n - 1].time.getTime(),
    Date.now()
  );

  const trackPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const activePath = buildActivePath(progress, pointAt);
  const dot = pointAt(progress);

  const nextLabel = day.nextSlot ? PRAYER_LABELS[day.nextSlot].toUpperCase() : "";

  return (
    <Card translucent={false} style={styles.card}>
      <LinearGradient
        colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radii.lg }]}
      >
      <View style={{ width: inner, height: HEIGHT }}>
        <Svg width={inner} height={HEIGHT}>
          <Path d={trackPath} stroke={theme.colors.arcTrack} strokeWidth={2} fill="none" />
          {activePath && (
            <Path d={activePath} stroke={theme.colors.arcActive} strokeWidth={2.5} fill="none" />
          )}
          <Circle cx={dot.x} cy={dot.y} r={4} fill={theme.colors.arcActive} />
        </Svg>

        {entries.map((entry, i) => {
          const f = i / (n - 1);
          const p = pointAt(f);
          const state = rowStateFor(entry.slot, entry.time, day.currentSlot);
          const active = state === "current" || entry.slot === day.nextSlot;
          return (
            <View
              key={entry.slot}
              style={[
                styles.node,
                { left: p.x - NODE / 2, top: p.y - NODE / 2, width: NODE, height: NODE },
              ]}
            >
              <Ionicons
                name={SLOT_ICON[entry.slot]}
                size={16}
                color={active ? theme.colors.accent : theme.colors.textTertiary}
              />
            </View>
          );
        })}

        <View style={styles.center} pointerEvents="none">
          <ThemedText variant="caption" color="textTertiary">
            {`${nextLabel} PRAYER`}
          </ThemedText>
          <ThemedText variant="display" style={styles.countdown}>
            {formatCountdown(countdownMs)}
          </ThemedText>
        </View>
      </View>
      </LinearGradient>
    </Card>
  );
}

function buildActivePath(
  progress: number,
  pointAt: (f: number) => { x: number; y: number }
): string | null {
  if (progress <= 0) return null;
  const steps = Math.max(2, Math.round(progress * 40));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const f = (i / steps) * progress;
    const { x, y } = pointAt(f);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

const styles = StyleSheet.create({
  card: { alignItems: "center", padding: 0, overflow: "hidden" },
  gradient: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  node: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    top: 30,
  },
  countdown: { fontVariant: ["tabular-nums"], marginTop: 2 },
});
