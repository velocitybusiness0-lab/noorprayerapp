import React from "react";
import { View } from "react-native";
import { PrayerRow } from "./PrayerRow";
import { DayPrayerTimes, ObligatoryPrayer, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";
import { rowStateFor } from "@/features/prayerTimes/prayerSelectors";
import { useAlertPrefs } from "@/features/notifications/alertPrefsStore";

interface PrayerListProps {
  day: DayPrayerTimes;
  completed?: Partial<Record<PrayerSlot, boolean>>;
  allNamazComplete?: boolean;
  showBells?: boolean;
  onPressPrayer?: (slot: PrayerSlot) => void;
}

/** Renders the ordered list of prayer rows for a day. */
export function PrayerList({
  day,
  completed = {},
  allNamazComplete = false,
  showBells = true,
  onPressPrayer,
}: PrayerListProps) {
  const { alerts, toggle } = useAlertPrefs();

  return (
    <View>
      {day.entries.map((entry) => (
        <PrayerRow
          key={entry.slot}
          slot={entry.slot}
          label={entry.label}
          time={entry.time}
          state={rowStateFor(entry.slot, entry.time, day.currentSlot)}
          isNext={entry.slot === day.nextSlot}
          completed={completed[entry.slot]}
          allNamazComplete={allNamazComplete}
          showBell={showBells && entry.isObligatory}
          bellOn={entry.isObligatory ? alerts[entry.slot as ObligatoryPrayer] : false}
          onToggleBell={
            entry.isObligatory ? () => toggle(entry.slot as ObligatoryPrayer) : undefined
          }
          onPress={onPressPrayer ? () => onPressPrayer(entry.slot) : undefined}
        />
      ))}
    </View>
  );
}
