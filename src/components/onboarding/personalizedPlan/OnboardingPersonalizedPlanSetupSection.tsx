import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingRatingLaurel } from "@/components/onboarding/steps/OnboardingRatingLaurel";
import {
  PersonalizedPlanIncludesItem,
  PersonalizedPlanSetupField,
} from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";
import { OnboardingPersonalizedPlanIncludesStrip } from "./OnboardingPersonalizedPlanIncludesStrip";
import { OnboardingPersonalizedPlanSetupFieldRow } from "./OnboardingPersonalizedPlanSetupFieldRow";

interface OnboardingPersonalizedPlanSetupSectionProps {
  planIncludesTitle: string;
  planIncludesSubheader: string;
  planIncludesItems: readonly PersonalizedPlanIncludesItem[];
  fields: readonly PersonalizedPlanSetupField[];
  socialProofLine: string;
  ratingLine: string;
}

/** Setup answer summary + soft laurel social proof. */
export function OnboardingPersonalizedPlanSetupSection({
  planIncludesTitle,
  planIncludesSubheader,
  planIncludesItems,
  fields,
  socialProofLine,
  ratingLine,
}: OnboardingPersonalizedPlanSetupSectionProps) {
  return (
    <View style={styles.wrap}>
      <OnboardingPersonalizedPlanIncludesStrip
        title={planIncludesTitle}
        subheader={planIncludesSubheader}
        items={planIncludesItems}
      />

      <View style={styles.fields}>
        {fields.map((field) => (
          <OnboardingPersonalizedPlanSetupFieldRow key={field.id} field={field} />
        ))}
      </View>

      <View style={styles.proofRow}>
        <ProofBadge line={socialProofLine} />
        <ProofBadge line={ratingLine} />
      </View>
    </View>
  );
}

function ProofBadge({ line }: { line: string }) {
  return (
    <View style={styles.badge}>
      <OnboardingRatingLaurel side="leading" size={28} />
      <View style={styles.badgeCopy}>
        <ThemedText variant="caption" style={styles.badgeLine}>
          {line}
        </ThemedText>
        <View style={styles.stars}>
          {[0, 1, 2, 3, 4].map((index) => (
            <Ionicons key={index} name="star" size={11} color={Theme.star} />
          ))}
        </View>
      </View>
      <OnboardingRatingLaurel side="trailing" size={28} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: 14,
    paddingHorizontal: 2,
  },
  fields: {
    gap: 14,
  },
  proofRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  badge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  badgeCopy: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  badgeLine: Type.style({
    color: Theme.ink,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
  }),
  stars: {
    flexDirection: "row",
    gap: 2,
  },
});
