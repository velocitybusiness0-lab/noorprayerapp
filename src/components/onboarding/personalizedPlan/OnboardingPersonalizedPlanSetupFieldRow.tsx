import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanSetupField } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanSetupFieldRowProps {
  field: PersonalizedPlanSetupField;
}

/** Labeled summary row with value + checkmark. */
export function OnboardingPersonalizedPlanSetupFieldRow({
  field,
}: OnboardingPersonalizedPlanSetupFieldRowProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText variant="caption" style={styles.label}>
        {field.label}
      </ThemedText>
      <View style={styles.box}>
        <ThemedText variant="body" style={styles.value} numberOfLines={2}>
          {field.value}
        </ThemedText>
        <Ionicons name="checkmark" size={18} color={Theme.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: 8,
  },
  label: Type.style({
    color: Theme.muted,
    fontSize: 13,
    letterSpacing: -0.05,
  }),
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Theme.pillFill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.pillBorder,
  },
  value: Type.style({
    flex: 1,
    color: Theme.ink,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.15,
  }),
});
