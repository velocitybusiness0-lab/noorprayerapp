import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanIncludesItem } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";
import { OnboardingPersonalizedPlanIncludesItemRow } from "./OnboardingPersonalizedPlanIncludesItemRow";

interface OnboardingPersonalizedPlanIncludesStripProps {
  title: string;
  subheader: string;
  items: readonly PersonalizedPlanIncludesItem[];
}

/** Outer “Your plan” title + cream card list of included Miraj features. */
export function OnboardingPersonalizedPlanIncludesStrip({
  title,
  subheader,
  items,
}: OnboardingPersonalizedPlanIncludesStripProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>

      <View style={styles.card}>
        <ThemedText variant="body" style={styles.subheader}>
          {subheader}
        </ThemedText>

        <View style={styles.list}>
          {items.map((item) => (
            <OnboardingPersonalizedPlanIncludesItemRow key={item.id} item={item} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: 12,
  },
  title: Type.style({
    color: Theme.ink,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 26,
  }),
  card: {
    width: "100%",
    gap: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: Theme.pillFill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.softCardBorder,
  },
  subheader: Type.style({
    color: Theme.muted,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.1,
    lineHeight: 20,
  }),
  list: {
    width: "100%",
    gap: 18,
  },
});
