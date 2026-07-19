import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { CalculationChecklistStatus } from "@/features/onboarding/OnboardingCalculationChecklistProgress";
import { OnboardingCalculationChecklistRow } from "./OnboardingCalculationChecklistRow";

interface OnboardingCalculationChecklistProps {
  tasks: string[];
  statuses: CalculationChecklistStatus[];
}

/** White card checklist shown under the calculation progress bar. */
export function OnboardingCalculationChecklist({
  tasks,
  statuses,
}: OnboardingCalculationChecklistProps) {
  const theme = useTheme();

  if (tasks.length === 0) return null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: "#FFFFFF",
          borderColor: theme.colors.hairline,
        },
      ]}
    >
      {tasks.map((label, index) => (
        <OnboardingCalculationChecklistRow
          key={label}
          label={label}
          status={statuses[index] ?? "upcoming"}
          showDivider={index < tasks.length - 1}
          hairlineColor={theme.colors.hairline}
          successColor={theme.colors.success}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
