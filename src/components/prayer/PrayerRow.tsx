import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { formatClock } from "@/core/utils/time";
import { PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";
import { SLOT_ICON } from "./slotIcons";

export type RowState = "past" | "current" | "upcoming";

interface PrayerRowProps {
  slot: PrayerSlot;
  label: string;
  time: Date;
  state: RowState;
  completed?: boolean;
  showBell?: boolean;
  bellOn?: boolean;
  onToggleBell?: () => void;
  onPress?: () => void;
}

/** A single prayer line: icon, name, time, optional completion + bell. */
export function PrayerRow({
  slot,
  label,
  time,
  state,
  completed = false,
  showBell = false,
  bellOn = false,
  onToggleBell,
  onPress,
}: PrayerRowProps) {
  const theme = useTheme();
  const emphasized = state === "current";
  const dim = state === "past";

  const nameColor = emphasized
    ? "textPrimary"
    : dim
      ? "textTertiary"
      : "textSecondary";

  return (
    <Pressable
      onPress={() => {
        if (!onPress) return;
        haptics.selection();
        onPress();
      }}
      style={[
        styles.row,
        { borderBottomColor: theme.colors.hairline },
        emphasized && {
          backgroundColor: theme.colors.sageMuted,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <View style={styles.left}>
        <Ionicons
          name={SLOT_ICON[slot]}
          size={emphasized ? 22 : 18}
          color={emphasized ? theme.colors.accent : theme.colors.textTertiary}
        />
        <ThemedText
          variant={emphasized ? "heading" : "body"}
          color={nameColor}
        >
          {label}
        </ThemedText>
        {completed && (
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
        )}
      </View>

      <View style={styles.right}>
        <ThemedText
          variant={emphasized ? "heading" : "body"}
          color={dim ? "textTertiary" : "textPrimary"}
        >
          {formatClock(time)}
        </ThemedText>
        {showBell && (
          <Pressable
            hitSlop={10}
            onPress={() => {
              if (!onToggleBell) return;
              haptics.selection();
              onToggleBell();
            }}
          >
            <Ionicons
              name={bellOn ? "notifications" : "notifications-off-outline"}
              size={18}
              color={bellOn ? theme.colors.accent : theme.colors.textTertiary}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 14 },
});
