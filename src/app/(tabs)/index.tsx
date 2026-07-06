import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { HomeHeader } from "@/components/home/HomeHeader";
import { SunPathArc } from "@/components/home/SunPathArc";
import { NextPrayerArcCard } from "@/components/home/NextPrayerArcCard";
import { PrayerList } from "@/components/prayer/PrayerList";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { spacing } from "@/core/theme/spacing";
import { usePrayerTimes } from "@/features/prayerTimes/usePrayerTimes";
import { useModes } from "@/features/modes/modeStore";
import { SALAH_MODE_ICON, SALAH_MODE_LABELS } from "@/features/modes/mode.types";
import { useHistory } from "@/features/history/historyStore";
import { ObligatoryPrayer, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";

export default function TodayScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { loading, error, location, today, countdownMs, refresh } = usePrayerTimes();
  const globalMode = useModes((s) => s.global);
  const { streak, todaySlots, toggle } = useHistory();

  const sunrise = today?.entries.find((e) => e.slot === "sunrise")?.time;
  const sunset = today?.entries.find((e) => e.slot === "maghrib")?.time;

  const completed = todaySlots.reduce<Partial<Record<PrayerSlot, boolean>>>(
    (acc, slot) => ({ ...acc, [slot]: true }),
    {}
  );

  const onPressPrayer = (slot: PrayerSlot) => {
    if (slot === "sunrise") return;
    haptics.success();
    void toggle(slot as ObligatoryPrayer);
  };

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
          {sunrise && sunset && (
            <View style={styles.sun}>
              <SunPathArc sunrise={sunrise} sunset={sunset} width={width - spacing.lg * 2} />
            </View>
          )}

          <NextPrayerArcCard day={today} countdownMs={countdownMs} width={width} />

          <ModePill
            label={SALAH_MODE_LABELS[globalMode]}
            icon={SALAH_MODE_ICON[globalMode] as keyof typeof Ionicons.glyphMap}
          />

          {globalMode !== "reminder" && today.nextSlot && today.nextSlot !== "sunrise" && (
            <Button
              label="Heading to the masjid? Pre-disarm"
              variant="ghost"
              onPress={() => {
                haptics.selection();
                router.push(`/scan/predisarm?slot=${today.nextSlot}`);
              }}
              style={styles.predisarm}
            />
          )}

          <Card padded={false} style={styles.list}>
            <PrayerList
              day={today}
              showBells
              completed={completed}
              onPressPrayer={onPressPrayer}
            />
          </Card>
        </>
      )}
    </Screen>
  );
}

function ModePill({
  label,
  icon,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        router.push("/settings");
      }}
      style={[
        styles.pill,
        {
          backgroundColor: theme.colors.sageMuted,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Ionicons name={icon} size={16} color={theme.colors.accent} />
      <ThemedText variant="caption" color="textSecondary">
        {`Mode: ${label}`}
      </ThemedText>
      <Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 60 },
  block: { marginTop: 24 },
  retry: { marginTop: 16 },
  sun: { marginTop: 12, marginBottom: 4 },
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
  predisarm: { marginTop: 4 },
});
