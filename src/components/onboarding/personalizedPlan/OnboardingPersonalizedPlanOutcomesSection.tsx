import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanOutcomeRow } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";
import { OnboardingPersonalizedPlanSegmentedText } from "./OnboardingPersonalizedPlanSegmentedText";

interface OnboardingPersonalizedPlanOutcomesSectionProps {
  rows: readonly PersonalizedPlanOutcomeRow[];
  ratingLine: string;
}

/** Checklist outcomes with selective bolding + stars rating line. */
export function OnboardingPersonalizedPlanOutcomesSection({
  rows,
  ratingLine,
}: OnboardingPersonalizedPlanOutcomesSectionProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.list}>
        {rows.map((row) => (
          <View key={row.id} style={styles.row}>
            <View style={styles.check}>
              <Ionicons name="checkmark" size={14} color={Theme.onCheckFill} />
            </View>
            <View style={styles.copy}>
              <OnboardingPersonalizedPlanSegmentedText segments={row.segments} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.stars}>
          {[0, 1, 2, 3, 4].map((index) => (
            <Ionicons key={index} name="star" size={16} color={Theme.star} />
          ))}
        </View>
        <ThemedText variant="body" style={styles.ratingLine}>
          {ratingLine}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: 22,
    paddingHorizontal: 4,
  },
  list: {
    gap: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.checkFill,
  },
  copy: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  stars: {
    flexDirection: "row",
    gap: 3,
  },
  ratingLine: Type.style({
    flex: 1,
    color: Theme.ink,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.1,
  }),
});
