import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { GoalProgressBar } from "@/components/today/GoalProgressBar";

const MOCK_GOALS = [
  { title: "Namazes prayed", count: 3, target: 5 },
  { title: "Read Quran daily", count: 1, target: 1 },
] as const;

/** Static goals mock matching Today's goals section. */
export function OnboardingGoalsPreview() {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <ThemedText variant="bodyStrong" style={styles.header}>
        Today&apos;s goals
      </ThemedText>

      {MOCK_GOALS.map((goal, index) => (
        <View key={goal.title}>
          {index > 0 ? (
            <View style={[styles.divider, { backgroundColor: theme.colors.hairline }]} />
          ) : null}
          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText variant="body">{goal.title}</ThemedText>
              <ThemedText variant="caption" color="textTertiary">
                {`${goal.count}/${goal.target}`}
              </ThemedText>
            </View>
            <GoalProgressBar ratio={goal.count / goal.target} animate={false} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  header: {
    marginBottom: 2,
  },
  row: {
    gap: 8,
    paddingVertical: 6,
  },
  copy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
