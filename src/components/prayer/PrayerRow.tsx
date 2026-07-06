import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { formatClock } from "@/core/utils/time";
import { PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";
import { SLOT_ICON } from "./slotIcons";
import { PrayerRowBackground } from "./PrayerRowBackground";

export type RowState = "past" | "current" | "upcoming";

interface PrayerRowProps {
  slot: PrayerSlot;
  label: string;
  time: Date;
  state: RowState;
  isNext?: boolean;
  completed?: boolean;
  allNamazComplete?: boolean;
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
  isNext = false,
  completed = false,
  allNamazComplete = false,
  showBell = false,
  bellOn = false,
  onToggleBell,
  onPress,
}: PrayerRowProps) {
  const theme = useTheme();
  const highlighted = isNext && !allNamazComplete;
  const dim = state === "past" && !isNext && !allNamazComplete;
  const specialRow = isNext || slot === "sunrise" || slot === "maghrib";
  const showGreen = allNamazComplete && slot !== "sunrise";

  const nameColor = allNamazComplete && slot !== "sunrise"
    ? "accent"
    : highlighted
      ? "accent"
      : dim
        ? "textSecondary"
        : "textPrimary";

  const iconColor =
    allNamazComplete && slot !== "sunrise"
      ? theme.colors.accent
      : highlighted
        ? theme.colors.accent
        : dim
          ? theme.colors.textSecondary
          : theme.colors.textSecondary;

  const timeColor = allNamazComplete && slot !== "sunrise"
    ? "accent"
    : highlighted
      ? "accent"
      : dim
        ? "textSecondary"
        : "textPrimary";

  return (
    <PrayerRowBackground slot={slot} isNext={isNext} completedGreen={showGreen}>
      <Pressable
        onPress={() => {
          if (!onPress) return;
          haptics.selection();
          onPress();
        }}
        style={[
          styles.row,
          !specialRow && { borderBottomColor: theme.colors.hairline, borderBottomWidth: StyleSheet.hairlineWidth },
        ]}
      >
        <View style={styles.left}>
          <Ionicons
            name={SLOT_ICON[slot]}
            size={highlighted || allNamazComplete ? 22 : 18}
            color={iconColor}
          />
          <ThemedText
            variant={highlighted || (allNamazComplete && slot !== "sunrise") ? "heading" : "body"}
            color={nameColor}
          >
            {label}
          </ThemedText>
          {(completed || allNamazComplete) && slot !== "sunrise" && (
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.accent} />
          )}
        </View>

        <View style={styles.right}>
          <ThemedText
            variant={highlighted || (allNamazComplete && slot !== "sunrise") ? "heading" : "body"}
            color={timeColor}
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
    </PrayerRowBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 14 },
});
