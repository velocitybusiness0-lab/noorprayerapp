import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  PersonalizedPlanBenefitChip,
  PersonalizedPlanIconName,
} from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanBenefitChipRowLayout } from "@/features/onboarding/OnboardingPersonalizedPlanBenefitChipRowLayout";
import { OnboardingPersonalizedPlanChipAccentPalette } from "@/features/onboarding/OnboardingPersonalizedPlanChipAccentPalette";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanBenefitChipViewProps {
  chip: PersonalizedPlanBenefitChip;
  rowSize: number;
}

/** Soft pastel pill with accent border/icon + Miraj benefit label. */
export function OnboardingPersonalizedPlanBenefitChipView({
  chip,
  rowSize,
}: OnboardingPersonalizedPlanBenefitChipViewProps) {
  const accent = OnboardingPersonalizedPlanChipAccentPalette.colors(chip.accent);
  const maxWidth = OnboardingPersonalizedPlanBenefitChipRowLayout.maxWidthPercent(
    rowSize
  );

  return (
    <View
      style={[
        styles.chip,
        {
          maxWidth,
          backgroundColor: accent.fill,
          borderColor: accent.border,
        },
      ]}
    >
      <Ionicons
        name={chip.icon as PersonalizedPlanIconName}
        size={13}
        color={accent.icon}
      />
      <ThemedText
        variant="caption"
        style={styles.label}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
      >
        {chip.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 1,
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  label: Type.style({
    color: Theme.ink,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "500",
    letterSpacing: -0.1,
    flexShrink: 1,
    textAlign: "center",
  }),
});
