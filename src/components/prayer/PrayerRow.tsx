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
import { prayerRowStyleResolver } from "./PrayerRowStyleResolver";

export type RowState = "past" | "current" | "upcoming";

interface PrayerRowProps {
  slot: PrayerSlot;
  label: string;
  time: Date;
  state: RowState;
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
  completed = false,
  allNamazComplete = false,
  showBell = false,
  bellOn = false,
  onToggleBell,
  onPress,
}: PrayerRowProps) {
  const theme = useTheme();
  const isCurrent = state === "current";
  const backdrop = prayerRowStyleResolver.backdrop(slot, isCurrent);
  const fg = prayerRowStyleResolver.foreground(backdrop, theme.colors);
  const showDivider = prayerRowStyleResolver.hasDivider(backdrop);
  const logged = (completed || allNamazComplete) && slot !== "sunrise";

  return (
    <PrayerRowBackground backdrop={backdrop}>
      <Pressable
        onPress={() => {
          if (!onPress) return;
          haptics.selection();
          onPress();
        }}
        style={[
          styles.row,
          showDivider && {
            borderBottomColor: theme.colors.hairline,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <View style={styles.left}>
          <Ionicons
            name={SLOT_ICON[slot]}
            size={fg.emphasized ? 22 : 18}
            color={fg.icon}
          />
          <ThemedText
            variant={fg.emphasized ? "heading" : "body"}
            style={{ color: fg.text }}
          >
            {label}
          </ThemedText>
          {logged && (
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.accent} />
          )}
        </View>

        <View style={styles.right}>
          <ThemedText
            variant={fg.emphasized ? "heading" : "body"}
            style={{ color: fg.text }}
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
                color={bellOn ? fg.bellActive : fg.bellMuted}
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
