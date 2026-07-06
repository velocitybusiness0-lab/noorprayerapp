import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { PrayerList } from "@/components/prayer/PrayerList";
import { VoluntaryPrayersCard } from "@/components/prayer/VoluntaryPrayersCard";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { isSameDay } from "@/core/utils/time";
import { usePrayerTimes } from "@/features/prayerTimes/usePrayerTimes";
import { NightCalculator } from "@/features/tahajjud/NightCalculator";

export default function TimetableScreen() {
  const theme = useTheme();
  const { loading, error, location, manager, refresh } = usePrayerTimes();
  const [offset, setOffset] = useState(0);

  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  }, [offset]);

  const day = useMemo(() => {
    if (!location) return null;
    return manager.computeForDate(location, selectedDate);
  }, [location, manager, selectedDate]);

  const night = useMemo(() => {
    if (!location) return null;
    return new NightCalculator(manager).compute(location, selectedDate);
  }, [location, manager, selectedDate]);

  const shift = (delta: number) => {
    haptics.selection();
    setOffset((o) => o + delta);
  };

  return (
    <Screen scroll tabBarPadding>
      <ThemedText variant="title">Times</ThemedText>
      <ThemedText variant="body" color="textSecondary">
        {location?.name ?? "Locating..."}
      </ThemedText>

      <View style={styles.nav}>
        <Pressable onPress={() => shift(-1)} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.textSecondary} />
        </Pressable>
        <ThemedText variant="bodyStrong">
          {isSameDay(selectedDate, new Date())
            ? "Today"
            : selectedDate.toLocaleDateString([], {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
        </ThemedText>
        <Pressable onPress={() => shift(1)} hitSlop={10}>
          <Ionicons name="chevron-forward" size={22} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {loading && !day && (
        <ActivityIndicator color={theme.colors.textPrimary} style={styles.loader} />
      )}

      {error && !day && (
        <Card style={styles.card}>
          <ThemedText variant="body" color="textSecondary">
            {error}
          </ThemedText>
          <Button label="Try again" onPress={refresh} style={styles.retry} />
        </Card>
      )}

      {day && (
        <Card padded={false} style={styles.card}>
          <PrayerList day={day} showBells />
        </Card>
      )}

      {night && <VoluntaryPrayersCard night={night} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 18,
  },
  card: { marginTop: 8, paddingHorizontal: 8 },
  loader: { marginTop: 40 },
  retry: { marginTop: 16 },
});
