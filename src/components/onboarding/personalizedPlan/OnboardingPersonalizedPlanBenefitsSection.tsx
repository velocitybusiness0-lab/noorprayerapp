import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanBenefitChip } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanBenefitChipRowLayout } from "@/features/onboarding/OnboardingPersonalizedPlanBenefitChipRowLayout";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";
import { OnboardingPersonalizedPlanBenefitChipView } from "./OnboardingPersonalizedPlanBenefitChipView";

interface OnboardingPersonalizedPlanBenefitsSectionProps {
  title: string;
  subtitle: string;
  chips: readonly PersonalizedPlanBenefitChip[];
}

/** “Become more consistent…” headline + 2 / 3 / 2 staggered Miraj chips. */
export function OnboardingPersonalizedPlanBenefitsSection({
  title,
  subtitle,
  chips,
}: OnboardingPersonalizedPlanBenefitsSectionProps) {
  const rows = OnboardingPersonalizedPlanBenefitChipRowLayout.rows(chips);

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText variant="body" style={styles.subtitle}>
        {subtitle}
      </ThemedText>
      <View style={styles.cluster}>
        {rows.map((row, rowIndex) => (
          <View key={`chip-row-${rowIndex}`} style={styles.row}>
            {row.map((chip) => (
              <OnboardingPersonalizedPlanBenefitChipView
                key={chip.id}
                chip={chip}
                rowSize={row.length}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    gap: 10,
    overflow: "visible",
  },
  title: Type.style({
    color: Theme.ink,
    textAlign: "center",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "600",
    letterSpacing: -0.3,
    paddingHorizontal: 4,
  }),
  subtitle: Type.style({
    color: Theme.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400",
    marginBottom: 6,
  }),
  cluster: {
    width: "100%",
    alignItems: "center",
    gap: 8,
    overflow: "visible",
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    width: "100%",
    overflow: "visible",
  },
});
