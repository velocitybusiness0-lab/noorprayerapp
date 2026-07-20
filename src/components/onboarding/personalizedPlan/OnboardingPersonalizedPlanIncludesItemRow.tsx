import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  PersonalizedPlanIconName,
  PersonalizedPlanIncludesItem,
} from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanIncludesItemRowProps {
  item: PersonalizedPlanIncludesItem;
}

/** Circular sage badge + bold title / muted description for the plan-includes card. */
export function OnboardingPersonalizedPlanIncludesItemRow({
  item,
}: OnboardingPersonalizedPlanIncludesItemRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Ionicons
          name={item.icon as PersonalizedPlanIconName}
          size={22}
          color={Theme.accent}
        />
      </View>
      <View style={styles.copy}>
        <ThemedText variant="body" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText variant="caption" style={styles.description}>
          {item.description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    width: "100%",
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.sageFill,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: Type.style({
    color: Theme.ink,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 21,
  }),
  description: Type.style({
    color: Theme.softMuted,
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: -0.05,
    lineHeight: 18,
  }),
});
