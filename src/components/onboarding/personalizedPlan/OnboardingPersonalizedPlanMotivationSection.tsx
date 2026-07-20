import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanMotivationBenefit } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanDiscountBox } from "./OnboardingPersonalizedPlanDiscountBox";
import { OnboardingPersonalizedPlanGraphic } from "./OnboardingPersonalizedPlanGraphic";
import { OnboardingPersonalizedPlanKeywordRows } from "./OnboardingPersonalizedPlanKeywordRows";
import { OnboardingPersonalizedPlanStarsCapsule } from "./OnboardingPersonalizedPlanStarsCapsule";

interface OnboardingPersonalizedPlanMotivationSectionProps {
  title: string;
  body: string;
  benefits: readonly PersonalizedPlanMotivationBenefit[];
  discountTitle: string;
  discountBody: string;
  discountCta: string;
  trustLine: string;
  onClaimDiscount: () => void;
}

/** Section E: Islamic motivation about the user’s heart, identity, and return. */
export function OnboardingPersonalizedPlanMotivationSection({
  title,
  body,
  benefits,
  discountTitle,
  discountBody,
  discountCta,
  trustLine,
  onClaimDiscount,
}: OnboardingPersonalizedPlanMotivationSectionProps) {
  return (
    <View style={styles.wrap}>
      <OnboardingPersonalizedPlanGraphic kind="motivation" />
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>
      <View style={styles.card}>
        <OnboardingPersonalizedPlanKeywordRows items={benefits} />
      </View>
      <OnboardingPersonalizedPlanStarsCapsule />
      <ThemedText variant="body" style={styles.body}>
        {body}
      </ThemedText>
      <OnboardingPersonalizedPlanDiscountBox
        title={discountTitle}
        body={discountBody}
        ctaLabel={discountCta}
        onPress={onClaimDiscount}
      />
      <ThemedText variant="caption" style={styles.trust}>
        {trustLine}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
  },
  title: {
    color: Theme.ink,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  card: {
    width: "100%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: Theme.sageFill,
  },
  body: {
    color: Theme.muted,
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  trust: {
    color: Theme.softMuted,
    textAlign: "center",
    marginTop: 2,
  },
});
