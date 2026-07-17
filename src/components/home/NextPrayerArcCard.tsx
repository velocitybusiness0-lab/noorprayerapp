import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SLOT_ICON } from "@/components/prayer/slotIcons";
import { formatCountdown } from "@/core/utils/time";
import { DayPrayerTimes, PRAYER_LABELS, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";
import { rowStateFor } from "@/features/prayerTimes/prayerSelectors";
import { PrayerArcGeometry } from "@/components/home/PrayerArcGeometry";
import { PrayerArcNode, PrayerArcNodeState } from "@/components/home/PrayerArcNode";

interface NextPrayerArcCardProps {
  day: DayPrayerTimes;
  countdownMs: number;
  width: number;
  completed?: Partial<Record<PrayerSlot, boolean>>;
  allNamazComplete?: boolean;
}

const TRACK_WIDTH = 2;
const TOP_INSET = 32;
const BOTTOM_INSET = 28;

/** Hero card: Athan-style semicircle with prayer nodes and countdown. */
export function NextPrayerArcCard({
  day,
  countdownMs,
  width,
  completed = {},
  allNamazComplete = false,
}: NextPrayerArcCardProps) {
  const theme = useTheme();
  const inner = width - theme.spacing.lg * 2;
  const pad = 32;
  const radius = (inner - pad * 2) / 2;
  const cx = inner / 2;
  const cy = TOP_INSET + radius;
  const height = cy + BOTTOM_INSET;
  const geometry = new PrayerArcGeometry(cx, cy, radius);

  const arcEntries = day.entries.filter((entry) => entry.isObligatory);
  const n = arcEntries.length;

  const trackPath = geometry.fullTrackPath();
  const nextLabel = day.nextSlot ? PRAYER_LABELS[day.nextSlot].toUpperCase() : "";
  const labelTop = cy - radius * 0.42;

  return (
    <Card translucent={false} padded={false} style={styles.card}>
      <LinearGradient
        colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: theme.radii.lg }]}
      >
        <View style={{ width: inner, height }}>
          <Svg width={inner} height={height}>
            <Path
              d={trackPath}
              stroke={theme.colors.arcTrack}
              strokeWidth={TRACK_WIDTH}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>

          {arcEntries.map((entry, i) => {
            const f = n > 1 ? i / (n - 1) : 0;
            const p = geometry.pointAt(f);
            const rowState = rowStateFor(entry.slot, entry.time, day.currentSlot);
            const isLogged = allNamazComplete || Boolean(completed[entry.slot]);
            const nodeState = toNodeState(rowState, entry.slot === day.nextSlot, isLogged);

            return (
              <PrayerArcNode
                key={entry.slot}
                icon={SLOT_ICON[entry.slot]}
                x={p.x}
                y={p.y}
                state={nodeState}
              />
            );
          })}

          <View style={[styles.center, { top: labelTop }]} pointerEvents="none">
            <ThemedText variant="caption" color="textSecondary" style={styles.label}>
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

function toNodeState(
  rowState: ReturnType<typeof rowStateFor>,
  isNext: boolean,
  isLogged: boolean
): PrayerArcNodeState {
  if (isLogged || rowState === "past") return "past";
  if (rowState === "current" || isNext) return "current";
  return "upcoming";
}

const styles = StyleSheet.create({
  card: { alignItems: "center", padding: 0, overflow: "visible" },
  gradient: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    width: "100%",
  },
  center: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  label: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  countdown: {
    fontVariant: ["tabular-nums"],
    marginTop: 2,
    fontSize: 38,
    letterSpacing: -0.5,
  },
});
