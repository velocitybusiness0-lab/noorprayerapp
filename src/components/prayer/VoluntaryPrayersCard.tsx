import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { formatClock } from "@/core/utils/time";
import { NightTimes } from "@/features/tahajjud/NightCalculator";

interface VoluntaryPrayersCardProps {
  night: NightTimes;
}

/** Tahajjud / Qiyam windows plus a short Istikhara note. */
export function VoluntaryPrayersCard({ night }: VoluntaryPrayersCardProps) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <ThemedText variant="caption" color="textTertiary" style={styles.title}>
        VOLUNTARY PRAYERS
      </ThemedText>

      <Row
        icon="moon"
        label="Tahajjud (last third)"
        value={formatClock(night.lastThirdOfNight)}
      />
      <Row
        icon="cloudy-night"
        label="Qiyam (mid-night)"
        value={formatClock(night.middleOfNight)}
      />

      <View style={[styles.note, { borderTopColor: theme.colors.hairline }]}>
        <Ionicons name="compass-outline" size={16} color={theme.colors.lavender} />
        <ThemedText variant="caption" color="textTertiary" style={styles.noteText}>
          Istikhara: pray two rak'ah then make the du'a when seeking guidance.
          It may be prayed any time, best in the last third of the night.
        </ThemedText>
      </View>
    </Card>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Ionicons name={icon} size={18} color={theme.colors.sky} />
        <ThemedText variant="body" color="textSecondary">
          {label}
        </ThemedText>
      </View>
      <ThemedText variant="body">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16 },
  title: { marginBottom: 12, letterSpacing: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  note: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  noteText: { flex: 1, lineHeight: 18 },
});
