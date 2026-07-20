import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSectionDivider } from "@/components/home/HomeSectionDivider";
import { HomeTimetableConfirmHint } from "@/components/home/HomeTimetableConfirmHint";
import { NextPrayerArcCard } from "@/components/home/NextPrayerArcCard";
import { PrayerList } from "@/components/prayer/PrayerList";
import { DailyGoalsSection } from "@/components/today/DailyGoalsSection";
import { HomeMotivationCard } from "@/components/home/HomeMotivationCard";
import { HomePurposeEbookCard } from "@/components/home/HomePurposeEbookCard";
import { HomeMyDuasCard } from "@/components/duas/HomeMyDuasCard";
import { NamazCompletionCelebration } from "@/components/celebration/NamazCompletionCelebration";
import { SalahModePickerModal } from "@/components/modes/SalahModePickerModal";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { usePrayerTimes } from "@/features/prayerTimes/usePrayerTimes";
import { useModes } from "@/features/modes/modeStore";
import { formatEnabledModesSummary } from "@/features/modes/modeFormat";
import { useHistory } from "@/features/history/historyStore";
import { useDailyGoals } from "@/features/dailyGoals/dailyGoalsStore";
import { canLogPrayer } from "@/features/prayerTimes/prayerSelectors";
import { OBLIGATORY_PRAYERS, ObligatoryPrayer, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";

const NAMAZ_TARGET = 5;

export default function TodayScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { loading, error, location, today, countdownMs, refresh } = usePrayerTimes();
  const enabledModes = useModes((s) => s.enabledModes);
  const { streak, todaySlots, toggle } = useHistory();
  const syncNamazPrayed = useDailyGoals((s) => s.syncNamazPrayed);
  const [modePickerVisible, setModePickerVisible] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const prevNamazCount = useRef(todaySlots.length);

  const allNamazComplete = todaySlots.length >= NAMAZ_TARGET;

  const completed = todaySlots.reduce<Partial<Record<PrayerSlot, boolean>>>(
    (acc, slot) => ({ ...acc, [slot]: true }),
    {}
  );

  useEffect(() => {
    syncNamazPrayed(todaySlots.length);
  }, [todaySlots.length, syncNamazPrayed]);

  useEffect(() => {
    if (todaySlots.length === NAMAZ_TARGET && prevNamazCount.current < NAMAZ_TARGET) {
      setCelebrationVisible(true);
    }
    prevNamazCount.current = todaySlots.length;
  }, [todaySlots.length]);

  const onPressPrayer = (slot: PrayerSlot) => {
    if (slot === "sunrise") return;
    if (!OBLIGATORY_PRAYERS.includes(slot as ObligatoryPrayer)) return;

    const entry = today?.entries.find((e) => e.slot === slot);
    const alreadyLogged = todaySlots.includes(slot as ObligatoryPrayer);
    if (entry && !alreadyLogged && !canLogPrayer(entry.time)) {
      haptics.warning();
      return;
    }

    haptics.success();
    void toggle(slot as ObligatoryPrayer);
  };

  const dismissCelebration = useCallback(() => {
    setCelebrationVisible(false);
  }, []);

  return (
    <Screen scroll tabBarPadding>
      <HomeHeader locationName={location?.name} streakCount={streak.current} />

      {loading && !today && (
        <ActivityIndicator color={theme.colors.textPrimary} style={styles.loader} />
      )}

      {error && !today && (
        <Card style={styles.block}>
          <ThemedText variant="body" color="textSecondary">
            {error}
          </ThemedText>
          <Button label="Enable location" onPress={refresh} style={styles.retry} />
        </Card>
      )}

      {today && (
        <>
          <NextPrayerArcCard
            day={today}
            countdownMs={countdownMs}
            width={width}
            completed={completed}
            allNamazComplete={allNamazComplete}
          />

          <ModePill
            label={formatEnabledModesSummary(enabledModes)}
            onPress={() => {
              haptics.selection();
              setModePickerVisible(true);
            }}
          />

          <SalahModePickerModal
            visible={modePickerVisible}
            onClose={() => setModePickerVisible(false)}
          />

          <Card padded={false} style={styles.list}>
            <PrayerList
              day={today}
              showBells
              completed={completed}
              allNamazComplete={allNamazComplete}
              onPressPrayer={onPressPrayer}
            />
          </Card>
          <HomeTimetableConfirmHint />

          <HomeSectionDivider />
          <DailyGoalsSection />
          <HomeSectionDivider />

          <HomeMyDuasCard />
          <HomeMotivationCard />
          <HomePurposeEbookCard />

          <NamazCompletionCelebration visible={celebrationVisible} onFinished={dismissCelebration} />
        </>
      )}
    </Screen>
  );
}

function ModePill({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: theme.colors.sageMuted,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Ionicons name="options-outline" size={16} color={theme.colors.accent} />
      <ThemedText variant="caption" color="textSecondary">
        {`Mode: ${label}`}
      </ThemedText>
      <Ionicons name="chevron-down" size={14} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 60 },
  block: { marginTop: 24 },
  retry: { marginTop: 16 },
  list: { marginTop: 16, paddingHorizontal: 8 },
  pill: {
    marginTop: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
