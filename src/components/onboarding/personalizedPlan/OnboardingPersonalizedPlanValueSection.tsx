import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  PersonalizedPlanKeywordItem,
  PersonalizedPlanQuote,
} from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import {
  OnboardingPersonalizedPlanGraphic,
  PersonalizedPlanGraphicKind,
} from "./OnboardingPersonalizedPlanGraphic";
import { OnboardingPersonalizedPlanKeywordRows } from "./OnboardingPersonalizedPlanKeywordRows";
import { OnboardingPersonalizedPlanQuoteBlock } from "./OnboardingPersonalizedPlanQuoteBlock";

interface OnboardingPersonalizedPlanValueSectionProps {
  graphicKind: Extract<PersonalizedPlanGraphicKind, "helps" | "protect">;
  title: string;
  items: readonly PersonalizedPlanKeywordItem[];
  quote: PersonalizedPlanQuote;
}

/** Shared layout for the features block and the user-journey value section. */
export function OnboardingPersonalizedPlanValueSection({
  graphicKind,
  title,
  items,
  quote,
}: OnboardingPersonalizedPlanValueSectionProps) {
  return (
    <View style={styles.wrap}>
      <OnboardingPersonalizedPlanGraphic kind={graphicKind} />
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>
      <View style={styles.card}>
        <OnboardingPersonalizedPlanKeywordRows items={items} />
      </View>
      <OnboardingPersonalizedPlanQuoteBlock quote={quote} />
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
});
