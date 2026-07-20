import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

interface OnboardingPersonalizedPlanGoalProps {
  lead: string;
  dateLabel: string;
}

/** Goal milestone label + date pill for the presence journey. */
export function OnboardingPersonalizedPlanGoal({
  lead,
  dateLabel,
}: OnboardingPersonalizedPlanGoalProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText variant="body" style={styles.lead}>
        {lead}
      </ThemedText>
      <View style={styles.pill}>
        <Ionicons name="calendar-outline" size={16} color={Theme.accent} />
        <ThemedText variant="bodyStrong" style={styles.date}>
          {dateLabel}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  lead: {
    color: Theme.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: Theme.pillFill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.pillBorder,
  },
  date: {
    color: Theme.ink,
  },
});
